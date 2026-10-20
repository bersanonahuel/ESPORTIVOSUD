// ============================================================================
// SINTÉTICO EL POTRERO - VERSIÓN 2.0 (CANCHA ÚNICA + CUENTAS CON MAIL + CAJA CIEGA)
// ============================================================================

const STORAGE_KEY = 'sportivo_cancha_unica_v2';
const SESSION_USER_KEY = 'sportivo_logged_user_id_v2';
const LOCAL_MY_BOOKINGS_KEY = 'sportivo_my_booking_ids_v2';

const DAY_NAMES_SHORT = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
const DAY_NAMES_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const HOURS = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

function getDateKey(offsetDays = 0) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function nowTimeStr() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function getUpcomingDays(count = 7) {
  const list = [];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + i);
    const key = getDateKey(i);
    const dow = d.getDay();
    const dayNum = d.getDate();
    let topLabel = DAY_NAMES_SHORT[dow];
    let mainLabel = `${DAY_NAMES_SHORT[dow]} ${dayNum}`;
    if (i === 0) {
      topLabel = 'HOY';
      mainLabel = `HOY ${dayNum}`;
    } else if (i === 1) {
      topLabel = 'MAÑANA';
      mainLabel = `MAÑ ${dayNum}`;
    }
    list.push({
      key,
      dow,
      dayNum,
      topLabel,
      mainLabel,
      fullLabel:
        i === 0
          ? `Hoy ${DAY_NAMES_FULL[dow]} ${dayNum}`
          : i === 1
          ? `Mañana ${DAY_NAMES_FULL[dow]} ${dayNum}`
          : `${DAY_NAMES_FULL[dow]} ${dayNum}`
    });
  }
  return list;
}

function formatMoney(amount) {
  return '$' + Number(amount || 0).toLocaleString('es-AR');
}

function cleanPhoneForWa(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return '5491100000000';
  if (digits.startsWith('54')) return digits;
  return '549' + digits;
}

function buildInitialState() {
  const today = getDateKey(0);
  const todayDow = new Date().getDay();

  return {
    version: 2,
    config: {
      clubName: 'SINTÉTICO EL POTRERO',
      clubSub: 'Av. San Martín 1450 • Cancha Única Techada • Cantina y Parrilla',
      pitchTitle: 'Cancha Principal (Sintético Profesional)',
      courtStatus: 'open', // 'open' | 'last_slots' | 'closed_rain'
      courtStatusText: '🟢 CANCHA HABILITADA — Se juega normal (Techada e iluminada)',
      clubWhatsapp: '5491155554444',
      mpAlias: 'cancha.elpotrero.mp',
      basePrice: 30000,
      promoDiscount: 6000,
      promoHours: [14, 15, 16, 17],
      depositPercent: 30,
      loyaltyGoal: 10,
      loyaltyRewardText: '🍻 1 Cajón de Cervezas o 50% OFF en Cancha',
      ownerPin: '1234',
      staffPin: '0000'
    },
    extrasCatalog: [
      { id: 'ex_cerveza', name: '🍺 Promo 3 Cervezas 1L bien frías (para el final)', price: 12000 },
      { id: 'ex_agua', name: '💧 Pack 10 Aguas frías para el partido', price: 8000 },
      { id: 'ex_pecheras', name: '🎽 Juego de Pecheras limpias + Pelota nueva', price: 3000 },
      { id: 'ex_asado', name: '🔥 Uso de Parrilla + Mesa reservada', price: 10000 }
    ],
    users: [
      {
        id: 'u_tucu',
        name: 'El Tucu (Obra Mitre)',
        email: 'tucu@gmail.com',
        phone: '11 6543-2109',
        pin: '1234',
        stamps: 7,
        completedMatches: 7,
        cancelledMatches: 0,
        createdAt: today
      },
      {
        id: 'u_marcos',
        name: 'Marcos (Los del Andamio)',
        email: 'marcos.obra@gmail.com',
        phone: '11 3344-5566',
        pin: '1234',
        stamps: 3,
        completedMatches: 3,
        cancelledMatches: 0,
        createdAt: today
      },
      {
        id: 'u_ramiro',
        name: 'Ramiro (El Corralón)',
        email: 'ramiro.corralon@gmail.com',
        phone: '11 4987-1122',
        pin: '1234',
        stamps: 9,
        completedMatches: 9,
        cancelledMatches: 1,
        createdAt: today
      }
    ],
    fixedSchedules: [
      {
        id: 'fx_1',
        dow: todayDow,
        hour: 19,
        userId: 'u_tucu',
        customerName: 'El Tucu (Cuadrilla Obra Mitre)',
        customerEmail: 'tucu@gmail.com',
        customerPhone: '11 6543-2109',
        teamSize: 10,
        notes: 'Fijo semanal. Siempre piden la promo de 3 cervezas.'
      },
      {
        id: 'fx_2',
        dow: (todayDow + 1) % 7,
        hour: 20,
        userId: 'u_ramiro',
        customerName: 'Ramiro y los del Corralón',
        customerEmail: 'ramiro.corralon@gmail.com',
        customerPhone: '11 4987-1122',
        teamSize: 10,
        notes: 'Fijo semanal a las 20hs.'
      }
    ],
    fixedExceptions: [],
    bookings: [
      {
        id: 'bk_seed_1',
        matchCode: 'P190',
        date: today,
        hour: 19,
        userId: 'u_tucu',
        customerName: 'El Tucu (Cuadrilla Obra Mitre)',
        customerEmail: 'tucu@gmail.com',
        customerPhone: '11 6543-2109',
        teamSize: 10,
        isFixedInstance: true,
        fixedId: 'fx_1',
        paymentStatus: 'deposit_verified',
        paymentMethod: 'transfer',
        courtPrice: 30000,
        extras: [{ id: 'ex_cerveza', name: '🍺 Promo 3 Cervezas 1L bien frías (para el final)', price: 12000 }],
        paidAmount: 9000,
        playersList: [
          { name: 'El Tucu (Arquero)', paid: true },
          { name: 'Fabián', paid: true },
          { name: 'Chicho', paid: true },
          { name: 'Rubén', paid: false },
          { name: 'Moncho', paid: false },
          { name: 'Darío', paid: true },
          { name: 'Pato', paid: false },
          { name: 'Walter', paid: false },
          { name: 'Cacho', paid: false },
          { name: '', paid: false }
        ]
      },
      {
        id: 'bk_seed_2',
        matchCode: 'P200',
        date: today,
        hour: 20,
        userId: 'u_ramiro',
        customerName: 'Ramiro (El Corralón)',
        customerEmail: 'ramiro.corralon@gmail.com',
        customerPhone: '11 4987-1122',
        teamSize: 10,
        isFixedInstance: false,
        paymentStatus: 'paid',
        paymentMethod: 'cash',
        courtPrice: 30000,
        extras: [{ id: 'ex_agua', name: '💧 Pack 10 Aguas frías para el partido', price: 8000 }],
        paidAmount: 38000,
        playersList: Array.from({ length: 10 }, (_, i) => ({
          name: i === 0 ? 'Ramiro' : `Compañero ${i + 1}`,
          paid: true
        }))
      },
      {
        id: 'bk_seed_3',
        matchCode: 'P210',
        date: today,
        hour: 21,
        userId: 'u_marcos',
        customerName: 'Marcos (Los del Andamio)',
        customerEmail: 'marcos.obra@gmail.com',
        customerPhone: '11 3344-5566',
        teamSize: 10,
        isFixedInstance: false,
        paymentStatus: 'pending_deposit',
        paymentMethod: 'transfer',
        courtPrice: 30000,
        extras: [],
        paidAmount: 0,
        playersList: Array.from({ length: 10 }, (_, i) => ({
          name: i === 0 ? 'Marcos (Capitán)' : '',
          paid: false
        }))
      }
    ],
    waitlist: [
      {
        id: 'wl_1',
        date: today,
        hour: 20,
        name: 'Gastón (Obra San Lorenzo)',
        email: 'gaston.sl@gmail.com',
        phone: '11 5001-8899'
      }
    ],
    faltaUnoList: [
      {
        id: 'f1_seed_1',
        date: today,
        hour: 21,
        organizer: 'Marcos (Los del Andamio)',
        phone: '11 3344-5566',
        missingCount: 2,
        position: 'Arquero o Jugador de campo',
        pricePerPlayer: 3000
      },
      {
        id: 'f1_seed_2',
        date: today,
        hour: 19,
        organizer: 'El Tucu',
        phone: '11 6543-2109',
        missingCount: 1,
        position: 'Uno que corra (se nos lesionó un compañero en la obra)',
        pricePerPlayer: 3000
      }
    ],
    cantinaSales: [
      {
        id: 'cs_1',
        date: today,
        item: '🍺 Promo 3 Cervezas 1L (Mostrador)',
        amount: 12000,
        method: 'cash',
        byRole: 'Encargado',
        time: '18:45'
      },
      {
        id: 'cs_2',
        date: today,
        item: '🥟 6 Empanadas + 2 Aguas Grandes',
        amount: 11500,
        method: 'transfer',
        byRole: 'Dueño',
        time: '19:20'
      }
    ],
    auditLog: [
      {
        id: 'aud_1',
        date: today,
        time: '18:30',
        role: 'Dueño',
        action: 'COBRO TOTAL',
        detail: 'Cobró $38.000 en efectivo del turno 20:00 hs (Ramiro - El Corralón)'
      },
      {
        id: 'aud_2',
        date: today,
        time: '18:45',
        role: 'Encargado',
        action: 'VENTA CANTINA',
        detail: 'Cargó venta mostrador: 🍺 Promo 3 Cervezas 1L ($12.000)'
      }
    ]
  };
}

// ============================================================================
// ESTADO EN MEMORIA Y SESIÓN DEL JUGADOR / DUEÑO
// ============================================================================
let state = buildInitialState();
let currentTab = 'reservar'; // 'reservar' | 'mipartido' | 'faltauno' | 'dueno'
let selectedDateKey = getDateKey(0);
let selectedTeamSize = 10; // 10 (5 vs 5), 12 (6 vs 6), 14 (7 vs 7)
let currentUserId = null;
let myBookingIds = [];
let unlockedMatchCode = null;
let staffRole = null; // null | 'Dueño' | 'Encargado'
let ownerSubTab = 'turnos'; // 'turnos' | 'fijos' | 'cantina' | 'clientes' | 'auditoria'

async function loadState() {
  try {
    currentUserId = localStorage.getItem(SESSION_USER_KEY) || 'u_tucu';
    const rawMyIds = localStorage.getItem(LOCAL_MY_BOOKINGS_KEY);
    if (rawMyIds) {
      myBookingIds = JSON.parse(rawMyIds);
    } else {
      myBookingIds = ['bk_seed_1'];
    }
  } catch (_) {
    currentUserId = 'u_tucu';
    myBookingIds = ['bk_seed_1'];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 2) {
        state = parsed;
      }
    }
  } catch (e) {
    console.warn('Error leyendo localStorage:', e);
  }

  try {
    const res = await fetch('/api/state');
    if (res.ok) {
      const data = await res.json();
      if (data && data.ok && data.state && data.state.version === 2) {
        state = data.state;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } else {
        await saveState();
      }
    }
  } catch (_) {
    // Funciona offline si se abre directo
  }

  ensureMaterializedFixedBookings();
  renderAll();
}

async function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (currentUserId) {
      localStorage.setItem(SESSION_USER_KEY, currentUserId);
    } else {
      localStorage.removeItem(SESSION_USER_KEY);
    }
    localStorage.setItem(LOCAL_MY_BOOKINGS_KEY, JSON.stringify(myBookingIds));
  } catch (e) {
    console.warn('No se pudo guardar en localStorage:', e);
  }

  try {
    await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    });
  } catch (_) {
    // Offline fallback
  }
}

function addAuditEntry(role, action, detail) {
  state.auditLog.unshift({
    id: 'aud_' + Date.now(),
    date: getDateKey(0),
    time: nowTimeStr(),
    role: role || staffRole || 'Sistema',
    action,
    detail
  });
}

function showToast(msg) {
  const root = document.getElementById('toastRoot');
  if (!root) return;
  root.innerHTML = `<div class="toast">${msg}</div>`;
  setTimeout(() => {
    if (root.innerHTML.includes(msg)) {
      root.innerHTML = '';
    }
  }, 3800);
}

function getCurrentUser() {
  if (!currentUserId) return null;
  return (state.users || []).find(u => u.id === currentUserId) || null;
}

