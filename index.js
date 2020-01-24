var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
let uuid = require('uuid');
var jsonParser = bodyParser.json();

var app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    if (req.method === "OPTIONS") {
        return res.send(204);
    }
    next();
})

app.use(express.static('public'));
app.use(morgan('dev'));

let comentarios = [{
    id: uuid.v4(),
    titulo: "Primer comentario",
    contenido: "Este es el primer comentario",
    autor: "Fulano",
    fecha: new Date(1996, 11, 06)//"1996-12-06"
}, {
    id: uuid.v4(),
    titulo: "Segundo comentario",
    contenido: "Este es el segundo comentario",
    autor: "Mangano",
    fecha: new Date(1996, 11, 07)//"1996-12-07"
}];

app.get('/blog-api/comentarios', (req, res) => {

    return res.status(200).json(comentarios);


});

app.get('/blog-api/comentarios-por-autor', (req, res) => {
    var autor = req.query.autor;
    if (autor) {
        let result = comentarios.filter((elemento) => {
            if (elemento.autor == autor) {
                return elemento;
            }
        });

        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            res.statusMessage = 'No hay comentarios del autor especificado';
            return res.status(404).send();
        }

    }
    else {
        res.statusMessage = 'Query string vacío';
        return res.status(406).send();
    }
});




app.post('/blog-api/nuevo-comentario', jsonParser, (req, res) => {
    console.log(req.body);
    /*let titulo = req.body.titulo;
    let autor = req.body.autor;
    let contenido = req.body.contenido;*/
    const { titulo, autor, contenido } = req.body;

    if (titulo && autor && contenido) {
        if (titulo != "" && autor != "" && contenido != "") {


            let comentario = {
                id: uuid.v4(),
                titulo: titulo,
                contenido: contenido,
                fecha: new Date(),
                autor: autor
            }

            comentarios.push(comentario);
            return res.status(201).json(comentario);


        }
    } else {
        res.statusMessage = 'Campos incompletos';
        return res.status(406).send();
    }

});


app.put('/blog-api/actualizar-comentario/:id', jsonParser, (req, res) => {
    console.log(req.body)
    let titulo = req.body.titulo;
    let autor = req.body.autor;
    let contenido = req.body.contenido;
    let fecha = req.body.fecha;
    let id = req.params.id;
    let idBody = req.body.id;
    if (id) {
        if (titulo || autor || contenido) {
            if (idBody == id) {


                var ind;
                let result = comentarios.find((elemento, index) => {
                    if (elemento.id == id) {
                        ind = index;
                        return elemento;
                    }
                });




                if (result) {
                    if (contenido) {
                        comentarios[ind].contenido = contenido;
                    }

                    if (autor) {
                        comentarios[ind].autor = autor;
                    }
                    if (titulo) {
                        comentarios[ind].titulo = titulo;
                    }
                    comentarios[ind].fecha = fecha;
                    return res.status(202).json(comentarios[ind]);
                } else {
                    res.statusMessage = 'El comentario no existe'
                    return res.status(404).send();
                }
            } else {
            res.statusMessage = 'ID no coincide';
                return res.status(409).send();
            }
        }
        else {
            res.statusMessage = 'Campos vacios';
            return res.status(406).send();
        }
    } else {
        res.statusMessage = 'ID vacio';
        return res.status(406).send();
    }
});



app.delete('/blog-api/remover-comentario/:id', jsonParser, (req, res) => {
    let id = req.params.id;

    var ind;

    if (id) {
        let result = comentarios.find((elemento, index) => {
            if (elemento.id == id) {
                ind = index;
                return elemento;
            }
        });

        if (result) {
            comentarios.splice(ind, 1);
            return res.status(204).json({});
        } else {
            res.statusMessage = 'El comentario no existe';
            return res.status(404).send();
        }
    } else {
        res.statusMessage = 'ID vacio';
        return res.status(409).send();
    }
});

app.listen(8080, () => {
    console.log('Servidor corriendo en puerto 8080.');
});


