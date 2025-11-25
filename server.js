const express = require('express');
const cors = require('cors');
const app = express();

// ✅ Konfigurasi CORS yang benar untuk request dengan credentials
const corsOptions = {
  origin: 'http://127.0.0.1:5500', // sesuaikan dengan port Live Server Anda
  credentials: true // izinkan cookie/session
};

app.use(cors(corsOptions));

// Middleware lainnya
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint Anda
app.get('/auth/status', (req, res) => {
  // logika cek login
});
app.post('/auth/login', (req, res) => {
  // logika login
});

app.listen(8080, () => {
  console.log('Server berjalan di http://localhost:8080');
});