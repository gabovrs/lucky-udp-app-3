import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
