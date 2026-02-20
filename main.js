// main.js
import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ------------------- Elementos HTML -------------------
const loginDiv = document.getElementById("loginDiv");
const contenidoDiv = document.getElementById("contenidoDiv");
const usuarioNombre = document.getElementById("usuarioNombre");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Botón y sidebar
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const sidebarMenu = document.getElementById("sidebarMenu");

// Chat
const chatButton = document.getElementById("chatButton");
const chatDiv = document.getElementById("chatDiv");
const chatMensajes = document.getElementById("chatMensajes");
const chatInput = document.getElementById("chatInput");

// Subida de archivos
const addFileBtn = document.getElementById("addFileBtn");
const uploadForm = document.getElementById("uploadForm");
const submitArchivo = document.getElementById("submitArchivo");
const archivoInput = document.getElementById("archivoInput");
const archivoTitulo = document.getElementById("archivoTitulo");
const status = document.getElementById("status");
const archivosList = document.getElementById("archivosList");

// ------------------- Login -------------------
async function login() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Debes ingresar correo y contraseña");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Ocultar login y mostrar contenido
    loginDiv.style.display = "none";
    contenidoDiv.style.display = "block";

    // Verificar que el span exista
   // Diccionario de nombres de bienvenida según usuario
const nombresBienvenida = {
  "arquitecto@sestevez.com": "Emanuel",
  "administrador@sestevez.com": "Adriel",
  "economica@sestevez.com": "Elenita",
  "civil@sestevez.com": "Doime",
  "secretaria@sestevez.com": "Secretaria",
  "recursosh@sestevez.com": "RRHH",
  "comercial@sestevez.com": "Comercial"
};

const nombre = nombresBienvenida[email] || email.split("@")[0];
if(usuarioNombre) usuarioNombre.textContent = "Bienvenido " + nombre;

    // Mostrar menú y chat
    if(menuToggle) menuToggle.style.display = "block";
    if(chatButton) chatButton.style.display = "block";

    // Inicializar chat
    initChat();

    // Cargar menú lateral según roles
    cargarMenuLateral(user.email);

    // Inicializar archivos
    cargarArchivos();

  } catch (error) {
    alert("Error de login: " + error.message);
  }
}

document.querySelector("#loginDiv button").addEventListener("click", login);

// ------------------- Menú lateral -------------------
if(menuToggle && sidebar) {
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("show");
  });
}

function cargarMenuLateral(email){
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
  if(!sidebarMenu) return;

  sidebarMenu.innerHTML = "";
  menu.forEach(depto => {
    const li = document.createElement("li");
    li.textContent = depto;
    li.addEventListener("click", () => {
  // Oculta todos los contenidos de departamentos
  const deptos = document.querySelectorAll(".departamentoDiv");
  deptos.forEach(d => d.style.display = "none");

  // Muestra solo el departamento seleccionado
  const depDiv = document.getElementById("depto_" + depto.replace(/\s+/g,''));
  if(depDiv) depDiv.style.display = "block";
});
    sidebarMenu.appendChild(li);
  });
}

// ------------------- Chat -------------------
let chatListener;

function initChat() {
  const q = query(collection(db,"chat"), orderBy("fecha"));
  chatListener = onSnapshot(q, snapshot => {
    if(!chatMensajes) return;
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

    const badge = document.getElementById("chatBadge");
    if(badge) badge.textContent = snapshot.size;
  });
}

window.abrirChat = () => { if(chatDiv) chatDiv.style.display="flex"; }
window.cerrarChat = () => { if(chatDiv) chatDiv.style.display="none"; }

window.enviarMensaje = async () => {
  if(!chatInput || !chatInput.value.trim()) return;

  const mensaje = chatInput.value.trim();
  const email = auth.currentUser.email;
  const nombre = email.split('@')[0];

  await addDoc(collection(db,"chat"), {
    nombre,
    mensaje,
    fecha: serverTimestamp()
  });

  chatInput.value = "";
};

// ------------------- Subida de archivos -------------------
if(addFileBtn && uploadForm) {
  addFileBtn.addEventListener("click", () => {
    uploadForm.style.display = uploadForm.style.display === "none" ? "block" : "none";
  });
}

if(submitArchivo) {
  submitArchivo.addEventListener("click", async () => {
    if(!archivoInput.files[0] || !archivoTitulo.value) {
      status.textContent = "Por favor completa todos los campos.";
      return;
    }
    status.textContent = "Subiendo...";

    const file = archivoInput.files[0];
    const titulo = archivoTitulo.value;

    try {
      // Aquí debes integrar tu API de Google Drive para obtener archivoURL real
      const archivoURL = "https://drive.google.com/archivoID"; // temporal

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
}

// ------------------- Cargar archivos -------------------
async function cargarArchivos() {
  if(!archivosList) return;

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
