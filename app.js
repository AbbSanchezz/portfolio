const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });

app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

const bcryptjs = require('bcryptjs');

const session = require('express-session');
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

const connection = require('./database/db.js')

app.get('/', (req, res) => {
  const queryEstudios = 'SELECT * FROM estudios';
  const queryTecnologias = 'SELECT * FROM tecnologias';
  const queryProyectos = 'SELECT * FROM proyectos';

  const resultados = {};

  // Realizar las consultas a las tres tablas
  connection.query(queryEstudios, (errorEstudios, resultadosEstudios) => {
    if (errorEstudios) {
      console.error('Error al obtener los datos de la tabla "estudios":', errorEstudios.stack);
      res.sendStatus(500); // Envía una respuesta de error al cliente
      return;
    }

    resultados.estudios = resultadosEstudios;

    connection.query(queryTecnologias, (errorTecnologias, resultadosTecnologias) => {
      if (errorTecnologias) {
        console.error('Error al obtener los datos de la tabla "tecnologias":', errorTecnologias.stack);
        res.sendStatus(500); // Envía una respuesta de error al cliente
        return;
      }

      resultados.tecnologias = resultadosTecnologias;

      connection.query(queryProyectos, (errorProyectos, resultadosProyectos) => {
        if (errorProyectos) {
          console.error('Error al obtener los datos de la tabla "proyectos":', errorProyectos.stack);
          res.sendStatus(500); // Envía una respuesta de error al cliente
          return;
        }

        resultados.proyectos = resultadosProyectos;

        res.render('index', { datos: resultados }); // Renderiza la vista EJS y pasa todos los datos combinados en un solo objeto llamado 'datos'
      });
    });
  });
});

app.get('/login', (req, res) => {
  res.render('login');
})

app.get('/register', (req, res) => {
  res.render('register');
})

app.get('/panel', (req, res) => {
  res.render('panel');
})

app.get('/estudios', (req, res) => {
  res.render('estudios');
})

app.get('/proyectos', (req, res) => {
  res.render('proyectos');
})

app.get('/tecnologias', (req, res) => {
  res.render('tecnologias');
})

app.get('/eliminarEstudios', (req, res) => {
  const queryEstudios = 'SELECT * FROM estudios';
  const resultados = {};
  connection.query(queryEstudios, (errorEstudios, resultadosEstudios) => {
    if (errorEstudios) {
      console.error('Error al obtener los datos de la tabla "estudios":', errorEstudios.stack);
      res.sendStatus(500); // Envía una respuesta de error al cliente
      return;
    }
    resultados.estudios = resultadosEstudios;
    res.render('eliminarEstudios', { datos: resultados });
  })
})

app.get('/actEstudios', (req, res) => {
  const queryEstudios = 'SELECT * FROM estudios';
  const resultados = {};
  connection.query(queryEstudios, (errorEstudios, resultadosEstudios) => {
    if (errorEstudios) {
      console.error('Error al obtener los datos de la tabla "estudios":', errorEstudios.stack);
      res.sendStatus(500); // Envía una respuesta de error al cliente
      return;
    }
    resultados.estudios = resultadosEstudios;
    res.render('actEstudios', { datos: resultados });
  })
})

app.get('/eliminarProyectos', (req, res) => {
  const queryProyectos = 'SELECT * FROM proyectos';
  const resultados = {};
  connection.query(queryProyectos, (errorProyectos, resultadosProyectos) => {
    if (errorProyectos) {
      console.error('Error al obtener los datos de la tabla "proyectos":', errorProyectos.stack);
      res.sendStatus(500); // Envía una respuesta de error al cliente
      return;
    }

    resultados.proyectos = resultadosProyectos;
    res.render('eliminarProyectos', { datos: resultados });
  })
})

app.get('/actProyectos', (req, res) => {
  const queryProyectos = 'SELECT * FROM proyectos';
  const resultados = {};
  connection.query(queryProyectos, (errorProyectos, resultadosProyectos) => {
    if (errorProyectos) {
      console.error('Error al obtener los datos de la tabla "proyectos":', errorProyectos.stack);
      res.sendStatus(500); // Envía una respuesta de error al cliente
      return;
    }
    resultados.proyectos = resultadosProyectos;
    res.render('actProyectos', { datos: resultados });
  })
})

app.get('/eliminarTecnologias', (req, res) => {
  const queryTecnologias = 'SELECT * FROM tecnologias';
  const resultados = {};
  connection.query(queryTecnologias, (errorTecnologias, resultadosTecnologias) => {
    if (errorTecnologias) {
      console.error('Error al obtener los datos de la tabla "tecnologias":', errorTecnologias.stack);
      res.sendStatus(500); // Envía una respuesta de error al cliente
      return;
    }

    resultados.tecnologias = resultadosTecnologias;
    res.render('eliminarTecnologias', { datos: resultados });
  })
})

app.get('/actTecnologias', (req, res) => {
  const queryTecnologias = 'SELECT * FROM tecnologias';
  const resultados = {};

  connection.query(queryTecnologias, (errorTecnologias, resultadosTecnologias) => {
    if (errorTecnologias) {
      console.error('Error al obtener los datos de la tabla "tecnologias":', errorTecnologias.stack);
      res.sendStatus(500); // Envía una respuesta de error al cliente
      return;
    }

    resultados.tecnologias = resultadosTecnologias;
    res.render('actTecnologias', { datos: resultados });
  })
})


