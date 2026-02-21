import { auth } from '../firebase-config.js';

// Sidebar
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const sidebarMenu = document.getElementById("sidebarMenu");

const departamentos = [
  {nombre:"Direccion", url:"direccion.html"},
  {nombre:"Economia", url:"economia.html"},
  {nombre:"Produccion", url:"produccion.html"},
  {nombre:"Comercial", url:"comercial.html"},
  {nombre:"Recursos Humanos", url:"rrhh.html"}
];

function cargarMenuLateral(){
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

if(menuToggle && sidebar){
  menuToggle.addEventListener("click", ()=>{ sidebar.classList.toggle("show"); });
}

cargarMenuLateral();

// --------- Función para manejar archivos locales ----------
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

function agregarArchivo(containerId, carpetaDriveUrl){
  const container = document.getElementById(containerId);
  if(!container) return;

  fileInput.onchange = () => {
    if(fileInput.files.length === 0) return;

    const file = fileInput.files[0];

    // Crear div del archivo
    const archivoDiv = document.createElement('div');
    archivoDiv.classList.add('archivoItem');

    const abrirBtn = document.createElement('button');
    abrirBtn.textContent = "Abrir";
    abrirBtn.onclick = () => {
      window.open(URL.createObjectURL(file), "_blank");
    };

    const descargarBtn = document.createElement('button');
    descargarBtn.textContent = "Descargar";
    descargarBtn.onclick = () => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(file);
      a.download = file.name;
      a.click();
    };

    archivoDiv.appendChild(document.createTextNode(file.name));
    archivoDiv.appendChild(abrirBtn);
    archivoDiv.appendChild(descargarBtn);

    // Solo mostrar botón borrar si es usuario autorizado
    const email = auth.currentUser?.email;
    if(email === "arquitecto@sestevez.com" || email === "administrador@sestevez.com"){
      const borrarBtn = document.createElement('button');
      borrarBtn.textContent = "Borrar";
      borrarBtn.onclick = () => { archivoDiv.remove(); };
      archivoDiv.appendChild(borrarBtn);
    }

    container.appendChild(archivoDiv);
  };

  fileInput.click();
}

// Botones "Agregar archivo"
document.querySelectorAll('.agregarArchivo').forEach(btn => {
  btn.addEventListener('click', () => {
    const parent = btn.closest('.accordion-content');
    const container = parent.querySelector('div');
    agregarArchivo(container.id);
  });
});