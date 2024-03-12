require("dotenv").config()
const express = require("express");
const {leerColores,crearColor,borrarColor} = require("./db")
const {json} = require("body-parser")
const cors = require ("cors")




let servidor = express();

servidor.use(cors());

servidor.use(json());

//servidor.use("/mentirillas", express.static("./pruebas_api"));



servidor.get("/colores",async (peticion, respuesta) => {
    try{
        let colores = await leerColores(); 

        respuesta.json(colores.map(({_id,r,g,b}) => {return { id : _id,r,g,b}}));


    }catch(error){
        respuesta.status(500);

        respuesta.json(error);
    }
})
servidor.post("/colores/nuevo",async (peticion, respuesta,siguiente) => {
    let {r,g,b} = peticion.body;

    let valido = true;

    [r,g,b].forEach( n => valido = valido && n >=0 && n <= 255);
    
    if(valido){
        try{
            let resultado = await crearColor({r,g,b});
            return respuesta.json(resultado);
        }catch(error){
            respuesta.status(500);

            return respuesta.json(error);
        }
       
    }        

    siguiente({error : "...no me enviaste nada"})

})
servidor.delete("/colores/borrar/:id([a-f0-9]{24})",async (peticion, respuesta) => {

    try{
        let cantidad = await borrarColor(peticion.params.id);
        respuesta.json({resultado : cantidad > 0 ? "ok" : "ko"});
    }catch(error){
        respuesta.status(500);

        return respuesta.json(error);
    }
});

servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({error : "not found"})
})

servidor.use((error,peticion,respuesta,siguiente) =>{
    respuesta.estatus(400);
    respuesta.send(error);
})





servidor.listen(process.env.PORT)