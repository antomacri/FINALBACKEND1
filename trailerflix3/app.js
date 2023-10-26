const express = require('express');
const app = express();
const port = process.env.PORT || 3008;
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Archivo = "trailerflix.json";
dotenv.config();
let LeerDatos = function () {
  let rawdata = fs.readFileSync(Archivo);
  let Datos = JSON.parse(rawdata);
  
  return Datos;
};
// Inicializamos  el Motor de plantillas elegido 
app.set('view engine', 'ejs');
app.use(express.static('views'))
app.use(express.static(path.join(__dirname,'views')))
// Configurar la ubicación de las vistas (plantillas)
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
const peliculas =LeerDatos()

//  Endpoint para la ruta raíz

app.get('/', (req, res) => {
  const welcomeMessage = '<h1>Bienvenido a TrailerFlix</h1>';
 
  res.send(welcomeMessage);
 });



app.get("/inicio", (req, res) => {
  // TRAILERFLIX es JSON con las rutas de las imágenes y las URL de los trailers
  res.render('inicio', {catalogo: peliculas });
  
});
//Renderiza la vista de index.ejs

app.get('/index',(req,res)=>{
res.render('index');{ catalogo: TRAILERFLIX}

});


// Endpoint para listar el catálogo completo
app.get('/catalogo', (req, res) => {
    res.render('catalogo', { catalogo: TRAILERFLIX });
  });


// Ruta para  la búsqueda
app.get('/buscar', (req, res) => {
  const query = req.query.q.toLowerCase();
  const results = TRAILERFLIX.filter((item) =>
    item.titulo.toLowerCase().includes(query));
  res.json({ resultados: results, query: query });
  console.log("Se ha llamado a la ruta de búsqueda");
});

// Endpoint para buscar por título
app.get('/titulo/:title', (req, res) => {
    const titleParam = req.params.title.toLowerCase();
    const filteredContent = TRAILERFLIX.filter(item => item.titulo.toLowerCase().includes(titleParam));
    res.json(filteredContent);
  });
  
  // Endpoint para buscar por categoría
  app.get('/categoria/:cat', (req, res) => {
    const categoryParam = req.params.cat.toLowerCase();
    const filteredContent = TRAILERFLIX.filter(item => item.categoria.toLowerCase() === categoryParam);
    res.json(filteredContent);
  });
  
  // Endpoint para buscar por actor/actriz en el reparto
  app.get('/reparto/:act', (req, res) => {
    const actorParam = req.params.act.toLowerCase();
    const filteredContent = TRAILERFLIX.filter(item => item.reparto.toLowerCase().includes(actorParam));
    res.json(filteredContent);
  });
  
  // Endpoint para obtener la URL del tráiler
  app.get('/trailer/:id', (req, res) => {
    const idParam = req.params.id;
    const movie = TRAILERFLIX.find(item => item.id === idParam);
    if (movie) {
      if (movie.trailer) {
        res.json({ url: movie.trailer });
      } else {
        res.json({ message: 'Tráiler no disponible para esta película/serie' });
      }
    } else {
      res.status(404).json({ error: 'Película/serie no encontrada' });
    }
  });
  

// Aquí puedes agregar los demás endpoints según las búsquedas requeridas

app.listen(port, () => {
  console.log(`Servidor web en http://localhost:${port}`);
});