// ============================================================================
// PROYECCIÓN AUTOMÁTICA DE TURNOS FIJOS EN EL CALENDARIO
// ============================================================================
function ensureMaterializedFixedBookings() {
  const upcoming = getUpcomingDays(7);
  let changed = false;

  upcoming.forEach(dayObj => {
    (state.fixedSchedules || []).forEach(fx => {
      if (Number(fx.dow) === Number(dayObj.dow)) {
        const exceptionKey = `${dayObj.key}_${fx.hour}`;
        if ((state.fixedExceptions || []).includes(exceptionKey)) {
          return; // Liberado puntualmente por esa fecha
        }
        const existing = state.bookings.find(
          b => b.date === dayObj.key && Number(b.hour) === Number(fx.hour)
        );
        if (!existing) {
          const price = getSlotPrice(fx.hour);
          state.bookings.push({
            id: `bk_fx_${fx.id}_${dayObj.key}`,
            matchCode: 'F' + String(fx.hour) + String(dayObj.dayNum),
            date: dayObj.key,
            hour: Number(fx.hour),
            userId: fx.userId || null,
            customerName: fx.customerName,
            customerEmail: fx.customerEmail || '',
            customerPhone: fx.customerPhone,
            teamSize: Number(fx.teamSize || 10),
            isFixedInstance: true,
            fixedId: fx.id,
            paymentStatus: 'pending_cash',
            paymentMethod: 'cash',
            courtPrice: price,
            extras: [],
            paidAmount: 0,
            playersList: Array.from({ length: Number(fx.teamSize || 10) }, (_, idx) => ({
              name: idx === 0 ? fx.customerName : '',
              paid: false
            }))
          });
          changed = true;
        }
      }
    });
  });

  if (changed) {
    saveState();
  }
}

// ============================================================================
// PRECIOS Y CÁLCULOS DE LA CANCHA ÚNICA
// ============================================================================
function isPromoHour(hour) {
  return (state.config.promoHours || [14, 15, 16, 17]).includes(Number(hour));
}

function getSlotPrice(hour) {
  const base = Number(state.config.basePrice || 30000);
  if (isPromoHour(hour)) {
    return Math.max(10000, base - Number(state.config.promoDiscount || 6000));
  }
  return base;
}

function getBookingAt(dateKey, hour) {
  return state.bookings.find(b => b.date === dateKey && Number(b.hour) === Number(hour));
}

function getBookingTotal(booking) {
  const extrasSum = (booking.extras || []).reduce((acc, item) => acc + Number(item.price || 0), 0);
  return Number(booking.courtPrice || 0) + extrasSum;
}

// ============================================================================
// NAVEGACIÓN ENTRE PESTAÑAS
// ============================================================================
function switchTab(tabName) {
  currentTab = tabName;
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  const views = ['reservar', 'mipartido', 'faltauno', 'dueno'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) el.style.display = v === tabName ? 'block' : 'none';
  });

  renderAll();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================================
// RENDERIZADO GENERAL
// ============================================================================
function renderAll() {
  ensureMaterializedFixedBookings();

  // Banner de estado de cancha en vivo (Clima / Habilitada)
  const banner = document.getElementById('courtStatusBanner');
  if (banner) {
    banner.className = `status-banner ${state.config.courtStatus || 'open'}`;
    banner.textContent = state.config.courtStatusText || '🟢 CANCHA HABILITADA — Se juega normal';
  }

  // Encabezado y pie
  document.getElementById('headerClubName').textContent = state.config.clubName;
  document.getElementById('headerClubSub').textContent = state.config.clubSub;
  document.getElementById('footerClubName').textContent = state.config.clubName;

  const waTop = document.getElementById('headerWhatsappBtn');
  const waMsg = encodeURIComponent(`Hola! Te escribo para consultar por cancha en ${state.config.clubName}.`);
  waTop.href = `https://wa.me/${cleanPhoneForWa(state.config.clubWhatsapp)}?text=${waMsg}`;

  // Botón de cuenta del jugador en el header
  const user = getCurrentUser();
  const userBtn = document.getElementById('headerUserBtn');
  if (userBtn) {
    if (user) {
      userBtn.className = 'btn-user-account logged';
      userBtn.innerHTML = `👤 ${user.name.split(' ')[0]} (${user.stamps}/${state.config.loyaltyGoal || 10} ⚽)`;
    } else {
      userBtn.className = 'btn-user-account';
      userBtn.innerHTML = `👤 Ingresar con Mail`;
    }
  }

  // Botón del pie para Dueño / Encargado
  const staffBtn = document.getElementById('footerStaffBtn');
  if (staffBtn) {
    if (staffRole) {
      staffBtn.innerHTML = `🔐 Panel ${staffRole} Activo (Ir al Panel)`;
      staffBtn.style.background = '#1D4ED8';
      staffBtn.style.color = '#FFFFFF';
      staffBtn.style.borderColor = '#1D4ED8';
    } else {
      staffBtn.innerHTML = `🔐 Acceso Dueño / Encargado`;
      staffBtn.style.background = '';
      staffBtn.style.color = '';
      staffBtn.style.borderColor = '';
    }
  }

  // Badges
  const f1Badge = document.getElementById('faltaUnoBadge');
  if (f1Badge) {
    f1Badge.textContent = state.faltaUnoList.length;
    f1Badge.style.display = state.faltaUnoList.length > 0 ? 'inline-block' : 'none';
  }

  const myBookings = getMyAccessibleBookings();
  const myBadge = document.getElementById('myMatchBadge');
  if (myBadge) {
    myBadge.textContent = myBookings.length;
    myBadge.style.display = myBookings.length > 0 ? 'inline-block' : 'none';
  }

  renderUserLoyaltyStrip();

  if (currentTab === 'reservar') {
    renderReservarView();
  } else if (currentTab === 'mipartido') {
    renderMiPartidoView();
  } else if (currentTab === 'faltauno') {
    renderFaltaUnoView();
  } else if (currentTab === 'dueno') {
    renderDuenoView();
  }
}

// ============================================================================
// TARJETA DE CUENTA CON MAIL Y SELLOS DE FIDELIDAD
// ============================================================================
function renderUserLoyaltyStrip() {
  const container = document.getElementById('userLoyaltyStrip');
  if (!container) return;

  if (currentTab === 'dueno') {
    container.innerHTML = '';
    return;
  }

  const user = getCurrentUser();
  const goal = Number(state.config.loyaltyGoal || 10);

  if (!user) {
    container.innerHTML = `
      <div class="user-strip">
        <div>
          <div style="font-weight:900; font-size:1.02rem;">🎁 Club ${state.config.clubName}: Registrate con tu Mail en 10 segundos</div>
          <div style="font-size:0.88rem; color:#475569; font-weight:700;">
            Guardá tus datos para reservar en 1 toque y sumá 1 sello por partido para ganarte: <strong>${state.config.loyaltyRewardText}</strong>
          </div>
        </div>
        <button type="button" class="btn-secondary" style="background:#0F172A; color:#FFF; border-color:#0F172A;" onclick="openAuthModal()">
          ✉️ Ingresar o Crear Cuenta
        </button>
      </div>
    `;
    return;
  }

  const stampsCount = Number(user.stamps || 0) % goal;
  const remaining = goal - stampsCount;
  const dotsHtml = Array.from({ length: goal }, (_, i) => {
    const filled = i < stampsCount;
    return `<span class="stamp-dot ${filled ? 'filled' : ''}">${filled ? '⚽' : i + 1}</span>`;
  }).join('');

  container.innerHTML = `
    <div class="user-strip">
      <div>
        <div style="font-weight:900; font-size:1rem;">
          👋 Hola, <strong>${user.name}</strong> <span style="color:#475569; font-weight:700;">(${user.email})</span>
        </div>
        <div style="font-size:0.86rem; font-weight:800; color:#15803D; margin-top:2px;">
          🎁 Tarjeta de Premios: Te faltan <strong>${remaining} partidos</strong> para ${state.config.loyaltyRewardText}
        </div>
        <div class="stamps-row">${dotsHtml}</div>
      </div>
      <button type="button" class="btn-secondary" onclick="openAuthModal()">
        🔄 Cambiar Cuenta
      </button>
    </div>
  `;
}

// ============================================================================
// MODAL DE REGISTRO / LOGIN CON EMAIL (SÚPER SIMPLE + DEMO 1 TOQUE)
// ============================================================================
let authMode = 'login'; // 'login' | 'register'

function openAuthModal(defaultMode) {
  if (defaultMode) authMode = defaultMode;
  const modalRoot = document.getElementById('modalRoot');
  modalRoot.style.display = 'block';
  const user = getCurrentUser();

  modalRoot.innerHTML = `
    <div class="modal-backdrop" onclick="if(event.target===this) closeModal()">
      <div class="modal-sheet">
        <div class="modal-header">
          <div class="modal-title">✉️ Tu Cuenta en la Cancha</div>
          <button type="button" class="btn-close" onclick="closeModal()">✕ Cerrar</button>
        </div>

        ${
          user
            ? `
          <div style="background:#F0FDF4; border:2px solid #22C55E; padding:12px; border-radius:10px; margin-bottom:14px;">
            <div style="font-weight:900; color:#15803D;">✅ Sesión iniciada como: ${user.name}</div>
            <div style="font-size:0.9rem; font-weight:700;">✉️ Mail: ${user.email} • 📱 WhatsApp: ${user.phone}</div>
            <div style="font-size:0.9rem; font-weight:800; margin-top:4px;">⚽ Partidos jugados: ${user.completedMatches} (${user.stamps} sellos acumulados)</div>
            <button type="button" class="btn-danger" style="margin-top:10px;" onclick="logoutUser()">
              🚪 Cerrar sesión en este celular
            </button>
          </div>
        `
            : ''
        }

        <div class="pay-options" style="margin-bottom:14px;">
          <button type="button" class="pay-option-btn ${authMode === 'login' ? 'active' : ''}" onclick="openAuthModal('login')">
            🔑 Ya tengo cuenta (Ingresar)
          </button>
          <button type="button" class="pay-option-btn ${authMode === 'register' ? 'active' : ''}" onclick="openAuthModal('register')">
            ➕ Soy nuevo (Registrarme)
          </button>
        </div>

        ${
          authMode === 'login'
            ? `
          <form onsubmit="submitLogin(event)">
            <div class="form-group">
              <label class="form-label">Tu Correo Electrónico (Email)</label>
              <input id="loginEmail" type="email" class="form-input" placeholder="ejemplo@gmail.com" required />
            </div>
            <div class="form-group">
              <label class="form-label">Tu PIN de 4 números (o clave)</label>
              <input id="loginPin" type="password" class="form-input" placeholder="Ej: 1234" required />
            </div>
            <button type="submit" class="btn-primary-giant">
              ✅ ENTRAR A MI CUENTA
            </button>
          </form>

          <div style="margin-top:16px; padding-top:12px; border-top:2px dashed #CBD5E1;">
            <div style="font-size:0.85rem; font-weight:800; color:#475569; margin-bottom:8px;">
              ⚡ Prueba rápida en 1 toque (Cuentas de ejemplo cargadas):
            </div>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              ${state.users
                .map(
                  u => `
                <button type="button" class="btn-secondary" style="font-size:0.82rem; padding:7px 10px;" onclick="quickLoginAs('${u.id}')">
                  👤 ${u.name} (${u.email})
                </button>
              `
                )
                .join('')}
            </div>
          </div>
        `
            : `
          <form onsubmit="submitRegister(event)">
            <div class="form-group">
              <label class="form-label">1. Tu Nombre o Apodo (y Obra / Equipo)</label>
              <input id="regName" type="text" class="form-input" placeholder="Ej: El Chicho (Obra San Martín)" required />
            </div>
            <div class="form-group">
              <label class="form-label">2. Tu Email (para guardar tus turnos y premios)</label>
              <input id="regEmail" type="email" class="form-input" placeholder="ejemplo@gmail.com" required />
            </div>
            <div class="form-group">
              <label class="form-label">3. Tu Celular (WhatsApp)</label>
              <input id="regPhone" type="tel" class="form-input" placeholder="Ej: 11 5544-3322" required />
            </div>
            <div class="form-group">
              <label class="form-label">4. Elegí un PIN fácil de 4 números</label>
              <input id="regPin" type="text" inputmode="numeric" maxlength="8" class="form-input" placeholder="Ej: 1234" required />
            </div>
            <button type="submit" class="btn-primary-giant">
              🎁 CREAR CUENTA Y GUARDAR EN MI CELULAR
            </button>
          </form>
        `
        }
      </div>
    </div>
  `;
}

