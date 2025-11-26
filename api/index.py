from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import pandas as pd
import numpy as np
import requests
import datetime

# NOTA: Removemos 'scipy' para poupar espaço no Vercel. 
# Implementámos a otimização manualmente abaixo.

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# === 1. CONFIGURAÇÕES GLOBAIS ===
# ==========================================

# Lista de Países (Tese) - ISO Alpha-2 Codes
TARGET_COUNTRY = "RU" 
DONOR_POOL = ["SA", "ID", "AO", "AZ", "AU", "BR", "AR", "TR", "CO", "AM", "EC", "CL", "MY", "IN"]

# Indicadores do Banco Mundial
INDICATORS = {
    "GDP_CONST": "NY.GDP.MKTP.KD",       # PIB (US$ Constante)
    "GDP_CUR": "NY.GDP.MKTP.CD",         # PIB (US$ Atual)
    "GDP_PC": "NY.GDP.PCAP.KD",          # PIB per Capita
    "GDP_GROWTH": "NY.GDP.MKTP.KD.ZG",   # Crescimento do PIB %
    "INFLATION": "FP.CPI.TOTL.ZG",       # Inflação
    "UNEMPLOYMENT": "SL.UEM.TOTL.ZS",    # Desemprego
    "EXPORTS": "NE.EXP.GNFS.KD",         # Exportações
    "IMPORTS": "NE.IMP.GNFS.KD",         # Importações
    "FDI_IN": "BX.KLT.DINV.WD.GD.ZS",    # Investimento Direto Estrangeiro (Entrada)
    "RESERVES": "FI.RES.TOTL.CD",        # Reservas Totais
    "GNI": "NY.GNP.MKTP.KD",             # Rendimento Nacional Bruto
    "IND_VAL": "NV.IND.TOTL.KD",         # Valor Acrescentado Indústria
    "AGR_VAL": "NV.AGR.TOTL.KD",         # Valor Acrescentado Agricultura
    "TRADE_GDP": "NE.TRD.GNFS.ZS",       # Comércio (% do PIB)
    "EXCH_RATE": "PA.NUS.FCRF"           # Taxa de Câmbio Oficial
}

# ==========================================
# === 2. FUNÇÕES AUXILIARES ===
# ==========================================

def _get_metric(df, key, fallback=[], idx=0):
    """Extrai métricas financeiras de DataFrames do yfinance de forma segura."""
    keys = [key] + fallback
    if df is None or df.empty: return 0.0
    for k in keys:
        if k in df.index:
            try: 
                val = pd.to_numeric(df.loc[k].iloc[idx], errors='coerce')
                return float(val) if not pd.isna(val) else 0.0
            except: pass
    return 0.0

def fetch_wb_data(indicator_code):
    """Busca dados ao Banco Mundial com tratamento de erros robusto."""
    countries = ";".join([TARGET_COUNTRY] + DONOR_POOL)
    url = f"http://api.worldbank.org/v2/country/{countries}/indicator/{indicator_code}?format=json&per_page=5000&date=2010:2023"
    
    try:
        r = requests.get(url, timeout=10)
        data = r.json()
        
        if not data or len(data) < 2: return None
        
        records = []
        for entry in data[1]:
            if entry['value'] is not None:
                records.append({
                    "country": entry['countryiso3code'],
                    "year": int(entry['date']),
                    "value": float(entry['value'])
                })
        
        df = pd.DataFrame(records)
        if df.empty: return None
        
        # Pivotar e limpar colunas vazias (países sem dados para este indicador saem fora)
        pivot_df = df.pivot(index="year", columns="country", values="value").dropna(axis=1)
        return pivot_df.sort_index()
    except Exception as e:
        print(f"WB API Error: {e}")
        return None

