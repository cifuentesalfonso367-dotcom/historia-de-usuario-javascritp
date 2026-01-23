import { storage } from './services/storage.js';
import { createNoteItem } from './components/NoteItem.js';

const input = document.getElementById('notaInput');
const btnAgregar = document.querySelector('#btnAgregar');
const listaUl = document.getElementById('listaNotas');

let notas = storage.get();

console.log("Referencias DOM cargadas:", { input, btnAgregar, listaUl });
console.log(`Se cargaron ${notas.length} notas desde Local Storage.`);

function renderNota(texto) {
    const item = createNoteItem(texto, () => {

        notas = notas.filter(n => n !== texto);
        storage.save(notas);
    });
    listaUl.appendChild(item);
}


notas.forEach(nota => renderNota(nota));


btnAgregar.addEventListener('click', () => {
    const texto = input.value.trim();

    if (texto === "") {
        alert("Por favor, escribe algo.");
        return;
    }
    notas.push(texto);
    storage.save(notas);

    renderNota(texto);

    input.value = "";
    input.focus();
    console.log("Nota agregada con éxito.");
});