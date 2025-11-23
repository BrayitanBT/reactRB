# 🍽️ Backend RestauranteRB

Backend del sistema **RestauranteRB**, desarrollado en **PHP (MVC)** con **PDO**, **sesiones** y una **API REST** consumida por un frontend en React.  
Funciona en **XAMPP**, dentro de la carpeta `htdocs`.

---

# 📑 Tabla de Contenido

1. [Descripción General](#-descripción-general)
2. [Estructura del Proyecto](#-estructura-del-proyecto)
3. [Base de Datos](#-base-de-datos)
4. [Autenticación](#-autenticación)
5. [Endpoints](#-endpoints)
   - [Auth](#auth)
   - [Usuarios](#usuarios)
   - [Productos](#productos)
   - [Órdenes](#órdenes)
   - [Carrito](#carrito)
   - [Administración](#administración)
6. [Configuración e Instalación](#-configuración-e-instalación)
7. [Seguridad](#-seguridad)
8. [Flujo de una Orden](#-flujo-de-una-orden)
9. [Respuestas de la API](#-respuestas-de-la-api)
10. [Uso con React](#-uso-con-react)
11. [Solución de Problemas](#-solución-de-problemas)
12. [Soporte](#-soporte)

---

# 📋 Descripción General
Este backend implementa la lógica central del sistema RestauranteRB.  
Incluye:

- PHP + PDO con patrón **Modelo-Vista-Controlador**
- **Sesiones PHP** para autenticación persistente
- **Roles** (admin / cliente)
- **API REST** para React
- **CRUD completo** de usuarios, productos, órdenes y establecimientos

---

# 🏗️ Estructura del Proyecto

backend/
├── app/
│ ├── config/
│ │ └── config.php
│ ├── controllers/
│ │ ├── AdminController.php
│ │ ├── AuthController.php
│ │ ├── CartController.php
│ │ ├── OrderController.php
│ │ ├── ProductController.php
│ │ └── UserController.php
│ ├── models/
│ │ ├── Database.php
│ │ ├── Establecimiento.php
│ │ ├── Order.php
│ │ ├── Pagos.php
│ │ ├── Product.php
│ │ └── User.php
│ └── restauranteRB.sql
└── public/
└── index.php

yaml
Copy code

---

# 🗄️ Base de Datos

Incluye las tablas:

- `usuarios`
- `productos`
- `ordenes`
- `pagos`
- `establecimientos`
- `orden_producto`
- `orden_establecimiento`

### Estructura de usuario (resumen)
- id  
- nombre  
- apellido  
- documento  
- correo  
- teléfono  
- contraseña (hash)  
- tipo_usuario  

---

# 🔐 Autenticación

El sistema utiliza:

- **Sesiones PHP**
- `password_hash()` y `password_verify()`
- Roles: **admin** y **cliente**

### Helpers:
- `isLoggedIn()`
- `isAdmin()`
- `getCurrentUser()`

---

# 🚀 Endpoints

## Auth
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | /signup | Registrar usuario | Público |
| POST | /login | Iniciar sesión | Público |
| POST | /logout | Cerrar sesión | Autenticado |
| GET | /check-session | Verificar sesión | Público |

---

## Usuarios
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | /profile | Perfil del usuario | Autenticado |

---

## Productos
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | /products | Listar productos | Público |
| POST | /products | Crear producto | Admin |
| PUT | /products | Actualizar producto | Admin |
| DELETE | /products/{id} | Eliminar producto | Admin |

---

## Órdenes
| Método | Endpoint | Descripción | Acceso |
|--------|-----------------|-------------|--------|
| GET | /orders/user | Órdenes del usuario | Autenticado |
| GET | /orders | Todas las órdenes | Admin |
| POST | /orders | Crear orden | Autenticado |
| GET | /orders/{id} | Ver detalle | Admin / dueño |

---

## Carrito
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /cart | Obtener carrito |
| POST | /cart/add | Agregar producto |
| POST | /cart/remove | Eliminar producto |
| POST | /cart/clear | Vaciar carrito |

---

## Administración
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /admin/users | Listar usuarios |
| PUT | /admin/users | Actualizar usuario |
| DELETE | /admin/users/{id} | Eliminar usuario |
| GET | /admin/establecimientos | Listar establecimientos |
| POST | /admin/establecimientos | Crear establecimiento |
| PUT | /admin/establecimientos | Actualizar establecimiento |
| DELETE | /admin/establecimientos/{id} | Eliminar establecimiento |

---

# 🔧 Configuración e Instalación

### Requisitos
- PHP 8+
- MySQL 5.7+
- XAMPP

### Instalación

1. Colocar el proyecto dentro de:
C:/xampp/htdocs/backend/

sql
Copy code

2. Configurar credenciales en `app/config/config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'RestauranteRB');
define('DB_USER', 'root');
define('DB_PASS', '');
Importar SQL:

bash
Copy code
mysql -u root -p RestauranteRB < app/restauranteRB.sql
Habilitar CORS para React:

php
Copy code
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
🛡️ Seguridad
Implementado:

Hash de contraseñas

Sanitización de datos

PDO con consultas preparadas

Roles por sesión

Cookies httpOnly

Protección básica contra CSRF (acciones sensibles por sesión)

Recomendado para producción:

HTTPS obligatorio

Variables de entorno

Deshabilitar errores visibles

Cambiar usuario/password de MySQL

Rate limiting

📝 Flujo de una Orden
El usuario agrega productos al carrito (guardado en sesión).

Envía POST /orders con:

json
Copy code
{
  "productos": [{ "id": 5, "cantidad": 2 }],
  "tipo_pago": "efectivo",
  "total": 16000
}
El backend crea:

Registro en pagos

Registro en ordenes

Registros en orden_producto

Relación con establecimiento

Todo se ejecuta dentro de una transacción PDO.

🔄 Respuestas de la API
Éxito
json
Copy code
{
  "message": "Operación exitosa",
  "data": {}
}
Error
json
Copy code
{
  "message": "Error descriptivo"
}
🚀 Uso con React
js
Copy code
const API_URL = 'http://localhost/backend/public/index.php';

const response = await fetch(`${API_URL}?url=login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify(credentials)
});
🐛 Solución de Problemas
Sesiones no persisten
Revisar session_start()

Configurar CORS correctamente

Permitir cookies en el navegador

“Acceso denegado”
Solo admin puede ejecutar la acción

La sesión pudo expirar

Error de MySQL
Revisar credenciales en config.php

Confirmar tablas presentes

Verificar que MySQL está iniciado

📞 Soporte
Revisar logs del servidor

Verificar configuración de base de datos

Confirmar permisos de archivos