function quickLoginAs(userId) {
  currentUserId = userId;
  saveState();
  closeModal();
  renderAll();
  const u = getCurrentUser();
  if (u) showToast(`👋 ¡Hola ${u.name}! Tus datos ya quedan listos para reservar.`);
}

function logoutUser() {
  currentUserId = null;
  saveState();
  closeModal();
  renderAll();
  showToast('👋 Cerraste tu sesión.');
}

function submitLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const pin = document.getElementById('loginPin').value.trim();

  const found = (state.users || []).find(
    u => u.email.toLowerCase() === email && String(u.pin) === String(pin)
  );
  if (!found) {
    showToast('❌ Mail o PIN incorrecto. Probá de nuevo o creá tu cuenta.');
    return;
  }

  currentUserId = found.id;
  saveState();
  closeModal();
  renderAll();
  showToast(`✅ ¡Bienvenido ${found.name}!`);
}

function submitRegister(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const phone = document.getElementById('regPhone').value.trim();
  const pin = document.getElementById('regPin').value.trim();

  if (!name || !email || !phone || !pin) return;

  let existing = (state.users || []).find(u => u.email.toLowerCase() === email);
  if (existing) {
    existing.name = name;
    existing.phone = phone;
    existing.pin = pin;
    currentUserId = existing.id;
  } else {
    const newUser = {
      id: 'u_' + Date.now(),
      name,
      email,
      phone,
      pin,
      stamps: 1, // 1 sello de regalo de bienvenida
      completedMatches: 0,
      cancelledMatches: 0,
      createdAt: getDateKey(0)
    };
    state.users.push(newUser);
    currentUserId = newUser.id;
  }

  saveState();
  closeModal();
  renderAll();
  showToast('🎁 ¡Cuenta creada! Te regalamos tu 1° sello en la tarjeta de premios.');
}

// ============================================================================
// VISTA 1: RESERVAR EN LA CANCHA ÚNICA (2 PASOS DIRECTOS)
// ============================================================================
function renderReservarView() {
  const days = getUpcomingDays(7);
  const daysContainer = document.getElementById('daysContainer');
  daysContainer.innerHTML = days
    .map(d => {
      const isSelected = d.key === selectedDateKey;
      return `
        <button type="button" class="day-btn ${isSelected ? 'active' : ''}" onclick="selectDate('${d.key}')">
          <div class="day-label-top">${d.topLabel}</div>
          <div class="day-label-main">${d.mainLabel}</div>
        </button>
      `;
    })
    .join('');

  // Calculadora rápida "¿Entre cuántos dividen hoy?"
  const teamSizes = [
    { count: 10, label: 'Somos 10 (5 vs 5)' },
    { count: 12, label: 'Somos 12 (6 vs 6)' },
    { count: 14, label: 'Somos 14 (7 vs 7)' }
  ];
  const pillsEl = document.getElementById('teamSizePills');
  if (pillsEl) {
    pillsEl.innerHTML = teamSizes
      .map(
        t => `
      <button type="button" class="split-pill ${selectedTeamSize === t.count ? 'active' : ''}" onclick="setTeamSize(${t.count})">
        ${t.label}
      </button>
    `
      )
      .join('');
  }

  // Grilla de horarios de la cancha única
  const slotsContainer = document.getElementById('slotsContainer');
  const user = getCurrentUser();

  slotsContainer.innerHTML = HOURS.map(hour => {
    const booking = getBookingAt(selectedDateKey, hour);
    const price = getSlotPrice(hour);
    const perPlayer = Math.round(price / selectedTeamSize);
    const promo = isPromoHour(hour);

    if (booking) {
      const isMine =
        (user && booking.userId === user.id) ||
        (user && booking.customerEmail && booking.customerEmail.toLowerCase() === user.email.toLowerCase()) ||
        myBookingIds.includes(booking.id);

      const waitlistCount = state.waitlist.filter(
        w => w.date === selectedDateKey && Number(w.hour) === Number(hour)
      ).length;

      const isPendingDeposit = booking.paymentStatus === 'pending_deposit';

      return `
        <div class="slot-card busy">
          <div class="slot-top">
            <div class="slot-time">${hour}:00 hs</div>
            <span class="slot-status-badge ${isPendingDeposit ? 'badge-pending-dep' : 'badge-busy'}">
              ${isMine ? '✅ TU TURNO' : isPendingDeposit ? '⏳ RESERVADO (Sin Señar)' : 'OCUPADO'}
            </span>
          </div>

          <div style="font-size:0.92rem; font-weight:800; color:#334155; padding:4px 0;">
            ${
              isMine
                ? `⚽ Reservado a tu nombre (${booking.customerName}) • Código: <strong>${booking.matchCode || 'P100'}</strong>`
                : booking.isFixedInstance
                ? `🔒 Horario reservado (Turno Fijo Semanal)`
                : isPendingDeposit
                ? `⏳ Alguien lo pidió recién (si no manda la seña se libera)`
                : `🔒 Horario ocupado`
            }
          </div>

          ${
            isMine
              ? `
            <button type="button" class="slot-action-btn btn-book-now" onclick="openMyBookingDetail('${booking.id}')">
              📋 VER MI LISTA Y PASAR AL GRUPO
            </button>
          `
              : `
            <button type="button" class="slot-action-btn btn-waitlist" onclick="openWaitlistModal('${selectedDateKey}', ${hour})">
              🔔 Avisame si se libera ${waitlistCount > 0 ? `(${waitlistCount} esperando)` : ''}
            </button>
          `
          }
        </div>
      `;
    }

    return `
      <div class="slot-card ${promo ? 'promo' : 'free'}" onclick="openBookingModal('${selectedDateKey}', ${hour})">
        <div class="slot-top">
          <div class="slot-time">${hour}:00 hs</div>
          <span class="slot-status-badge ${promo ? 'badge-promo' : 'badge-free'}">
            ${promo ? '🔥 PROMO SIESTA' : 'LIBRE'}
          </span>
        </div>
        <div class="slot-price-row">
          <span class="slot-each">${formatMoney(perPlayer)} c/u</span>
          <span class="slot-total">Cancha: ${formatMoney(price)} (entre ${selectedTeamSize})</span>
        </div>
        <button type="button" class="slot-action-btn ${promo ? 'btn-book-promo' : 'btn-book-now'}">
          👉 TOCAR PARA ANOTARME
        </button>
      </div>
    `;
  }).join('');
}

function selectDate(dateKey) {
  selectedDateKey = dateKey;
  renderReservarView();
}

function setTeamSize(size) {
  selectedTeamSize = Number(size);
  renderReservarView();
}

function openMyBookingDetail(bookingId) {
  if (!myBookingIds.includes(bookingId)) {
    myBookingIds.unshift(bookingId);
  }
  switchTab('mipartido');
}

// ============================================================================
// MODAL DE RESERVA EN LA CANCHA ÚNICA (CON REGISTRO AUTOMÁTICO DE MAIL)
// ============================================================================
let draftBooking = null;

function openBookingModal(dateKey, hour) {
  const courtPrice = getSlotPrice(hour);
  const dayObj = getUpcomingDays(7).find(d => d.key === dateKey) || { fullLabel: dateKey };

  draftBooking = {
    dateKey,
    dayLabel: dayObj.fullLabel,
    hour,
    teamSize: selectedTeamSize,
    courtPrice,
    selectedExtras: [],
    paymentMethod: 'transfer'
  };

  renderBookingModal();
}

function renderBookingModal() {
  if (!draftBooking) return;
  const modalRoot = document.getElementById('modalRoot');
  modalRoot.style.display = 'block';

  const user = getCurrentUser();
  const extrasTotal = draftBooking.selectedExtras.reduce((sum, id) => {
    const item = state.extrasCatalog.find(e => e.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const grandTotal = draftBooking.courtPrice + extrasTotal;
  const perPlayer = Math.round(grandTotal / draftBooking.teamSize);
  const depositAmount = Math.round((draftBooking.courtPrice * (state.config.depositPercent || 30)) / 100);

  modalRoot.innerHTML = `
    <div class="modal-backdrop" onclick="if(event.target===this) closeModal()">
      <div class="modal-sheet">
        <div class="modal-header">
          <div class="modal-title">⚽ Anotar Turno en la Cancha</div>
          <button type="button" class="btn-close" onclick="closeModal()">✕ Cerrar</button>
        </div>

        <div class="summary-banner">
          <div>
            <div class="summary-when">📅 ${draftBooking.dayLabel} a las ${draftBooking.hour}:00 hs</div>
            <div class="summary-where">🏟️ ${state.config.pitchTitle} (${draftBooking.teamSize} jugadores)</div>
          </div>
          <div class="summary-price-box">
            <span class="per-player-big">${formatMoney(perPlayer)} c/u</span>
            <span class="per-player-sub">Total: ${formatMoney(grandTotal)}</span>
          </div>
        </div>

        <form onsubmit="confirmBookingSubmit(event)">
          ${
            user
              ? `
            <div style="background:#F0FDF4; border:2px solid #22C55E; padding:12px; border-radius:10px; margin-bottom:14px;">
              <div style="font-weight:900; color:#15803D;">👤 Reservando con tu cuenta: ${user.name}</div>
              <div style="font-size:0.88rem; font-weight:700; color:#334155;">✉️ ${user.email} • 📱 ${user.phone}</div>
              <input id="inpCustomerName" type="hidden" value="${user.name.replace(/"/g, '&quot;')}" />
              <input id="inpCustomerEmail" type="hidden" value="${user.email.replace(/"/g, '&quot;')}" />
              <input id="inpCustomerPhone" type="hidden" value="${user.phone.replace(/"/g, '&quot;')}" />
            </div>
          `
              : `
            <div class="form-group">
              <label class="form-label" for="inpCustomerName">1. Tu Nombre / Apodo o Equipo</label>
              <input id="inpCustomerName" type="text" class="form-input" placeholder="Ej: El Tucu / Los del Andamio" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="inpCustomerEmail">2. Tu Correo Electrónico (Email)</label>
              <div class="form-hint">Con tu mail te guardamos la cuenta y sumás sellos para el cajón de cerveza gratis:</div>
              <input id="inpCustomerEmail" type="email" class="form-input" placeholder="ejemplo@gmail.com" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="inpCustomerPhone">3. Tu Celular (WhatsApp)</label>
              <input id="inpCustomerPhone" type="tel" class="form-input" placeholder="Ej: 11 5544-3322" required />
            </div>
          `
          }

          <div class="form-group">
            <label class="form-label">🍻 ¿Les dejamos algo frío para cuando terminen? (Opcional)</label>
            <div class="extras-list">
              ${state.extrasCatalog
                .map(extra => {
                  const isSel = draftBooking.selectedExtras.includes(extra.id);
                  return `
                    <div class="extra-item ${isSel ? 'selected' : ''}" onclick="toggleDraftExtra('${extra.id}')">
                      <div class="extra-left">
                        <input type="checkbox" class="extra-check" ${isSel ? 'checked' : ''} onchange="event.stopPropagation(); toggleDraftExtra('${extra.id}')" />
                        <span class="extra-name">${extra.name}</span>
                      </div>
                      <span class="extra-price">+${formatMoney(extra.price)}</span>
                    </div>
                  `;
                })
                .join('')}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">📲 ¿Cómo señan o pagan el turno?</label>
            <div class="pay-options">
              <button
                type="button"
                class="pay-option-btn ${draftBooking.paymentMethod === 'transfer' ? 'active' : ''}"
                onclick="setDraftPayMethod('transfer')"
              >
                📲 Transferir Seña (${formatMoney(depositAmount)}) y mandar comprobante
              </button>
              <button
                type="button"
                class="pay-option-btn ${draftBooking.paymentMethod === 'cash' ? 'active' : ''}"
                onclick="setDraftPayMethod('cash')"
              >
                💵 Pagar en Efectivo en la cancha
              </button>
            </div>

            ${
              draftBooking.paymentMethod === 'transfer'
                ? `
              <div class="alias-box">
                <div>
                  <div style="font-size:0.82rem; font-weight:800; color:#1E3A8A;">
                    ALIAS DE MERCADO PAGO (Seña ${formatMoney(depositAmount)}):
                  </div>
                  <div class="alias-text">${state.config.mpAlias}</div>
                  <div style="font-size:0.8rem; font-weight:700; color:#334155; margin-top:4px;">
                    ⚠️ Al confirmar te llevamos al WhatsApp de la cancha para enviar la captura de la transferencia.
                  </div>
                </div>
                <button type="button" class="btn-secondary" onclick="copyAlias('${state.config.mpAlias}')">
                  📋 Copiar Alias
                </button>
              </div>
            `
                : `
              <div style="margin-top:8px; font-size:0.88rem; font-weight:700; color:#475569; background:#F8FAFC; padding:10px; border-radius:8px; border:1px solid #CBD5E1;">
                ℹ️ Tu turno queda registrado con tu cuenta de mail y WhatsApp.
              </div>
            `
            }
          </div>

          <button type="submit" class="btn-primary-giant">
            ✅ CONFIRMAR MI TURNO
          </button>
        </form>
      </div>
    </div>
  `;
}

