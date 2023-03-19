"use strict"

/* 
? ||||||| URL-API: USUARIOS, FORO ||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
const urlUsuariosAPI = "https://61117acdc38a0900171f1219.mockapi.io/Usuario";

const urlForoAPI ="https://61117acdc38a0900171f1219.mockapi.io/Foro";

// URL´S
const urlPagina = "https://61117acdc38a0900171f1219.mockapi.io/Paginas";
const urlPaginaInicio = "https://61117acdc38a0900171f1219.mockapi.io/Paginas/1";
const urlPaginaForo = "https://61117acdc38a0900171f1219.mockapi.io/Paginas/2";
const urlPaginaInformacion = "https://61117acdc38a0900171f1219.mockapi.io/Paginas/3";
const urlPaginaNav = "https://61117acdc38a0900171f1219.mockapi.io/Paginas/4";

/*
! CARGAR PAGINA */

//IMPORT´S
import {obtenerJsonAPI} from './funciones.js';
import {buscarUsuario} from './funciones.js';
import {publicarAPI} from './funciones.js';

// VARIABLES GLOBALES
var usuarioLogueado = null;

async function iniciarPagina(){
    try {
        let navAPI = await fetch(urlPaginaNav);
        let jsNav = await navAPI.json();

        if(navAPI.status === 200){
            
            loadHTML(jsNav.contenido,'nav');
            loadEventos('pagina');
            loadPagina('index');
        }
        
    } catch (error) {
        console.log(error);
    } 
}

async function loadPagina(fileName)
{
    import(`./${fileName}.js`)                   // Dynamic import
    .then(data => { data.load();});

}

async function loadEventos(filename){
    import(`./${filename}.js`)                   // Dynamic import
    .then(data => { data.loadEvents();});
}

// LOAD HTML+SELECTOR
function loadHTML(html,selector){
    let box = document.querySelector(`${selector}`);
    box.innerHTML = "";
    box.innerHTML += html;
}

function loadEvents(){
    /*
   !!!!!   FUNCIONALIDADES BTN'S NAV    !!!!!!!!*/
   // btn VER NAV USUARIO
   document.querySelectorAll('.btn.usuario').forEach((btn) => btn.addEventListener('click',()=>{document.querySelector('.nav.usuario').classList.toggle('visible');}));
   
   // btn VER NAV MOBIL
   document.querySelector('.nav .verNav').addEventListener('click',()=>{document.querySelector('.mobil.navegacion').classList.toggle('visible');})
   
   // btn's PAGINA 
   document.querySelectorAll('.nav .btn.pagina').forEach((btn) => btn.addEventListener('click',(btn)=>{loadPagina(btn.target.attributes.value.value);}));

   // btn REGISTRAR
   document.querySelectorAll('.nav .registrar').forEach( (btn) => btn.addEventListener('click',formularioRegistro)); 

   // btn CERRAR SESION
   document.querySelector('.nav .cerrarSesion').addEventListener('click',cerrarSesion);
   
   // btn INICIAR SESION
   document.querySelectorAll('.nav .login').forEach((btn)=> btn.addEventListener('click',verFormularioLogueo));
   
   // btn COMENTARIOS 
   document.querySelector('.nav .comentarios').addEventListener('click',()=>{});
}

