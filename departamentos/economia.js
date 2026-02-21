import { auth } from '../firebase-config.js';

// ------------------- Sidebar -------------------
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const sidebarMenu = document.getElementById("sidebarMenu");

// Lista de departamentos para el menú lateral
const departamentos = [
  { nombre: "Dirección", url: "direccion.html" },
  { nombre: "Economía", url: "economia.html" },
  { nombre: "Producción", url: "produccion.html" },
  { nombre: "Comercial", url: "comercial.html" },
  { nombre: "Recursos Humanos", url: "rrhh.html" }
];

// Función para cargar menú lateral
function cargarMenuLateral() {
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

// Activar menú lateral
if(menuToggle && sidebar){
  menuToggle.addEventListener("click", ()=>{ sidebar.classList.toggle("show"); });
}

cargarMenuLateral();

// ------------------- Acordeones -------------------
const accordions = document.querySelectorAll('.accordion');
accordions.forEach(acc => {
  const header = acc.querySelector('.accordion-header');
  const content = acc.querySelector('.accordion-content');
  if(header && content){
    header.addEventListener('click', () => {
      content.style.display = content.style.display === "block" ? "none" : "block";
    });
  }
});

// ------------------- Manejo de archivos locales -------------------
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

// IDs de contenedores por tarjeta
const contenedores = [
  "facturasEmitidas",
  "facturasRecibidas",
  "nominas",
  "inventario",
  "otrosDocumentos"
];

// Función para crear la vista de un archivo subido
function agregarArchivoLocal(nombreArchivo, containerId) {
  const container = document.getElementById(containerId);
  if(!container) return;

  const archivoDiv = document.createElement('div');
  archivoDiv.classList.add('archivoItem');

  const botones = `
    <button onclick="window.open('${nombreArchivo}','_blank')">Abrir</button>
    <button onclick="descargarArchivo('${nombreArchivo}','${nombreArchivo}')">Descargar</button>
  `;

  archivoDiv.innerHTML = `<span>${nombreArchivo}</span>${botones}`;
  container.appendChild(archivoDiv);
}

// Descargar archivo local
window.descargarArchivo = (url, nombre) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  a.click();
};

// Botones de agregar archivo
const agregarBotones = document.querySelectorAll('.agregarArchivo');
agregarBotones.forEach((btn, idx)=>{
  const containerId = contenedores[idx];
  btn.addEventListener('click', ()=>{
    fileInput.click();
    fileInput.onchange = () => {
      if(fileInput.files.length > 0){
        const file = fileInput.files[0];
        // Crear objeto URL temporal para abrirlo en la web
        const url = URL.createObjectURL(file);
        agregarArchivoLocal(url, containerId);
      }
    };
  });
});