const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001; // Cambia el puerto si es necesario

app.use(express.json()); // Para manejar datos JSON

// Ruta para subir videos al servicio Flask
app.post('/upload-video', (req, res) => {
    const video = req.body.video; // Aquí asumimos que el archivo viene en el body

    // Llama al servicio Flask para subir el video
    axios.post('http://localhost:5000/upload', { video })
    .then(response => {
        res.json(response.data);
    })
    .catch(error => {
        res.status(500).json({ error: error.message });
    });
});

// Ruta para obtener un video desde el servicio Flask
app.get('/video/:name', (req, res) => {
    const videoName = req.params.name;

    // Llama al servicio Flask para obtener el video
    axios.get(`http://localhost:5000/video/${videoName}`, { responseType: 'stream' })
    .then(response => {
        response.data.pipe(res); // Pasa el stream del video al cliente
    })
    .catch(error => {
        res.status(404).json({ error: 'Video not found' });
    });
});

// Ruta para descargar un video como adjunto
app.get('/download-video/:name', (req, res) => {
    const videoName = req.params.name;

    // Llama al servicio Flask para descargar el video
    axios.get(`http://localhost:5000/download/${videoName}`, { responseType: 'stream' })
    .then(response => {
        response.data.pipe(res);
    })
    .catch(error => {
        res.status(404).json({ error: 'Video not found' });
    });
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
