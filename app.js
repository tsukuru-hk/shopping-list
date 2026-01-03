import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => {
  res.render('top');
});

app.get('/index', (_req, res) => {
  res.render('index');
});

app.get('/new', (req, res) => {
  res.render('new.ejs');
});

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
