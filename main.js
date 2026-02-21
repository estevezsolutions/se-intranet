import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// ------------------- Elementos HTML -------------------
const loginDiv = document.getElementById("loginDiv");
const contenidoDiv = document.getElementById("contenidoDiv");
const bienvenida = document.getElementById("bienvenida");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const sidebarMenu = document.getElementById("sidebarMenu");

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
    contenidoDiv.style.display = "flex";

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
    if(bienvenida) bienvenida.textContent =nombre;

    // Mostrar menú lateral
    if(menuToggle) menuToggle.style.display = "block";

    // Cargar menú lateral completo con enlaces
    cargarMenuLateral();

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
  const departamentos = [
    {nombre:"Direccion", url:"departamentos/direccion.html"},
    {nombre:"Economia", url:"departamentos/economia.html"},
    {nombre:"Produccion", url:"departamentos/produccion.html"},
    {nombre:"Comercial", url:"departamentos/comercial.html"},
    {nombre:"Recursos Humanos", url:"departamentos/rrhh.html"}
];

  sidebarMenu.innerHTML = "";

  departamentos.forEach(depto => {
    const li = document.createElement("li");
    li.textContent = depto.nombre;

    li.addEventListener("click", () => {
      window.location.href = depto.url;
    });

    sidebarMenu.appendChild(li);
  });
}