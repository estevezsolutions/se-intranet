import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Roles y nombres cortos
const roles = {
  "arquitecto@sestevez.com": "Arquitecto",
  "administrador@sestevez.com": "Administrador",
  "secretaria@sestevez.com": "Secretaria",
  "elena@economia.com": "Económica",
  "doime@produccion.com": "Civil",
  "rrhh@recursos.com": "Recursos",
  "comercial@comercial.com": "Comercial"
};

// Login
window.login = async function(){
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  try{
    const userCredential = await signInWithEmailAndPassword(auth,email,pass);
    document.getElementById("loginDiv").style.display="none";
    document.getElementById("contenidoDiv").style.display="block";
    document.getElementById("usuarioNombre").textContent = roles[email] || email;
    initChat();
  }catch(err){
    alert("Usuario o contraseña incorrecta");
  }
};

// Mostrar departamento
window.mostrarDepartamento = function(depto){
  const div = document.getElementById("documentosDiv");
  div.innerHTML = `<iframe src="departamentos/${depto}.html" style="width:100%; height:600px; border:none;"></iframe>`;
}

// Chat
let chatListener;
function initChat(){
  const q = query(collection(db,"chat"),orderBy("fecha"));
  chatListener = onSnapshot(q,snapshot=>{
    const chatDiv = document.getElementById("chatMensajes");
    chatDiv.innerHTML="";
    snapshot.forEach(doc=>{
      const data = doc.data();
      const mensaje = document.createElement("div");
      const hora = new Date(data.fecha.seconds*1000).toLocaleTimeString();
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
