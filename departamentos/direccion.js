import { auth, db, storage } from '../firebase-config.js';
import { collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

document.addEventListener('DOMContentLoaded', () => {

  // ---------------- Sidebar ----------------
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const sidebarMenu = document.getElementById("sidebarMenu");

  const departamentos = [
    { nombre: "Dirección", url: "/departamentos/direccion.html" },
    { nombre: "Economía", url: "/departamentos/economia.html" },
    { nombre: "Producción", url: "/departamentos/produccion.html" },
    { nombre: "Comercial", url: "/departamentos/comercial.html" },
    { nombre: "Recursos Humanos", url: "/departamentos/rrhh.html" }
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

  if(menuToggle && sidebar){
    menuToggle.addEventListener("click", () => sidebar.classList.toggle("show"));
  }

  cargarMenuLateral();

  // ---------------- Acordeones ----------------
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

  // ---------------- Descargar archivo ----------------
  window.descargarArchivo = (url, nombre) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();
  };

  // ---------------- Botones de agregar archivo ----------------
  const agregarBotones = document.querySelectorAll('.agregarArchivo');
  const fileInput = document.getElementById('fileInput');

  agregarBotones.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      fileInput.click();

      fileInput.onchange = async () => {
        if(fileInput.files.length === 0) return;
        const file = fileInput.files[0];

        // Determinar carpeta según el índice del botón
        let carpetaId;
        if(idx === 0) carpetaId = "documentosEmpresa";
        else if(idx === 1) carpetaId = "actas";
        else carpetaId = "otrosDocumentos";

        // --- Aquí debes agregar tu código para subir a Google Drive ---
        // Ejemplo:
        // await subirArchivoDrive(carpetaId, file);

        // Limpiar input
        fileInput.value = '';
      };
    });
  });

});