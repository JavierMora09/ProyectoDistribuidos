const express = require('express');
const axios = require('axios');
const soap = require('soap');  // Para comunicación SOAP
const bodyParser = require('body-parser'); // Para manejar el cuerpo de las peticiones

const app = express();
const port = 3000;

// Usar body-parser para analizar JSON
app.use(bodyParser.json());

// URL del servidor SOAP
const soapUrl = 'http://localhost/soap?wsdl';

// Ejemplo de autenticación con el servidor SOAP
app.post('/auth', (req, res) => {
    const { username, password } = req.body;

    soap.createClient(soapUrl, (err, client) => {
        if (err) return res.status(500).json({ error: 'Error al crear cliente SOAP' });

        client.autenticarUsuario({ username, password }, (err, result) => {
            if (err) return res.status(500).json({ error: 'Error en autenticación SOAP' });
            res.json(result);
        });
    });
});

// Endpoint para subir archivos al servicio en Python
app.post('/upload-file', (req, res) => {
    const file = req.body.file; // Suponiendo que el archivo es enviado en la petición

    axios.post('http://localhost:5000/upload', { file })
        .then(response => res.json(response.data))
        .catch(error => res.status(500).json({ error: error.message }));
});

// Endpoint para subir videos al servicio de videos en Python
app.post('/upload-video', (req, res) => {
    const video = req.body.video;  // Suponiendo que el video es enviado en la petición

    axios.post('http://localhost:5000/upload', { video })
        .then(response => res.json(response.data))
        .catch(error => res.status(500).json({ error: error.message }));
});

// Endpoint para descargar archivos
app.get('/download-file/:name', (req, res) => {
    const fileName = req.params.name;

    axios.get(`http://localhost:5000/download/${fileName}`, { responseType: 'stream' })
        .then(response => response.data.pipe(res))
        .catch(error => res.status(404).json({ error: 'Archivo no encontrado' }));
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor intermediario corriendo en http://localhost:${port}`);
});
