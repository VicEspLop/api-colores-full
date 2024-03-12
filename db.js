require("dotenv").config();
const { MongoClient,ObjectId} = require("mongodb");


function conectar() {
    return MongoClient.connect(process.env.DB_URL_MONGO)
}



function leerColores() {
    return new Promise( async (ok,ko) => {
        try{

            const conexion = await conectar();

            let coleccion = conexion.db("colores").collection("colores");

            let colores = await coleccion.find({}).toArray();
        
        
            conexion.close();

            ok(colores);

            

        }catch(error){
            ko({error : " error en base de datos"});

            
        }


    })
    
}


function crearColor(color) {
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();

            let coleccion = conexion.db("colores").collection("colores")
        
            let {insertedId} = await coleccion.insertOne(color)
        
            conexion.close();

            ok({id : insertedId});
        }catch(error){
            ko({error : "error en base de datos"});
        }
    })
}


function borrarColor(id){
    return new Promise( async (ok,ko) => {
        

        try{
            const conexion =  await conectar();
            let coleccion = conexion.db("colores").collection("colores")
    
            let {deletedCount} = await coleccion.deleteOne({ _id : new ObjectId(id)})
        
            console.log(resultado);
        
            conexion.close();

            ok(deletedCount);

        }catch(error){
            ko({error : " error en base de datos"});
        }


    })
}

/*function actualizarEstado(id){
    return new Promise( async (ok,ko) => {
        let conexion = conectar();

        try{
            let {count} = await conexion`UPDATE tareas SET terminada = NOT terminada WHERE id = ${id}`;

            ok(count);

        }catch(error){
            ko({error : " error en base de datos"});
        }


    })
}*/
/*function actualizarTexto(id,tarea){
    return new Promise( async (ok,ko) => {
        let conexion = conectar();

        try{
            let {count} = await conexion`UPDATE tareas SET tarea = ${tarea} WHERE id = ${id}`;

            ok(count);

        }catch(error){
            ko({error : " error en base de datos"});
        }


    })
}*/
module.exports = {leerColores,crearColor,borrarColor};