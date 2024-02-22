import express from "express";
//recordar "type": "module", en package.json
//recordar "dev": "node --watch server.js"

import fs from "fs";
import { stringify } from "querystring";

const PORT = process.env.PORT || 3000

//guarda instancia de express en una variable, en este caso, app
const app=express() 

app.use(express.json())

app.get("/",(req,res)=>{
    const {id, nombre, precio} = req.query
    console.log(req.query);
    res.json(req.query)
})

app.post("/canciones",(req,res)=>{
    const producto =req.body
    const productos=JSON.parse(fs.readFileSync("repertorio.json"))
    productos.push(producto)
    console.log("por json",productos);
    fs.writeFileSync("repertorio.json",JSON.stringify(productos))

    console.log(req.body);
    res.json(req.body)
})

app.put("/canciones/:id", (req, res) => {
    const { id } = req.params;
    const nuevaCancion = req.body;
    let productos = JSON.parse(fs.readFileSync("repertorio.json", "utf8"));


        // Encuentra el índice del producto que se va a actualizar
        const indice = productos.findIndex(producto => producto.id === id);
        console.log(indice);

        if (indice !== -1) { // Verifica si se encontró el producto
            // Actualiza el producto en el índice encontrado con la nueva información
            productos[indice] = { ...productos[indice], ...nuevaCancion };
    
            // Escribe los cambios en repertorio.json
            fs.writeFileSync("repertorio.json", JSON.stringify(productos));
    
            // Envía una respuesta con la canción actualizada
            res.json(productos[indice]);
        } else {
            // Si no se encuentra el producto, envía un error 404
            res.status(404).send("Canción no encontrada");
        }


    /* res.send("Listado de canciones actualizado") */

});
app.delete("/canciones/:id", (req, res) => {
    const { id } = req.params;
    const cancionEliminada = req.body;
    let productos = JSON.parse(fs.readFileSync("repertorio.json", "utf8"));


        // Encuentra el índice del producto que se va a actualizar
        const indice = productos.findIndex(producto => producto.id === id);
        console.log(indice);

        if (indice !== -1) { 
            productos.splice(indice,1);
    
            // Escribe los cambios en repertorio.json
            fs.writeFileSync("repertorio.json", JSON.stringify(productos));
    
            // Envía una respuesta con la canción actualizada
            res.json(productos[indice]);
        } else {
            // Si no se encuentra el producto, envía un error 404
            res.status(404).send("Canción no encontrada");
        }

});

/* app.put("/editar",(req,res)=>{
    
})
app.delete("/eliminar",(req,res)=>{
    
}) */

app.listen(PORT,console.log(`server on https//localhost:${PORT}`))