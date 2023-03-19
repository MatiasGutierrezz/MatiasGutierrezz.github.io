"use strict"
/*
    * Verde
    ! Red
    ? Hola
    TODO:  
*/

/* 
 ? ||||||| URL-API: USUARIOS, FORO ||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
const urlUsuariosAPI = "https://61117acdc38a0900171f1219.mockapi.io/Usuarios";
const urlForoAPI ="https://61117acdc38a0900171f1219.mockapi.io/Paginas/2";
const urlPaginaForo = "https://61117acdc38a0900171f1219.mockapi.io/Paginas/2";

/*
 !VARIABLES */
import{usuarioLogueado} from './pagina.js';

/*
 !FUNCIONES */
import {publicarAPI} from './funciones.js';
import {eliminarAPI} from './funciones.js';
import {editarAPI} from './funciones.js';
import {obtenerJsonAPI} from './funciones.js';
import {loadHTML} from './pagina.js'

/*
 ! PUBLICAR FORO */
 async function publicarForoAPI(){
     let formulario = document.querySelector('#form-PublicarForo');
     let camposFormulario = new FormData(formulario);
 
     
     let nuevoforo = {
         "nombre": camposFormulario.get('txtForo'),
         "like": 0
     };
         
     try {
         console.log(nuevoforo,camposFormulario.get('txtForo'));
         
         publicarAPI(urlForoAPI,nuevoforo);
 
     } 
     catch (error) {
         console.log(error);
         }
 }

 /*
 ! ACTUALIZAR FORO */
////////////////////////////////////////////////////////////////////////////////////
async function loadForos(){
    try {
        
        let foros = await obtenerJsonAPI(urlForoAPI);

        console.log(foros);
        
        foros.forEach(foro => {
            let boxForo =  document.querySelector('#boxForos');
            boxForo.appendChild(generarTablaForo(foro));
        }); 
    
        
    } catch (error) {
        
    }
}

/* 
! GENERAR COMENTARIOS */
function generarComentarios(jsComentarios){

    let bodyComentarios = document.createElement('tbody');

    for (const comentario of jsComentarios) {
            
        // avatar 
        let avatar = document.createElement('p');
        avatar.innerHTML ="* "+`${comentario.avatar}`;
        
        // btn Editar 
        let btnEdit= document.createElement('button');
        btnEdit.type = 'button';
        btnEdit.innerHTML = "Edit";
        btnEdit.addEventListener('click',editarComentario);

        // btn Eliminar
        let btnDelete= document.createElement('button');
        btnDelete.type = 'button';
        btnDelete.innerHTML = "Delete";
        btnDelete.addEventListener('click',eliminarComentario);

        // box botones header
        let boxBotones = document.createElement('span');
        boxBotones.appendChild(btnEdit);
        boxBotones.appendChild(btnDelete); 
        
        // box header
        let header = document.createElement('div');
        header.classList.add('headerComentario');
        header.appendChild(avatar);
        header.appendChild(boxBotones);

        //info
        let info = document.createElement('h2');
        info.innerHTML = `${comentario.info}`;

        // box Info
        let boxInformacion = document.createElement('div');
        boxInformacion.classList.add('infoComentario');
        boxInformacion.appendChild(info);

        // like (SEMILLAS == LIKES)
        let like = document.createElement('p');
        like.innerHTML = "10";

        // btn like
        let btnLike= document.createElement('button');
        btnLike.type = 'button';
        btnLike.id = 'btn-Like';
        btnLike.innerHTML = "Like";

        // box Likes == SEMILLAS
        let boxLike = document.createElement('div');
        boxLike.appendChild(btnLike);
        boxLike.appendChild(like);

        // btn subcomentarios
        let btnSubComentarios = document.createElement('button');
        btnSubComentarios.type = 'button';
        btnSubComentarios.id = 'btn-SubComentarios';
        btnSubComentarios.innerHTML = "Comentarios";
        
        // nav funciones
        let navFunciones = document.createElement('span');
        navFunciones.classList.add('navFuncionesComentario');
        navFunciones.appendChild(boxLike);
        navFunciones.appendChild(btnSubComentarios);
        
        // TD 
        let tdComentario = document.createElement('td');
        tdComentario.classList.add('tdComentario');
        tdComentario.appendChild(header);
        tdComentario.appendChild(boxInformacion);
        tdComentario.appendChild(navFunciones);

        // TR 
        let tr = document.createElement(td); 
        tr.classList.add('trComentario');
        tr.appendChild(tdComentario);

        // T-BODY
        bodyComentarios.appendChild(tr);
    }
    return bodyComentarios;
}

