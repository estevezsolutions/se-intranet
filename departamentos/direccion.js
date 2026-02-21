// direccion.js corregido

import { auth, db } from '../firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  // ------------------- Elementos DOM -------------------
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const sidebarMenu = document.getElementById("sidebarMenu");

  // ------------------- Mostrar botón menú lateral -------------------
  if (menuToggle) menuToggle.style.display = "block";

  // ------------------- Menú lateral -------------------
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

  // ------------------- Función para mostrar archivos -------------------
  async function cargarArchivos(carpetaId, containerId){
    const container = document.getElementById(containerId);
    if(!container) return; // evita errores si no existe el contenedor
    container.innerHTML = "";

    const snapshot = await getDocs(collection(db, "departamentos", "direccion", carpetaId));
    snapshot.forEach(docItem => {
      const data = docItem.data();
      const archivoDiv = document.createElement("div");
      archivoDiv.classList.add("archivoItem");

      let botones = `
        <button onclick="window.open('${data.url}','_blank')">Abrir</button>
        <button onclick="descargarArchivo('${data.url}','${data.nombre}')">Descargar</button>
      `;

      // Si es admin o director
      const email = auth.currentUser?.email;
      if(email === "arquitecto@sestevez.com" || email === "administrador@sestevez.com"){
        botones += `<button class="editarArchivo">Editar</button>`;
      }

      archivoDiv.innerHTML = `<span>${data.nombre}</span>${botones}`;
      container.appendChild(archivoDiv);
    });
  }

  // ------------------- Descargar archivo -------------------
  window.descargarArchivo = (url, nombre) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();
  };

  // ------------------- Botón de añadir archivo -------------------
  const agregarBotones = document.querySelectorAll('.agregarArchivo');
  agregarBotones.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      alert("Aquí abrirías un modal para subir un archivo (pendiente implementar)");
    });
  });

  // ------------------- Cargar archivos inicial -------------------
  cargarArchivos("documentosEmpresa","documentosEmpresa");
  cargarArchivos("otrosDocumentos","otrosDocumentos");

});