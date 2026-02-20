// main.js
import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Elementos HTML
const loginDiv = document.getElementById("loginDiv");
const contenidoDiv = document.getElementById("contenidoDiv");
const usuarioNombre = document.getElementById("usuarioNombre");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Botón y sidebar
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

// Chat
const chatButton = document.getElementById("chatButton");
const chatDiv = document.getElementById("chatDiv");
const chatMensajes = document.getElementById("chatMensajes");
const chatInput = document.getElementById("chatInput");
const addFileBtn = document.getElementById("addFileBtn");
const uploadForm = document.getElementById("uploadForm");
const submitArchivo = document.getElementById("submitArchivo");
const archivoInput = document.getElementById("archivoInput");
const archivoTitulo = document.getElementById("archivoTitulo");
const status = document.getElementById("status");
const archivosList = document.getElementById("archivosList");

addFileBtn.addEventListener("click", () => {
  uploadForm.style.display = uploadForm.style.display === "none" ? "block" : "none";
});

submitArchivo.addEventListener("click", async () => {
  if(!archivoInput.files[0] || !archivoTitulo.value) {
    status.textContent = "Por favor completa todos los campos.";
    return;
  }
  status.textContent = "Subiendo...";
  
  // Subida a Google Drive vía API
  const file = archivoInput.files[0];
  const titulo = archivoTitulo.value;

  try {
    // Lógica para subir a Google Drive o Firestore URL del archivo
    // Aquí asumimos que sube y devuelve un link URL
    const archivoURL = "https://drive.google.com/archivoID"; // reemplazar con integración real
    
    // Guardar en Firestore
    await addDoc(collection(db,"archivosProduccion"),{
      titulo,
      archivoURL,
      creadoPor: auth.currentUser.email,
      fecha: serverTimestamp()
    });

    status.textContent = "Archivo subido con éxito!";
    archivoInput.value = "";
    archivoTitulo.value = "";
    uploadForm.style.display = "none";

    cargarArchivos();
  } catch(err){
    status.textContent = "Error al subir: " + err.message;
  }
});

// Cargar archivos subidos
async function cargarArchivos() {
  const q = query(collection(db,"archivosProduccion"), orderBy("fecha","desc"));
  const snapshot = await getDocs(q);
  archivosList.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.classList.add("archivoItem");
    div.innerHTML = `
      <span>${data.titulo}</span>
      <div>
        <button onclick="window.open('${data.archivoURL}','_blank')">Abrir</button>
        <button onclick="window.location.href='${data.archivoURL}'">Descargar</button>
      </div>
    `;
    archivosList.appendChild(div);
  });
}

// Cargar archivos al iniciar
cargarArchivos();
// LOGIN
async function login() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    loginDiv.style.display = "none";
    contenidoDiv.style.display = "block";
    usuarioNombre.textContent = email.split("@")[0];

    // Mostrar menú lateral y chat solo al usuario autenticado
    menuToggle.style.display = "block";
    chatButton.style.display = "block";

    // Inicializa chat
    initChat();

    // Carga menú lateral según roles
    cargarMenuLateral(user.email);

  } catch (error) {
    alert("Error de login: " + error.message);
  }
}

// Evento login
document.querySelector("#loginDiv button").addEventListener("click", login);

// MENÚ LATERAL
menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});

function cargarMenuLateral(email){
  // Define roles y páginas
  const roles = {
    "arquitecto@sestevez.com": ["Direccion","Economia","Produccion","Comercial","Recursos Humanos"],
    "administrador@sestevez.com": ["Direccion"],
    "secretaria@sestevez.com": ["Direccion"],
    "economica@sestevez.com": ["Economia"],
    "civil@sestevez.com": ["Produccion"],
    "recursosh@sestevez.com": ["Recursos Humanos"],
    "comercial@sestevez.com": ["Comercial"]
  };

  const menu = roles[email] || [];
  const sidebarMenu = document.getElementById("sidebarMenu");
  sidebarMenu.innerHTML = "";
  menu.forEach(depto => {
    const li = document.createElement("li");
    li.textContent = depto;
    li.addEventListener("click", () => {
      alert("Ir a la página de " + depto); // Aquí se cargará la página real de cada departamento
    });
    sidebarMenu.appendChild(li);
  });
}

// CHAT FUNCIONAL
let chatListener;

function initChat() {
  const q = query(collection(db,"chat"), orderBy("fecha"));
  chatListener = onSnapshot(q, snapshot => {
    chatMensajes.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const hora = data.fecha ? new Date(data.fecha.seconds*1000).toLocaleTimeString() : "";
      const mensaje = document.createElement("div");
      mensaje.classList.add("mensaje");
      mensaje.innerHTML = `<b>${data.nombre}</b>: ${data.mensaje} <span>${hora}</span>`;
      chatMensajes.appendChild(mensaje);
    });
    chatMensajes.scrollTop = chatMensajes.scrollHeight;
    document.getElementById("chatBadge").textContent = snapshot.size;
  });
}

window.abrirChat = () => { chatDiv.style.display="flex"; }
window.cerrarChat = () => { chatDiv.style.display="none"; }

window.enviarMensaje = async () => {
  const mensaje = chatInput.value.trim();
  if(!mensaje) return;
  const email = auth.currentUser.email;
  const nombre = email.split('@')[0];
  await addDoc(collection(db,"chat"), {
    nombre,
    mensaje,
    fecha: serverTimestamp()
  });
  chatInput.value = "";
};
