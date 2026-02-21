import { auth } from '../firebase-config.js';

document.addEventListener("DOMContentLoaded", () => {

  // ------------------- Elementos DOM -------------------
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const sidebarMenu = document.getElementById("sidebarMenu");
  const agregarBotones = document.querySelectorAll('.agregarArchivo');
  const fileInput = document.getElementById("fileInput");

  // ------------------- Menú lateral -------------------
  const departamentos = [
    { nombre: "Direccion", url: "direccion.html" },
    { nombre: "Economia", url: "economia.html" },
    { nombre: "Produccion", url: "produccion.html" },
    { nombre: "Comercial", url: "comercial.html" },
    { nombre: "Recursos Humanos", url: "rrhh.html" }
  ];

  function cargarMenuLateral() {
    if(!sidebarMenu) return;
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

  // ------------------- Manejo de archivos locales -------------------
  // Creamos un objeto por cada tarjeta para almacenar los archivos en memoria
  const archivosPorTarjeta = {
    facturasEmitidas: [],
    facturasRecibidas: [],
    nominas: [],
    inventario: [],
    otrosDocumentos: []
  };

  function renderArchivos(tarjetaId){
    const container = document.getElementById(tarjetaId);
    if(!container) return;
    container.innerHTML = "";

    archivosPorTarjeta[tarjetaId].forEach((archivo, index) => {
      const archivoDiv = document.createElement("div");
      archivoDiv.classList.add("archivoItem");

      let botones = `
        <button onclick="window.open('${archivo.url}','_blank')">Abrir</button>
        <button onclick="descargarArchivo('${archivo.url}','${archivo.name}')">Descargar</button>
      `;

      // Mostrar Borrar solo para admin o autorizado
      const email = auth.currentUser?.email;
      const autorizados = ["administrador@sestevez.com", "economica@sestevez.com"];
      if(autorizados.includes(email)){
        botones += `<button class="borrarArchivo" data-tarjeta="${tarjetaId}" data-index="${index}">Borrar</button>`;
      }

      archivoDiv.innerHTML = `<span>${archivo.name}</span>${botones}`;
      container.appendChild(archivoDiv);
    });

    // Agregar listener a borrar
    const borrarBtns = container.querySelectorAll('.borrarArchivo');
    borrarBtns.forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const tId = e.target.dataset.tarjeta;
        const idx = parseInt(e.target.dataset.index);
        archivosPorTarjeta[tId].splice(idx,1);
        renderArchivos(tId);
      });
    });
  }

  window.descargarArchivo = (url, nombre) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();
  };

  // ------------------- Botones agregar archivo -------------------
  agregarBotones.forEach(btn => {
    btn.addEventListener('click', () => {
      if(fileInput) fileInput.click();
      // Guardar en qué tarjeta se hizo clic
      fileInput.dataset.tarjeta = btn.previousElementSibling.id;
    });
  });

  fileInput.addEventListener('change', () => {
    const tarjetaId = fileInput.dataset.tarjeta;
    if(fileInput.files.length > 0 && tarjetaId){
      Array.from(fileInput.files).forEach(file => {
        // Crear URL temporal para abrir el archivo
        const fileURL = URL.createObjectURL(file);
        archivosPorTarjeta[tarjetaId].push({name: file.name, url: fileURL});
      });
      renderArchivos(tarjetaId);
      // Limpiar input para poder agregar mismos archivos después
      fileInput.value = "";
    }
  });

});