import { auth } from '../firebase-config.js';

// ------------------- Menú lateral -------------------
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const sidebarMenu = document.getElementById("sidebarMenu");

// Misma estructura de menú que Dirección
const departamentos = [
  { nombre: "Direccion", url: "direccion.html" },
  { nombre: "Economia", url: "economia.html" },
  { nombre: "Produccion", url: "produccion.html" },
  { nombre: "Comercial", url: "comercial.html" },
  { nombre: "Recursos Humanos", url: "rrhh.html" }
];

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

if (menuToggle && sidebar) {
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("show");
  });
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

// ------------------- Agregar archivos localmente -------------------
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

function agregarArchivoLocal(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  fileInput.onchange = () => {
    if (fileInput.files.length > 0) {
      const archivo = fileInput.files[0];

      const archivoDiv = document.createElement('div');
      archivoDiv.classList.add('archivoItem');

      const span = document.createElement('span');
      span.textContent = archivo.name;

      const abrirBtn = document.createElement('button');
      abrirBtn.textContent = 'Abrir';
      abrirBtn.onclick = () => {
        const url = URL.createObjectURL(archivo);
        window.open(url, '_blank');
      };

      const descargarBtn = document.createElement('button');
      descargarBtn.textContent = 'Descargar';
      descargarBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(archivo);
        a.download = archivo.name;
        a.click();
      };

      archivoDiv.appendChild(span);
      archivoDiv.appendChild(abrirBtn);
      archivoDiv.appendChild(descargarBtn);
      container.appendChild(archivoDiv);
    }
    fileInput.value = '';
  };

  fileInput.click();
}

// ------------------- Botones + Agregar archivo -------------------
document.querySelectorAll('.agregarArchivo').forEach(btn => {
  btn.addEventListener('click', () => {
    const container = btn.previousElementSibling.id;
    agregarArchivoLocal(container);
  });
});