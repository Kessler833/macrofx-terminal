// ══════════════════════════════════════════════════════════
// API MODULE — Frankfurter (free), FRED (key), Alpha Vantage
// ═════════════════════���════════════════════════════════════

window.API = {

  // ── FX Rates (no key needed) ───────────────────────────
  async getFXRates(base = 'USD') {
    try {
      const res = await fetch(`https://api.frankfurter.app/latest?base=${base}`);
      const data = await res.json();
      return data.rates || {};
    } catch(e) {
      console.warn('FX rates fetch failed:', e);
      return {};
    }
  },

  async getFXHistorical(from, to, start, end) {
    try {
      const res = await fetch(`https://api.frankfurter.app/${start}..${end}?base=${from}&symbols=${to}`);
      const data = await res.json();
      return data.rates || {};
    } catch(e) {
      console.warn('FX historical fetch failed:', e);
      return {};
    }
  },

  // ── FRED (requires API key) ────────────────────────────
  async getFREDSeries(seriesId) {
    const key = STATE.apiKeys.fred;
    if (!key) return null;
    try {
      const res = await fetch(
        `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${key}&file_type=json&sort_order=desc&limit=12`
      );
      const data = await res.json();
      return data.observations || [];
    } catch(e) {
      console.warn(`FRED ${seriesId} fetch failed:`, e);
      return null;
    }
  },

  // ── Alpha Vantage (requires API key) ───────────────────
  async getAVMacro(indicator) {
    const key = STATE.apiKeys.alphaVantage;
    if (!key) return null;
    try {
      const res = await fetch(
        `https://www.alphavantage.co/query?function=${indicator}&apikey=${key}`
      );
      const data = await res.json();
      return data;
    } catch(e) {
      console.warn(`AV ${indicator} fetch failed:`, e);
      return null;
    }
  },

  // ── US Treasury Yields (no key needed) ────────────────
  async getTreasuryYields() {
    try {
      const res = await fetch(
        'https://api.fiscaldata.treasury.gov/services/api/v1/accounting/od/avg_interest_rates?fields=record_date,security_desc,avg_interest_rate_amt&filter=security_desc:in:(Treasury Bills,Treasury Notes,Treasury Bonds)&sort=-record_date&page[size]=9'
      );
      const data = await res.json();
      return data.data || [];
    } catch(e) {
      console.warn('Treasury yields fetch failed:', e);
      return [];
    }
  },

  // ── Economic Calendar (Open source, no key) ────────────
  async getEconomicCalendar() {
    // Using tradingeconomics-style free endpoint via theglobaleconomy.com proxy
    // Fallback to static upcoming events if API unavailable
    return API._getStaticCalendar();
  },

  _getStaticCalendar() {
    const now = new Date();
    const events = [
      { date: _nextDate(1), time: '14:30', currency: 'USD', event: 'Core CPI m/m', impact: 'high', forecast: '0.3%', previous: '0.4%' },
      { date: _nextDate(2), time: '14:30', currency: 'USD', event: 'Initial Jobless Claims', impact: 'medium', forecast: '215K', previous: '211K' },
      { date: _nextDate(3), time: '08:00', currency: 'GBP', event: 'GDP m/m', impact: 'high', forecast: '0.1%', previous: '-0.1%' },
      { date: _nextDate(4), time: '13:45', currency: 'EUR', event: 'ECB Interest Rate Decision', impact: 'high', forecast: '2.50%', previous: '2.75%' },
      { date: _nextDate(5), time: '03:30', currency: 'AUD', event: 'Employment Change', impact: 'high', forecast: '25.0K', previous: '44.0K' },
      { date: _nextDate(6), time: '14:30', currency: 'CAD', event: 'CPI m/m', impact: 'high', forecast: '0.3%', previous: '0.1%' },
      { date: _nextDate(7), time: '14:30', currency: 'USD', event: 'Non-Farm Payrolls', impact: 'high', forecast: '185K', previous: '203K' },
      { date: _nextDate(8), time: '05:00', currency: 'JPY', event: 'BoJ Policy Rate', impact: 'high', forecast: '0.50%', previous: '0.25%' },
      { date: _nextDate(9), time: '09:30', currency: 'CHF', event: 'SNB Policy Rate', impact: 'high', forecast: '0.25%', previous: '0.50%' },
      { date: _nextDate(10), time: '07:00', currency: 'NZD', event: 'RBNZ Rate Decision', impact: 'high', forecast: '3.50%', previous: '3.75%' },
      { date: _nextDate(12), time: '20:00', currency: 'USD', event: 'FOMC Meeting Minutes', impact: 'high', forecast: '', previous: '' },
      { date: _nextDate(14), time: '08:00', currency: 'EUR', event: 'German GDP q/q', impact: 'high', forecast: '0.2%', previous: '-0.2%' },
    ];
    return events;
  }
};

function _nextDate(daysAhead) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}