app.post('/register', async (req, res) => {
  const user = req.body.user;
  const name = req.body.name;
  const rol = req.body.rol;
  const pass = req.body.pass;
  let passwordHassh = await bcryptjs.hash(pass, 8);
  connection.query('INSERT INTO users set ?', { user: user, name: name, rol: rol, pass: passwordHassh }, async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.render('register', {
        alert: true,
        alertTitle: "Registro",
        alertMessage: "Registro exitoso!",
        alertIcon: 'success',
        showConfirmButton: false,
        timer: 1500,
        ruta: ''
      });
    }
  });
});

app.post('/auth', async (req, res) => {
  const user = req.body.user;
  const pass = req.body.pass;
  let passwordHassh = await bcryptjs.hash(pass, 8);
  if (user && pass) {
    connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results) => {
      if (results.length == 0 || !await bcryptjs.compare(pass, results[0].pass)) {
        res.render('login', {
          alert: true,
          alertTitle: "Error",
          alertMessage: "Usuario y/o contraseña incorrectos",
          alertIcon: 'error',
          showConfirmButton: true,
          timer: false,
          ruta: 'login'
        });
      }
      else {
        req.session.loggedin = true;
        req.session.name = results[0].name
        res.render('login', {
          alert: true,
          alertTitle: "Conexion exitosa",
          alertMessage: "Login correcto!",
          alertIcon: 'success',
          showConfirmButton: false,
          timer: 1500,
          ruta: 'panel'
        });
      }

    })
  } else {
    res.render('login', {
      alert: true,
      alertTitle: "Error",
      alertMessage: "Por favor ingrese usuario y contraseña",
      alertIcon: 'warning',
      showConfirmButton: true,
      timer: false,
      ruta: 'login'
    });
  }
});

app.post('/estudios', async (req, res) => {
  const titulo = req.body.titulo;
  const anio = req.body.anio;
  const institucion = req.body.institucion;
  connection.query('INSERT INTO estudios set ?', { titulo: titulo, anio: anio, institucion: institucion }, async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.redirect('/');
    }
  });
});

app.post('/proyectos', async (req, res) => {
  const tituloProyecto = req.body.tituloProyecto;
  const anioProyecto = req.body.anioProyecto;
  const descripcionProyecto = req.body.descripcionProyecto;
  // const fotoProyecto = fotoProyecto;
  connection.query('INSERT INTO proyectos set ?', { titulo: tituloProyecto, anio: anioProyecto, descripcion: descripcionProyecto }, async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.redirect('/');
    }
  });
});

app.post('/tecnologias', async (req, res) => {
  const tituloTecnologia = req.body.tituloTecnologia;
  const descripcionTecnologia = req.body.descripcionTecnologia;
  connection.query('INSERT INTO tecnologias set ?', { titulo: tituloTecnologia, descripcion: descripcionTecnologia }, async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.redirect('/');
    }
  });
});

app.post('/eliminarEstudios', async (req, res) => {
  const id = req.body.id;
  connection.query('DELETE FROM estudios WHERE id = ?', [id], async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.redirect('/');
    }
  });
});

app.post('/actEstudios', async (req, res) => {
  const titulo = req.body.titulo;
  const anio = req.body.anio;
  const institucion = req.body.institucion;
  const id = req.body.id;
  connection.query(
    'UPDATE estudios SET titulo = ?, anio = ?, institucion = ? WHERE id = ?',
    [titulo, anio, institucion, id],
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect('/');
      }
    }
  );
});


app.post('/eliminarProyectos', async (req, res) => {
  const id = req.body.id;
  connection.query('DELETE FROM proyectos WHERE id = ?', [id], async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.redirect('/');
    }
  });
});


app.post('/actProyectos', async (req, res) => {
  const tituloProyecto = req.body.tituloProyecto;
  const anioProyecto = req.body.anioProyecto;
  const descripcionProyecto = req.body.descripcionProyecto;
  const id = req.body.id;
  connection.query(
    'UPDATE proyectos SET titulo = ?, anio = ?, descripcion = ? WHERE id = ?',
    [tituloProyecto, anioProyecto, descripcionProyecto, id],
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect('/');
      }
    }
  );
});


app.post('/eliminarTecnologias', async (req, res) => {
  const id = req.body.id;
  connection.query('DELETE FROM tecnologias WHERE id = ?', [id], async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.redirect('/');
    }
  });
});

app.post('/actTecnologias', async (req, res) => {
  const tituloTecnologia = req.body.tituloTecnologia;
  const descripcionTecnologia = req.body.descripcionTecnologia;
  const id = req.body.id;
  connection.query(
    'UPDATE tecnologias SET titulo = ?, descripcion = ? WHERE id = ?',
    [tituloTecnologia, descripcionTecnologia, id],
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect('/');
      }
    }
  );
});



app.listen(3000, (req, res) => {
  console.log("servidor en 3000");
})