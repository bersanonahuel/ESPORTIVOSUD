const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

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

function buildDefaultDb() {
  const today = getDateKey(0);
  const tomorrow = getDateKey(1);
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
        notes: 'Fijo todos los miércoles/mañana a las 20hs.'
      }
    ],
    // Fechas puntuales donde un turno fijo avisó que no viene y liberó la cancha por ese día: "YYYY-MM-DD_HH"
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
        paymentStatus: 'deposit_verified', // 'pending_deposit' | 'deposit_verified' | 'pending_cash' | 'paid'
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

function readDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 2) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading DB:', err.message);
  }
  const fresh = buildDefaultDb();
  writeDb(fresh);
  return fresh;
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing DB:', err.message);
    return false;
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (url.pathname === '/api/state' && req.method === 'GET') {
    const state = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true, state }));
    return;
  }

  if (url.pathname === '/api/state' && (req.method === 'POST' || req.method === 'PUT')) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        if (parsed && parsed.config) {
          writeDb(parsed);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ ok: true }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ ok: false, error: 'Estructura invalida' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Invalid JSON' }));
      }
    });
    return;
  }

  let safePath = path.normalize(url.pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(__dirname, safePath);
  const ext = path.extname(filePath).toLowerCase();

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Archivo no encontrado');
    return;
  }

  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Error interno del servidor');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`⚽ SINTÉTICO EL POTRERO - Versión 2.0 Activa`);
  console.log(`👉 Abri en tu navegador: http://localhost:${PORT}`);
  console.log(`🔐 PIN Dueño: 1234 | PIN Encargado: 0000`);
  console.log(`==================================================\n`);
});
