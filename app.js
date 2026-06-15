// ===== STATE =====
let currentYear, currentMonth;
let selectedDate = null;
let selectedType = 'workout';
let selectedTags = [];
let cachedData = {};   // in-memory cache so we don't re-fetch on every render

// ===== HELPERS =====
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function dateKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}
function todayKey() {
  const t = new Date();
  return dateKey(t.getFullYear(), t.getMonth(), t.getDate());
}

// ===== STREAK CALCULATION =====
// Rule: 1 rest day is fine. 2 consecutive non-workout days = streak broken.
function calcStreak(data) {
  let streak = 0;
  let missedInARow = 0;
  const t = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(t);
    d.setDate(t.getDate() - i);
    const k = dateKey(d.getFullYear(), d.getMonth(), d.getDate());
    if (data[k] && data[k].type === 'workout') {
      streak++;
      missedInARow = 0;
    } else {
      missedInARow++;
      if (missedInARow >= 2) break;
    }
  }
  return streak;
}

// ===== RENDER CALENDAR =====
function renderCalendar() {
  const data = cachedData;
  const grid = document.getElementById('calendarGrid');
  grid.innerHTML = '';

  DAYS.forEach(d => {
    const h = document.createElement('div');
    h.className = 'dow-header';
    h.textContent = d;
    grid.appendChild(h);
  });

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = todayKey();

  for (let b = 0; b < firstDay; b++) {
    const blank = document.createElement('div');
    blank.className = 'day-cell empty-cell';
    grid.appendChild(blank);
  }

  for (let d = 1; d <= totalDays; d++) {
    const k = dateKey(currentYear, currentMonth, d);
    const entry = data[k];
    const cell = document.createElement('div');
    cell.className = 'day-cell';
    if (k === today) cell.classList.add('today');
    if (entry) cell.classList.add(entry.type === 'workout' ? 'worked' : 'skipped');

    const num = document.createElement('div');
    num.className = 'day-num';
    num.textContent = d;
    cell.appendChild(num);

    if (entry) {
      const icon = document.createElement('div');
      icon.className = 'day-status-icon';
      icon.textContent = entry.type === 'workout' ? '✅' : '❌';
      cell.appendChild(icon);

      if (entry.tags && entry.tags.length) {
        const lbl = document.createElement('div');
        lbl.className = 'day-label';
        lbl.textContent = entry.tags.join(', ');
        cell.appendChild(lbl);
      }

      if (entry.note) {
        const note = document.createElement('div');
        note.className = 'day-note';
        note.textContent = entry.note;
        cell.appendChild(note);
      }
    }

    cell.addEventListener('click', () => openModal(k, entry));
    grid.appendChild(cell);
  }

  document.getElementById('monthYear').textContent = `${MONTHS[currentMonth]} ${currentYear}`;
  document.getElementById('streakCount').textContent = calcStreak(data);
  renderSummary(data);
}

// ===== MONTHLY SUMMARY =====
function renderSummary(data) {
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  let workouts = 0, skips = 0;
  for (let d = 1; d <= totalDays; d++) {
    const k = dateKey(currentYear, currentMonth, d);
    if (data[k]) {
      if (data[k].type === 'workout') workouts++;
      else skips++;
    }
  }
  const pct = totalDays > 0 ? Math.round((workouts / totalDays) * 100) : 0;
  const now = new Date();
  const isCurrentMonth = currentYear === now.getFullYear() && currentMonth === now.getMonth();
  const daysLeft = isCurrentMonth ? totalDays - now.getDate() : 0;

  document.getElementById('monthlySummary').innerHTML = `
    <div class="summary-title">${MONTHS[currentMonth]} ${currentYear} — Summary</div>
    <div class="summary-stats">
      <div class="stat-box"><div class="stat-num green">${workouts}</div><div class="stat-lbl">Workouts</div></div>
      <div class="stat-box"><div class="stat-num red">${skips}</div><div class="stat-lbl">Skipped</div></div>
      <div class="stat-box"><div class="stat-num acc">${pct}%</div><div class="stat-lbl">Consistency</div></div>
      <div class="stat-box"><div class="stat-num" style="color:var(--text)">${daysLeft}</div><div class="stat-lbl">Days left</div></div>
    </div>
  `;
}

