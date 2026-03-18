// ══ CB RATES PAGE ══
ROUTER.register('rates', initRates);

function initRates() {
  const container = document.getElementById('page-rates');
  const rates = MACRO.CB_RATES;
  const curs = Object.keys(rates);

  const trendIcon = t => t === 'hiking' ? '↑' : t === 'cutting' ? '↓' : '→';

  // Rate cards
  const cards = curs.map(c => {
    const r = rates[c];
    return `
      <div class="rate-card">
        <div class="rate-card-header">
          <span class="rate-currency">${c}</span>
          <span class="rate-cycle ${r.cycle}">${r.cycle.toUpperCase()}</span>
        </div>
        <div class="rate-value">${r.rate.toFixed(2)}%
          <span class="rate-trend" style="color:${r.trend === 'hiking' ? 'var(--green)' : r.trend === 'cutting' ? 'var(--red)' : 'var(--muted)'}">${trendIcon(r.trend)}</span>
        </div>
        <div class="rate-bank">${r.bank}</div>
        <div class="rate-next">📅 Next meeting: ${r.next}</div>
      </div>`;
  }).join('');

  // Differential matrix
  let matHead = '<tr><th></th>' + curs.map(c => `<th>${c}</th>`).join('') + '</tr>';
  let matRows = curs.map(baseC => {
    const cells = curs.map(quoteC => {
      if (baseC === quoteC) return `<td class="diff-cell diff-zero">—</td>`;
      const diff = rates[baseC].rate - rates[quoteC].rate;
      const cls = diff > 0.1 ? 'diff-positive' : diff < -0.1 ? 'diff-negative' : 'diff-zero';
      return `<td class="diff-cell ${cls}">${diff > 0 ? '+' : ''}${diff.toFixed(2)}</td>`;
    }).join('');
    return `<tr><th>${baseC}</th>${cells}</tr>`;
  }).join('');

  container.innerHTML = `
    <div class="rates-page">
      <div class="panel-header">🏦 Central Bank Rates — March 2026</div>
      <div class="rates-body">
        <div class="rates-grid">${cards}</div>
        <div class="differential-table-wrap">
          <div class="differential-title">Interest Rate Differential Matrix (row − col)</div>
          <table class="diff-table">
            <thead>${matHead}</thead>
            <tbody>${matRows}</tbody>
          </table>
        </div>
      </div>
    </div>`;
}
