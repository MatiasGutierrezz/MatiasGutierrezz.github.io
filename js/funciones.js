"use strict"
/* 
 ? ||||||| URL-API: USUARIOS, FORO ||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
 const urlUsuariosAPI = "https://61117acdc38a0900171f1219.mockapi.io/Usuarios";
 const urlForoAPI ="https://61117acdc38a0900171f1219.mockapi.io/Foro";
 
/*
!!!!!!!!!!!!     FUNCIONES API      !!!!!!!!!!!!!!!!!!!!!!!!!! */
async function obtenerJsonAPI(url){
    try {
        let respuesta = await fetch(url);
        let json = await respuesta.json();
        
        if(respuesta.status == 200){
            return json;
        }else{
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}
async function buscarUsuario(usuario){
    try {
        
        //Obtenemos los USUARIOS de la API 
        let jsonUsuarios = await obtenerJsonAPI(urlUsuariosAPI);
    

        // Buscamos el USUARIO en el Json 
        for (const usuarioAPI of jsonUsuarios) {

            let nombreAPI = new String(usuarioAPI.nombre.toUpperCase());
            let nombreNuevoUsuario = new String (usuario.toUpperCase());
            
            // Si lo ENCUENTRA, retorna el USUARIO con los datos de la API,
            if(nombreAPI.localeCompare(nombreNuevoUsuario) == 0){
                return usuarioAPI;
            }
        }
        
        // Si NO se encuentra el USUARIO en la API, retorna NULL
        return null;

    } catch (error) {
        console.log("error xD");
    }
    
}
async function publicarAPI(url,dato){
    try {
        let res = await fetch(url,
            {
                "method": "POST",
                "headers": {"Content-type": "application/json"},
                "body": JSON.stringify(dato)
            });
           
        if(res.status == 201){
            console.log("-> PUBLICADO con EXITO <-");
            return await res.json(); 
        }
           
    } catch (error) {
        console.log(error);
    }
}
async function editarAPI(url,dato){
    console.log(url,dato);
    try {
        let res = await fetch(url,
            {
                "method": "PUT",
                "headers": {"Content-type": "application/json"},
                "body": JSON.stringify(dato)
            });
        if(res.status == 200){
            console.log("-> EDITADO con EXITO <-");
            return await res.json();
        }
           
    } catch (error) {
        console.log(error);
    }
}
async function eliminarAPI(url){
    try {
        let res = await fetch(url,
            {
                "method": "DELETE",
                "headers": {"Content-type": "application/json"}
            });
           
        if(res.status == 200){
            console.log("-> ELIMINADO con EXITO <-");
            actualizarForo();
            return await res.json(); 
        }
    } catch (error) {
        console.log(error);
    }
}

export {buscarUsuario}
export {publicarAPI}
export {obtenerJsonAPI}
export {editarAPI}
export {eliminarAPI}