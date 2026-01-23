// TASK 1: Configuración inicial del proyecto - Archivo: sistema_interactivo.js

// TASK 2: Entrada de datos del usuario
// Usamos prompt para capturar la información y const para valores que no reasignaremos
const nombreUsuario = prompt("Por favor, ingresa tu nombre:");
const entradaEdad = prompt("Por favor, ingresa tu edad:");

// Convertimos la entrada de texto a un número para poder validarla
const edadUsuario = Number(entradaEdad);

// TASK 3: Validación de la edad
// Verificamos si la conversión resultó en un NaN (Not a Number) o si el campo está vacío
if (isNaN(edadUsuario) || entradaEdad === null || entradaEdad.trim() === "") {
    
    // Mostramos error en consola según el requerimiento
    console.error("Error: Por favor, ingresa una edad válida en números.");
    alert("Hubo un error con tu edad. Revisa la consola para más detalles.");

} else {
    // TASK 4: Condicionales y mensajes dinámicos
    
    if (edadUsuario < 18) {
        // Mensaje para menores de edad
        const mensajeMenor = `Hola ${nombreUsuario}, eres menor de edad. ¡Sigue aprendiendo y disfrutando del código!`;
        console.log(mensajeMenor);
        alert(mensajeMenor);
    } else {
        // Mensaje para mayores de edad (18 o más)
        const mensajeMayor = `Hola ${nombreUsuario}, eres mayor de edad. ¡Prepárate para grandes oportunidades en el mundo de la programación!`;
        console.log(mensajeMayor);
        alert(mensajeMayor);
    }
}