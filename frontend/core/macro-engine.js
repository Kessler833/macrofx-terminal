// ══════════════════════════════════════════════════════════
// MACRO ENGINE — CMSI Currency Macro Strength Index
// Scores each currency -5 to +5 across 7 factor categories
// ══════════════════════════════════════════════════════════

window.MACRO = {

  CURRENCIES: ['USD','EUR','GBP','JPY','AUD','NZD','CAD','CHF'],

  FACTORS: [
    { id: 'trend',   label: 'TREND',   weight: 1.5, desc: 'Price trend vs 200d MA' },
    { id: 'season',  label: 'SEASON',  weight: 0.5, desc: 'Seasonal patterns' },
    { id: 'cot',     label: 'COT',     weight: 1.2, desc: 'Commitment of Traders net positioning' },
    { id: 'crowd',   label: 'CROWD',   weight: 0.8, desc: 'Retail sentiment (contrarian)' },
    { id: 'gdp',     label: 'GDP',     weight: 1.3, desc: 'GDP growth rate vs trend' },
    { id: 'pmi',     label: 'MPMI',    weight: 1.0, desc: 'Manufacturing PMI vs 50' },
    { id: 'spmi',    label: 'SPMI',    weight: 1.0, desc: 'Services PMI vs 50' },
    { id: 'retail',  label: 'RETAIL',  weight: 0.9, desc: 'Retail Sales m/m' },
    { id: 'conf',    label: 'CONF',    weight: 0.7, desc: 'Consumer Confidence' },
    { id: 'cpi',     label: 'CPI',     weight: 1.4, desc: 'CPI vs Central Bank target' },
    { id: 'ppi',     label: 'PPI',     weight: 0.8, desc: 'Producer Price Index' },
    { id: 'pce',     label: 'PCE',     weight: 1.0, desc: 'PCE inflation (USD only)' },
    { id: 'rates',   label: 'RATES',   weight: 2.0, desc: 'Interest rate level + trend' },
    { id: 'nfp',     label: 'NFP',     weight: 1.2, desc: 'Non-Farm Payrolls / Employment' },
    { id: 'urate',   label: 'URATE',   weight: 1.1, desc: 'Unemployment rate trend' },
    { id: 'claims',  label: 'CLAIMS',  weight: 0.7, desc: 'Initial Jobless Claims' },
    { id: 'adp',     label: 'ADP',     weight: 0.6, desc: 'ADP Private Payrolls' },
    { id: 'jolts',   label: 'JOLTS',   weight: 0.5, desc: 'Job Openings' },
    { id: 'news',    label: 'NEWS',    weight: 0.8, desc: 'Recent CB statement tone' },
  ],

  // Central Bank rates (updated March 2026)
  CB_RATES: {
    USD: { rate: 4.375, bank: 'Federal Reserve', next: '2026-05-07', trend: 'hold', cycle: 'cutting' },
    EUR: { rate: 2.50,  bank: 'ECB',             next: '2026-04-17', trend: 'cutting', cycle: 'cutting' },
    GBP: { rate: 4.50,  bank: 'Bank of England',  next: '2026-05-08', trend: 'cutting', cycle: 'cutting' },
    JPY: { rate: 0.50,  bank: 'Bank of Japan',    next: '2026-04-30', trend: 'hiking',  cycle: 'hiking' },
    AUD: { rate: 4.10,  bank: 'RBA',              next: '2026-04-01', trend: 'cutting', cycle: 'cutting' },
    NZD: { rate: 3.75,  bank: 'RBNZ',             next: '2026-04-09', trend: 'cutting', cycle: 'cutting' },
    CAD: { rate: 3.00,  bank: 'Bank of Canada',   next: '2026-04-16', trend: 'cutting', cycle: 'cutting' },
    CHF: { rate: 0.50,  bank: 'SNB',              next: '2026-03-20', trend: 'cutting', cycle: 'cutting' },
  },

  // Demo/fallback scores (realistic March 2026 snapshot)
  // Replace with live data once API keys are configured
  DEMO_SCORES: {
    USD: { trend: 2, season: -1, cot: -1, crowd: -2, gdp: 1, pmi: 1, spmi: 1, retail: -1, conf: 1, cpi: -1, ppi: 1, pce: 1, rates: -1, nfp: 1, urate: 1, claims: 1, adp: 1, jolts: -1 },
    EUR: { trend: -2, season: 1, cot: 0, crowd: -1, gdp: 0, pmi: 0, spmi: 1, retail: -1, conf: 0, cpi: 1, ppi: -1, pce: 0, rates: 0, nfp: 0, urate: 0, claims: 0, adp: 0, jolts: 0 },
    GBP: { trend: -2, season: 1, cot: -2, crowd: 0, gdp: -1, pmi: -1, spmi: 0, retail: 1, conf: 0, cpi: 0, ppi: 1, pce: 0, rates: 0, nfp: 0, urate: -1, claims: 0, adp: 0, jolts: 0 },
    JPY: { trend: -2, season: -1, cot: -1, crowd: 0, gdp: -1, pmi: 1, spmi: 1, retail: 1, conf: 0, cpi: -1, ppi: 0, pce: 1, rates: 0, nfp: 0, urate: -1, claims: 0, adp: 0, jolts: 0 },
    AUD: { trend: -2, season: 1, cot: 2, crowd: 1, gdp: 1, pmi: -1, spmi: -1, retail: 1, conf: 0, cpi: 1, ppi: 1, pce: 0, rates: 0, nfp: 0, urate: -1, claims: 0, adp: 0, jolts: 0 },
    NZD: { trend: -2, season: -1, cot: -2, crowd: 0, gdp: 1, pmi: -1, spmi: -1, retail: 1, conf: 0, cpi: 1, ppi: 1, pce: 0, rates: 0, nfp: 0, urate: -1, claims: 0, adp: 0, jolts: 0 },
    CAD: { trend: -2, season: -1, cot: -1, crowd: 1, gdp: -1, pmi: 1, spmi: 1, retail: -1, conf: 0, cpi: -1, ppi: -1, pce: 0, rates: 0, nfp: 0, urate: 1, claims: 0, adp: 0, jolts: 0 },
    CHF: { trend: 1,  season: 0,  cot: 1,  crowd: -1, gdp: 0, pmi: 0, spmi: 0, retail: 0, conf: 0, cpi: -1, ppi: -1, pce: 0, rates: -1, nfp: 0, urate: 0, claims: 0, adp: 0, jolts: 0 },
  },

  computeScore(currency) {
    const factors = STATE.macroData[currency] || MACRO.DEMO_SCORES[currency] || {};
    let weightedSum = 0, totalWeight = 0;
    for (const f of MACRO.FACTORS) {
      if (f.id in factors) {
        weightedSum += (factors[f.id] || 0) * f.weight;
        totalWeight += f.weight;
      }
    }
    const raw = totalWeight > 0 ? weightedSum / totalWeight : 0;
    return Math.max(-5, Math.min(5, Math.round(raw * 10) / 10));
  },

  getBias(score) {
    if (score >= 1.5) return 'Bullish';
    if (score <= -1.5) return 'Bearish';
    return 'Neutral';
  },

  generateSignals() {
    const pairs = STATE.config.defaultPairs;
    const signals = [];
    for (const pair of pairs) {
      const base = pair.slice(0,3), quote = pair.slice(3,6);
      const baseScore = MACRO.computeScore(base);
      const quoteScore = MACRO.computeScore(quote);
      const diff = baseScore - quoteScore;
      if (Math.abs(diff) < 0.8) continue;
      const direction = diff > 0 ? 'LONG' : 'SHORT';
      const confidence = Math.min(99, Math.round(Math.abs(diff) / 5 * 100 * 1.4 + 35));
      signals.push({
        pair, base, quote, direction, diff,
        baseScore, quoteScore, confidence,
        baseBias: MACRO.getBias(baseScore),
        quoteBias: MACRO.getBias(quoteScore),
        holdingDays: Math.round(20 + Math.abs(diff) * 8),
      });
    }
    signals.sort((a,b) => Math.abs(b.diff) - Math.abs(a.diff));
    STATE.signals = signals;
    return signals;
  },

  getFactorColor(val) {
    if (val >= 1)  return 'var(--green)';
    if (val <= -1) return 'var(--red)';
    return 'var(--muted)';
  },

  getCellBg(val) {
    if (val >= 1)  return 'rgba(166,227,161,0.18)';
    if (val <= -1) return 'rgba(239,83,80,0.18)';
    return 'transparent';
  },

  getScoreBg(score) {
    const v = score;
    if (v >= 2)  return 'rgba(166,227,161,0.22)';
    if (v >= 0.5) return 'rgba(166,227,161,0.10)';
    if (v <= -2) return 'rgba(239,83,80,0.22)';
    if (v <= -0.5) return 'rgba(239,83,80,0.10)';
    return 'rgba(108,112,134,0.12)';
  }
};
