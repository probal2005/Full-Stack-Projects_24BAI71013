const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: {'Content-Type':'application/json', ...(options.headers || {})},
    ...options
  });
  const text = await response.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch {}
  if (!response.ok) throw new Error(data.error || data.message || `HTTP ${response.status}`);
  return data;
}

function renderStats(stats = {}) {
  $('totalPublished').textContent = stats.totalPublished ?? 0;
  $('processed').textContent = stats.processed ?? 0;
  $('retries').textContent = stats.retries ?? 0;
  $('deadLetter').textContent = stats.deadLetter ?? 0;
}

function formatTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleTimeString();
}

function renderEvents(events = []) {
  $('eventCount').textContent = `${events.length} tracked event${events.length === 1 ? '' : 's'}`;
  if (!events.length) {
    $('eventRows').innerHTML = '<tr><td colspan="6" class="empty">No events yet. Publish one to begin the experiment.</td></tr>';
    return;
  }
  $('eventRows').innerHTML = events.map(event => {
    const id = String(event.eventId || '');
    const status = String(event.status || 'PUBLISHED').toUpperCase();
    return `<tr>
      <td title="${esc(id)}">${esc(id.slice(0, 12))}${id.length > 12 ? '…' : ''}</td>
      <td class="payload" title="${esc(event.content)}">${esc(event.content || '—')}</td>
      <td>${Number(event.attempts || 0)}</td>
      <td><span class="status ${esc(status)}">${esc(status)}</span></td>
      <td>${esc(formatTime(event.updatedAt || event.createdAt))}</td>
      <td><button class="duplicate-btn" data-duplicate="${esc(id)}">Replay ID</button></td>
    </tr>`;
  }).join('');
}

async function refresh() {
  try {
    const data = await api('/api/events?limit=50');
    renderStats(data.stats);
    renderEvents(data.events);
  } catch (error) {
    $('eventRows').innerHTML = `<tr><td colspan="6" class="empty">API unavailable: ${esc(error.message)}</td></tr>`;
  }
}

$('eventForm').addEventListener('submit', async event => {
  event.preventDefault();
  const button = $('eventForm').querySelector('button[type="submit"]');
  const message = $('formMessage');
  button.disabled = true;
  message.className = 'form-message';
  message.textContent = 'Publishing event to Kafka…';

  try {
    const payload = {
      content: $('content').value.trim(),
      eventId: $('eventId').value.trim() || null,
      failAttempts: Number($('failAttempts').value),
      alwaysFail: $('alwaysFail').checked
    };
    const result = await api('/api/events', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    message.textContent = `Published event ${result.event.eventId}`;
    $('content').value = '';
    $('eventId').value = '';
    await refresh();
  } catch (error) {
    message.className = 'form-message error';
    message.textContent = error.message;
  } finally {
    button.disabled = false;
  }
});

$('eventRows').addEventListener('click', async event => {
  const button = event.target.closest('[data-duplicate]');
  if (!button) return;
  button.disabled = true;
  try {
    await api(`/api/events/${encodeURIComponent(button.dataset.duplicate)}/duplicate`, {method:'POST'});
    await refresh();
  } catch (error) {
    alert(`Replay failed: ${error.message}`);
  } finally {
    button.disabled = false;
  }
});

$('refreshBtn').addEventListener('click', refresh);
refresh();
setInterval(refresh, 3000);
