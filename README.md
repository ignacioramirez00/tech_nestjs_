# Challenge API con NESTJS :computer:	

![](https://www.patferraggi.dev/_next/image?url=%2Fassets%2Fblog%2F2021%2Fmar%2Fnestjs-esta-bueno%2Fcover.jpeg&w=1920&q=75)

## 1 Descripcion
Esta es una aplicacion Backend desarrollada con Node.Js, TypeScript y el framework [Nest](https://nestjs.com/ "Nest"). La aplicacion se encuentra dockerizada 

## 2 Instalación 
### 2.1 Clonar el repositorio
```
https://github.com/ignacioramirez00/tech_nestjs_.git
```
### 2.2 Configuracion de la aplicación Dockerizada   
![](https://img.icons8.com/?size=100&id=cdYUlRaag9G9&format=png&color=000000)

Este proyecto utiliza un archivo docker-compose.yml que define dos servicios: `demo-server` (una aplicación Node.js construida desde un Dockerfile) y `fudo_db_docker` (una base de datos PostgreSQL). Ambos servicios se comunican a través de la red predeterminada creada automáticamente por Docker. Al ejecutar docker-compose up, Docker construye y pone en marcha los contenedores, garantizando la persistencia de los datos con un volumen para la base de datos (postgresql-volume). Además, la base de datos se inicializa con un script SQL personalizado (init.sql).

#### 1°)  Configurar las variables de entorno que necesita la aplicacion para ejecutar

A continuación, procederemos a configurar las variables de entorno del proyecto, para esto hay un archivo llamado .env.example en la raíz del proyecto. Debemos hacer una copia de este archivo y renombrarla a .env. Después procederemos a poner la configuración correcta según las nuestras necesidades

```
PORT=3000

#Config database
DB_HOST=fudo_db_docker
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=postgres1234
DB_NAME=fudodb_docker

#Auth
HASH_SECRET=10
JWT_SECRET=fudochallenge
JWT_EXPIRES=5m
```

**En mi caso el .env creado en mi local fue exactamente el mismo ya que lo puertos e informacion del docker-compose.yml hicieron uso de esa informacion.**


#### 2°) Ejecucion de migraciones (Explicacion de funcionamiento)

Se hizo uso de [ TypeORM](https://typeorm.io/ " TypeORM") , un ORM para facilitar las interacciones entre la aplicacion y la base de datos. Mediante el uso de esta herramienta se pudo generar migraciones a partir de los cambios realizados en la entidades de la aplicación

Para el siguiente proyecto se optó que la migracion se corra al comienzo de la generacion de la imagen de node (obviamente dependiendo de la generacion de la base de datos que hace el service: `fudo_db_docker`)

Este tipo de desición se hizo debido a que luego de correr el docker-compose up --build se realiza la ejecucion del programa
y al instante se ejecuta una post a una API de fudo, resultado en la incorporacion al inicion de informacion proveniente de un json entrante en la base de datos de la aplicacion (punto extra del challenge).  Es por eso que para realizar la operacion la migracion ya debe estar creada dentro de la aplicación. 

#### 3°) Ejecucion de docker-compose.yml

```
docker-compose up --build
```

## 3. Ejecucion de la aplicacion

###### En modo desarrollo:

Nestjs ofrece dos versiones de desarrollo, pero la que comúnmente se usa es la de "watch mode", ya que permite ver los cambios en vivo, si necesidad de detener y ejecutar de nuevo el servidor

```
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## 4. Test de endpoints

#### ACLARACIÓN IMPORTANTE: 
A cada ruta que requiera de autenticacion se requiere pasar como headers  llamado **fudo_token** con el token
correspondiente del usuario.

### Autenticacion: (POST)  `localhost:3000/auth/login`

a. Autenticación: recibe un usuario y una contraseña y genera un token que luego servirá para autenticarse contra los otros endpoints. Bonus: si no usas librerías de autenticación (Devise, Auth0, Passport, etc).  ***esta ruta es publica*** :unlock:

**json de entrada:**

```
{
    "password":"prueba123",
    "username":"ignacio"
}
```

**Respuesta: **
```
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE3ZjA5ZmVmLTM5YmUtNGY3MC04NjVjLWM1MTRiNWE5N2M1NCIsInVzZXJuYW1lIjoianVhbmkiLCJlbWFpbCI6Imp1YW4xMjNAZ21haWwuY29tIiwiaWF0IjoxNzMyNzMyODMxLCJleHAiOjE3MzI3MzMxMzF9.nrviNIFx9KZ3b9bBx_uQZjG2R0ol3lDdMm0qh_ScGh8"
}
```


### Registro (POST)   `localhost:3000/user/register`
b. Registro: Lo que realiza este endpoint es el registro de una usuario, de esta forma podra realizar el login para
tener acceso a las demas operaciones. ***esta ruta es publica*** :unlock:

**json de entrada:**
```
{
    "name":"juan",
    "lastname":"perez",
    "username":"juani",
    "email":"juan123@gmail.com",
    "password": "hola123"
}
```

**Respuesta: **

```
{
    "name": "juan",
    "lastname": "perez",
    "username": "juani",
    "email": "juan123@gmail.com",
    "password": "$2b$10$.vFugR4DTKSZ8sfYXAcLreHMKFR/ixVxm0yPX65bcuduhREUk.TDe",
    "createdAt": "2024-11-27T18:37:12.333Z",
    "updatedAt": "2024-11-27T18:37:12.333Z",
    "id": "a7f09fef-39be-4f70-865c-c514b5a97c54"
}
```

### Creacion de productos (POST)   `localhost:3000/products/create`

c. Creación de productos: permite crear un producto. Este endpoint requiere autenticación. Bonus: si la creación del producto es asincrónica.  ***es una ruta protegida***  :lock:

**json de entrada:**

```
{
    "name":"heladera"
}
```

**Respuesta:**
```
{
    "name": "heladera",
    "user_create_product_fk": "a7f09fef-39be-4f70-865c-c514b5a97c54",
    "external_id": null,
    "createdAt": "2024-11-27T18:40:52.237Z",
    "updatedAt": "2024-11-27T18:40:52.237Z",
    "id": 3,
    "api_fudo_syncronized": false
}
```

### Consulta de todos los productos (GET) `  localhost:3000/products/`

d. Consulta de productos: devuelve un listado de los productos existentes. Este endpoint requiere autenticación. Devuelve 
todos los productos que existen ***es una ruta protegida***  :lock:

**Respuesta:**

```
[
    {
        "id": 1,
        "name": "Apple"
    },
    {
        "id": 2,
        "name": "ddfd"
    }
]
```


### Consulta de productos segun el usuario ingresado (GET)   `localhost:3000/products/id`

e. La diferencia con el anterior es que devuelve segun el usuario que este ingresado ***es una ruta protegida***  :lock:


**Respuesta: **
```
{
    "user": {
        "username": "ignacio",
        "name": "a",
        "lastname": "valen123"
    },
    "products": []
}
```

### Sincronizacion de productos con una api externa (hecho)

la lista de productos almacenada podrá sincronizarse con una API de productos externa, agregando los productos que la misma retorna al listado inicial, al momento de correr la aplicación por primera vez. Esta API externa fue elaborada por el equipo de Fudo para este challenge y tiene un solo endpoint, el cuál devuelve un listado de productos con un id y un nombre. A continuación, te dejamos un CURL de ejemplo:

 ```
 curl -X POST -H "Content-Type: application/json"
https://23f0013223494503b54c61e8bee1190c.api.mockbin.io/
```

Como dije anteriormente esta operacion se va ejecutar la primera vez que se corra el programa 
por medio de una operacion que al detectar la inicializacion de un servicio, realizará de forma automatica
la operacion de sincronización.

## 5. Test unitarios

Para ejecutar los test unitarios
```
npm run test
```
De esta forma el programa va detectar los archivos .spec.ts para ejecutar las operaciones.

**En este caso realicé una prueba unitaria para un metodo del servicio de usuario, donde consiste
detectar el metodo registeruser. Mediante dos casos de test, uno "final feliz" y otro de error. Consiste determinar
el comportamiento de register ante la ausencia del email o la existencia del mismo. Por lo tanto con el uso de mock y 
simulacion del modulo se puede determinar como actua el caso.**






