import express from "express";
//recordar "type": "module", en package.json
//recordar "dev": "node --watch server.js"

import fs from "fs";
import { stringify } from "querystring";

const PORT = process.env.PORT || 3000

//guarda instancia de express en una variable, en este caso, app
const app=express() 

//incluido para leer documentos en la carpeta public del proyecto, en este caso el index.html
app.use(express.static('public'));
app.use(express.json())

app.get("/canciones",(req,res)=>{

    fs.readFile('repertorio.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al leer el archivo");
        }
        try {
            const obj = JSON.parse(data);
            res.json(obj);
        } catch (error) {
            console.error(error);
            return res.status(500).send("Error al parsear el archivo JSON");
        }
    });
})


app.post("/canciones",(req,res)=>{
    const cancion =req.body
    console.log(cancion);
    const canciones=JSON.parse(fs.readFileSync("repertorio.json"))
    canciones.push(cancion)
    console.log("por json",canciones);
    fs.writeFileSync("repertorio.json",JSON.stringify(canciones))

    console.log(req.body);
    res.json(req.body)
})

app.put("/canciones/:id", (req, res) => {
    const { id } = req.params;
    const nuevaCancion = req.body;
    let canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf8"));


        // Encuentra el índice del producto que se va a actualizar
        const indice = canciones.findIndex(cancion => parseInt(cancion.id) === parseInt(id));

        if (indice !== -1) { // Verifica si se encontró la cancion
            // Actualiza la cancion en el índice encontrado con la nueva información
            canciones[indice] = { ...canciones[indice], ...nuevaCancion };
    
            // Escribe los cambios en repertorio.json
            fs.writeFileSync("repertorio.json", JSON.stringify(canciones));
    
            // Envía una respuesta con la canción actualizada
            res.json(canciones[indice]);
        } else {
            // Si no se encuentra el producto, envía un error 404
            res.status(404).send("Canción no encontrada");
        }


    /* res.send("Listado de canciones actualizado") */

});

app.delete("/canciones/:id", (req, res) => {
    const { id } = req.params;
    let canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf8"));

        // Encuentra el índice del producto que se va a actualizar
        const indice = canciones.findIndex(cancion=>parseInt(cancion.id) === parseInt(id));
        console.log(indice);

        if (indice !== -1) { 
            canciones.splice(indice,1);
    
            // Escribe los cambios en repertorio.json
            fs.writeFileSync("repertorio.json", JSON.stringify(canciones));
    
            // Envía una respuesta con la canción actualizada
            res.json(canciones[indice]);
        } else {
            // Si no se encuentra la cancion, envía un error 404
            res.status(404).send("Canción no encontrada");
        }
});

/* app.put("/editar",(req,res)=>{
    
})
app.delete("/eliminar",(req,res)=>{
    
}) */

app.listen(PORT,console.log(`server on https//localhost:${PORT}`))