function toggleDraftExtra(extraId) {
  if (!draftBooking) return;
  const idx = draftBooking.selectedExtras.indexOf(extraId);
  if (idx >= 0) {
    draftBooking.selectedExtras.splice(idx, 1);
  } else {
    draftBooking.selectedExtras.push(extraId);
  }
  preserveModalInputsAndRender();
}

function setDraftPayMethod(method) {
  if (!draftBooking) return;
  draftBooking.paymentMethod = method;
  preserveModalInputsAndRender();
}

function preserveModalInputsAndRender() {
  const nameVal = document.getElementById('inpCustomerName')?.value || '';
  const emailVal = document.getElementById('inpCustomerEmail')?.value || '';
  const phoneVal = document.getElementById('inpCustomerPhone')?.value || '';
  renderBookingModal();
  if (document.getElementById('inpCustomerName')) document.getElementById('inpCustomerName').value = nameVal;
  if (document.getElementById('inpCustomerEmail')) document.getElementById('inpCustomerEmail').value = emailVal;
  if (document.getElementById('inpCustomerPhone')) document.getElementById('inpCustomerPhone').value = phoneVal;
}

function copyAlias(alias) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(alias);
  }
  showToast(`✅ Alias copiado: ${alias}`);
}

function confirmBookingSubmit(e) {
  e.preventDefault();
  if (!draftBooking) return;

  // Verificar que nadie haya ocupado ese horario mientras tenía el modal abierto
  const existing = getBookingAt(draftBooking.dateKey, draftBooking.hour);
  if (existing) {
    closeModal();
    renderAll();
    showToast('⚠️ ¡Uy! Alguien acaba de reservar ese horario recién.');
    return;
  }

  const customerName = document.getElementById('inpCustomerName').value.trim();
  const customerEmail = document.getElementById('inpCustomerEmail').value.trim().toLowerCase();
  const customerPhone = document.getElementById('inpCustomerPhone').value.trim();
  if (!customerName || !customerEmail || !customerPhone) return;

  // Si no estaba logueado, crear o recuperar su cuenta por Email automáticamente
  let user = getCurrentUser();
  if (!user) {
    user = (state.users || []).find(u => u.email.toLowerCase() === customerEmail);
    if (!user) {
      user = {
        id: 'u_' + Date.now(),
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        pin: '1234',
        stamps: 1,
        completedMatches: 0,
        cancelledMatches: 0,
        createdAt: getDateKey(0)
      };
      state.users.push(user);
    }
    currentUserId = user.id;
  }

  const chosenExtras = draftBooking.selectedExtras
    .map(id => state.extrasCatalog.find(item => item.id === id))
    .filter(Boolean);

  const matchCode = 'P' + String(draftBooking.hour) + String(Math.floor(10 + Math.random() * 89));

  const newBooking = {
    id: 'bk_' + Date.now(),
    matchCode,
    date: draftBooking.dateKey,
    hour: draftBooking.hour,
    userId: user.id,
    customerName,
    customerEmail,
    customerPhone,
    teamSize: draftBooking.teamSize,
    isFixedInstance: false,
    // IMPORTANTE: Si elige transferencia, entra como 'pending_deposit' hasta que mande el comprobante y el dueño lo apruebe
    paymentStatus: draftBooking.paymentMethod === 'transfer' ? 'pending_deposit' : 'pending_cash',
    paymentMethod: draftBooking.paymentMethod,
    courtPrice: draftBooking.courtPrice,
    extras: chosenExtras,
    paidAmount: 0,
    playersList: Array.from({ length: draftBooking.teamSize }, (_, idx) => ({
      name: idx === 0 ? `${customerName} (Capitán)` : '',
      paid: false
    }))
  };

  state.bookings.push(newBooking);
  myBookingIds.unshift(newBooking.id);
  addAuditEntry('Cliente Web', 'NUEVA RESERVA', `${customerName} (${customerEmail}) reservó ${draftBooking.dateKey} ${draftBooking.hour}:00hs [${matchCode}]`);
  saveState();

  closeModal();
  showToast(`⚽ ¡Turno anotado! Código de partido: ${matchCode}`);
  switchTab('mipartido');
}

function closeModal() {
  const modalRoot = document.getElementById('modalRoot');
  modalRoot.style.display = 'none';
  modalRoot.innerHTML = '';
  draftBooking = null;
}

// ============================================================================
// MODAL LISTA DE ESPERA ("AVISAME SI SE LIBERA")
// ============================================================================
function openWaitlistModal(dateKey, hour) {
  const dayObj = getUpcomingDays(7).find(d => d.key === dateKey) || { fullLabel: dateKey };
  const user = getCurrentUser();
  const modalRoot = document.getElementById('modalRoot');
  modalRoot.style.display = 'block';

  modalRoot.innerHTML = `
    <div class="modal-backdrop" onclick="if(event.target===this) closeModal()">
      <div class="modal-sheet">
        <div class="modal-header">
          <div class="modal-title">🔔 Avisame si se libera las ${hour}:00 hs</div>
          <button type="button" class="btn-close" onclick="closeModal()">✕ Cerrar</button>
        </div>

        <div class="summary-banner">
          <div>
            <div class="summary-when">📅 ${dayObj.fullLabel} — ${hour}:00 hs</div>
            <div class="summary-where">🏟️ ${state.config.pitchTitle}</div>
          </div>
        </div>

        <p style="font-weight:700; margin-bottom:14px; color:#334155;">
          Si el grupo de las ${hour}:00 hs se baja o no manda la seña, te avisamos al instante por WhatsApp para que agarres la cancha vos.
        </p>

        <form onsubmit="submitWaitlist(event, '${dateKey}', ${hour})">
          <div class="form-group">
            <label class="form-label">Tu Nombre o Apodo</label>
            <input id="wlName" type="text" class="form-input" value="${user ? user.name : ''}" placeholder="Ej: Gastón" required />
          </div>
          <div class="form-group">
            <label class="form-label">Tu Email</label>
            <input id="wlEmail" type="email" class="form-input" value="${user ? user.email : ''}" placeholder="ejemplo@gmail.com" required />
          </div>
          <div class="form-group">
            <label class="form-label">Tu WhatsApp</label>
            <input id="wlPhone" type="tel" class="form-input" value="${user ? user.phone : ''}" placeholder="Ej: 11 5001-8899" required />
          </div>
          <button type="submit" class="btn-primary-giant">
            🔔 ANOTARME EN LISTA DE ESPERA
          </button>
        </form>
      </div>
    </div>
  `;
}

function submitWaitlist(e, dateKey, hour) {
  e.preventDefault();
  const name = document.getElementById('wlName').value.trim();
  const email = document.getElementById('wlEmail').value.trim();
  const phone = document.getElementById('wlPhone').value.trim();
  if (!name || !phone) return;

  state.waitlist.push({
    id: 'wl_' + Date.now(),
    date: dateKey,
    hour: Number(hour),
    name,
    email,
    phone
  });
  saveState();
  closeModal();
  renderAll();
  showToast('🔔 ¡Listo! Si se libera esa hora te avisamos por WhatsApp.');
}

// ============================================================================
// VISTA 2: MI PARTIDO (PRIVADO DEL JUGADOR O ENTRANDO CON CÓDIGO DE PARTIDO)
// ============================================================================
function getMyAccessibleBookings() {
  const user = getCurrentUser();
  return state.bookings.filter(b => {
    if (user && (b.userId === user.id || (b.customerEmail && b.customerEmail.toLowerCase() === user.email.toLowerCase()))) {
      return true;
    }
    if (myBookingIds.includes(b.id)) {
      return true;
    }
    if (unlockedMatchCode && b.matchCode && b.matchCode.toUpperCase() === unlockedMatchCode.toUpperCase()) {
      return true;
    }
    return false;
  });
}

