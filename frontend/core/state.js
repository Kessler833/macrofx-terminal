// ══════════════════════════════════════════════════════════
// GLOBAL STATE — no localStorage (sandboxed Electron compat)
// ══════════════════════════════════════════════════════════
window.STATE = {
  apiKeys: {
    fred: '',
    alphaVantage: '',
    twelveData: ''
  },
  // Cached macro data
  macroData: {},
  fxRates: {},
  lastUpdate: null,
  // User config
  config: {
    refreshInterval: 3600, // seconds
    theme: 'dark',
    defaultPairs: ['AUDJPY','USDJPY','EURUSD','GBPUSD','NZDJPY','USDCAD','AUDNZD','EURGBP']
  },
  // Signal state
  signals: [],
  activePair: null
};