/* 
! ||||||| CAPTCHA ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/
let captcha = "";
function verificarCaptcha(){
    let textIngresado = document.getElementById("txtCaptchaIngresado").value;
    
    let textoValidacion = document.getElementById("validacionCaptcha");
    
    console.log(textIngresado,textoValidacion);
    
    if(textIngresado == captcha){
        textoValidacion.innerHTML = "";
        textoValidacion.innerHTML = ("(V) CORRECTO");
        return true;
    }else{
        textoValidacion.innerHTML = "";
        textoValidacion.innerHTML = ("(X) INCORRECTO");
        GeneradorCaptcha();
        return false;
    }
}
function GeneradorCaptcha(){
    let indice;
    let caracter;
    captcha = "";
    
    for(indice = 0; indice<6 ; indice++){
        caracter = GenerarCaracter();
        captcha = captcha + caracter;
    }
    let tituloCaptcha = document.querySelector("#txtCaptchaGenerado");
    tituloCaptcha.innerHTML = captcha;
}
function GenerarCaracter(){
    let caracter = Math.floor((Math.random()*10)+1);
    if(caracter %2 == 0){
        let valor = Math.floor(Math.random()*10);
        return valor;
    }else{
        let valor = letraRandom();
        return valor;
    }
}
function letraRandom(){
    let letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let valor = Math.floor(Math.random()*26);
    return letras [valor];
}

// FORMULARIO LOGUEAR
function verFormularioLogueo(){
    //GENERAR FORMULARIO
    formularioLogueo();
    let btnCerrarLogueo = document.getElementById('btn-CerrarLogueo').addEventListener('click',cerrarFormulario);
    let btnLoguear = document.getElementById('btn-Logueo').addEventListener('click',()=> iniciarSesion()); 
    
    // VER FORMULARIO
    let overlay = document.getElementById('box-Overlay');
    let boxLoguear = document.getElementById('boxLogueo');
    overlay.classList.add('ver');
    boxLoguear.classList.add('ver');

}
function  formularioLogueo(){
    let overlay = document.getElementById('box-Overlay');
    overlay.innerHTML = "";
    overlay.innerHTML +=
        `
            <!-- FORMULARIO LOGUEO -->
            <div class="box-Logueo" id="boxLogueo">
                <button class="btn-CerrarLogueo" id="btn-CerrarLogueo">X</button>
                <h1>¡COMPLETA LOS DATOS!</h1>
                <form id="form-Logueo">
                    <div class="boxInput">
                        <input type="text" name="usuario" placeholder="Usuario">
                        <input type="text" name="password" placeholder="Password">
                    </div>
                    <button type="button" id ="btn-Logueo">Loguear</button>
                </form>
                <h1 id="validacionLogueo">¡TE LOGUEASTE CON EXITO!</h1>
            </div >`;
}

// NAV USUARIO
function verNavUsuario(){
    // ACTUALIZAMOS y MOSTRAMOS - BOX USUARIO LOGUEADO
    let btnUsuarioLog = document.querySelector('.nav.usuario');
    btnUsuarioLog.innerHTML ="";
    btnUsuarioLog.innerHTML = usuarioLogueado.nombre;
    btnUsuarioLog.classList.toggle('ver');

    // OCULTAMOS BOTON LOG
    let btnFormularioLog = document.getElementById('btn-VerFormularioLogeo').classList.toggle('ver');
}

// SESION
async function iniciarSesion() {
    console.log("Logueo click");
    // FORMULARIO-LOGUEO
    let formulario = document.querySelector('#form-Logueo');
    let camposFormulario = new FormData(formulario);
    
    // DATOS INGRESADOS
    let usuarioIngresado = camposFormulario.get('usuario');
    let passwordIngresado = camposFormulario.get('password');
    
    try {

        // BUSCAMOS EL USUARIO EN LA API
        let usuarioAPI = await buscarUsuario(usuarioIngresado);
        console.log(usuarioAPI);
        // VERIFICAMOS EL USUARIO Y PASSWORD
        if((usuarioAPI != null) && (usuarioAPI.password == passwordIngresado)){
            
            // USUARIO LOGUEADO
            usuarioLogueado = { 
                "nombre":usuarioAPI.nombre,
                "password":usuarioAPI.password,
                "id":usuarioAPI.id,
                "comentariosID": usuarioAPI.comentariosID
            };

            // ACTUALIZAMOS NAV 
            verNavUsuario();
        
            // OCULTAMOS FORMULARIO
            cerrarFormulario();
            
        }else{
            // ERROR - VERIFICAR DATOS.
            validacionLogueo.innerHTML = "";
            validacionLogueo.innerHTML = "(X)->Verificar Datos.";
            
        }
    } catch (error) {
        console.log(error);   
    }
}
function cerrarSesion(){

    usuarioLogueado = null; 

    // ACTUALIZAMOS y OCULTAMOS - BOX USUARIO LOGUEADO
    let btnUsuarioLog = document.getElementById('btn-UsuarioLogueado');
    btnUsuarioLog.innerHTML ="";
    btnUsuarioLog.classList.toggle('ver');

    // OCULTAMOS NAV USUARIO
    let navUsuario = document.getElementById('navLogeo');
    ocultarBox(navUsuario.id);

    // MOSTRAMOS BOTON LOG
    let btnFormularioLog = document.getElementById('btn-VerFormularioLogeo').classList.toggle('ver');

}

// REGISTRAR USUARIO
async function publicarUsuarioAPI(){

    // BOX CAMPO USUARIO 
    let boxUsuario = document.querySelector("#boxValidarUsuario");
    boxUsuario.innerHTML = "";
    
    // BOX RESULTADO DE REGISTRO
    let resultado = document.querySelector("#validacionRegistro");
    resultado.innerHTML = "";


    //Formulario de REGISTRO
    let formulario = document.querySelector('#form-Registro');
    
    // FormData( ), toma los campos de un formulario.
    let camposFormulario = new FormData(formulario);
    
    // NUEVO USUARIO 
    let newUsuario = {
        "nombre" : camposFormulario.get('usuario'),
        "password" : camposFormulario.get('password')
    }

    try {
        // VERIFICAMOS QUE USUARIO NO EXISTA EN LA API
        if(await buscarUsuario(newUsuario.nombre) == null){
            
            // VERIFICAMOS CAPTCHA
            if(verificarCaptcha()){
                
                // PUBLICAMOS USUARIO Y ACTUALIZAMOS DOM
                publicarAPI(urlUsuariosAPI,newUsuario);
                resultado.innerHTML ="¡Registro Exitoso!";
                formulario.reset();
            }
            // USUARIO DISPONIBLE - CAPTCHA INCORRECTO
            else{boxUsuario.innerHTML = "(V) USUARIO DISPONIBLE"; }
        
        // USUARIO NO DISPONIBLE
        }else{ boxUsuario.innerHTML = "(X) USUARIO NO DISPONIBLE";}
    }
    catch (error) {
        console.log(error);
    }
}
function  formularioRegistro(){
    let overlay = document.getElementById('box-Overlay');
    overlay.innerHTML = "";
    overlay.innerHTML +=
        
        `<div class="box-Registro" id="box-Registro">
                
            <button class="btn-Cerrar" id="btn-Cerrar">X</button> 
            
            <h1>¡COMPLETA LOS DATOS!</h1>
            
            <form id = "form-Registro">
                <div class="boxInput">
                    <!-- VALIDAR USUARIO -->
                    <input type="text" name="usuario" required placeholder="Usuario" >
                    <p id="boxValidarUsuario">  </p>
                    
                    <!-- VALIDAR PASSWORD -->   
                    <input type="password" name="password" required maxlength="10" placeholder="Password">
                    <p id="boxValidarPassword">         </p>
                    
                    
                    <!-- VALIDAR EMAIL -->
                    <input type="email" name="email" required placeholder="Email">
                    <p id="boxValidarEmail">         </p>
                    
                    <!--CAPTCHA-->
                    <input type="text" name="captcha" id="txtCaptchaIngresado" required placeholder="Captcha">
                    <!--VALIDACION-->
                    <p id="validacionCaptcha"></p>
                    <p id="txtCaptchaGenerado"></p>

                </div>
                <!-- BTN-REGISTRAR -->
                <button type="button" id="btn-Registrar">Registrarse</button>
            </form>
            
            <h1 id="validacionRegistro">¡TE UNISTE CON EXITO!</h1>

        </div>`;

    let btnCerrarRegistro = document.getElementById('btn-Cerrar').addEventListener('click',cerrarFormulario);
    let btnRegistrar = document.querySelector('#btn-Registrar').addEventListener('click',publicarUsuarioAPI); 
    GeneradorCaptcha();
    // VER FORMULARIO
    let boxRegistro = document.getElementById('box-Registro');
    overlay.classList.add('ver');
    boxRegistro.classList.add('ver');
}

// export funciones
export {formularioRegistro}
export{GeneradorCaptcha}
export{loadHTML}


// export variables
export{usuarioLogueado}

// export url
export{urlPaginaInicio}
export{urlPaginaForo}
export{urlPaginaInformacion}

/*
!!!!!!  FUNCIONES   !!!!!!!!!!!!!!!!!! */
function cerrarFormulario(){
    let overlay = document.getElementById('box-Overlay');
    overlay.innerHTML = "";
    overlay.classList.remove('ver');
}

function verBox(id){
    let box = document.getElementById(id);
    box.classList.add('ver');
}

function ocultarBox(id){
    let box = document.getElementById(id);
    box.classList.remove('ver');
}


// FUNCIONES INICIAR
iniciarPagina();
async function mostrarConsola(){
    try {
      //  console.log(jsPrueba);
    }
    catch (error) {
        console.log(error);
    }   
}
export{loadEvents}

mostrarConsola();