function renderMiPartidoView() {
  const container = document.getElementById('miPartidoContainer');
  const accessible = getMyAccessibleBookings();
  const myBooking = accessible[0] || null;

  // Caja para entrar a la lista de un amigo con el Código Corto (ej. P190)
  const codeLookupBar = `
    <div class="step-section" style="display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;">
      <div>
        <div style="font-weight:900; font-size:1rem;">🔑 ¿Un compañero reservó y te pasó el Código del Partido?</div>
        <div style="font-size:0.86rem; color:#475569; font-weight:700;">Ingresá el código de 4 letras (ej: P190 o P210) para anotarte en su lista:</div>
      </div>
      <form onsubmit="unlockByMatchCode(event)" style="display:flex; gap:6px;">
        <input id="inpMatchCode" type="text" class="form-input" style="width:120px; padding:9px 10px; text-transform:uppercase;" placeholder="Ej: P190" required />
        <button type="submit" class="btn-secondary" style="background:#0F172A; color:#FFF; border-color:#0F172A;">
          Buscar Lista
        </button>
      </form>
    </div>
  `;

  if (!myBooking) {
    container.innerHTML = `
      ${codeLookupBar}
      <div class="step-section" style="text-align:center; padding:32px 16px;">
        <div style="font-size:3rem; margin-bottom:8px;">⚽</div>
        <h2 style="font-size:1.3rem; font-weight:900; margin-bottom:8px;">No tenés turnos activos en tu cuenta</h2>
        <p style="color:#475569; font-weight:700; margin-bottom:16px;">
          Reservá una hora en la cancha o ingresá con tu mail para ver tus turnos y armar la lista de tus compañeros.
        </p>
        <button type="button" class="btn-primary-giant" onclick="switchTab('reservar')">
          👉 VER HORARIOS LIBRES
        </button>
      </div>
    `;
    return;
  }

  const dayObj = getUpcomingDays(7).find(d => d.key === myBooking.date) || { fullLabel: myBooking.date };
  const teamSize = Number(myBooking.teamSize || 10);
  const totalAmount = getBookingTotal(myBooking);
  const perPlayer = Math.round(totalAmount / teamSize);
  const depositAmount = Math.round((myBooking.courtPrice * (state.config.depositPercent || 30)) / 100);

  const confirmedPlayers = (myBooking.playersList || []).filter(p => p.name && p.name.trim() !== '').length;
  const missingPlayers = Math.max(0, teamSize - confirmedPlayers);

  // Mensaje listo para reenviar al grupo de WhatsApp
  const playerLines = (myBooking.playersList || [])
    .map((p, idx) => `${idx + 1}. ${p.name ? p.name : 'Libre'} ${p.paid ? '✅' : ''}`)
    .join('\n');

  const extrasText =
    myBooking.extras && myBooking.extras.length > 0
      ? `\n🍻 Tercer Tiempo encargado: ${myBooking.extras.map(e => e.name).join(' + ')}`
      : '';

  const shareMessage =
    `⚽ *¡TENEMOS CANCHA EN ${state.config.clubName}!*\n` +
    `📅 *Día:* ${dayObj.fullLabel} a las *${myBooking.hour}:00 hs*\n` +
    `🔑 *Código para anotarse en la web:* *${myBooking.matchCode || 'P190'}*\n` +
    `💵 *Ponemos:* *${formatMoney(perPlayer)} cada uno* (Total: ${formatMoney(totalAmount)})${extrasText}\n\n` +
    `📋 *LISTA DEL PARTIDO (${confirmedPlayers}/${teamSize}):*\n${playerLines}\n\n` +
    `👉 Confirmá si venís seguro!`;

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;

  // Link para mandar el comprobante de la seña al dueño de la cancha
  const sendReceiptMsg = encodeURIComponent(
    `Hola! Soy ${myBooking.customerName} (${myBooking.customerEmail}). Reservé la cancha para el ${dayObj.fullLabel} a las ${myBooking.hour}:00 hs (Código ${myBooking.matchCode}). Acá te paso el comprobante de la seña de ${formatMoney(depositAmount)} al alias ${state.config.mpAlias}:`
  );
  const sendReceiptWaUrl = `https://wa.me/${cleanPhoneForWa(state.config.clubWhatsapp)}?text=${sendReceiptMsg}`;

  const selectorHtml =
    accessible.length > 1
      ? `
    <div class="step-section">
      <label class="form-label">🔎 Elegí cuál de tus turnos querés ver:</label>
      <select class="form-select" onchange="promoteMyBookingFirst(this.value)">
        ${accessible
          .map(
            b => `<option value="${b.id}" ${b.id === myBooking.id ? 'selected' : ''}>
              ${b.date} - ${b.hour}:00 hs | Código ${b.matchCode} (${b.customerName})
            </option>`
          )
          .join('')}
      </select>
    </div>
  `
      : '';

  container.innerHTML = `
    ${codeLookupBar}
    ${selectorHtml}

    <div class="match-card">
      <div class="summary-banner">
        <div>
          <div style="font-size:0.85rem; font-weight:800; color:#86EFAC; text-transform:uppercase;">
            🔑 CÓDIGO DE PARTIDO: ${myBooking.matchCode || 'P190'} • RESERVÓ: ${myBooking.customerName}
          </div>
          <div class="summary-when">📅 ${dayObj.fullLabel} — ${myBooking.hour}:00 hs</div>
          <div class="summary-where">🏟️ ${state.config.pitchTitle}</div>
        </div>
        <div class="summary-price-box">
          <span class="per-player-big">${formatMoney(perPlayer)} por cabeza</span>
          <span class="per-player-sub">Total con extras: ${formatMoney(totalAmount)}</span>
        </div>
      </div>

      ${
        myBooking.paymentStatus === 'pending_deposit'
          ? `
        <div style="background:#FFFBEB; border:2px solid #F59E0B; border-radius:12px; padding:14px; margin-bottom:14px;">
          <div style="font-weight:900; color:#B45309; font-size:1.05rem;">
            ⏳ FALTA ENVIAR EL COMPROBANTE DE LA SEÑA (${formatMoney(depositAmount)})
          </div>
          <div style="font-weight:700; font-size:0.9rem; color:#334155; margin:4px 0 10px;">
            Transferí al Alias <strong>${state.config.mpAlias}</strong> y tocá el botón de abajo para mandarle la captura por WhatsApp a la cancha así queda 100% confirmado:
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button type="button" class="btn-secondary" onclick="copyAlias('${state.config.mpAlias}')">
              📋 Copiar Alias (${state.config.mpAlias})
            </button>
            <a href="${sendReceiptWaUrl}" target="_blank" rel="noopener" class="btn-whatsapp-top" style="padding:10px 14px;">
              📲 Mandar Comprobante por WhatsApp a la Cancha
            </a>
          </div>
        </div>
      `
          : myBooking.paymentStatus === 'deposit_verified'
          ? `<div style="margin-bottom:12px;"><span class="status-chip chip-deposit">✅ Seña verificada (${formatMoney(myBooking.paidAmount)}) • Resto en cancha: ${formatMoney(totalAmount - myBooking.paidAmount)}</span></div>`
          : myBooking.paymentStatus === 'paid'
          ? `<div style="margin-bottom:12px;"><span class="status-chip chip-paid">✅ TURNO PAGADO COMPLETO (${formatMoney(totalAmount)})</span></div>`
          : ''
      }

      <!-- BOTÓN GIGANTE DE WHATSAPP PARA EL GRUPO -->
      <a href="${whatsappShareUrl}" target="_blank" rel="noopener" class="btn-whatsapp-giant">
        📲 MANDAR LISTA AL GRUPO DE WHATSAPP
      </a>

      <div style="margin-top:20px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
        <div>
          <h3 style="font-size:1.15rem; font-weight:900;">
            📋 Lista de Jugadores (${confirmedPlayers} de ${teamSize} anotados)
          </h3>
          <p style="font-size:0.88rem; color:#475569; font-weight:700;">
            Anotá a tus compañeros acá y marcá "Pagó" cuando pongan sus ${formatMoney(perPlayer)}:
          </p>
        </div>
        ${
          missingPlayers > 0
            ? `
          <button type="button" class="btn-secondary" style="border-color:#D97706; background:#FFFBEB; color:#B45309;" onclick="publishFaltaUnoFromBooking('${myBooking.id}', ${missingPlayers}, ${perPlayer})">
            🙋‍♂️ ¡Nos faltan ${missingPlayers}! Publicar en "¿Falta 1?"
          </button>
        `
            : `<span class="status-chip chip-paid">✅ ¡Equipo Completo!</span>`
        }
      </div>

      <div class="players-checklist">
        ${(myBooking.playersList || [])
          .map(
            (player, index) => `
          <div class="player-row">
            <span class="player-num">${index + 1}</span>
            <input
              type="text"
              class="player-input"
              placeholder="Anotar compañero..."
              value="${(player.name || '').replace(/"/g, '&quot;')}"
              oninput="updatePlayerName('${myBooking.id}', ${index}, this.value)"
            />
            <button
              type="button"
              class="player-paid-btn ${player.paid ? 'paid' : ''}"
              onclick="togglePlayerPaid('${myBooking.id}', ${index})"
            >
              ${player.paid ? '✅ Pagó' : '💵 Falta'}
            </button>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;
}

function unlockByMatchCode(e) {
  e.preventDefault();
  const code = document.getElementById('inpMatchCode').value.trim().toUpperCase();
  const found = state.bookings.find(b => b.matchCode && b.matchCode.toUpperCase() === code);
  if (!found) {
    showToast('❌ No encontramos ningún partido con ese código.');
    return;
  }
  unlockedMatchCode = code;
  if (!myBookingIds.includes(found.id)) {
    myBookingIds.unshift(found.id);
  }
  saveState();
  renderAll();
  showToast(`✅ ¡Encontraste el partido de ${found.customerName}! Anotate en la lista.`);
}

function promoteMyBookingFirst(bookingId) {
  myBookingIds = [bookingId, ...myBookingIds.filter(id => id !== bookingId)];
  saveState();
  renderMiPartidoView();
}

function updatePlayerName(bookingId, idx, newName) {
  const b = state.bookings.find(item => item.id === bookingId);
  if (!b || !b.playersList[idx]) return;
  b.playersList[idx].name = newName;
  saveState();
}

function togglePlayerPaid(bookingId, idx) {
  const b = state.bookings.find(item => item.id === bookingId);
  if (!b || !b.playersList[idx]) return;
  b.playersList[idx].paid = !b.playersList[idx].paid;
  saveState();
  renderMiPartidoView();
}

function publishFaltaUnoFromBooking(bookingId, missingCount, pricePerPlayer) {
  const b = state.bookings.find(item => item.id === bookingId);
  if (!b) return;

  state.faltaUnoList.unshift({
    id: 'f1_' + Date.now(),
    date: b.date,
    hour: b.hour,
    organizer: b.customerName,
    phone: b.customerPhone,
    missingCount,
    position: 'Jugador de campo o Arquero',
    pricePerPlayer
  });

  saveState();
  showToast('🙋‍♂️ ¡Publicado en la pizarra "¿Falta 1?"!');
  switchTab('faltauno');
}

