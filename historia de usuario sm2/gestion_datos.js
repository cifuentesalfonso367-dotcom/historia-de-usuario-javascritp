const productosRaw = [
    { id: 101, nombre: "Laptop Pro", precio: 1200, categoria: "Electrónica" },
    { id: 102, nombre: "Mouse Óptico", precio: 25, categoria: "Accesorios" },
    { id: 103, nombre: "Teclado Mecánico", precio: 80, categoria: "Accesorios" },
    { id: 104, nombre: "", precio: 50, categoria: "Invalido" },
    { id: 105, nombre: "Monitor 4K", precio: -10, categoria: "Electrónica" }
];

const productosValidos = {};

function validarProducto(prod) {
    return prod.id && prod.nombre.length > 0 && prod.precio > 0;
}

productosRaw.forEach(p => {
    if (validarProducto(p)) {
        productosValidos[p.id] = { nombre: p.nombre, precio: p.precio, categoria: p.categoria };
    }
});

const numerosSet = new Set([1, 2, 2, 3, 4, 4, 5]);
numerosSet.add(6);
numerosSet.has(3);
numerosSet.delete(2);

const categoriaMap = new Map();
Object.entries(productosValidos).forEach(([id, info]) => {
    categoriaMap.set(info.categoria, info.nombre);
});

console.log("--- OBJETOS (for...in) ---");
for (let id in productosValidos) {
    console.log(`ID: ${id} | Producto: ${productosValidos[id].nombre} | Precio: ${productosValidos[id].precio}`);
}

console.log("\n--- SET (for...of) ---");
for (let num of numerosSet) {
    console.log(`Valor único: ${num}`);
}

console.log("\n--- MAP (forEach) ---");
categoriaMap.forEach((producto, categoria) => {
    console.log(`Categoría: ${categoria} - Producto: ${producto}`);
});

console.log("\n--- MÉTODOS DE OBJETO ---");
console.log("Keys:", Object.keys(productosValidos));
console.log("Values:", Object.values(productosValidos));
console.log("Entries:", Object.entries(productosValidos));