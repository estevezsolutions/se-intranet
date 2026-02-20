import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Roles de usuarios
const rolesUsuarios = {
  "arquitecto@sestevez.com":"admin",
  "administrador@sestevez.com":"direccion",
  "secretaria@sestevez.com":"direccion",
  "economica@sestevez.com":"economia",
  "civil@sestevez.com":"produccion",
  "recursosh@sestevez.com":"rrhh",
  "comercial@sestevez.com":"comercial"
};

// LOGIN
window.login = async function(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try{
    await signInWithEmailAndPassword(auth,email,password);
    const nombre=email.split('@')[0];
    document.getElementById("bienvenida").textContent=`Bienvenido, ${nombre}`;
    document.getElementById("loginDiv").style.display="none";
    document.getElementById("contenidoDiv").style.display="block";
    document.getElementById("sidebar").style.display="block"; // mostrar menú
    initChat();
    document.getElementById("chatButton").style.display="block"; // mostrar chat
    configurarMenu(email);
  }catch(e){
    alert("Usuario o contraseña incorrecta");
  }
};

// Menú lateral según rol
function configurarMenu(email){
  const menu=document.getElementById("sidebarMenu");
  menu.innerHTML="";
  const rol=rolesUsuarios[email];
  const departamentos={direccion:"Dirección", economia:"Economía", produccion:"Producción", comercial:"Comercial", rrhh:"Recursos Humanos"};
  for(const key in departamentos){
    if(rol==="admin" || rol===key){
      const li=document.createElement("li");
      li.textContent=departamentos[key];
      li.onclick=()=>{ irADepartamento(key,rol); };
      menu.appendChild(li);
    }
  }
}
function irADepartamento(depto,rol){
  if(rol==="admin" || rol===depto) window.location.href=`departamentos/${depto}.html`;
  else alert("No tienes permiso para acceder a este departamento.");
}

// Chat
let chatListener;
function initChat(){
  const q=query(collection(db,"chat"),orderBy("fecha"));
  chatListener=onSnapshot(q,snapshot=>{
    const chatDiv=document.getElementById("chatMensajes");
    chatDiv.innerHTML="";
    snapshot.forEach(doc=>{
      const data=doc.data();
      const hora=new Date(data.fecha.seconds*1000).toLocaleTimeString();
      const mensaje=document.createElement("div");
      mensaje.classList.add('mensaje');
      mensaje.innerHTML=`<b>${data.nombre}</b>: ${data.mensaje} <span style="font-size:10px;color:#666">${hora}</span>`;
      chatDiv.appendChild(mensaje);
    });
    chatDiv.scrollTop=chatDiv.scrollHeight;
    document.getElementById("chatBadge").textContent=snapshot.size;
  });
}
window.abrirChat=function(){document.getElementById("chatDiv").style.display="flex";}
window.cerrarChat=function(){document.getElementById("chatDiv").style.display="none";}
window.enviarMensaje=async function(){
  const input=document.getElementById("chatInput");
  const mensaje=input.value.trim();
  if(!mensaje) return;
  const email=auth.currentUser.email;
  const nombre=email.split('@')[0];
  await addDoc(collection(db,"chat"),{nombre,mensaje,fecha:serverTimestamp()});
  input.value="";
}