// ============================================================================
// VISTA 3: ¿FALTA 1? (BOLSA DE JUGADORES DEL BARRIO)
// ============================================================================
function renderFaltaUnoView() {
  const container = document.getElementById('faltaUnoContainer');

  container.innerHTML = `
    <div class="step-section">
      <div class="step-header">
        <div>
          <h2 style="font-size:1.3rem; font-weight:900;">🙋‍♂️ Pizarra "¿Te falta 1 jugador?"</h2>
          <p style="color:#475569; font-weight:700; margin-top:4px;">
            Si se les lesionó o bajó un compañero de la obra a último momento, publicalo acá para completar el equipo y no perder el turno:
          </p>
        </div>
        <button type="button" class="btn-secondary" style="background:#0F172A; color:#FFF; border-color:#0F172A;" onclick="openNewFaltaUnoModal()">
          ➕ Publicar que nos falta 1
        </button>
      </div>

      <div style="margin-top:16px;">
        ${
          state.faltaUnoList.length === 0
            ? `<div style="padding:24px; text-align:center; font-weight:800; color:#64748B;">Todos los partidos están completos por ahora.</div>`
            : state.faltaUnoList
                .map(item => {
                  const dayObj = getUpcomingDays(7).find(d => d.key === item.date) || { fullLabel: item.date };
                  const waText = encodeURIComponent(
                    `Hola ${item.organizer}! Vi en la web de ${state.config.clubName} que les falta jugador para las ${item.hour}:00 hs. ¡Me sumo!`
                  );
                  const waLink = `https://wa.me/${cleanPhoneForWa(item.phone)}?text=${waText}`;

                  return `
                    <div class="falta-card">
                      <div>
                        <span class="falta-needed-badge">🚨 FALTAN ${item.missingCount} JUGADOR(ES)</span>
                        <div style="font-size:1.2rem; font-weight:900; color:#0F172A;">
                          📅 ${dayObj.fullLabel} a las ${item.hour}:00 hs
                        </div>
                        <div style="font-weight:800; color:#334155; margin-top:4px;">
                          👕 Busca: <strong>${item.organizer}</strong> • Puesto: <strong>${item.position}</strong>
                        </div>
                        <div style="font-weight:900; color:#15803D; margin-top:4px; font-size:1.05rem;">
                          💵 Ponen ${formatMoney(item.pricePerPlayer)} por cabeza
                        </div>
                      </div>
                      <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                        <a href="${waLink}" target="_blank" rel="noopener" class="btn-whatsapp-top" style="padding:12px 16px; font-size:1rem;">
                          💬 ¡Yo juego! Hablar por WhatsApp
                        </a>
                        <button type="button" class="btn-secondary" onclick="removeFaltaUno('${item.id}')">
                          ✅ Ya completamos
                        </button>
                      </div>
                    </div>
                  `;
                })
                .join('')
        }
      </div>
    </div>
  `;
}

function removeFaltaUno(id) {
  state.faltaUnoList = state.faltaUnoList.filter(i => i.id !== id);
  saveState();
  renderAll();
  showToast('✅ ¡Qué grande! Equipo completo.');
}

function openNewFaltaUnoModal() {
  const modalRoot = document.getElementById('modalRoot');
  modalRoot.style.display = 'block';
  const days = getUpcomingDays(7);
  const user = getCurrentUser();

  modalRoot.innerHTML = `
    <div class="modal-backdrop" onclick="if(event.target===this) closeModal()">
      <div class="modal-sheet">
        <div class="modal-header">
          <div class="modal-title">🙋‍♂️ Publicar que falta jugador</div>
          <button type="button" class="btn-close" onclick="closeModal()">✕ Cerrar</button>
        </div>

        <form onsubmit="submitNewFaltaUno(event)">
          <div class="form-group">
            <label class="form-label">¿Para qué día y hora en la cancha?</label>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
              <select id="f1Date" class="form-select">
                ${days.map(d => `<option value="${d.key}">${d.fullLabel}</option>`).join('')}
              </select>
              <select id="f1Hour" class="form-select">
                ${HOURS.map(h => `<option value="${h}" ${h === 20 ? 'selected' : ''}>${h}:00 hs</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Tu Nombre / Equipo</label>
            <input id="f1Organizer" type="text" class="form-input" value="${user ? user.name : ''}" placeholder="Ej: El Tucu" required />
          </div>
          <div class="form-group">
            <label class="form-label">Tu WhatsApp para que te escriban</label>
            <input id="f1Phone" type="tel" class="form-input" value="${user ? user.phone : ''}" placeholder="Ej: 11 6543-2109" required />
          </div>
          <div class="form-group">
            <label class="form-label">¿Cuántos jugadores les faltan y qué puesto?</label>
            <div style="display:grid; grid-template-columns: 90px 1fr; gap:8px;">
              <input id="f1Count" type="number" min="1" max="6" value="1" class="form-input" required />
              <input id="f1Pos" type="text" class="form-input" placeholder="Ej: Arquero o uno que corra" required />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">¿Cuánto pone cada jugador? ($)</label>
            <input id="f1Price" type="number" value="3000" step="100" class="form-input" required />
          </div>
          <button type="submit" class="btn-primary-giant">
            📢 PUBLICAR EN LA PIZARRA
          </button>
        </form>
      </div>
    </div>
  `;
}

function submitNewFaltaUno(e) {
  e.preventDefault();
  state.faltaUnoList.unshift({
    id: 'f1_' + Date.now(),
    date: document.getElementById('f1Date').value,
    hour: Number(document.getElementById('f1Hour').value),
    organizer: document.getElementById('f1Organizer').value.trim(),
    phone: document.getElementById('f1Phone').value.trim(),
    missingCount: Number(document.getElementById('f1Count').value),
    position: document.getElementById('f1Pos').value.trim(),
    pricePerPlayer: Number(document.getElementById('f1Price').value)
  });
  saveState();
  closeModal();
  renderAll();
  showToast('📢 ¡Publicado en la pizarra!');
}

// ============================================================================
// ACCESO PROTEGIDO CON PIN PARA DUEÑO (1234) Y ENCARGADO (0000)
// ============================================================================
function openStaffAccess() {
  if (staffRole) {
    switchTab('dueno');
    return;
  }

  const modalRoot = document.getElementById('modalRoot');
  modalRoot.style.display = 'block';

  modalRoot.innerHTML = `
    <div class="modal-backdrop" onclick="if(event.target===this) closeModal()">
      <div class="modal-sheet">
        <div class="modal-header">
          <div class="modal-title">🔐 Acceso Personal de la Cancha</div>
          <button type="button" class="btn-close" onclick="closeModal()">✕ Cerrar</button>
        </div>

        <p style="font-weight:700; color:#334155; margin-bottom:14px;">
          Ingresá tu PIN para abrir el control de caja, señas y turnos fijos:
        </p>

        <form onsubmit="submitStaffPin(event)">
          <div class="form-group">
            <label class="form-label">PIN de Seguridad</label>
            <input id="inpStaffPin" type="password" inputmode="numeric" class="form-input" placeholder="****" required autofocus />
          </div>
          <button type="submit" class="btn-primary-giant">
            🔓 ENTRAR AL PANEL
          </button>
        </form>

        <div style="margin-top:16px; padding-top:12px; border-top:2px dashed #CBD5E1; display:flex; gap:8px; flex-wrap:wrap;">
          <button type="button" class="btn-secondary" onclick="quickStaffLogin('Dueño')">
            👑 Probar como Dueño (PIN: 1234)
          </button>
          <button type="button" class="btn-secondary" onclick="quickStaffLogin('Encargado')">
            👷 Probar como Encargado (PIN: 0000)
          </button>
        </div>
      </div>
    </div>
  `;
}

function quickStaffLogin(role) {
  staffRole = role;
  if (role === 'Encargado' && ownerSubTab === 'auditoria') {
    ownerSubTab = 'turnos';
  }
  closeModal();
  switchTab('dueno');
  showToast(`🔓 Modo ${role} activado.`);
}

function submitStaffPin(e) {
  e.preventDefault();
  const pin = document.getElementById('inpStaffPin').value.trim();
  if (pin === String(state.config.ownerPin || '1234')) {
    quickStaffLogin('Dueño');
  } else if (pin === String(state.config.staffPin || '0000')) {
    quickStaffLogin('Encargado');
  } else {
    showToast('❌ PIN incorrecto. (Dueño: 1234 | Encargado: 0000)');
  }
}

function logoutStaff() {
  staffRole = null;
  switchTab('reservar');
  showToast('🔒 Saliste del panel de administración.');
}

// ============================================================================
// VISTA 4: PANEL PROTEGIDO DEL DUEÑO / ENCARGADO (CAJA CIEGA + CRM + AUDITORÍA)
// ============================================================================
function renderDuenoView() {
  const container = document.getElementById('duenoContainer');
  if (!staffRole) {
    openStaffAccess();
    return;
  }

  const todayKey = selectedDateKey;
  const dayBookings = state.bookings
    .filter(b => b.date === todayKey)
    .sort((a, b) => a.hour - b.hour);

  let collectedToday = 0;
  let pendingToday = 0;
  let cantinaExtrasFromBookings = 0;
  let pendingDepositsCount = 0;

  dayBookings.forEach(b => {
    const total = getBookingTotal(b);
    const paid = Number(b.paidAmount || 0);
    collectedToday += paid;
    pendingToday += Math.max(0, total - paid);
    cantinaExtrasFromBookings += (b.extras || []).reduce((s, x) => s + Number(x.price || 0), 0);
    if (b.paymentStatus === 'pending_deposit') pendingDepositsCount++;
  });

  const directCantinaToday = (state.cantinaSales || [])
    .filter(c => c.date === todayKey)
    .reduce((s, c) => s + Number(c.amount || 0), 0);

  const occupancyPct = Math.round((dayBookings.length / HOURS.length) * 100);
  const days = getUpcomingDays(7);

  container.innerHTML = `
    <div class="step-section" style="background:#0F172A; color:#FFFFFF; border-color:#0F172A;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div>
          <div style="font-size:0.85rem; font-weight:800; color:#86EFAC; text-transform:uppercase;">
            ROL ACTIVO: ${staffRole.toUpperCase()} ${staffRole === 'Encargado' ? '(Caja Ciega - Sin permiso de borrar historial ni cambiar Alias)' : '(Control Total)'}
          </div>
          <h2 style="font-size:1.3rem; font-weight:900;">🔐 Gestión de la Cancha Única</h2>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <select class="form-select" style="width:auto; padding:8px 12px; font-size:0.95rem;" onchange="selectOwnerDay(this.value)">
            ${days.map(d => `<option value="${d.key}" ${d.key === todayKey ? 'selected' : ''}>${d.fullLabel}</option>`).join('')}
          </select>
          <button type="button" class="btn-danger" onclick="logoutStaff()">
            🔒 Salir
          </button>
        </div>
      </div>

      <!-- CAMBIAR ESTADO DEL CLIMA / CANCHA EN 1 CLIC -->
      <div style="margin-top:12px; padding-top:12px; border-top:1px solid #334155; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
        <span style="font-size:0.88rem; font-weight:800; color:#CBD5E1;">Cartel superior en vivo para los jugadores:</span>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button type="button" class="btn-secondary" style="padding:6px 10px; font-size:0.82rem;" onclick="setCourtLiveStatus('open', '🟢 CANCHA HABILITADA — Se juega normal (Techada e iluminada)')">
            🟢 Se juega normal
          </button>
          <button type="button" class="btn-secondary" style="padding:6px 10px; font-size:0.82rem;" onclick="setCourtLiveStatus('last_slots', '🟡 ¡ÚLTIMOS HORARIOS LIBRES PARA HOY!')">
            🟡 Últimos turnos
          </button>
          <button type="button" class="btn-secondary" style="padding:6px 10px; font-size:0.82rem;" onclick="setCourtLiveStatus('closed_rain', '🔴 SUSPENDIDO POR TORMENTA FUERTE / MANTENIMIENTO')">
            🔴 Cerrado / Lluvia
          </button>
        </div>
      </div>
    </div>

    <!-- TARJETAS DE PLATA DEL DÍA -->
    <div class="kpi-grid">
      <div class="kpi-card" style="border-color:#22C55E; background:#F0FDF4;">
        <div class="kpi-label" style="color:#15803D;">💵 Plata Cobrada Hoy</div>
        <div class="kpi-value" style="color:#15803D;">${formatMoney(collectedToday + directCantinaToday)}</div>
      </div>
      <div class="kpi-card" style="border-color:#F59E0B; background:#FFFBEB;">
        <div class="kpi-label" style="color:#B45309;">⏳ Falta Cobrar Hoy</div>
        <div class="kpi-value" style="color:#B45309;">${formatMoney(pendingToday)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">🍻 Venta Cantina / 3er Tiempo</div>
        <div class="kpi-value" style="color:#1D4ED8;">${formatMoney(cantinaExtrasFromBookings + directCantinaToday)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">📊 Ocupación (${dayBookings.length} de ${HOURS.length} hs)</div>
        <div class="kpi-value">${occupancyPct}%</div>
      </div>
    </div>

    <!-- SUB-NAVEGACIÓN -->
    <div class="owner-subnav">
      <button type="button" class="owner-pill ${ownerSubTab === 'turnos' ? 'active' : ''}" onclick="setOwnerSubTab('turnos')">
        📋 Turnos y Señas (${dayBookings.length}) ${pendingDepositsCount > 0 ? `<span class="badge-count">${pendingDepositsCount}</span>` : ''}
      </button>
      <button type="button" class="owner-pill ${ownerSubTab === 'fijos' ? 'active' : ''}" onclick="setOwnerSubTab('fijos')">
        🔁 Turnos Fijos Semanales (${state.fixedSchedules.length})
      </button>
      <button type="button" class="owner-pill ${ownerSubTab === 'cantina' ? 'active' : ''}" onclick="setOwnerSubTab('cantina')">
        🍻 Caja de Cantina
      </button>
      <button type="button" class="owner-pill ${ownerSubTab === 'clientes' ? 'active' : ''}" onclick="setOwnerSubTab('clientes')">
        👥 Clientes y Mails (${state.users.length})
      </button>
      ${
        staffRole === 'Dueño'
          ? `
        <button type="button" class="owner-pill ${ownerSubTab === 'auditoria' ? 'active' : ''}" onclick="setOwnerSubTab('auditoria')">
          🛡️ Auditoría Anti-Robo y Precios
        </button>
      `
          : ''
      }
    </div>

    <div id="ownerSubViewContent"></div>
  `;

  renderOwnerSubView(dayBookings);
}

function setCourtLiveStatus(code, text) {
  state.config.courtStatus = code;
  state.config.courtStatusText = text;
  addAuditEntry(staffRole, 'ESTADO CANCHA', `Cambió el cartel en vivo a: ${text}`);
  saveState();
  renderAll();
  showToast('✅ Cartel superior actualizado en vivo.');
}

function selectOwnerDay(dateKey) {
  selectedDateKey = dateKey;
  renderAll();
}

function setOwnerSubTab(subTab) {
  ownerSubTab = subTab;
  renderDuenoView();
}

function renderOwnerSubView(dayBookings) {
  const subContainer = document.getElementById('ownerSubViewContent');
  if (!subContainer) return;

  if (ownerSubTab === 'turnos') {
    const dayWaitlist = state.waitlist.filter(w => w.date === selectedDateKey);

    subContainer.innerHTML = `
      <div class="step-section">
        <div class="step-header">
          <div class="step-title">📋 Horarios de la Cancha (${selectedDateKey})</div>
          <button type="button" class="btn-secondary" style="background:#15803D; color:#FFF; border-color:#0F172A;" onclick="openQuickOwnerBookingModal()">
            ➕ Anotar Turno Rápido (Teléfono / Mostrador)
          </button>
        </div>

        ${
          dayBookings.length === 0
            ? `<div style="padding:20px; text-align:center; font-weight:800; color:#64748B;">No hay turnos ocupados en esta fecha.</div>`
            : dayBookings
                .map(b => {
                  const total = getBookingTotal(b);
                  const owed = Math.max(0, total - Number(b.paidAmount || 0));
                  const depositExpected = Math.round((b.courtPrice * (state.config.depositPercent || 30)) / 100);

                  let chipHtml = `<span class="status-chip chip-pending">💵 Pago en cancha (Debe ${formatMoney(owed)})</span>`;
                  if (b.paymentStatus === 'pending_deposit') {
                    chipHtml = `<span class="status-chip" style="background:#FFEDD5; color:#C2410C; border:1px solid #F97316;">⏳ FALTA VALIDAR COMPROBANTE DE SEÑA (${formatMoney(depositExpected)})</span>`;
                  } else if (owed === 0) {
                    chipHtml = `<span class="status-chip chip-paid">✅ PAGADO COMPLETO (${formatMoney(total)})</span>`;
                  } else if (b.paidAmount > 0) {
                    chipHtml = `<span class="status-chip chip-deposit">✅ Seña verificada (${formatMoney(b.paidAmount)}) • Falta ${formatMoney(owed)}</span>`;
                  }

                  const clientUser = (state.users || []).find(u => u.id === b.userId);
                  const repBadge =
                    clientUser && clientUser.cancelledMatches > 0
                      ? `<span class="status-chip" style="background:#FEE2E2; color:#B91C1C;">⚠️ Canceló ${clientUser.cancelledMatches} vez/veces antes</span>`
                      : clientUser && clientUser.completedMatches >= 3
                      ? `<span class="status-chip" style="background:#DCFCE7; color:#15803D;">⭐ Cliente Cumplidor (${clientUser.completedMatches} partidos)</span>`
                      : '';

                  const reminderMsg = encodeURIComponent(
                    `Hola ${b.customerName}! Te escribimos de ${state.config.clubName} por el turno de las ${b.hour}:00 hs (Código ${b.matchCode}). ¡Los esperamos!`
                  );
                  const waUrl = `https://wa.me/${cleanPhoneForWa(b.customerPhone)}?text=${reminderMsg}`;

                  return `
                    <div class="owner-booking-row">
                      <div>
                        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:4px;">
                          <span style="font-size:1.3rem; font-weight:900;">⏰ ${b.hour}:00 hs</span>
                          <span style="font-size:0.84rem; font-weight:900; background:#E2E8F0; padding:3px 8px; border-radius:6px;">Código ${b.matchCode || 'P100'}</span>
                          ${chipHtml}
                          ${b.isFixedInstance ? `<span class="status-chip" style="background:#EDE9FE; color:#6D28D9;">🔁 Turno Fijo Semanal</span>` : ''}
                          ${repBadge}
                        </div>
                        <div style="font-weight:800; font-size:1rem;">
                          👤 <strong>${b.customerName}</strong> • ✉️ ${b.customerEmail || 'Sin mail'} • 📞 ${b.customerPhone}
                        </div>
                        ${
                          b.extras && b.extras.length > 0
                            ? `<div style="font-weight:800; color:#15803D; font-size:0.9rem; margin-top:3px;">
                                🍻 Cantina encargada: ${b.extras.map(e => e.name).join(' + ')}
                              </div>`
                            : ''
                        }
                      </div>

                      <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        ${
                          b.paymentStatus === 'pending_deposit'
                            ? `<button type="button" class="btn-secondary" style="background:#DBEAFE; color:#1D4ED8; border-color:#3B82F6;" onclick="approveDepositReceipt('${b.id}', ${depositExpected})">
                                ✅ Aprobar Seña (${formatMoney(depositExpected)})
                              </button>`
                            : ''
                        }
                        ${
                          owed > 0
                            ? `<button type="button" class="btn-secondary" style="background:#DCFCE7; color:#15803D; border-color:#22C55E;" onclick="markBookingFullyPaid('${b.id}')">
                                💵 Cobrar Total (${formatMoney(owed)}) + Sumar Sello
                              </button>`
                            : ''
                        }
                        <a href="${waUrl}" target="_blank" rel="noopener" class="btn-secondary" style="text-decoration:none;">
                          💬 WhatsApp
                        </a>
                        <button type="button" class="btn-danger" onclick="cancelAndReleaseBooking('${b.id}')">
                          ${b.isFixedInstance ? '🔓 Liberar solo por hoy' : '🗑️ Se bajó / Liberar'}
                        </button>
                      </div>
                    </div>
                  `;
                })
                .join('')
        }
      </div>

      <!-- LISTA DE ESPERA DEL DÍA -->
      <div class="step-section">
        <div class="step-title" style="margin-bottom:8px;">🔔 Suplentes esperando cancha hoy ("Avisame si se libera")</div>
        ${
          dayWaitlist.length === 0
            ? `<div style="font-weight:700; color:#64748B;">No hay pedidos en lista de espera para este día.</div>`
            : dayWaitlist
                .map(w => {
                  const msg = encodeURIComponent(
                    `¡Hola ${w.name}! Se acaba de liberar la cancha para hoy a las ${w.hour}:00 hs en ${state.config.clubName}. ¿La querés agarrar?`
                  );
                  return `
                    <div class="owner-booking-row" style="background:#FFFBEB; border-color:#F59E0B;">
                      <div>
                        <div style="font-weight:900; font-size:1.05rem;">⏰ Busca hoy a las ${w.hour}:00 hs</div>
                        <div style="font-weight:800;">👤 ${w.name} • ✉️ ${w.email || '-'} • 📞 ${w.phone}</div>
                      </div>
                      <div style="display:flex; gap:8px;">
                        <a href="https://wa.me/${cleanPhoneForWa(w.phone)}?text=${msg}" target="_blank" rel="noopener" class="btn-whatsapp-top">
                          💬 Avisar por WhatsApp
                        </a>
                        <button type="button" class="btn-secondary" onclick="convertWaitlistToBooking('${w.id}')">
                          ✅ Asignarle el Turno
                        </button>
                      </div>
                    </div>
                  `;
                })
                .join('')
        }
      </div>
    `;
    return;
  }

  if (ownerSubTab === 'fijos') {
    subContainer.innerHTML = `
      <div class="step-section">
        <div class="step-header">
          <div>
            <div class="step-title">🔁 Turnos Fijos Semanales (Se reservan solos todas las semanas)</div>
            <p style="font-size:0.9rem; color:#475569; font-weight:700; margin-top:4px;">
              Cada grupo fijo bloquea automáticamente su día y hora en el calendario. Si una semana avisan que no vienen, podés liberar solo esa fecha desde "Turnos y Señas".
            </p>
          </div>
        </div>

        ${state.fixedSchedules
          .map(fx => {
            const msg = encodeURIComponent(
              `Hola ${fx.customerName}! Confirmamos el turno fijo de los ${DAY_NAMES_FULL[fx.dow]} a las ${fx.hour}:00 hs en ${state.config.clubName}. ¡Abrazo!`
            );
            return `
              <div class="owner-booking-row">
                <div>
                  <div style="font-size:1.15rem; font-weight:900;">
                    📅 Todos los ${DAY_NAMES_FULL[fx.dow]} a las ${fx.hour}:00 hs
                  </div>
                  <div style="font-weight:800; margin-top:2px;">👤 ${fx.customerName} • ✉️ ${fx.customerEmail || '-'} • 📞 ${fx.customerPhone}</div>
                  <div style="font-size:0.88rem; color:#475569; font-weight:700; margin-top:2px;">📝 ${fx.notes}</div>
                </div>
                <div style="display:flex; gap:8px;">
                  <a href="https://wa.me/${cleanPhoneForWa(fx.customerPhone)}?text=${msg}" target="_blank" rel="noopener" class="btn-whatsapp-top">
                    💬 Confirmar Semana
                  </a>
                  ${
                    staffRole === 'Dueño'
                      ? `<button type="button" class="btn-danger" onclick="deleteFixedSchedule('${fx.id}')">Quitar Fijo</button>`
                      : ''
                  }
                </div>
              </div>
            `;
          })
          .join('')}
      </div>
    `;
    return;
  }

  if (ownerSubTab === 'cantina') {
    const todaySales = (state.cantinaSales || []).filter(c => c.date === selectedDateKey);

    subContainer.innerHTML = `
      <div class="step-section">
        <div class="step-title" style="margin-bottom:8px;">🍻 Venta Rápida de Mostrador / Cantina</div>
        <p style="font-size:0.9rem; color:#475569; font-weight:700; margin-bottom:14px;">
          Tocá un botón para sumar la venta a la caja del día en 1 segundo:
        </p>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap:10px; margin-bottom:18px;">
          <button type="button" class="btn-secondary" style="padding:14px; justify-content:space-between;" onclick="quickAddCantinaSale('🍺 Promo 3 Cervezas 1L', 12000)">
            <span>🍺 3 Cervezas 1L</span> <strong>+$12.000</strong>
          </button>
          <button type="button" class="btn-secondary" style="padding:14px; justify-content:space-between;" onclick="quickAddCantinaSale('🥤 Gaseosa Grande / Aguas', 4500)">
            <span>🥤 Gaseosa / Agua</span> <strong>+$4.500</strong>
          </button>
          <button type="button" class="btn-secondary" style="padding:14px; justify-content:space-between;" onclick="quickAddCantinaSale('🥪 Choripán / Sándwich', 5000)">
            <span>🥪 Choripán / Buff</span> <strong>+$5.000</strong>
          </button>
          <button type="button" class="btn-secondary" style="padding:14px; justify-content:space-between;" onclick="quickAddCantinaSale('🎽 Alquiler Pecheras/Pelota', 3000)">
            <span>🎽 Pecheras/Pelota</span> <strong>+$3.000</strong>
          </button>
        </div>

        <h4 style="font-weight:900; margin-bottom:10px;">Ventas de mostrador anotadas hoy:</h4>
        ${
          todaySales.length === 0
            ? `<div style="color:#64748B; font-weight:700;">Todavía no hay ventas sueltas de mostrador en este día.</div>`
            : todaySales
                .map(
                  s => `
              <div class="owner-booking-row" style="padding:10px 14px;">
                <div style="font-weight:800;">🕒 ${s.time} — ${s.item} <span style="color:#64748B; font-size:0.84rem;">(Cargó: ${s.byRole || 'Personal'})</span></div>
                <div style="font-weight:900; color:#15803D;">${formatMoney(s.amount)}</div>
              </div>
            `
                )
                .join('')
        }
      </div>
    `;
    return;
  }

  if (ownerSubTab === 'clientes') {
    const allEmails = (state.users || []).map(u => u.email).join(', ');

    subContainer.innerHTML = `
      <div class="step-section">
        <div class="step-header">
          <div>
            <div class="step-title">👥 Base de Clientes Registrados (Emails, Sellos y Reputación)</div>
            <p style="font-size:0.9rem; color:#475569; font-weight:700; margin-top:4px;">
              Cada cliente que se registra deja su mail y su WhatsApp. Sabés quién cumple siempre y quién canceló turnos.
            </p>
          </div>
          <button type="button" class="btn-secondary" onclick="copyAlias('${allEmails}')">
            📋 Copiar todos los Emails (${state.users.length})
          </button>
        </div>

        ${(state.users || [])
          .map(u => {
            const promoWa = encodeURIComponent(
              `¡Hola ${u.name}! En ${state.config.clubName} nos quedó libre un horario hoy con promo para tu equipo. ¿Se prenden?`
            );
            return `
              <div class="owner-booking-row">
                <div>
                  <div style="font-size:1.1rem; font-weight:900;">
                    👤 ${u.name}
                    ${
                      u.cancelledMatches > 0
                        ? `<span class="status-chip" style="background:#FEE2E2; color:#B91C1C; margin-left:6px;">⚠️ Canceló ${u.cancelledMatches}</span>`
                        : `<span class="status-chip chip-paid" style="margin-left:6px;">🟢 Cumplidor (${u.completedMatches} jugados)</span>`
                    }
                  </div>
                  <div style="font-weight:800; color:#334155; margin-top:3px;">
                    ✉️ <strong>${u.email}</strong> • 📱 ${u.phone}
                  </div>
                  <div style="font-size:0.88rem; font-weight:800; color:#15803D; margin-top:3px;">
                    🎁 Tarjeta de Fidelidad: ${u.stamps} / ${state.config.loyaltyGoal || 10} sellos
                  </div>
                </div>
                <div style="display:flex; gap:8px;">
                  <button type="button" class="btn-secondary" onclick="addManualStamp('${u.id}')">
                    ➕ Sumar 1 Sello ⚽
                  </button>
                  <a href="https://wa.me/${cleanPhoneForWa(u.phone)}?text=${promoWa}" target="_blank" rel="noopener" class="btn-whatsapp-top">
                    💬 Ofrecer Promo
                  </a>
                </div>
              </div>
            `;
          })
          .join('')}
      </div>
    `;
    return;
  }

  if (ownerSubTab === 'auditoria' && staffRole === 'Dueño') {
    subContainer.innerHTML = `
      <!-- REGISTRO INBORRABLE DE AUDITORÍA ANTI-FRAUDE -->
      <div class="step-section">
        <div class="step-title" style="margin-bottom:6px;">🛡️ Caja Ciega: Registro Inborrable de Movimientos</div>
        <p style="font-size:0.9rem; color:#475569; font-weight:700; margin-bottom:12px;">
          Todo cobro, aprobación de seña o turno liberado por el encargado queda grabado acá con hora exacta para evitar "turnos fantasma":
        </p>
        ${(state.auditLog || [])
          .slice(0, 20)
          .map(
            log => `
          <div class="owner-booking-row" style="padding:10px 14px; background:#F8FAFC;">
            <div>
              <span class="status-chip" style="background:#E2E8F0; color:#0F172A; margin-right:6px;">${log.date} ${log.time}</span>
              <strong style="color:#1D4ED8;">[${log.role}]</strong>
              <strong style="margin-left:4px;">${log.action}:</strong>
              <span style="font-weight:700; color:#334155;">${log.detail}</span>
            </div>
          </div>
        `
          )
          .join('')}
      </div>

      <!-- CONFIGURACIÓN EXCLUSIVA DEL DUEÑO -->
      <div class="step-section">
        <div class="step-title" style="margin-bottom:12px;">⚙️ Configurar Precio de la Cancha, Alias y Claves</div>
        <form onsubmit="saveOwnerConfig(event)">
          <div class="form-group">
            <label class="form-label">Nombre del Complejo</label>
            <input id="cfgClubName" type="text" class="form-input" value="${state.config.clubName}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Dirección / Subtítulo</label>
            <input id="cfgClubSub" type="text" class="form-input" value="${state.config.clubSub}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Precio de la Cancha por Hora ($)</label>
            <input id="cfgBasePrice" type="number" step="1000" class="form-input" value="${state.config.basePrice}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Descuento Automático en "Hora Siesta" (14 a 17 hs) ($)</label>
            <input id="cfgPromoDiscount" type="number" step="500" class="form-input" value="${state.config.promoDiscount}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Alias de Mercado Pago (Protegido solo para el Dueño)</label>
            <input id="cfgAlias" type="text" class="form-input" value="${state.config.mpAlias}" required />
          </div>
          <div class="form-group">
            <label class="form-label">WhatsApp de la Cancha</label>
            <input id="cfgWa" type="text" class="form-input" value="${state.config.clubWhatsapp}" required />
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div class="form-group">
              <label class="form-label">PIN del Dueño</label>
              <input id="cfgOwnerPin" type="text" class="form-input" value="${state.config.ownerPin}" required />
            </div>
            <div class="form-group">
              <label class="form-label">PIN del Encargado</label>
              <input id="cfgStaffPin" type="text" class="form-input" value="${state.config.staffPin}" required />
            </div>
          </div>
          <button type="submit" class="btn-primary-giant">
            💾 GUARDAR CONFIGURACIÓN DEL DUEÑO
          </button>
        </form>
      </div>
    `;
  }
}

function approveDepositReceipt(bookingId, depositAmount) {
  const b = state.bookings.find(item => item.id === bookingId);
  if (!b) return;
  b.paidAmount = Number(depositAmount);
  b.paymentStatus = 'deposit_verified';
  addAuditEntry(
    staffRole,
    'SEÑA APROBADA',
    `Verificó comprobante de seña (${formatMoney(depositAmount)}) del turno ${b.hour}:00 hs (${b.customerName})`
  );
  saveState();
  renderDuenoView();
  showToast('✅ ¡Seña aprobada y sumada a la caja del día!');
}

function markBookingFullyPaid(bookingId) {
  const b = state.bookings.find(item => item.id === bookingId);
  if (!b) return;
  const total = getBookingTotal(b);
  const owed = Math.max(0, total - Number(b.paidAmount || 0));
  b.paidAmount = total;
  b.paymentStatus = 'paid';

  // Sumar 1 sello de fidelidad y 1 partido cumplido a la cuenta del cliente
  if (b.userId) {
    const u = (state.users || []).find(user => user.id === b.userId);
    if (u) {
      u.stamps = Number(u.stamps || 0) + 1;
      u.completedMatches = Number(u.completedMatches || 0) + 1;
    }
  }

  addAuditEntry(
    staffRole,
    'COBRO TOTAL',
    `Cobró saldo de ${formatMoney(owed)} (Total ${formatMoney(total)}) del turno ${b.hour}:00 hs (${b.customerName})`
  );
  saveState();
  renderAll();
  showToast('💵 ¡Cobro registrado en caja y +1 sello sumado al cliente!');
}

function cancelAndReleaseBooking(bookingId) {
  const b = state.bookings.find(item => item.id === bookingId);
  if (!b) return;

  // Si es una instancia de un Turno Fijo, agregar excepción solo para esta fecha así la semana que viene sigue fijo
  if (b.isFixedInstance) {
    const exKey = `${b.date}_${b.hour}`;
    if (!state.fixedExceptions.includes(exKey)) {
      state.fixedExceptions.push(exKey);
    }
  }

  // Registrar en la reputación si canceló
  if (b.userId && !b.isFixedInstance) {
    const u = (state.users || []).find(user => user.id === b.userId);
    if (u) {
      u.cancelledMatches = Number(u.cancelledMatches || 0) + 1;
    }
  }

  addAuditEntry(
    staffRole,
    'TURNO LIBERADO / BAJA',
    `Liberó el turno del ${b.date} a las ${b.hour}:00 hs que tenía ${b.customerName} (Había pagado: ${formatMoney(b.paidAmount)})`
  );

  state.bookings = state.bookings.filter(item => item.id !== bookingId);
  saveState();
  renderAll();
  showToast('🔓 Horario liberado (quedó asentado en la Auditoría del Dueño).');
}

function deleteFixedSchedule(fxId) {
  const fx = state.fixedSchedules.find(item => item.id === fxId);
  if (!fx) return;
  state.fixedSchedules = state.fixedSchedules.filter(item => item.id !== fxId);
  addAuditEntry(staffRole, 'BAJA TURNO FIJO', `Eliminó el turno fijo semanal de ${fx.customerName} (${fx.hour}:00 hs)`);
  saveState();
  renderAll();
  showToast('🗑️ Turno fijo semanal eliminado.');
}

function addManualStamp(userId) {
  const u = (state.users || []).find(item => item.id === userId);
  if (!u) return;
  u.stamps = Number(u.stamps || 0) + 1;
  u.completedMatches = Number(u.completedMatches || 0) + 1;
  addAuditEntry(staffRole, 'SELLO FIDELIDAD', `Sumó 1 sello manual a ${u.name} (${u.email})`);
  saveState();
  renderAll();
  showToast(`⚽ ¡Se le sumó 1 sello a ${u.name}!`);
}

function convertWaitlistToBooking(waitlistId) {
  const w = state.waitlist.find(item => item.id === waitlistId);
  if (!w) return;

  // Si había un turno fijo en esa fecha, marcar la excepción del día
  const exKey = `${w.date}_${w.hour}`;
  if (!state.fixedExceptions.includes(exKey)) {
    state.fixedExceptions.push(exKey);
  }

  state.bookings = state.bookings.filter(
    b => !(b.date === w.date && Number(b.hour) === Number(w.hour))
  );

  const matchCode = 'P' + String(w.hour) + String(Math.floor(10 + Math.random() * 89));

  const newBk = {
    id: 'bk_' + Date.now(),
    matchCode,
    date: w.date,
    hour: Number(w.hour),
    userId: null,
    customerName: w.name,
    customerEmail: w.email || '',
    customerPhone: w.phone,
    teamSize: 10,
    isFixedInstance: false,
    paymentStatus: 'pending_cash',
    paymentMethod: 'cash',
    courtPrice: getSlotPrice(w.hour),
    extras: [],
    paidAmount: 0,
    playersList: Array.from({ length: 10 }, (_, idx) => ({
      name: idx === 0 ? w.name : '',
      paid: false
    }))
  };

  state.bookings.push(newBk);
  state.waitlist = state.waitlist.filter(item => item.id !== waitlistId);
  addAuditEntry(staffRole, 'SUPLENTE ASIGNADO', `Asignó las ${w.hour}:00 hs a ${w.name} desde la lista de espera`);
  saveState();
  renderAll();
  showToast(`✅ Turno asignado a ${w.name}. ¡No se perdió la hora!`);
}

function quickAddCantinaSale(itemName, amount) {
  state.cantinaSales.unshift({
    id: 'cs_' + Date.now(),
    date: selectedDateKey,
    item: itemName,
    amount: Number(amount),
    method: 'cash',
    byRole: staffRole || 'Personal',
    time: nowTimeStr()
  });
  addAuditEntry(staffRole, 'VENTA CANTINA', `Cargó venta mostrador: ${itemName} (${formatMoney(amount)})`);
  saveState();
  renderDuenoView();
  showToast(`🍻 Sumado a la caja: ${itemName} (${formatMoney(amount)})`);
}

function openQuickOwnerBookingModal() {
  const modalRoot = document.getElementById('modalRoot');
  modalRoot.style.display = 'block';

  modalRoot.innerHTML = `
    <div class="modal-backdrop" onclick="if(event.target===this) closeModal()">
      <div class="modal-sheet">
        <div class="modal-header">
          <div class="modal-title">➕ Anotar Turno Rápido (Mostrador/Teléfono)</div>
          <button type="button" class="btn-close" onclick="closeModal()">✕ Cerrar</button>
        </div>
        <form onsubmit="submitQuickOwnerBooking(event)">
          <div class="form-group">
            <label class="form-label">Hora en la Cancha (${selectedDateKey})</label>
            <select id="qoHour" class="form-select">
              ${HOURS.map(h => `<option value="${h}" ${h === 22 ? 'selected' : ''}>${h}:00 hs</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Nombre del Cliente / Grupo</label>
            <input id="qoName" type="text" class="form-input" placeholder="Ej: Los de la Obra de Belgrano" required />
          </div>
          <div class="form-group">
            <label class="form-label">Email del Cliente (Opcional)</label>
            <input id="qoEmail" type="email" class="form-input" placeholder="cliente@gmail.com" />
          </div>
          <div class="form-group">
            <label class="form-label">WhatsApp</label>
            <input id="qoPhone" type="tel" class="form-input" placeholder="Ej: 11 4455-6677" required />
          </div>
          <div class="form-group">
            <label class="extra-item">
              <div class="extra-left">
                <input id="qoFixed" type="checkbox" class="extra-check" />
                <span class="extra-name">🔁 Es Turno Fijo (bloquear todas las semanas a esta hora)</span>
              </div>
            </label>
          </div>
          <button type="submit" class="btn-primary-giant">
            ✅ GUARDAR TURNO
          </button>
        </form>
      </div>
    </div>
  `;
}

function submitQuickOwnerBooking(e) {
  e.preventDefault();
  const hour = Number(document.getElementById('qoHour').value);
  const customerName = document.getElementById('qoName').value.trim();
  const customerEmail = document.getElementById('qoEmail').value.trim().toLowerCase();
  const customerPhone = document.getElementById('qoPhone').value.trim();
  const isFixed = document.getElementById('qoFixed').checked;

  state.bookings = state.bookings.filter(
    b => !(b.date === selectedDateKey && Number(b.hour) === hour)
  );

  const matchCode = 'P' + String(hour) + String(Math.floor(10 + Math.random() * 89));

  state.bookings.push({
    id: 'bk_' + Date.now(),
    matchCode,
    date: selectedDateKey,
    hour,
    userId: null,
    customerName,
    customerEmail,
    customerPhone,
    teamSize: 10,
    isFixedInstance: isFixed,
    paymentStatus: 'pending_cash',
    paymentMethod: 'cash',
    courtPrice: getSlotPrice(hour),
    extras: [],
    paidAmount: 0,
    playersList: Array.from({ length: 10 }, (_, idx) => ({
      name: idx === 0 ? customerName : '',
      paid: false
    }))
  });

  if (isFixed) {
    const dayObj = getUpcomingDays(7).find(d => d.key === selectedDateKey);
    const dow = dayObj ? dayObj.dow : new Date().getDay();
    state.fixedSchedules.push({
      id: 'fx_' + Date.now(),
      dow,
      hour,
      userId: null,
      customerName,
      customerEmail,
      customerPhone,
      teamSize: 10,
      notes: 'Turno fijo cargado desde mostrador.'
    });
  }

  addAuditEntry(staffRole, 'TURNO MOSTRADOR', `Anotó a ${customerName} para las ${hour}:00 hs (${isFixed ? 'Fijo Semanal' : 'Por el día'})`);
  saveState();
  closeModal();
  renderAll();
  showToast('✅ Turno cargado en la grilla.');
}

function saveOwnerConfig(e) {
  e.preventDefault();
  if (staffRole !== 'Dueño') return;

  state.config.clubName = document.getElementById('cfgClubName').value.trim();
  state.config.clubSub = document.getElementById('cfgClubSub').value.trim();
  state.config.basePrice = Number(document.getElementById('cfgBasePrice').value || 30000);
  state.config.promoDiscount = Number(document.getElementById('cfgPromoDiscount').value || 0);
  state.config.mpAlias = document.getElementById('cfgAlias').value.trim();
  state.config.clubWhatsapp = document.getElementById('cfgWa').value.trim();
  state.config.ownerPin = document.getElementById('cfgOwnerPin').value.trim();
  state.config.staffPin = document.getElementById('cfgStaffPin').value.trim();

  addAuditEntry('Dueño', 'CAMBIO CONFIGURACIÓN', `Actualizó precio base a ${formatMoney(state.config.basePrice)} y Alias MP a ${state.config.mpAlias}`);
  saveState();
  renderAll();
  showToast('💾 ¡Configuración del Dueño guardada!');
}

window.addEventListener('DOMContentLoaded', () => {
  loadState();
});