/*
 ! GENERAR TABLA FORO */
function generarTablaForo(jsForo){
    
    // NOMBRE 
    let nombre = document.createElement('h1').innerHTML = `${jsForo.nombre}`;
    
    // LIKES 
    let likes = document.createElement('span').innerHTML = "Likes" + jsForo.comentarios.length;
    
    // TH 
    let th = document.createElement('th');
    th.classList.add('thForo');
    th.appendChild(nombre);
    th.appendChild(likes);
    
    // TR 
    let tr = document.createElement('tr');
    tr.classList.add('trForo');
    tr.appendChild(th);
    
    // T.HEAD 
    let tHead = document.createElement('thead');
    tHead.classList.add('tHeadForo');
    tHead.id = jsForo.id;
    tHead.appendChild(tr);

    // T.BODY
    let tBody = generarComentarios(jsForo.comentarios);

    // TABLE
    let table = document.createElement('table');
    table.classList.add('tableForo');
    table.appendChild(tHead);
    table.appendChild(tBody);

    return table;
        
}

/*
! GENERAR COMENTARIOS USUARIO */
async function obtenerComentariosUsuario() {
        
    // VERIFICA QUE EL USUARIO TENGA COMENTARIOS
    if(usuarioLogueado.comentariosID.length != 0){
        let jsComentarios = [];
        // TRAEMOS LOS COMENTARIOS DE LA API.
        for (const idComentario of usuarioLogueado.comentariosID) {
            setTimeout(async function(e){
                try {
                    let comentario = obtenerJsonAPI(urlForoAPI+idComentario)
                    jsComentarios.push(comentario);
                } catch (error) {
                    console.log(error);
                }
            }, 700);
        }
    }else{
        bodyTablaComentarios.innerHTML = "";
        bodyTablaComentarios.innerHTML = "Ups no tienes comentarios..";
    }

    return jsComentarios;
}

/*
! ELIMINAR COMENTARIOS USUARIO*/
async function eliminarComentario(){
    // TR
    let trComentario = this.parentNode.parentNode;
    // ID COMENTARIO
    let idComentario = trComentario.dataset.id;
    // URL COMENTARIO
    let urlComentario = urlForoAPI+idComentario;
    
    console.log(urlComentario);
    try {
        // ELIMINAMOS EN API
        eliminarAPI(urlComentario);

        // ELIMINAMOS el ID del comentario, de usuarioLogueado.comentariosID[]
        let id = usuarioLogueado.comentariosID.indexOf(idComentario);
        usuarioLogueado.comentariosID.splice(id,1);    
        console.log(usuarioLogueado.comentariosID);

        // ACTUALIZAMOS EL USUARIO EN LA API
        editarAPI(urlUsuariosAPI+"/"+usuarioLogueado.id,usuarioLogueado);

        // REMOVEMOS EL TR-COMENTARIO DE LA TABLA
        trComentario.remove();
    } catch (error) {
        console.log(error);
    }
}
/*
! EDITAR COMENTARIOS USUARIO*/
async function editarComentario(){
    try {
           
        // URL COMENTARIO    
        let urlComentario = urlForoAPI+this.dataset.id;

        console.log(urlComentario);
        
        // FORMULARIO EDITAR
        let form = document.getElementById('formEdit');
        let camposFormulario = new FormData(form);
        
        // TRAEMOS EL COMENTARIO DE LA API 
        let comentario = await obtenerJsonAPI(urlComentario);
        
        // EDITAMOS EL COMENTARIO
        comentario.info = camposFormulario.get('infoComentario');
        
        // ACTUALIZAMOS EL COMENTARIO API
        let editar = await editarAPI(urlComentario,comentario);
        
        obtenerComentariosUsuario();
        
    } catch (error) {
        console.log(error);
    }
};
async function formularioEditarComentario(){
    
    try {
        
        // TR COMENTARIO
        let trComentario = this.parentNode.parentNode;

        console.log(trComentario.dataset.id);

        // BOTON EDITAR
        let btnEditar = document.createElement('button');
        btnEditar.type = "button";
        btnEditar.innerHTML = "Editar";
        btnEditar.setAttribute("data-id",trComentario.dataset.id);
        btnEditar.addEventListener('click', editarComentario);
        // TEXT AREA 
        let info = this.parentNode.firstChild.innerHTML;
        let txtComentario = document.createElement('textarea');
        txtComentario.innerHTML = info;
        txtComentario.rows = "10";
        txtComentario.cols = "10";
        txtComentario.name = "infoComentario";

        // FORM
        let formEdit = document.createElement('form');
        formEdit.id = "formEdit";
        formEdit.appendChild(txtComentario);
        formEdit.appendChild(btnEditar);
        
        // TD 
        let tdEdit = document.createElement('td');
        tdEdit.appendChild(formEdit);


        trComentario.appendChild(tdEdit);
    } catch (error) {
        console.log(error);
    }
}
/*
 ! PUBLICAR COMENTARIO */
 async function publicarComentarioAPI(){
     
     // FORMULARIO-> Nuevo Comentario.
     let formulario = document.querySelector('#form-NuevoComentario');
     let camposFormulario = new FormData(formulario);
     
     // ID FORO, SELECCIONADO
     let idForo= camposFormulario.get('idForo');
 
     // DATOS INGRESADOS USUARIO
     let infoNueva = camposFormulario.get('txtNuevoComentario');
    
     // NUEVO COMENTARIO
     let nuevoComentario = {
         "info" : infoNueva,
         "like" : 0,
         "idUsuario": usuarioLogueado.id,
         "subComentarios" : [],
         "avatar": usuarioLogueado.nombre }

     // URL DE LOS COMENTARIOS DE UN FORO 
     let idComentario = "/"+idForo+"/Comentarios"
     
     try {
        
        // PUBLICAMOS EL COMENTARIO
        let respuestaAPI = await publicarAPI(urlForoAPI+idComentario,nuevoComentario); 

        // ACTUALIZAMOS EL ARRAY DE "ID" DE COMENTARIOS DEL USUARIO LOGUEADO.
        usuarioLogueado.comentariosID.push(idComentario+"/"+respuestaAPI.id);
        
        // ACTUALIZAMOS EL USUARIO EN LA API
        await editarAPI(urlUsuariosAPI+`/${usuarioLogueado.id}`,usuarioLogueado);

     } catch (error) { console.log(error); }
 }
