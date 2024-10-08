const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Endpoint para subir archivos al servidor Python
app.post('/upload', (req, res) => {
    // Suponiendo que el archivo es enviado como parte del cuerpo de la petición
    const file = req.body.file; // Obtén el archivo del request

    // Llama al servicio de Flask para subir archivos
    axios.post('http://localhost:5000/upload', { file })
    .then(response => {
        res.json(response.data);
    })
    .catch(error => {
        res.status(500).json({ error: error.message });
    });
});

// Endpoint para obtener archivos del servidor Python
app.get('/files/:name', (req, res) => {
    const fileName = req.params.name;

    // Llama al servicio Flask para obtener el archivo
    axios.get(`http://localhost:5000/files/${fileName}`)
    .then(response => {
        res.send(response.data);
    })
    .catch(error => {
        res.status(404).json({ error: 'File not found' });
    });
});

// Endpoint para descargar archivos como adjunto
app.get('/download/:name', (req, res) => {
    const fileName = req.params.name;

    // Llama al servicio Flask para descargar el archivo
    axios.get(`http://localhost:5000/download/${fileName}`, { responseType: 'stream' })
    .then(response => {
        response.data.pipe(res);
    })
    .catch(error => {
        res.status(404).json({ error: 'File not found' });
    });
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
