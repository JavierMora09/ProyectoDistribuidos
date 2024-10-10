const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// --- RUTAS PARA ARCHIVOS ---

// Subir archivos
app.post('/upload', (req, res) => {
    const file = req.body.file;

    axios.post('http://localhost:5000/upload', { file })
    .then(response => res.json(response.data))
    .catch(error => res.status(500).json({ error: error.message }));
});

// Obtener archivos
app.get('/files/:name', (req, res) => {
    const fileName = req.params.name;

    axios.get(`http://localhost:5000/files/${fileName}`)
    .then(response => res.send(response.data))
    .catch(error => res.status(404).json({ error: 'File not found' }));
});

// Descargar archivos
app.get('/download/:name', (req, res) => {
    const fileName = req.params.name;

    axios.get(`http://localhost:5000/download/${fileName}`, { responseType: 'stream' })
    .then(response => response.data.pipe(res))
    .catch(error => res.status(404).json({ error: 'File not found' }));
});

// --- RUTAS PARA VIDEOS ---

// Subir videos
app.post('/upload-video', (req, res) => {
    const video = req.body.video;

    axios.post('http://localhost:5000/upload', { video })
    .then(response => res.json(response.data))
    .catch(error => res.status(500).json({ error: error.message }));
});

// Obtener videos
app.get('/video/:name', (req, res) => {
    const videoName = req.params.name;

    axios.get(`http://localhost:5000/video/${videoName}`, { responseType: 'stream' })
    .then(response => response.data.pipe(res))
    .catch(error => res.status(404).json({ error: 'Video not found' }));
});

// Descargar videos
app.get('/download-video/:name', (req, res) => {
    const videoName = req.params.name;

    axios.get(`http://localhost:5000/download/${videoName}`, { responseType: 'stream' })
    .then(response => response.data.pipe(res))
    .catch(error => res.status(404).json({ error: 'Video not found' }));
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