def optimize_weights_manual(X0, X1, iterations=3000, lr=1e-4):
    """
    Algoritmo de Gradient Descent Projetado (Substitui scipy.optimize).
    Objetivo: Encontrar pesos W tal que X0 * W ≈ X1.
    Restrições: Soma(W) = 1, W >= 0.
    """
    n_donors = X0.shape[1]
    
    # Inicializar pesos uniformes
    W = np.ones(n_donors) / n_donors
    
    # Normalizar dados (MinMax) para estabilidade numérica
    max_val = np.max(np.abs(X0))
    if max_val == 0: return W
    X0_norm = X0 / max_val
    X1_norm = X1 / max_val

    for _ in range(iterations):
        # 1. Previsão (Forward pass)
        pred = np.dot(X0_norm, W)
        
        # 2. Erro
        error = pred - X1_norm
        
        # 3. Gradiente
        grad = np.dot(X0_norm.T, error)
        
        # 4. Atualização (Gradient Descent)
        W = W - lr * grad
        
        # 5. Projeção (Constraints)
        W = np.maximum(W, 0) # Não-negativo
        sum_w = np.sum(W)
        if sum_w > 0:
            W = W / sum_w # Soma = 1
        else:
            W = np.ones(n_donors) / n_donors
            
    return W

# ==========================================
# === 3. ROTAS DA API ===
# ==========================================

