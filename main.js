import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// -------------------- Configuración de usuarios --------------------
const roles = {
  "arquitecto@sestevez.com": "Arquitecto",
  "administrador@sestevez.com": "Administrador",
  "secretaria@sestevez.com": "Secretaria",
  "elena@economia.com": "Económica",
  "doime@produccion.com": "Civil",
  "rrhh@recursos.com": "Recursos",
  "comercial@comercial.com": "Comercial"
};

let usuarioActual = null;

// -------------------- LOGIN --------------------
window.login = async function(){
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  try{
    const userCredential = await signInWithEmailAndPassword(auth,email,pass);
    usuarioActual = email;
    document.getElementById("loginDiv").style.display="none";
    document.getElementById("contenidoDiv").style.display="block";
    document.getElementById("usuarioNombre").textContent = roles[email] || email;
    initChat();
  }catch(err){
    alert("Usuario o contraseña incorrecta");
  }
};

// -------------------- MOSTRAR DEPARTAMENTO --------------------
window.mostrarDepartamento = function(depto){
  const div = document.getElementById("documentosDiv");
  div.innerHTML = `<iframe src="departamentos/${depto}.html" style="width:100%; height:600px; border:none;"></iframe>`;
}

// -------------------- CHAT --------------------
let chatListener;
function initChat(){
  const q = query(collection(db,"chat"),orderBy("fecha"));
  chatListener = onSnapshot(q,snapshot=>{
    const chatDiv = document.getElementById("chatMensajes");
    chatDiv.innerHTML="";
    snapshot.forEach(doc=>{
      const data = doc.data();
      const hora = new Date(data.fecha.seconds*1000).toLocaleTimeString();
      const mensaje = document.createElement("div");
      mensaje.innerHTML=`<b>${data.nombre}</b>: ${data.mensaje} <span style="font-size:10px;color:#666">${hora}</span>`;
      chatDiv.appendChild(mensaje);
    });
    document.getElementById("chatBadge").textContent=snapshot.size;
  });
}

window.abrirChat = function(){ document.getElementById("chatDiv").style.display="flex"; }
window.cerrarChat = function(){ document.getElementById("chatDiv").style.display="none"; }

window.enviarMensaje = async function(){
  const input = document.getElementById("chatInput");
  if(!input.value) return;
  await addDoc(collection(db,"chat"),{
    nombre: document.getElementById("usuarioNombre").textContent,
    mensaje: input.value,
    fecha: new Date(),
    avatar: "",
    leido: false,
    notificado: false
  });
  input.value="";
}

// -------------------- GOOGLE DRIVE / SUBIDA DE ARCHIVOS --------------------
// Este ejemplo usa Google Picker + OAuth 2.0 (credenciales que ya creaste)
let pickerApiLoaded = false;
let oauthToken;

function loadPicker() {
  gapi.load('auth', {'callback': onAuthApiLoad});
  gapi.load('picker', {'callback': onPickerApiLoad});
}

function onAuthApiLoad() {
  gapi.auth.authorize(
    {
      'client_id': 'TU_CLIENT_ID.apps.googleusercontent.com',
      'scope': ['https://www.googleapis.com/auth/drive.file'],
      'immediate': false
    },
    handleAuthResult);
}

function onPickerApiLoad() {
  pickerApiLoaded = true;
}

function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    oauthToken = authResult.access_token;
  }
}

// Función para subir archivos desde la web
window.subirArchivo = function(depto, tipo){
  const inputId = `fileInput${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
  const input = document.getElementById(inputId);
  if(!input || !input.files.length){ alert("Selecciona un archivo"); return; }

  const file = input.files[0];
  const metadata = {
    name: file.name,
    mimeType: file.type,
    parents: [getFolderId(depto)]
  };

  // Usando Google Drive API directamente
  const accessToken = oauthToken;
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], {type:'application/json'}));
  form.append('file', file);

  fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
    method: 'POST',
    headers: new Headers({'Authorization': 'Bearer ' + accessToken}),
    body: form
  }).then(response => response.json())
    .then(data => {
      // Guardar metadata en Firestore
      addDoc(collection(db,"documentos"),{
        titulo: file.name,
        archivoURL: `https://drive.google.com/uc?id=${data.id}`,
        creadoPor: roles[usuarioActual],
        fecha: new Date(),
        departamento: depto,
        tipo: tipo
      });
      alert("Archivo subido correctamente");
      input.value = "";
    }).catch(err=>alert("Error subiendo archivo: "+err));
}

// -------------------- CARPETAS DE GOOGLE DRIVE --------------------
function getFolderId(depto){
  const folders = {
    "direccion":"1JmYzoHuP86zgdyTrbEY_ssuYXToDIabS",
    "economia":"18n-HQW4ZnLd_hs5oaFvmuwkOVZ5C7Rlj",
    "produccion":"1clx3G0o8bx45K5VOgZEIQaoKM4WqZ-U4",
    "comercial":"1K4q_L90JV6Rq8jQMbs12VP0dY4MUZ1XE",
    "rrhh":"1MtyebtyPK8xC9HoYeONGf70LBFvvCcp8"
  };
  return folders[depto];
}

// -------------------- ECONOMIA: CREAR REGISTRO DE FACTURA --------------------
window.crearRegistroFactura = async function(){
  const numero = prompt("Número de factura:");
  const fecha = prompt("Fecha (dd/mm/aaaa):");
  const servicio = prompt("Servicio:");
  const cliente = prompt("Cliente:");
  const contrato = prompt("Contrato:");
  const importe = prompt("Importe:");

  if(!numero || !fecha || !servicio || !cliente || !contrato || !importe){
    alert("Todos los campos son obligatorios"); return;
  }

  await addDoc(collection(db,"facturacion"),{
    numero,
    fecha,
    servicio,
    cliente,
    contrato,
    importe,
    creadoPor: roles[usuarioActual],
    fechaCreacion: new Date()
  });

  alert("Registro agregado correctamente");
}

// -------------------- VER LISTADO DE TRABAJADORES (RRHH) --------------------
window.verListadoTrabajadores = function(){
  alert("Aquí se mostraría el listado de trabajadores desde Firestore");
}
