// main.js
import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ------------------- Elementos HTML -------------------
const loginDiv = document.getElementById("loginDiv");
const contenidoDiv = document.getElementById("contenidoDiv");
const bienvenida = document.getElementById("bienvenida");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const sidebarMenu = document.getElementById("sidebarMenu");

// Chat
const chatButton = document.getElementById("chatButton");
const chatDiv = document.getElementById("chatDiv");
const chatMensajes = document.getElementById("chatMensajes");
const chatInput = document.getElementById("chatInput");

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

    // Mensaje de bienvenida
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
    if(bienvenida) bienvenida.textContent = "Bienvenido " + nombre;

    // Mostrar menú lateral y chat
    if(menuToggle) menuToggle.style.display = "block";
    if(chatButton) chatButton.style.display = "block";

    // Inicializar chat
    initChat();

    // Cargar menú lateral completo
    cargarMenuLateral();

    // Ocultar todos los departamentos al iniciar
    ocultarDepartamentos();

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

function cargarMenuLateral(){
  const departamentos = ["Direccion","Economia","Produccion","Comercial","RecursosHumanos"];
  sidebarMenu.innerHTML = "";

  departamentos.forEach(depto => {
    const li = document.createElement("li");
    li.textContent = depto;

    li.addEventListener("click", () => {
      const depDiv = document.getElementById("depto_" + depto.replace(/\s+/g,''));

      if(depDiv){
        // Solo hacer scroll hacia el departamento
        depDiv.scrollIntoView({ behavior: "smooth" });
      }

      // Ocultar menú lateral en móvil
      sidebar.classList.remove("show");
    });

    sidebarMenu.appendChild(li);
  });
}

function ocultarDepartamentos(){
  const deptos = document.querySelectorAll(".departamentoDiv");
  deptos.forEach(d => d.style.display = "none");
}

// ------------------- Chat estilo WhatsApp -------------------
let chatListener;

function initChat() {
  const q = query(collection(db,"chat"), orderBy("fecha"));
  
  chatListener = onSnapshot(q, snapshot => {
    if(!chatMensajes) return;
    chatMensajes.innerHTML = "";
    
    let unreadCount = 0; // contador de mensajes no leídos

    snapshot.forEach(async docSnap => {
      const data = docSnap.data();
      const fecha = data.fecha ? new Date(data.fecha.seconds*1000) : new Date();
      const hora = fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      const fechaStr = fecha.toLocaleDateString();

      const mensajeDiv = document.createElement("div");

      const esPropio = auth.currentUser && auth.currentUser.email === data.email;
      mensajeDiv.classList.add("mensaje");
      mensajeDiv.classList.add(esPropio ? "mensaje-propio" : "mensaje-otro");

      // Burbuja estilo WhatsApp
      mensajeDiv.innerHTML = `
        <div class="burbuja">
          <div class="texto"><b>${data.nombre}</b>: ${data.mensaje}</div>
          <div class="hora">${fechaStr} ${hora}</div>
          <div class="estado">
            ${esPropio 
              ? `<span class="punto ${data.visto ? 'verde' : 'rojo'}">•</span>
                 <span class="punto ${data.visto ? 'verde' : 'rojo'}">•</span>`
              : ''}
          </div>
        </div>
      `;

      chatMensajes.appendChild(mensajeDiv);

      // 🔹 Marcar mensaje como leído si no es mío y actualizar Firestore
      if(!esPropio && !data.visto){
        unreadCount++;
        await updateDoc(doc(db,"chat",docSnap.id), { visto: true });
      }
    });

    // Actualizar burbuja de notificación
    const badge = document.getElementById("chatBadge");
    if(badge){
      badge.style.display = unreadCount ? "flex" : "none";
      badge.textContent = unreadCount;
    }

    chatMensajes.scrollTop = chatMensajes.scrollHeight;
  });
}

window.abrirChat = () => { 
  if(chatDiv) chatDiv.style.display="flex"; 
};
window.cerrarChat = () => { 
  if(chatDiv) chatDiv.style.display="none"; 
};

window.enviarMensaje = async () => {
  if(!chatInput || !chatInput.value.trim()) return;

  const mensajeTexto = chatInput.value.trim();
  const email = auth.currentUser.email;
  const nombres = {
    "arquitecto@sestevez.com": "Emanuel",
    "administrador@sestevez.com": "Adriel",
    "economica@sestevez.com": "Elenita",
    "civil@sestevez.com": "Doime",
    "secretaria@sestevez.com": "Secretaria",
    "recursosh@sestevez.com": "RRHH",
    "comercial@sestevez.com": "Comercial"
  };
  const nombre = nombres[email] || email.split("@")[0];

  await addDoc(collection(db,"chat"), {
    nombre,
    email,
    mensaje: mensajeTexto,
    fecha: serverTimestamp(),
    entregado: true,
    visto: false
  });

  chatInput.value = "";
};