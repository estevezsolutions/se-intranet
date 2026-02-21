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

  // ---------------- Función para cargar archivos desde Firestore ----------------
  async function cargarArchivos(carpetaId, containerId){
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = "";

    const snapshot = await getDocs(collection(db, "departamentos", "direccion", carpetaId));
    snapshot.forEach(docItem => {
      const data = docItem.data();
      const archivoDiv = document.createElement("div");
      archivoDiv.classList.add("archivoItem");

      // Botones para todos
      let botones = `
        <button onclick="window.open('${data.url}','_blank')">Abrir</button>
        <button onclick="descargarArchivo('${data.url}','${data.nombre}')">Descargar</button>
      `;

      // Solo admin o usuario autorizado puede borrar
      const email = auth.currentUser?.email;
      if(email === "arquitecto@sestevez.com" || email === "administrador@sestevez.com"){
        botones += `<button onclick="borrarArchivo('${carpetaId}','${docItem.id}','${data.nombre}')">Borrar</button>`;
      }

      archivoDiv.innerHTML = `<span>${data.nombre}</span>${botones}`;
      container.appendChild(archivoDiv);
    });
  }

  // ---------------- Borrar archivo ----------------
  window.borrarArchivo = async (carpetaId, docId, nombreArchivo) => {
    if(!confirm(`¿Eliminar ${nombreArchivo}?`)) return;
    try {
      await deleteDoc(doc(db, "departamentos", "direccion", carpetaId, docId));
      const storageRef = ref(storage, `direccion/${carpetaId}/${nombreArchivo}`);
      await deleteObject(storageRef);
      cargarArchivos(carpetaId, carpetaId);
    } catch(e) {
      alert("Error al eliminar archivo: " + e.message);
    }
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

        // Subir archivo a Storage
        const storageRef = ref(storage, `direccion/${carpetaId}/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);

        // Guardar metadatos en Firestore
        await addDoc(collection(db, "departamentos", "direccion", carpetaId), {
          nombre: file.name,
          url
        });

        // Recargar archivos
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