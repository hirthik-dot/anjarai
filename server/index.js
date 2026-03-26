require('dotenv').config();
const express    = require('express');
const http       = require('http');
const cors       = require('cors');
const connectDB  = require('./db');
const socket     = require('./socket');

const app  = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Initialize Socket.io
socket.init(httpServer);

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      process.env.CLIENT_URL,
      process.env.ADMIN_URL
    ].filter(Boolean);
    
    // Allow if origin is in the list OR matches vercel.app
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/all-content',    require('./routes/all-content'));
app.use('/api/navbar',         require('./routes/navbar'));
app.use('/api/auth',           require('./routes/auth'));
app.use('/api/auth/otp',       require('./routes/otp'));

app.use('/api/products',       require('./routes/products'));
app.use('/api/hero',           require('./routes/hero'));
app.use('/api/announcements',  require('./routes/announcements'));
app.use('/api/tagline',        require('./routes/tagline'));
app.use('/api/trust',          require('./routes/trust'));
app.use('/api/marquee',        require('./routes/marquee'));
app.use('/api/categories',     require('./routes/categories'));
app.use('/api/about',          require('./routes/about'));
app.use('/api/ads',            require('./routes/ads'));
app.use('/api/closing-banner', require('./routes/closingbanner'));
app.use('/api/videos',         require('./routes/videos'));
app.use('/api/newsletter',     require('./routes/newsletter'));
app.use('/api/footer',         require('./routes/footer'));
app.use('/api/offers',         require('./routes/offers'));
app.use('/api/collections',    require('./routes/collections'));
app.use('/api/upload',         require('./routes/upload'));
app.use('/api/orders',         require('./routes/orders'));
app.use('/api/admin-profile',  require('./routes/adminProfile'));
app.use('/api/inventory',      require('./routes/inventory'));
app.use('/api/client',         require('./routes/clientAuth'));
app.use('/api/clients',        require('./routes/adminClients'));

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// ── Start ────────────────────────────────────────────────────────────────────
httpServer.listen(PORT, () => {
  console.log(`✅ Anjaraipetti Server (MongoDB + Socket.io) running → http://localhost:${PORT}`);
  
  // Test Socket connection
  const io = socket.getIO();
  io.on('connection', (s) => {
    console.log(`📡 New Socket Connection: ${s.id}`);
  });
});
