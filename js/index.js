"use strict"
import { obtenerJsonAPI } from './funciones.js';
import {formularioRegistro} from './pagina.js';
import {loadHTML} from './pagina.js';
const urlPaginaInicio = "https://61117acdc38a0900171f1219.mockapi.io/Paginas/1";

async function load(){
    // PAGINA INICIO 
    let index = await obtenerJsonAPI(urlPaginaInicio);

    if(index != null){
        
        //LOAD CONTENIDO
        loadHTML(index.contenido,'section');

        // LOAD EVENTOS
        loadEvents();

        console.log('PAGINA INICIO CARGADA');
    }else
    {
        console.log('error api');
    } 
}

// CARGAR PAGINA INICIO 
function loadEvents(){
    
    // btn VER FORMULARIO REGISTRO
    document.querySelector('#btn-Ver').addEventListener("click",formularioRegistro);
    
    console.log('JS INDEX -> LOAD EVENTOS');
}

export{loadEvents}
export{load}

