// ══ CONFIG PAGE ══
ROUTER.register('config', initConfig);

function initConfig() {
  const container = document.getElementById('page-config');

  const ALL_PAIRS = ['AUDJPY','USDJPY','EURUSD','GBPUSD','NZDJPY','USDCAD','AUDNZD','EURGBP','EURJPY','GBPJPY','AUDUSD','USDCHF','EURCHF','CADCHF','NZDUSD'];

  function getStatusDot(key) {
    return key ? 'status-ok' : 'status-none';
  }

  function getStatusLabel(key) {
    return key ? '✓ Connected' : 'No key';
  }

  function notify(msg, type = 'success') {
    const el = container.querySelector('.config-notification');
    el.textContent = msg;
    el.className = `config-notification ${type}`;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 3000);
  }

  function render() {
    const pairsHtml = ALL_PAIRS.map(p => {
      const on = STATE.config.defaultPairs.includes(p);
      return `<button class="pair-toggle ${on ? 'on' : ''}" data-pair="${p}">${p}</button>`;
    }).join('');

    container.innerHTML = `
      <div class="config-container">
        <h1>⚙️ Config &amp; API Keys</h1>
        <p class="config-subtitle">Keys stored in memory only — cleared on app restart. Never sent to any server.</p>

        <div class="api-status-bar">
          <div class="api-status-item"><span class="status-dot ${getStatusDot(STATE.apiKeys.fred)}"></span>FRED</div>
          <div class="api-status-item"><span class="status-dot ${getStatusDot(STATE.apiKeys.alphaVantage)}"></span>Alpha Vantage</div>
          <div class="api-status-item"><span class="status-dot ${getStatusDot(STATE.apiKeys.twelveData)}"></span>Twelve Data</div>
          <div class="api-status-item"><span class="status-dot status-ok"></span>Frankfurter (free)</div>
        </div>

        <div class="config-notification"></div>

        <div class="config-section">
          <h2>📡 API Keys</h2>
          <p class="section-desc">Enter your free API keys below. Get FRED at <a href="https://fred.stlouisfed.org/docs/api/api_key.html" target="_blank">fred.stlouisfed.org</a>, Alpha Vantage at <a href="https://www.alphavantage.co/support/#api-key" target="_blank">alphavantage.co</a>.</p>
          <div class="config-field">
            <label>FRED API Key</label>
            <input type="password" id="cfg-fred" placeholder="e.g. abcd1234efgh5678" value="${STATE.apiKeys.fred}">
            <span class="field-hint">Used for: CPI, rates, GDP, unemployment, PCE (US data)</span>
          </div>
          <div class="config-field">
            <label>Alpha Vantage API Key</label>
            <input type="password" id="cfg-av" placeholder="e.g. DEMO" value="${STATE.apiKeys.alphaVantage}">
            <span class="field-hint">Used for: FX OHLCV, global macro indicators, GDP</span>
          </div>
          <div class="config-field">
            <label>Twelve Data API Key (optional)</label>
            <input type="password" id="cfg-td" placeholder="optional" value="${STATE.apiKeys.twelveData}">
            <span class="field-hint">Used for: additional FX rates, economic data</span>
          </div>
          <div class="config-btns">
            <button class="btn btn-primary" id="cfg-save">💾 Save Keys</button>
            <button class="btn btn-ghost" id="cfg-clear">Clear All Keys</button>
          </div>
        </div>

        <div class="config-divider"></div>

        <div class="config-section">
          <h2>📈 Monitored Pairs</h2>
          <p class="section-desc">Select pairs to include in signal generation and the Pairs page.</p>
          <div class="config-pairs-grid">${pairsHtml}</div>
          <div style="margin-top:12px">
            <button class="btn btn-ghost" id="cfg-pairs-save">Save Pair Selection</button>
          </div>
        </div>

        <div class="config-divider"></div>

        <div class="config-section">
          <h2>⚙️ General</h2>
          <div class="config-field">
            <label>Data Refresh Interval</label>
            <select id="cfg-refresh" style="background:var(--surface);border:1px solid var(--border2);color:var(--text);padding:9px 12px;border-radius:5px;font-size:13px">
              <option value="1800" ${STATE.config.refreshInterval===1800?'selected':''}>30 minutes</option>
              <option value="3600" ${STATE.config.refreshInterval===3600?'selected':''}>1 hour</option>
              <option value="14400" ${STATE.config.refreshInterval===14400?'selected':''}>4 hours</option>
              <option value="86400" ${STATE.config.refreshInterval===86400?'selected':''}>Daily</option>
            </select>
          </div>
        </div>

        <div class="config-divider"></div>

        <div class="config-section">
          <h2>🖱️ About</h2>
          <p class="section-desc" style="font-size:11px;line-height:1.7">
            MacroFX Terminal v1.0.0 — Institutional macro swing trading dashboard.<br>
            Strategy: CMSI (Currency Macro Strength Index) — 7-factor composite scoring model.<br>
            Free APIs: Frankfurter (no key), FRED (free), Alpha Vantage (free), US Treasury (no key).<br>
            Part of the QuantOS ecosystem — <a href="https://github.com/Kessler833" target="_blank">github.com/Kessler833</a>
          </p>
        </div>
      </div>`;

    // Save keys
    container.querySelector('#cfg-save').addEventListener('click', () => {
      STATE.apiKeys.fred         = container.querySelector('#cfg-fred').value.trim();
      STATE.apiKeys.alphaVantage = container.querySelector('#cfg-av').value.trim();
      STATE.apiKeys.twelveData   = container.querySelector('#cfg-td').value.trim();
      notify('✓ API keys saved to session memory');
      // Invalidate router so config page re-renders with updated status
      ROUTER.pages['config'].ready = false;
      render();
    });

    // Clear keys
    container.querySelector('#cfg-clear').addEventListener('click', () => {
      STATE.apiKeys = { fred: '', alphaVantage: '', twelveData: '' };
      notify('Keys cleared', 'error');
      ROUTER.pages['config'].ready = false;
      render();
    });

    // Pair toggles
    container.querySelectorAll('.pair-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('on');
      });
    });

    // Save pairs
    container.querySelector('#cfg-pairs-save').addEventListener('click', () => {
      const selected = [...container.querySelectorAll('.pair-toggle.on')].map(b => b.dataset.pair);
      if (selected.length === 0) { notify('Select at least one pair', 'error'); return; }
      STATE.config.defaultPairs = selected;
      MACRO.generateSignals();
      // Reset signal + pairs pages so they re-render
      ROUTER.pages['signals'].ready = false;
      ROUTER.pages['pairs'].ready   = false;
      notify(`✓ ${selected.length} pairs saved`);
    });

    // Refresh interval
    container.querySelector('#cfg-refresh').addEventListener('change', e => {
      STATE.config.refreshInterval = parseInt(e.target.value);
    });
  }

  render();
}
