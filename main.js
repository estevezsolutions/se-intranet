import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    document.getElementById("loginDiv").style.display = "none";
    document.getElementById("contenidoDiv").style.display = "block";
    document.getElementById("usuarioNombre").innerText = user.email.split('@')[0]; // nombre corto

    // Guardar departamento del usuario
    usuarioActual.email = user.email;
    // usuarioActual.departamento = ... (lo sacamos de Firestore después)
    
    console.log("Usuario conectado:", user.email);
  } catch (error) {
    alert("Error en el login: " + error.message);
  }
}
