document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/soap/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            document.getElementById('message').innerText = '¡Bienvenido!';
            // Aquí puedes redirigir al usuario a otra parte de la aplicación
            // Por ejemplo, cargar la lista de archivos
            loadFiles();
        } else {
            document.getElementById('message').innerText = data.error || 'Error en la autenticación';
        }
    } catch (error) {
        document.getElementById('message').innerText = 'Error de conexión';
    }
});

// Función para cargar archivos desde el servicio
async function loadFiles() {
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch('http://localhost:5000/files', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const files = await response.json();
            displayFiles(files); // Muestra los archivos en la interfaz
        } else {
            console.error('Error al cargar archivos:', response.statusText);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
}

// Función para mostrar archivos en la interfaz
function displayFiles(files) {
    const filesList = document.createElement('ul');
    files.forEach(file => {
        const listItem = document.createElement('li');
        listItem.textContent = `${file.name} - ${file.size} KB`;
        filesList.appendChild(listItem);
    });
    document.body.appendChild(filesList); // O un contenedor específico en tu interfaz
}

// Función para subir archivos
async function uploadFile(file) {
    const token = localStorage.getItem('authToken');

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('http://localhost:5000/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Archivo subido:', result);
            loadFiles(); // Vuelve a cargar la lista de archivos
        } else {
            console.error('Error al subir archivo:', response.statusText);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
}
