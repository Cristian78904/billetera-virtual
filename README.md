Es una aplicación web y móvil que funciona como una billetera digital. Permite a los usuarios gestionar su dinero de forma virtual: pueden registrarse, iniciar sesión, ver cuánto dinero tienen, enviar dinero a otros usuarios y consultar el historial de todos sus movimientos.

Imaginá que es como tener una billetera física pero dentro de tu celular o computadora. En lugar de llevar billetes, tenés un saldo digital que podés usar para hacer transferencias.

🛠️ ¿CÓMO ESTÁ CONSTRUIDA?
La aplicación está desarrollada con tres capas principales:

Capa	Tecnología	Qué hace
Frontend	React Native / Expo	Es lo que el usuario ve y usa. Interfaz con pantallas, botones, formularios.
Backend	Node.js / Express	Es el "cerebro" que procesa las peticiones, valida datos y aplica la lógica de negocio.
Base de Datos	MongoDB	Donde se guardan los usuarios, saldos y transacciones de forma permanente.
✨ FUNCIONALIDADES PRINCIPALES
1. REGISTRO Y LOGIN
El usuario crea una cuenta con nombre, email y contraseña. La contraseña se guarda encriptada (nadie puede verla). Luego puede iniciar sesión con su email y contraseña, y recibe un token que lo mantiene autenticado mientras usa la app.

2. CONSULTA DE SALDO
Una vez dentro, el usuario ve su saldo disponible en grande y en tiempo real. Cada vez que hace una transferencia, el saldo se actualiza automáticamente.

3. TRANSFERENCIAS
El usuario puede enviar dinero a otra cuenta. El sistema verifica que tenga saldo suficiente, descuenta el monto de su cuenta, lo suma a la cuenta destino y registra la operación en el historial. Todo con una confirmación previa para evitar errores.

4. HISTORIAL
Muestra todas las transacciones realizadas (transferencias enviadas, recibidas, etc.). Se pueden filtrar por tipo (ingresos/egresos) para facilitar la búsqueda.

5. PERFIL
El usuario puede ver y editar sus datos personales (nombre, teléfono), cambiar su contraseña y cerrar sesión.

🔐 SEGURIDAD
Contraseñas encriptadas: No se guardan en texto plano, sino con un cifrado que impide que alguien las lea.

Tokens JWT: Cada usuario recibe un token al iniciar sesión que "certifica" su identidad. Sin ese token, no se pueden hacer operaciones como transferencias o ver datos personales.

Validaciones: Tanto el frontend como el backend verifican que los datos ingresados sean correctos antes de procesarlos.

📂 ESTRUCTURA DEL PROYECTO

text
billetera-virtual/
├── backend/              # Servidor
│   ├── controllers/      # Lógica de cada funcionalidad
│   ├── models/           # Esquemas de la base de datos
│   ├── routes/           # Definición de endpoints (URLs)
│   └── server.js         # Punto de entrada del servidor
│
└── frontend/             # Aplicación visual
    ├── src/
    │   ├── screens/      # Pantallas (Login, Home, Transferencias...)
    │   └── services/     # Configuración para conectar con el backend
    └── App.js            # Componente principal

    
🚀 MI ROL
Fui el único desarrollador del proyecto. Esto implicó:

Diseñar la arquitectura general

Programar tanto el frontend como el backend

Configurar la base de datos

Implementar la seguridad (JWT, encriptación)

Probar y depurar errores

Documentar el proyecto

🎯 ¿QUÉ APRENDÍ?


Cómo construir una aplicación completa desde cero (full stack)

Integrar frontend, backend y base de datos

Crear APIs RESTful

Autenticación con JWT

Modelar datos en MongoDB

Trabajar con React Hooks

Manejar errores y depurar código

Utilizar herramientas profesionales como Git, Postman, Selenium

