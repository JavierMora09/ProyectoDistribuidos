document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Llama al servicio SOAP para autenticar al usuario
        const response = await fetch('http://localhost:5000/soap/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Si la autenticación es exitosa, almacenar el token
            localStorage.setItem('authToken', data.token);
            document.getElementById('message').innerText = '¡Bienvenido!';
            // Aquí puedes redirigir al usuario a otra parte de la aplicación
        } else {
            document.getElementById('message').innerText = data.error || 'Error en la autenticación';
        }
    } catch (error) {
        document.getElementById('message').innerText = 'Error de conexión';
    }
});
