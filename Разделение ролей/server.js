const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const { username, role } = req.body;
  if (!username || !role) {
    return res.redirect('/');
  }
  req.session.username = username;
  req.session.role = role;
  res.redirect('/' + role);
});

app.get('/user', (req, res) => {
  if (!req.session.username) return res.redirect('/');
  res.sendFile(path.join(__dirname, 'public', 'user.html'));
});

app.get('/moderator', (req, res) => {
  if (!req.session.username) return res.redirect('/');
  if (req.session.role !== 'moderator') {
    return res.status(403).send('Доступ запрещён');
  }
  res.sendFile(path.join(__dirname, 'public', 'moderator.html'));
});

app.get('/admin', (req, res) => {
  if (!req.session.username) return res.redirect('/');
  if (req.session.role !== 'admin') {
    return res.status(403).send('Доступ запрещён');
  }
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log('Сервер запущен: http://localhost:' + PORT);
});
