import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    document.getElementById("loginDiv").style.display = "none";
    document.getElementById("contenidoDiv").style.display = "block";
    document.getElementById("usuarioNombre").innerText = user.email.split('@')[0]; // nombre corto

    // Guardar departamento del usuario
    usuarioActual.email = user.email;
    // usuarioActual.departamento = ... (lo sacamos de Firestore después)
    
    console.log("Usuario conectado:", user.email);
  } catch (error) {
    alert("Error en el login: " + error.message);
  }
}
// Mostrar login y contenido
let usuarioActual = { email:"", departamento:"" };

window.login = async function(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try{
    const { user } = await firebase.auth().signInWithEmailAndPassword(firebase.auth(), email, password);
    usuarioActual.email = user.email;
    document.getElementById("loginDiv").style.display="none";
    document.getElementById("contenidoDiv").style.display="block";
    document.getElementById("usuarioNombre").innerText = usuarioActual.email.split('@')[0];
  }catch(e){
    alert("Error: "+e.message);
  }
}

// Sidebar
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
menuBtn.onclick = ()=> sidebar.style.width = "250px";
window.cerrarSidebar = ()=> sidebar.style.width = "0";

// Mostrar secciones por departamento
window.mostrarDepartamento = function(depto){
  document.querySelectorAll('.departamento').forEach(sec=> sec.style.display='none');
  document.getElementById(depto).style.display='block';
}

// Chat flotante
window.abrirChat = function(){
  alert("Aquí se abrirá el chat en tiempo real con Firebase.");
}
