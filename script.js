/* ---------------- data ---------------- */
const PROGRAM = [
  {label:'Day 1', date:'Wed 07 Oct', items:[
    {t:'13:00', h:'Flight Arrival', d:'Group arrival in Istanbul (Tripoli & Benghazi flights)'},
    {t:'13:45–15:00', h:'Airport Transfer', d:'Private group transfer to the hotel'},
    {t:'15:00–15:30', h:'Hotel Check-in', d:'Check-in at Point Hotel 5★ Taksim'},
    {t:'15:30–16:30', h:'Welcome Coffee Break', d:'Welcome refreshments upon arrival at the hotel'},
    {t:'16:30–19:00', h:'Leisure Time', d:'Time to rest and refresh'},
    {t:'19:00–20:00', h:'Opening & Program Overview', d:'Opening ceremony and agenda overview'},
    {t:'20:00–20:30', h:'Transfer to Dinner', d:'Evening transfer to restaurant'},
    {t:'20:30–22:30', h:'Welcome Dinner', d:'Group dinner at Meat Moot Ortaköy'},
    {t:'22:30–23:00', h:'Return Transfer', d:'Private transfer back to Point Hotel 5★'},
  ]},
  {label:'Day 2', date:'Thu 08 Oct', items:[
    {t:'07:00–08:45', h:'Breakfast', d:'Point Hotel Restaurant'},
    {t:'09:00–11:00', h:'Scientific Session', d:'Scientific Session — Day 1'},
    {t:'11:00–12:00', h:'Preparation', d:'Lobby gathering for departure'},
    {t:'12:00–14:00', h:'Scenic Drive to Sapanca', d:'Departure for the Sapanca excursion'},
    {t:'14:00–16:00', h:'Sapanca Sightseeing Tour', d:'Visit to Glass Terrace, Sapanca Lake and Maşukiye with leisure activities'},
    {t:'16:00–17:00', h:'Group Lunch', d:'Inclusive group lunch at Sapanca'},
    {t:'17:00–19:00', h:'Return Drive to Istanbul', d:'Scenic drive back to Point Hotel 5★'},
    {t:'19:00 onwards', h:'Evening at Leisure', d:'Free evening to enjoy Taksim'},
  ]},
  {label:'Day 3', date:'Fri 09 Oct', items:[
    {t:'07:00–08:45', h:'Breakfast', d:'Point Hotel Restaurant'},
    {t:'09:00–11:00', h:'Scientific Session', d:'Scientific Session — Day 2'},
    {t:'11:00–19:30', h:'Leisure & City Exploration', d:'Free time for shopping and exploring Istanbul'},
    {t:'19:30–20:00', h:'Transfer to Dinner', d:'Evening transfer to restaurant'},
    {t:'20:00–22:30', h:'Gala Dinner', d:'Farewell dinner at Kuzu Beyi Restaurant'},
    {t:'22:30–23:00', h:'Return Transfer', d:'Private transfer back to Point Hotel 5★'},
  ]},
  {label:'Day 4', date:'Sat 10 Oct', items:[
    {t:'07:00–10:00', h:'Breakfast', d:'Point Hotel Restaurant'},
    {t:'10:00–10:30', h:'Hotel Check-out', d:'Luggage collection and check-out'},
    {t:'10:30–11:30', h:'Departure Transfer', d:'Private group transfer to Istanbul Airport'},
    {t:'11:30', h:'Airport Check-in', d:'Flight check-in and passport control'},
    {t:'14:00', h:'Departure', d:'Flights depart back to Tripoli and Benghazi'},
  ]},
];
const HOTEL = {lat:41.0387, lon:28.9861};

/* ---------------- storage helpers ---------------- */
async function loadProfile(){
  try{
    const raw = localStorage.getItem('orthosam_profile');
    return raw ? JSON.parse(raw) : null;
  }catch(e){ return null; }
}
async function storeProfile(profile){
  try{ localStorage.setItem('orthosam_profile', JSON.stringify(profile)); }catch(e){/* best effort */}
}

let profile = {name:'', photo:''};

function applyProfile(){
  document.getElementById('greetName').textContent = profile.name ? ('Welcome, ' + profile.name) : 'Welcome';
  const imgs = [document.getElementById('homeAvatarImg')];
  const icons = [document.getElementById('homeAvatarIcon')];
  if(profile.photo){
    imgs.forEach(i=>{i.src=profile.photo; i.style.display='block';});
    icons.forEach(i=>i.style.display='none');
  }
}

