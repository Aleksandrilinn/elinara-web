from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import yfinance as yf
import pandas as pd
import requests
import datetime
from scipy.optimize import minimize

app = FastAPI()

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- FUNÇÕES AUXILIARES (DO DCF) ---
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

# --- ROTAS DO DCF EXISTENTE ---
@app.get("/api/search")
def search(q: str):
    try:
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
        stock = yf.Ticker(ticker)
        
        try: hist = stock.history(period="1d")
        except Exception as e: raise HTTPException(status_code=500, detail=f"Erro Yahoo: {str(e)}")

        if hist.empty:
            hist = stock.history(period="5d")
            if hist.empty: raise HTTPException(status_code=404, detail="Ticker não encontrado.")
            
        price = float(hist["Close"].iloc[-1])
        
        try:
            info = stock.info or {}
            income = stock.income_stmt
            cashflow = stock.cashflow
            balance = stock.balance_sheet
        except:
            income = pd.DataFrame(); cashflow = pd.DataFrame(); balance = pd.DataFrame(); info = {}

        # Lógica simplificada do DCF para poupar espaço (usa a mesma lógica que já tinhas)
        ebit = manual_ebit if manual_ebit is not None else _get_metric(income, 'Ebit', ['Operating Income', 'EBIT'])
        if ebit == 0 and manual_ebit is None:
            rev = _get_metric(income, 'Total Revenue')
            op_exp = _get_metric(income, 'Operating Expense')
            if rev > 0: ebit = rev - op_exp

        tax_prov = _get_metric(income, 'Tax Provision')
        pretax = _get_metric(income, 'Pretax Income')
        tax_rate = manual_tax if manual_tax is not None else ((tax_prov / pretax) if pretax > 0 else 0.21)
        
        nopat = ebit * (1 - tax_rate)
        da = manual_da if manual_da is not None else _get_metric(cashflow, 'Depreciation And Amortization')
        capex = abs(manual_capex if manual_capex is not None else _get_metric(cashflow, 'Capital Expenditure'))
        nwc = manual_nwc if manual_nwc is not None else 0.0
        
        fcf_base = nopat + da - capex - nwc
        
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
            "ticker": ticker, "price": price, "currency": info.get('currency', 'USD'),
            "intrinsic_value": intrinsic, "margin": (intrinsic - price) / price,
            "inputs": { "ebit": ebit, "tax_rate": tax_rate, "d_and_a": da, "capex": capex, "change_nwc": nwc, "total_cash": cash, "total_debt": debt, "shares": shares },
            "valuation_flow": { "pv_projections": pv_sum, "pv_terminal": pv_term, "enterprise_value": enterprise_value, "total_cash": cash, "total_debt": debt, "equity_value": equity, "shares": shares },
            "metrics": { "nopat": nopat, "fcf_base": fcf_base }, "breakdown": breakdown
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- NOVA ROTA: VENTURE CAPITAL CALCULATOR ---
@app.get("/api/vc")
def vc_calc(
    tam: float, quota: float, margem: float, multiplo: float, 
    desconto: float, diluicao: float, target_year: int,
    acoes_atuais: float, caixa_atual: float, burn_anual: float
):
    try:
        # 1. Parâmetros Temporais
        ano_atual = datetime.datetime.now().year
        anos_projecao = target_year - ano_atual
        if anos_projecao <= 0: anos_projecao = 1 # Evitar divisão por zero

        # 2. Conversões
        quota_pct = quota / 100.0
        margem_pct = margem / 100.0
        desconto_pct = desconto / 100.0
        diluicao_pct = diluicao / 100.0

        # 3. Lógica VC (Top-Down)
        receita_alvo = tam * quota_pct
        nopat_alvo = receita_alvo * margem_pct
        
        # Valor de Saída (Exit)
        exit_value = nopat_alvo * multiplo
        
        # Valor Presente (PV)
        pv_equity = exit_value / ((1 + desconto_pct) ** anos_projecao)
        
        # Diluição
        acoes_futuras = acoes_atuais * ((1 + diluicao_pct) ** anos_projecao)
        
        # Preço Alvo
        target_price = pv_equity / acoes_futuras
        price_no_dilution = pv_equity / acoes_atuais

        # 4. Análise de Sobrevivência (Runway)
        if burn_anual <= 0:
            runway = 99.0
            runway_status = "safe"
        else:
            runway = caixa_atual / burn_anual
            if runway < 1.0: runway_status = "danger"
            elif runway < 2.0: runway_status = "warning"
            else: runway_status = "safe"

        return {
            "metrics": {
                "receita_alvo": receita_alvo,
                "nopat_alvo": nopat_alvo,
                "exit_value": exit_value,
                "pv_equity": pv_equity,
                "acoes_futuras": acoes_futuras,
                "target_price": target_price,
                "price_no_dilution": price_no_dilution,
                "years_to_exit": anos_projecao
            },
            "survival": {
                "runway": runway,
                "status": runway_status,
                "burn": burn_anual,
                "cash": caixa_atual
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# --- 1. LISTA DE PAÍSES (A TUA LISTA DA TESE) ---
# Convertido para ISO Alpha-2 Codes
TARGET_COUNTRY = "RU" # Rússia
DONOR_POOL = [
    "SA", # Arábia Saudita
    "ID", # Indonésia
    "AO", # Angola
    "AZ", # Azerbaijão
    "AU", # Austrália
    "BR", # Brasil
    "AR", # Argentina
    "TR", # Turquia
    "CO", # Colômbia
    "AM", # Arménia
    "EC", # Equador
    "CL", # Chile
    "MY", # Malásia
    "IN"  # Índia
]

# --- 2. OS 15 INDICADORES (Códigos do Banco Mundial) ---
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

def fetch_wb_data(indicator_code):
    """Busca dados ao Banco Mundial com tratamento de erros robusto"""
    # Pedimos dados desde 2010 até 2023
    countries = ";".join([TARGET_COUNTRY] + DONOR_POOL)
    url = f"http://api.worldbank.org/v2/country/{countries}/indicator/{indicator_code}?format=json&per_page=5000&date=2010:2023"
    
    try:
        r = requests.get(url, timeout=15) # Aumentei o timeout para 15s
        data = r.json()
        
        if not data or len(data) < 2: return None
        
        records = []
        for entry in data[1]:
            if entry['value'] is not None:
                # Mapear códigos ISO3 (ex: RUS) para ISO2 (ex: RU) se necessário, 
                # mas a API devolve ISO3. Vamos simplificar usando o que vem.
                records.append({
                    "country": entry['countryiso3code'],
                    "year": int(entry['date']),
                    "value": float(entry['value'])
                })
        
        df = pd.DataFrame(records)
        if df.empty: return None
        
        # Pivotar: Linhas=Anos, Colunas=Países
        pivot_df = df.pivot(index="year", columns="country", values="value")
        
        # TRUQUE IMPORTANTE: Remover países que tenham dados em falta (NaN)
        # Isto evita que o modelo falhe se Angola não tiver dados para FDI, por exemplo.
        pivot_df = pivot_df.dropna(axis=1)
        
        return pivot_df.sort_index()
    except Exception as e:
        print(f"WB API Error: {e}")
        return None

# --- ROTA DE CÁLCULO SCM ---
@app.get("/api/scm")
def calculate_scm(indicator: str = "GDP_CONST"):
    try:
        wb_code = INDICATORS.get(indicator, "NY.GDP.MKTP.KD")
        
        # 1. Obter Dados
        df = fetch_wb_data(wb_code)
        
        # Verificar se temos a Rússia (RUS) e pelo menos 2 dadores
        if df is None or "RUS" not in df.columns:
            raise HTTPException(status_code=404, detail="Dados indisponíveis para este indicador (WB API).")
            
        available_donors = [c for c in df.columns if c != "RUS"]
        if len(available_donors) < 2:
             raise HTTPException(status_code=400, detail="Dadores insuficientes com dados completos para este indicador.")

        # 2. Preparar Matrizes (2010-2021 = Treino)
        pre_years = [y for y in df.index if y < 2022]
        
        if len(pre_years) < 5:
             raise HTTPException(status_code=400, detail="Histórico insuficiente para calibração.")

        X0 = df.loc[pre_years, available_donors].values # Dadores (Matriz)
        X1 = df.loc[pre_years, "RUS"].values            # Rússia (Vetor)

        # 3. Otimização (Encontrar Pesos)
        n_donors = len(available_donors)
        
        # Função de perda: Diferença quadrática entre RU e Sintético no passado
        def loss(W):
            return np.sum((X1 - np.dot(X0, W))**2)

        # Restrições: Soma dos pesos = 1, Pesos >= 0
        constraints = ({'type': 'eq', 'fun': lambda W: np.sum(W) - 1})
        bounds = [(0, 1) for _ in range(n_donors)]
        initial_w = np.ones(n_donors) / n_donors
        
        res = minimize(loss, initial_w, method='SLSQP', bounds=bounds, constraints=constraints)
        weights = res.x

        # 4. Projetar (2010-2023)
        Y_donors = df[available_donors].values
        synth_values = np.dot(Y_donors, weights)
        
        # 5. Formatar Output
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

        # Quem compõe a Rússia Sintética?
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

# --- ROTAS DCF/VC/SEARCH (MANTIDAS PARA NÃO PARTIR O RESTO) ---
# (Cola aqui o resto das funções antigas get_metric, search, dcf, vc se as apagaste. 
# Se não, certifica-te que este ficheiro tem TODAS as rotas juntas.)
# Para garantir que funciona, vou colar as funções essenciais resumidas abaixo caso precises.

@app.get("/api/search")
def search(q: str):
    try:
        r = requests.get(f"https://query1.finance.yahoo.com/v1/finance/search?q={q}", headers={'User-Agent': 'Mozilla/5.0'})
        return [
            {"symbol": i.get('symbol'), "name": i.get('shortname'), "exchange": i.get('exchange')} 
            for i in r.json().get('quotes', []) if i.get('quoteType') == 'EQUITY'
        ]
    except: return []