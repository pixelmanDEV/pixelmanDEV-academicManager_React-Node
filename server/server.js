/**
 * ============================================
 * Campus Tech Academy — API Server (Node/Express)
 * ============================================
 *
 * Substitui o antigo fetch() a ficheiros JSON estáticos por uma
 * verdadeira API REST, mantendo o mesmo DataService/Repository pattern
 * do projeto original (agora corrido no servidor em vez do browser).
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'campus-tech-academy-api' });
});

app.listen(PORT, () => {
  console.log(`[Server] Campus Tech Academy API a correr em http://localhost:${PORT}`);
});
