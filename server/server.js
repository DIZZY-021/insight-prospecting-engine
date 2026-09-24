import express from 'express';
import cors from 'cors';

import searchRoutes from './routes/searchRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Insight Prospecting Engine API funcionando!'
  });
});

app.use('/api', searchRoutes);

app.use('/api', dashboardRoutes);

app.listen(PORT, () => {
  console.log(
    `Servidor rodando em http://localhost:${PORT}`
  );
});