// ===== MODAL =====
function openModal(key, existingEntry) {
  selectedDate = key;
  const [y, m, d] = key.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  document.getElementById('modalDate').textContent = dateObj.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  selectedTags = [];
  document.getElementById('workoutNote').value = '';
  document.getElementById('skipNote').value = '';
  document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));

  if (existingEntry) {
    setType(existingEntry.type);
    (existingEntry.tags || []).forEach(tag => {
      selectedTags.push(tag);
      document.querySelectorAll('.tag').forEach(btn => {
        if (btn.dataset.val === tag) btn.classList.add('active');
      });
    });
    if (existingEntry.type === 'workout') document.getElementById('workoutNote').value = existingEntry.note || '';
    else document.getElementById('skipNote').value = existingEntry.note || '';
    document.getElementById('deleteBtn').classList.remove('hidden');
  } else {
    setType('workout');
    document.getElementById('deleteBtn').classList.add('hidden');
  }

  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  selectedDate = null;
}

function setType(type) {
  selectedType = type;
  document.getElementById('workoutFields').classList.toggle('hidden', type !== 'workout');
  document.getElementById('skipFields').classList.toggle('hidden', type !== 'skip');
  document.getElementById('btnWorkout').classList.toggle('active', type === 'workout');
  document.getElementById('btnSkip').classList.toggle('active', type === 'skip');
}

function toggleTag(btn) {
  const val = btn.dataset.val;
  if (selectedTags.includes(val)) {
    selectedTags = selectedTags.filter(t => t !== val);
    btn.classList.remove('active');
  } else {
    selectedTags.push(val);
    btn.classList.add('active');
  }
}

// ===== SAVE / DELETE (now async via Supabase) =====
async function saveEntry() {
  if (!selectedDate) return;
  const note = selectedType === 'workout'
    ? document.getElementById('workoutNote').value.trim()
    : document.getElementById('skipNote').value.trim();

  const saveBtn = document.getElementById('saveBtn');
  saveBtn.textContent = 'Saving…';
  saveBtn.disabled = true;

  try {
    await dbSave(selectedDate, selectedType, [...selectedTags], note);
    cachedData[selectedDate] = { type: selectedType, tags: [...selectedTags], note };
    closeModal();
    renderCalendar();
  } catch (err) {
    alert('Could not save. Check your internet connection.');
    console.error(err);
  } finally {
    saveBtn.textContent = 'Save';
    saveBtn.disabled = false;
  }
}

async function deleteEntry() {
  if (!selectedDate) return;
  const deleteBtn = document.getElementById('deleteBtn');
  deleteBtn.textContent = 'Removing…';
  deleteBtn.disabled = true;

  try {
    await dbDelete(selectedDate);
    delete cachedData[selectedDate];
    closeModal();
    renderCalendar();
  } catch (err) {
    alert('Could not delete. Check your internet connection.');
    console.error(err);
  } finally {
    deleteBtn.textContent = 'Remove Entry';
    deleteBtn.disabled = false;
  }
}

// ===== EVENT LISTENERS =====
document.getElementById('prevMonth').addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  renderCalendar();
});
document.getElementById('nextMonth').addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  renderCalendar();
});
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});
document.getElementById('btnWorkout').addEventListener('click', () => setType('workout'));
document.getElementById('btnSkip').addEventListener('click', () => setType('skip'));
document.querySelectorAll('.tag').forEach(btn => btn.addEventListener('click', () => toggleTag(btn)));
document.getElementById('saveBtn').addEventListener('click', saveEntry);
document.getElementById('deleteBtn').addEventListener('click', deleteEntry);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ===== INIT (called by auth.js after login) =====
async function initApp() {
  const now = new Date();
  currentYear  = now.getFullYear();
  currentMonth = now.getMonth();

  // Show loading, hide content
  document.getElementById('loadingState').classList.remove('hidden');
  document.getElementById('appContent').classList.add('hidden');

  try {
    cachedData = await dbLoadAll();
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('appContent').classList.remove('hidden');
    renderCalendar();
  } catch (err) {
    document.getElementById('loadingState').innerHTML = '<p style="color:var(--red)">Failed to load data. Check your internet connection and refresh.</p>';
    console.error(err);
  }
}