function resizeImage(file, cb){
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const size = 240;
      const canvas = document.createElement('canvas');
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext('2d');
      const s = Math.max(size/img.width, size/img.height);
      const w = img.width*s, h = img.height*s;
      ctx.drawImage(img, (size-w)/2, (size-h)/2, w, h);
      cb(canvas.toDataURL('image/jpeg', 0.75));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

/* ---------------- onboarding ---------------- */
const onboarding = document.getElementById('onboarding');
document.getElementById('obPhotoPick').onclick = () => document.getElementById('obPhotoInput').click();
document.getElementById('obPhotoInput').onchange = e => {
  if(!e.target.files[0]) return;
  resizeImage(e.target.files[0], dataUrl => {
    profile.photo = dataUrl;
    const img = document.getElementById('obPhotoImg');
    img.src = dataUrl; img.style.display='block';
    document.getElementById('obPhotoIcon').style.display='none';
  });
};
document.getElementById('obEnter').onclick = async () => {
  profile.name = document.getElementById('obName').value.trim() || 'Guest';
  await storeProfile(profile);
  applyProfile();
  onboarding.style.display = 'none';
};

/* ---------------- edit sheet ---------------- */
const sheetBg = document.getElementById('sheetBg');
function openSheet(){
  document.getElementById('sheetName').value = profile.name || '';
  const img = document.getElementById('sheetPhotoImg');
  if(profile.photo){ img.src = profile.photo; img.style.display='block'; document.getElementById('sheetPhotoIcon').style.display='none'; }
  sheetBg.classList.add('show');
}
function closeSheet(){ sheetBg.classList.remove('show'); }
document.getElementById('homeAvatarBtn').onclick = openSheet;
document.getElementById('sheetPhotoPick').onclick = () => document.getElementById('sheetPhotoInput').click();
document.getElementById('sheetPhotoInput').onchange = e => {
  if(!e.target.files[0]) return;
  resizeImage(e.target.files[0], dataUrl => {
    profile.photo = dataUrl;
    const img = document.getElementById('sheetPhotoImg');
    img.src = dataUrl; img.style.display='block';
    document.getElementById('sheetPhotoIcon').style.display='none';
  });
};
async function saveProfile(){
  profile.name = document.getElementById('sheetName').value.trim() || profile.name || 'Guest';
  await storeProfile(profile);
  applyProfile();
  closeSheet();
}

/* ---------------- tabs ---------------- */
function goTab(name){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById('view-'+name).classList.add('active');
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active', t.dataset.tab===name));
  document.getElementById('views').scrollTop = 0;
}

/* ---------------- program rendering ---------------- */
let activeDay = 0;
function renderDayTabs(){
  const wrap = document.getElementById('daytabs');
  wrap.innerHTML = '';
  PROGRAM.forEach((d,i)=>{
    const b = document.createElement('button');
    b.className = 'daychip' + (i===activeDay?' active':'');
    b.textContent = d.label;
    b.onclick = () => { activeDay = i; renderDayTabs(); renderTimeline(); };
    wrap.appendChild(b);
  });
}
function renderTimeline(){
  const day = PROGRAM[activeDay];
  document.getElementById('daylabel').textContent = day.date;
  const tl = document.getElementById('timeline');
  tl.innerHTML = day.items.map(it => `
    <div class="titem">
      <div class="time">${it.t}</div>
      <h4>${it.h}</h4>
      <p>${it.d}</p>
    </div>`).join('');
}

/* ---------------- countdown ---------------- */
function updateCountdown(){
  const target = new Date('2026-10-07T09:00:00');
  const now = new Date();
  let diff = target - now;
  if(diff < 0) diff = 0;
  const days = Math.floor(diff/86400000);
  const hours = Math.floor((diff%86400000)/3600000);
  const mins = Math.floor((diff%3600000)/60000);
  document.getElementById('cdDays').textContent = days;
  document.getElementById('cdHours').textContent = hours;
  document.getElementById('cdMins').textContent = mins;
}

/* ---------------- geolocation ---------------- */
function haversine(lat1,lon1,lat2,lon2){
  const R=6371, toRad=x=>x*Math.PI/180;
  const dLat=toRad(lat2-lat1), dLon=toRad(lon2-lon1);
  const a=Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
function locateMe(){
  const el = document.getElementById('locText');
  if(!navigator.geolocation){ el.textContent = 'Location is not available on this device.'; return; }
  el.textContent = 'Locating…';
  navigator.geolocation.getCurrentPosition(pos=>{
    const km = haversine(pos.coords.latitude, pos.coords.longitude, HOTEL.lat, HOTEL.lon);
    el.textContent = km < 1 ? 'You are right at the hotel.' : `You're about ${km.toFixed(1)} km from Point Hotel Taksim.`;
  }, err=>{
    el.textContent = 'Location access was denied — enable it in your browser settings.';
  }, {enableHighAccuracy:true, timeout:8000});
}

/* ---------------- currency converter ---------------- */
const fLYD = document.getElementById('fLYD');
const fTRY = document.getElementById('fTRY');
const fUSD = document.getElementById('fUSD');
const rLYD = document.getElementById('rLYD');
const rTRY = document.getElementById('rTRY');
let lastEdited = 'LYD';

function convert(){
  const usdPerLyd = 1/parseFloat(rLYD.value||6.35);
  const tryPerUsd = parseFloat(rTRY.value||48.40);
  let usd;
  if(lastEdited==='LYD') usd = parseFloat(fLYD.value||0) * usdPerLyd;
  else if(lastEdited==='TRY') usd = parseFloat(fTRY.value||0) / tryPerUsd;
  else usd = parseFloat(fUSD.value||0);

  if(lastEdited!=='LYD') fLYD.value = (usd/usdPerLyd).toFixed(2);
  if(lastEdited!=='TRY') fTRY.value = (usd*tryPerUsd).toFixed(2);
  if(lastEdited!=='USD') fUSD.value = usd.toFixed(2);
}
fLYD.addEventListener('input', ()=>{lastEdited='LYD'; convert();});
fTRY.addEventListener('input', ()=>{lastEdited='TRY'; convert();});
fUSD.addEventListener('input', ()=>{lastEdited='USD'; convert();});
rLYD.addEventListener('input', convert);
rTRY.addEventListener('input', convert);
function toggleRates(){ document.getElementById('ratePanel').classList.toggle('open'); }

/* ---------------- init ---------------- */
(async function init(){
  renderDayTabs();
  renderTimeline();
  updateCountdown();
  setInterval(updateCountdown, 60000);
  convert();

  const saved = await loadProfile();
  if(saved && saved.name){
    profile = saved;
    applyProfile();
    onboarding.style.display = 'none';
  }
})();
