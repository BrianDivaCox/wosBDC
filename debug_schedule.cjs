const fs = require('fs');
const raw = fs.readFileSync('wos_sched_debug.json', 'utf8').replace(/^\uFEFF/, '');
const data = JSON.parse(raw);
const now = new Date();
const todayStr = now.toDateString();
console.log('NOW:', now.toISOString(), '| todayStr:', todayStr);
console.log('');
console.log('=== EVENT ROWS SCAN (rows 1-34) ===');
let todayEvents = [], upcomingEvents = [];
for (let i = 1; i < Math.min(34, data.length); i++) {
  const row = data[i];
  const eventName = row[5];
  const dateRaw = row[6];
  const utcRaw = row[7];
  if (!eventName || String(eventName).trim() === '') { console.log('Row',i,': SKIP blank'); continue; }
  if (String(eventName).includes("Event's")) { console.log('Row',i,': SKIP header:', eventName); continue; }
  if (String(eventName).trim() === 'Rewards') { console.log('Row',i,': BREAK at Rewards'); break; }
  const hasDate = typeof dateRaw === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(dateRaw);
  if (!hasDate) { console.log('Row',i,':', String(eventName),'=> no date'); continue; }
  const eventDate = new Date(dateRaw);
  const isToday = eventDate.toDateString() === todayStr;
  const isFuture = eventDate > now && !isToday;

  let utcDisplay = '', localTimeStr = '', eventDateTime = null;
  if (typeof utcRaw === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(utcRaw)) {
    const gasDate = new Date(utcRaw);
    gasDate.setUTCHours(gasDate.getUTCHours() - 8);
    const h = gasDate.getUTCHours(), m = gasDate.getUTCMinutes();
    utcDisplay = String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ' UTC';
    eventDateTime = new Date(eventDate);
    eventDateTime.setUTCHours(h, m, 0, 0);
  }
  const isPast = eventDateTime ? eventDateTime < now : (!isToday && eventDate < now);
  const bucket = isToday ? 'TODAY' : (isFuture && !isPast ? 'UPCOMING' : 'PAST/SKIP');
  console.log('Row',i,'|', String(eventName).padEnd(30), '| date:', eventDate.toDateString(), '| isToday:', isToday, '| isFuture:', isFuture, '| isPast:', isPast, '| UTC:', utcDisplay, '|', bucket);
  if (isToday) todayEvents.push(eventName);
  else if (isFuture && !isPast) upcomingEvents.push(eventName);
}
console.log('');
console.log('TODAY events:', todayEvents);
console.log('UPCOMING events:', upcomingEvents);
console.log('');
console.log('=== REWARDS HEADER ===');
for (let i = 0; i < data.length; i++) {
  const cell = String(data[i][5] || '').trim().toLowerCase();
  if (cell === 'rewards') {
    console.log('Rewards header at row', i);
    for (let j = i+1; j < Math.min(i+6, data.length); j++) {
      console.log('  Row',j,'cols F-I:', data[j][5], '|', data[j][6], '|', data[j][7], '|', data[j][8]);
    }
    break;
  }
}
