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

  // ------------------- Botones agregar archivo -------------------
  agregarBotones.forEach(btn => {
    btn.addEventListener('click', () => {
      if(fileInput) fileInput.click();
    });
  });

  fileInput.addEventListener('change', () => {
    if(fileInput.files.length > 0){
      alert(`Archivos seleccionados: ${Array.from(fileInput.files).map(f => f.name).join(", ")}`);
    }
  });

});