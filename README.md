# User Authentication API

API REST para gestión de usuarios con autenticación y autorización basada en roles (`admin` y `user`), desarrollada en **.NET 8**.

## 🚀 Características

* **Login y Registro**: Autenticación de usuarios con JWT.
* **Gestión de Usuarios**: Crear, actualizar, eliminar y consultar usuarios.
* **Roles y permisos**: Acceso a rutas basado en roles (`admin` y `user`).
* **Protección de rutas**: Uso de `[Authorize]` y `[Authorize(Roles = "...")]`.
* **Documentación**: Swagger para probar endpoints.

---

## 📋 Requisitos Previos

* [.NET SDK 8.0](https://dotnet.microsoft.com/en-us/download)
* SQL Server (local o remoto)
* Visual Studio 2022 o superior / VS Code

---


## 🛠️ Inicializar la base de datos

Antes de ejecutar la API, importar la base de datos que esta en el script que se encuentra
dentro de la carpeta **ScriptsDB** en el proyecto llamado `UserAuthDb.bacpac`

- Pasos para importar el archivo .bacpac en SQL Server Management Studio (SSMS):
  1. Abre SQL Server Management Studio (SSMS) y conéctate a tu instancia de SQL Server.
  2. Haz clic derecho en la carpeta "Bases de datos" en el Explorador de objetos.
  3. Selecciona "Importar la aplicación de capa de datos".
  4. Clic en siguiente, dejamos marcado la opcion "Importar del disco local" y seleccionamos el archivo `UserAuthDb.bacpac` que esta dentro de la carpeta **ScriptsDB** en el proyecto.
  5. Sigue las instrucciones del asistente para completar la importación.
  6. Una vez importada, deberías ver la base de datos `UserAuthDb` en la lista de bases de datos.


---

## ⚙️ Configuración del proyecto

### Variables de entorno / `appsettings.json`

Configura la conexión a SQL Server en `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=TU_SERVIDOR;Database=UserAuthDb;User Id=TU_USUARIO;Password=TU_CONTRASEÑA;"
  } 
}
```

Cambia `TU_SERVIDOR`, `TU_USUARIO`, `TU_CONTRASEÑA` y `TU_CLAVE_SECRETA` según tu configuración.

---

## 🛠️ Ejecución del proyecto

1. **Clonar el repositorio**:

```bash
git clone https://github.com/CardonaSam1997/UserAuthenticationApi.git
```

2. **Abrir el proyecto en Visual Studio**

3. **Restaurar paquetes NuGet**:

```bash
dotnet restore
```

4. **Ejecutar la API**:

```bash
dotnet run
```

> Por defecto se ejecutará en `https://localhost:7099` o el puerto configurado en `launchSettings.json`.

---

## 📌 Endpoints Principales

### AuthController

| Método | Ruta                 | Descripción                       | Roles   |
| ------ | -------------------- | --------------------------------- | ------- |
| POST   | `/api/auth/login`    | Inicia sesión y retorna JWT       | Público |
| POST   | `/api/auth/register` | Registra un usuario y retorna JWT | Público |

### UserController

| Método | Ruta              | Descripción                                              | Roles       |
| ------ | ----------------- | -------------------------------------------------------- | ----------- |
| POST   | `/api/users`      | Crea un nuevo usuario                                    | admin       |
| GET    | `/api/users`      | Obtiene todos los usuarios (paginado, opcional `search`) | admin       |
| GET    | `/api/users/{id}` | Obtiene un usuario por su ID                             | user, admin |
| PUT    | `/api/users/{id}` | Actualiza un usuario                                     | user, admin |
| DELETE | `/api/users/{id}` | Elimina un usuario                                       | admin       |

---

## 🧪 Probar la API

* **Swagger**: Accede a `https://localhost:7099/swagger` para ver y probar todos los endpoints.
* **Postman**: Puedes crear una colección con los endpoints anteriores y añadir el header `Authorization: Bearer {token}` para probar los endpoints protegidos.
