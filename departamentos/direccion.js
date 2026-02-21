import { auth } from '../firebase-config.js';

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

  // ---------------- Archivos desde Google Drive ----------------
  // Rutas de carpetas en Drive (con enlaces públicos)
  const archivosDrive = {
    "documentosEmpresa": [
      { nombre: "Manual de calidad.pdf", url: "https://drive.google.com/uc?export=download&id=TU_ID_1" },
      { nombre: "Reglamento interno.pdf", url: "https://drive.google.com/uc?export=download&id=TU_ID_2" }
    ],
    "actas": [
      { nombre: "Acta_2026_01.pdf", url: "https://drive.google.com/uc?export=download&id=TU_ID_3" }
    ],
    "otrosDocumentos": [
      { nombre: "Formulario_solicitud.docx", url: "https://drive.google.com/uc?export=download&id=TU_ID_4" }
    ]
  };

  function cargarArchivos(carpetaId, containerId){
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = "";

    const archivos = archivosDrive[carpetaId] || [];
    archivos.forEach(file => {
      const archivoDiv = document.createElement("div");
      archivoDiv.classList.add("archivoItem");

      let botones = `
        <button onclick="window.open('${file.url}','_blank')">Abrir</button>
        <button onclick="descargarArchivo('${file.url}','${file.nombre}')">Descargar</button>
      `;

      // Botón Borrar solo como placeholder (no elimina Drive)
      const email = auth.currentUser?.email;
      if(email === "arquitecto@sestevez.com" || email === "administrador@sestevez.com"){
        botones += `<button onclick="alert('El borrado se realiza directamente en Google Drive')">Borrar</button>`;
      }

      archivoDiv.innerHTML = `<span>${file.nombre}</span>${botones}`;
      container.appendChild(archivoDiv);
    });
  }

  // ---------------- Botones de agregar archivo ----------------
  const agregarBotones = document.querySelectorAll('.agregarArchivo');
  const fileInput = document.getElementById('fileInput');

  agregarBotones.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      fileInput.click();

      fileInput.onchange = () => {
        if(fileInput.files.length === 0) return;
        const file = fileInput.files[0];

        // Determinar carpeta según índice
        let carpetaId;
        if(idx === 0) carpetaId = "documentosEmpresa";
        else if(idx === 1) carpetaId = "actas";
        else carpetaId = "otrosDocumentos";

        // Solo agregamos visualmente; subida manual a Drive
        const url = URL.createObjectURL(file);
        archivosDrive[carpetaId].push({ nombre: file.name, url });
        cargarArchivos(carpetaId, carpetaId);

        // Limpiar input
        fileInput.value = '';
      };
    });
  });

  // ---------------- Cargar archivos inicial ----------------
  cargarArchivos("documentosEmpresa","documentosEmpresa");
  cargarArchivos("actas","actas");
  cargarArchivos("otrosDocumentos","otrosDocumentos");

});