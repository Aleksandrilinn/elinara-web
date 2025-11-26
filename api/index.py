from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import pandas as pd
import requests

app = FastAPI()

# Configuração CORS (Segurança)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Funções Auxiliares
def _get_metric(df, key, fallback=[], idx=0):
    keys = [key] + fallback
    if df is None or df.empty: return 0.0
    for k in keys:
        if k in df.index:
            try: 
                val = pd.to_numeric(df.loc[k].iloc[idx], errors='coerce')
                return float(val) if not pd.isna(val) else 0.0
            except: pass
    return 0.0

@app.get("/api/search")
def search(q: str):
    try:
        # Usamos requests simples aqui porque a API de search é mais permissiva
        headers = {'User-Agent': 'Mozilla/5.0'}
        url = f"https://query1.finance.yahoo.com/v1/finance/search?q={q}&quotesCount=5&newsCount=0"
        r = requests.get(url, headers=headers, timeout=5)
        data = r.json()
        results = []
        if 'quotes' in data:
            for quote in data['quotes']:
                if quote.get('quoteType', '').upper() in ['EQUITY', 'ETF']:
                    results.append({
                        "symbol": quote.get('symbol'),
                        "name": quote.get('shortname') or quote.get('symbol'),
                        "exchange": quote.get('exchange', 'N/A')
                    })
        return results
    except: return []

@app.get("/api/dcf")
def dcf(ticker: str, g1: float=0.075, g2: float=0.025, wacc: float=0.09, 
        manual_ebit: float=None, manual_capex: float=None, manual_da: float=None, 
        manual_nwc: float=None, manual_tax: float=None,
        manual_cash: float=None, manual_debt: float=None, manual_shares: float=None):
    try:
        ticker = ticker.upper().strip()
        
        # --- AQUI ESTAVA O ERRO ANTES ---
        # Removemos o "session=session". O yfinance gere isso sozinho agora.
        stock = yf.Ticker(ticker)
        
        # Teste de conexão
        try:
            hist = stock.history(period="1d")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro de conexão Yahoo: {str(e)}")

        if hist.empty:
            # Tentar mais uma vez caso seja um glitch momentâneo
            hist = stock.history(period="5d")
            if hist.empty:
                raise HTTPException(status_code=404, detail=f"Ticker '{ticker}' não encontrado ou sem dados.")
            
        price = float(hist["Close"].iloc[-1])
        
        # Tenta extrair dados com segurança
        try:
            info = stock.info or {}
            income = stock.income_stmt
            cashflow = stock.cashflow
            balance = stock.balance_sheet
        except:
            # Se falhar a sacar balanços, cria vazios para permitir input manual
            income = pd.DataFrame()
            cashflow = pd.DataFrame()
            balance = pd.DataFrame()
            info = {}

        # --- LÓGICA DCF ---
        ebit = manual_ebit if manual_ebit is not None else _get_metric(income, 'Ebit', ['Operating Income', 'EBIT'])
        
        # Fallback de emergência para EBIT
        if ebit == 0 and manual_ebit is None:
            rev = _get_metric(income, 'Total Revenue')
            op_exp = _get_metric(income, 'Operating Expense')
            if rev > 0: ebit = rev - op_exp

        tax_prov = _get_metric(income, 'Tax Provision')
        pretax = _get_metric(income, 'Pretax Income')
        tax_rate = manual_tax if manual_tax is not None else ((tax_prov / pretax) if pretax > 0 else 0.21)
        
        nopat = ebit * (1 - tax_rate)
        
        da = manual_da if manual_da is not None else _get_metric(cashflow, 'Depreciation And Amortization')
        capex = manual_capex if manual_capex is not None else _get_metric(cashflow, 'Capital Expenditure')
        capex = abs(capex) 
        
        nwc = manual_nwc if manual_nwc is not None else 0.0
        
        fcf_base = nopat + da - capex - nwc
        
        # Projeções
        projections = []
        fcf = fcf_base
        pv_sum = 0.0
        breakdown = []
        
        for i in range(1, 6):
            fcf = fcf * (1 + g1)
            pv = fcf / ((1 + wacc) ** i)
            pv_sum += pv
            projections.append(fcf)
            breakdown.append({"year": f"Ano {i}", "fcf": fcf, "pv": pv})
            
        term_val = (projections[-1] * (1 + g2)) / (wacc - g2)
        pv_term = term_val / ((1 + wacc) ** 5)
        
        enterprise_value = pv_sum + pv_term
        
        cash = manual_cash if manual_cash is not None else _get_metric(balance, 'Cash And Cash Equivalents')
        debt = manual_debt if manual_debt is not None else _get_metric(balance, 'Total Debt')
        
        shares = manual_shares if manual_shares is not None else info.get('sharesOutstanding', 1)
        if not shares or shares == 0: shares = 1
        
        equity = enterprise_value + cash - debt
        intrinsic = equity / shares
        
        return {
            "ticker": ticker,
            "price": price,
            "currency": info.get('currency', 'USD'),
            "intrinsic_value": intrinsic,
            "margin": (intrinsic - price) / price,
            "inputs": {
                "ebit": ebit, "tax_rate": tax_rate, "d_and_a": da, "capex": capex, "change_nwc": nwc,
                "total_cash": cash, "total_debt": debt, "shares": shares
            },
            "valuation_flow": {
                "pv_projections": pv_sum, "pv_terminal": pv_term, "enterprise_value": enterprise_value,
                "total_cash": cash, "total_debt": debt, "equity_value": equity, "shares": shares
            },
            "metrics": { "nopat": nopat, "fcf_base": fcf_base },
            "breakdown": breakdown
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Server Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))