/*
 ! BUSCAR */
async function buscar(){
    // FORM BUSQUEDA
    let form = document.getElementById('form-Buscar');
    let camposFormulario = new FormData(form);
    
    // TXT BUSQUEDA
    let txtBusqueda = camposFormulario.get('txtBusqueda');

    //  TABLA COMENTARIOS
    let tablaComentariosForo = document.querySelector('#bodyTablaComentariosForo');
    tablaComentariosForo.innerHTML = "";
    try {
        let foros = await obtenerJsonAPI(urlForoAPI);
        let forosOk = [];
        for (const foro of foros) {
            let comentariosOk = [];
            for (const comentario of foro.comentarios) {
                let infoComentario = new String(comentario.info.toUpperCase());
                txtBusqueda = new String (txtBusqueda.toUpperCase());
                
                console.log(infoComentario,txtBusqueda);
                
                if(infoComentario.includes(txtBusqueda)){
                    comentariosOk.push(comentario);
                }
            }

            if(comentariosOk.length != 0){
                let foroOk = foro;
                foroOk.comentarios = comentariosOk;
                forosOk.push(foroOk);
            }
        
        }

        generarTablaForo(forosOk);
    } catch (error) {
        console.log(error);
    }
    
}

async function load(){
    // PAGINA INICIO 
    let foro = await obtenerJsonAPI(urlPaginaForo);

    if(foro != null){
        
        //LOAD CONTENIDO
        loadHTML(foro.contenido,'section');

        loadForos();


        // LOAD EVENTOS
        loadEvents();

        console.log('PAGINA FORO CARGADA');
    }else
    {
        console.log('error api');
    } 
}

function loadEvents(){
    
    console.log('FORO.JS');

    /*
    let botonPublicarForo = document.querySelector('#btn-PublicarForo').addEventListener('click',publicarForoAPI);
    
    let btnMostrarForosCheck = document.querySelector('#btn-mostrarForos').addEventListener('click', ()=> actualizarForoCheck());
    
    let btnComentariosUsuario = document.querySelector('#btn-VerComentariosUsuario').addEventListener('click',()=> obtenerComentariosUsuario());
    
    let btnPublicarComentario = document.querySelector('#btn-PublicarComentario').addEventListener('click',publicarComentarioAPI);
    
    let btnBuscar = document.getElementById('btn-Buscar').addEventListener('click', buscar);
    */

}

/////////////////////////////////////////////////////////////////////////////////////

export{loadEvents}
export{load}