# --- ROTA 1: SANCTION DELTA (SCM) ---
@app.get("/api/scm")
def calculate_scm(indicator: str = "GDP_CONST"):
    try:
        wb_code = INDICATORS.get(indicator, "NY.GDP.MKTP.KD")
        
        # 1. Obter Dados
        df = fetch_wb_data(wb_code)
        if df is None or "RUS" not in df.columns:
            raise HTTPException(status_code=404, detail="Dados indisponíveis para este indicador.")
            
        available_donors = [c for c in df.columns if c != "RUS"]
        if len(available_donors) < 2:
             raise HTTPException(status_code=400, detail="Dadores insuficientes disponíveis.")

        # 2. Preparar Matrizes (Treino: 2010-2021)
        pre_years = [y for y in df.index if y < 2022]
        if len(pre_years) < 5:
             raise HTTPException(status_code=400, detail="Histórico insuficiente para calibração.")

        X0 = df.loc[pre_years, available_donors].values 
        X1 = df.loc[pre_years, "RUS"].values            

        # 3. Otimização Manual
        weights = optimize_weights_manual(X0, X1)

        # 4. Projetar Resultados (2010-2023)
        Y_donors = df[available_donors].values
        synth_values = np.dot(Y_donors, weights)
        
        # 5. Formatar Resposta
        chart_data = []
        metrics = {"gap_2022": 0, "gap_2023": 0}
        
        for i, year in enumerate(df.index):
            real = df.iloc[i]["RUS"]
            synth = synth_values[i]
            gap = real - synth
            
            chart_data.append({
                "year": year,
                "Real": real,
                "Synthetic": synth,
                "Gap": gap
            })
            
            if year == 2022: metrics["gap_2022"] = gap
            if year == 2023: metrics["gap_2023"] = gap

        contributors = sorted(
            [{"country": c, "weight": round(w*100, 1)} for c, w in zip(available_donors, weights) if w > 0.01],
            key=lambda x: x["weight"], 
            reverse=True
        )

        return {
            "data": chart_data,
            "metrics": metrics,
            "contributors": contributors,
            "indicator": indicator
        }

    except Exception as e:
        print(f"SCM Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- ROTA 2: PESQUISA DE TICKERS ---
@app.get("/api/search")
def search(q: str):
    try:
        r = requests.get(f"https://query1.finance.yahoo.com/v1/finance/search?q={q}", headers={'User-Agent': 'Mozilla/5.0'}, timeout=4)
        data = r.json()
        return [{"symbol": i.get('symbol'), "name": i.get('shortname'), "exchange": i.get('exchange')} for i in data.get('quotes', []) if i.get('quoteType') == 'EQUITY']
    except: return []

# --- ROTA 3: DCF ENGINE ---
@app.get("/api/dcf")
def dcf(ticker: str, g1: float=0.075, g2: float=0.025, wacc: float=0.09, 
        manual_ebit: float=None, manual_capex: float=None, manual_da: float=None, 
        manual_nwc: float=None, manual_tax: float=None,
        manual_cash: float=None, manual_debt: float=None, manual_shares: float=None):
    try:
        ticker = ticker.upper().strip()
        stock = yf.Ticker(ticker)
        
        try: hist = stock.history(period="5d")
        except: raise HTTPException(status_code=500, detail="Yahoo Finance Connection Error")
        
        if hist.empty: raise HTTPException(status_code=404, detail="Ticker not found")
        price = float(hist["Close"].iloc[-1])
        
        try:
            info = stock.info or {}
            income = stock.income_stmt
            cashflow = stock.cashflow
            balance = stock.balance_sheet
        except: income = pd.DataFrame(); cashflow = pd.DataFrame(); balance = pd.DataFrame(); info = {}

        ebit = manual_ebit if manual_ebit is not None else _get_metric(income, 'Ebit', ['Operating Income', 'EBIT'])
        if ebit == 0 and manual_ebit is None:
            rev = _get_metric(income, 'Total Revenue'); exp = _get_metric(income, 'Operating Expense')
            if rev > 0: ebit = rev - exp

        tax_rate = manual_tax if manual_tax is not None else 0.21
        nopat = ebit * (1 - tax_rate)
        da = manual_da if manual_da is not None else _get_metric(cashflow, 'Depreciation And Amortization')
        capex = abs(manual_capex if manual_capex is not None else _get_metric(cashflow, 'Capital Expenditure'))
        nwc = manual_nwc if manual_nwc is not None else 0.0
        fcf_base = nopat + da - capex - nwc
        
        pv_sum = 0.0; breakdown = []
        fcf = fcf_base
        for i in range(1, 6):
            fcf = fcf * (1 + g1)
            pv = fcf / ((1 + wacc) ** i)
            pv_sum += pv
            breakdown.append({"year": f"Y{i}", "fcf": fcf, "pv": pv})
            
        term_val = (fcf * (1 + g2)) / (wacc - g2)
        pv_term = term_val / ((1 + wacc) ** 5)
        enterprise_val = pv_sum + pv_term
        
        cash = manual_cash if manual_cash is not None else _get_metric(balance, 'Cash And Cash Equivalents')
        debt = manual_debt if manual_debt is not None else _get_metric(balance, 'Total Debt')
        shares = manual_shares if manual_shares is not None else info.get('sharesOutstanding', 1)
        if not shares: shares = 1
        
        equity = enterprise_val + cash - debt
        intrinsic = equity / shares
        
        return {
            "ticker": ticker, "price": price, "currency": info.get('currency', 'USD'),
            "intrinsic_value": intrinsic, "margin": (intrinsic - price) / price,
            "inputs": { "ebit": ebit, "tax_rate": tax_rate, "d_and_a": da, "capex": capex, "change_nwc": nwc, "total_cash": cash, "total_debt": debt, "shares": shares },
            "valuation_flow": { "pv_projections": pv_sum, "pv_terminal": pv_term, "enterprise_value": enterprise_val, "total_cash": cash, "total_debt": debt, "equity_value": equity, "shares": shares },
            "metrics": { "nopat": nopat, "fcf_base": fcf_base }, "breakdown": breakdown
        }
    except Exception as e:
        print(f"DCF Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- ROTA 4: VC SIMULATOR ---
@app.get("/api/vc")
def vc_calc(tam: float, quota: float, margem: float, multiplo: float, desconto: float, diluicao: float, target_year: int, acoes_atuais: float, caixa_atual: float, burn_anual: float):
    try:
        ano_atual = datetime.datetime.now().year
        anos = max(1, target_year - ano_atual)
        
        receita = tam * (quota/100); nopat = receita * (margem/100)
        exit_val = nopat * multiplo
        pv = exit_val / ((1 + (desconto/100)) ** anos)
        acoes_fut = acoes_atuais * ((1 + (diluicao/100)) ** anos)
        target_price = pv / acoes_fut
        price_no_dil = pv / acoes_atuais
        
        runway = 99.0 if burn_anual <= 0 else caixa_atual / burn_anual
        status = "safe" if runway > 2 else ("warning" if runway > 1 else "danger")

        return {
            "metrics": { "receita_alvo": receita, "nopat_alvo": nopat, "exit_value": exit_val, "pv_equity": pv, "target_price": target_price, "price_no_dilution": price_no_dil },
            "survival": { "runway": runway, "status": status }
        }
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))