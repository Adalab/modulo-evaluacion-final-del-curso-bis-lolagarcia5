// Servidor Express

// Para probar los ficheros estáticos del fronend, entrar en <http://localhost:4500/>
// Para probar el API, entrar en <http://localhost:4500/api/items>

// Imports

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require('dotenv').config()



// Arracar el servidor

const server = express();

// Configuración del servidor

server.use(cors());
server.use(express.json({limit: "25mb"}));

// Conexion a la base de datos

async function getConnection() {
  const connection = await mysql.createConnection(
    {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS,  // <-- Pon aquí tu contraseña o en el fichero /.env en la carpeta raíz
      database: process.env.DB_NAME || "Clase",
    }
  );

  connection.connect();

  return connection;
}



// Poner a escuchar el servidor

const port = process.env.PORT || 4500;
server.listen(port, () => {
  console.log(`Ya se ha arrancado nuestro servidor: http://localhost:${4500}/`);
});



// Endpoints
// obtener todos los libros
// GET/libros

server.get('/libros', async (req, res) => {

  const selectAllRec = 'SELECT * FROM libros_db';
  const conn = await getConnection();
  const [result] = await conn.query(selectAllRec);
  conn.end();
  res.json({
    info: {
      count: result.length,
    },
    results: result
  });
});


// Obtener un libro por su ID
//GET /libro/:id

server.get("/libros/:id", async (req, res) => {

  const id = req.params.id;
  const select = 'SELECT * FROM libros_db WHERE id = ?';
  const conn = await getConnection();
  const [result] = await conn.query(select, id);
  //console.log(result);
  conn.end();
  res.json(
    result[0]
  );
});

// añadir una nueva receta 
//POST / libros

server.post('/libros', async (req, res) => {
  const newbook = req.body
  try {
    const insert =
      'INSERT INTO libros_db (nombre, autor, paginas) VALUES (?,?,?)'
    const conn = await getConnection();
    const [result] = await conn.query(insert, [
      newbook.nombre,
      newbook.autor,
      newbook.paginas,
    ]);
    conn.end();
    res.json({
      success: true,
      id: result.insertId
    });
  } catch (error) {
    res.json({
      success: false,
      message: 'Ha ocurrido un error, revise los campos'
    });
  }
});

//Actualiza un libro existente
//PUT /libro/:id

server.put('/libros/:id', async (req, res) => {
  const libroid = req.params.id;
  const { nombrefront, autorfront, paginasfront } = req.body;
  try {
    const update = 'UPDATE libros_db SET nombre = ?, autor = ?, paginas = ? WHERE id= ?';
    const conn = await getConnection();
    const [result] = await conn.query(update, [
      nombrefront,
      autorfront,
      paginasfront,
      libroid
    ]);
    
    conn.end();
    res.json({
      success: true,
    });
  } catch (error) {
    req.json({
      success: false,
      message: 'Ha ocurrido un error, revise los campos'
    });
  }
});

//Eliminar un libro 
//DELETE /libro/:id 
server.delete('/libros/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const deleteSql = 'DELETE FROM libros_db WHERE id = ?'
    const conn = await getConnection();
    const [result] = await conn.query(deleteSql,[id])
    conn.end();
    res.json({
      success: true,
    });
  } catch (error) {
    res.json({
      success: false, 
      message: 'Ha ocurrido un error, revise los campos'
    });
  }
});