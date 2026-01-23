export function createNoteItem(text, onDelete) {

    const li = document.createElement('li');
    
    const span = document.createElement('span');
    span.textContent = text;

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = "Eliminar";
    btnEliminar.className = "delete-btn";
    
    btnEliminar.addEventListener('click', () => {
        onDelete();
        li.remove();
        console.log(`Nota eliminada: "${text}"`);
    });

    li.appendChild(span);
    li.appendChild(btnEliminar);
    
    return li;
}