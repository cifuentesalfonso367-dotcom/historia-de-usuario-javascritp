// ============================================
// TASK 1: ESTRUCTURA INICIAL Y CONFIGURACIÓN
// ============================================

/**
 * Configuración de la API
 * Cambia esta URL si usas un servidor diferente
 */
const API_URL = 'http://localhost:3000/products';

/**
 * Variables globales para almacenar el estado de la aplicación
 */
let products = []; // Array que contendrá todos los productos
let editingProductId = null; // ID del producto que se está editando (null si no hay edición)

/**
 * Referencias a elementos del DOM
 */
const productForm = document.getElementById('productForm');
const productNameInput = document.getElementById('productName');
const productPriceInput = document.getElementById('productPrice');
const productDescriptionInput = document.getElementById('productDescription');
const productsList = document.getElementById('productsList');
const alertMessage = document.getElementById('alertMessage');
const syncBtn = document.getElementById('syncBtn');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const formTitle = document.getElementById('formTitle');
const spinner = document.getElementById('spinner');

// ============================================
// TASK 2: CAPTURA E INTERACCIÓN CON EL USUARIO
// ============================================

/**
 * Función para validar los campos del formulario
 * @returns {Object} Objeto con los datos validados o null si hay error
 */
function validateFormData() {
    const name = productNameInput.value.trim();
    const price = parseFloat(productPriceInput.value);
    const description = productDescriptionInput.value.trim();

    // Validación de nombre
    if (!name || name.length < 3) {
        showAlert('El nombre del producto debe tener al menos 3 caracteres', 'error');
        return null;
    }

    // Validación de precio
    if (isNaN(price) || price <= 0) {
        showAlert('El precio debe ser un número mayor a 0', 'error');
        return null;
    }

    // Retornar datos validados
    return {
        name: name,
        price: price,
        description: description || 'Sin descripción'
    };
}

/**
 * Función para mostrar mensajes de alerta
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de alerta ('success' o 'error')
 */
function showAlert(message, type = 'success') {
    alertMessage.textContent = message;
    alertMessage.className = `alert alert-${type} show`;
    
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
        alertMessage.classList.remove('show');
    }, 3000);
}

/**
 * Evento del formulario para agregar o editar productos
 */
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validar datos del formulario
    const productData = validateFormData();
    if (!productData) return;

    // Verificar si estamos editando o agregando
    if (editingProductId !== null) {
        await updateProduct(editingProductId, productData);
    } else {
        await addProduct(productData);
    }
});

/**
 * Cancelar la edición
 */
cancelEditBtn.addEventListener('click', () => {
    cancelEdit();
});

/**
 * Función para cancelar la edición y resetear el formulario
 */
function cancelEdit() {
    editingProductId = null;
    productForm.reset();
    submitBtn.textContent = '➕ Agregar Producto';
    cancelEditBtn.style.display = 'none';
    formTitle.textContent = 'Agregar Nuevo Producto';
    showAlert('Edición cancelada', 'success');
}

// ============================================
// TASK 3: MANIPULACIÓN DINÁMICA DEL DOM
// ============================================

/**
 * Función para renderizar todos los productos en el DOM
 */
function renderProducts() {
    // Limpiar la lista
    productsList.innerHTML = '';

    // Si no hay productos, mostrar mensaje vacío
    if (products.length === 0) {
        productsList.innerHTML = `
            <div class="empty-state">
                <p>No hay productos agregados. ¡Agrega tu primer producto!</p>
            </div>
        `;
        return;
    }

    // Crear elemento <li> para cada producto
    products.forEach(product => {
        const li = createProductElement(product);
        productsList.appendChild(li);
    });

    console.log(`Productos renderizados: ${products.length}`);
}

/**
 * Función para crear un elemento de producto en el DOM
 * @param {Object} product - Objeto con los datos del producto
 * @returns {HTMLElement} Elemento <li> con el producto
 */
function createProductElement(product) {
    const li = document.createElement('li');
    li.className = 'product-item';
    li.setAttribute('data-id', product.id);

    li.innerHTML = `
        <div class="product-header">
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
        </div>
        <div class="product-description">${product.description}</div>
        <div class="product-actions">
            <button class="btn btn-warning" onclick="editProduct(${product.id})">
                ✏️ Editar
            </button>
            <button class="btn btn-danger" onclick="deleteProduct(${product.id})">
                🗑️ Eliminar
            </button>
        </div>
    `;

    return li;
}

// ============================================
// TASK 4: PERSISTENCIA EN LOCAL STORAGE
// ============================================

/**
 * Función para guardar productos en Local Storage
 */
function saveToLocalStorage() {
    try {
        localStorage.setItem('products', JSON.stringify(products));
        console.log('Productos guardados en Local Storage:', products);
    } catch (error) {
        console.error('Error al guardar en Local Storage:', error);
        showAlert('Error al guardar datos localmente', 'error');
    }
}

/**
 * Función para cargar productos desde Local Storage
 */
function loadFromLocalStorage() {
    try {
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
            products = JSON.parse(storedProducts);
            console.log('Productos cargados desde Local Storage:', products);
            renderProducts();
        }
    } catch (error) {
        console.error('Error al cargar desde Local Storage:', error);
        showAlert('Error al cargar datos locales', 'error');
    }
}

// ============================================
// TASK 5: INTEGRACIÓN CON FETCH API
// ============================================

/**
 * GET: Obtener todos los productos desde la API
 */
async function fetchProductsFromAPI() {
    try {
        spinner.classList.add('show');
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        products = data;
        
        // Guardar en Local Storage
        saveToLocalStorage();
        
        // Renderizar en el DOM
        renderProducts();
        
        console.log('GET - Productos obtenidos:', data);
        showAlert(`${products.length} productos sincronizados desde el servidor`, 'success');
        
    } catch (error) {
        console.error('Error al obtener productos:', error);
        showAlert('Error al conectar con el servidor. Usando datos locales.', 'error');
        
        // Si falla la API, cargar desde Local Storage
        loadFromLocalStorage();
    } finally {
        spinner.classList.remove('show');
    }
}

/**
 * POST: Agregar un nuevo producto a la API
 * @param {Object} productData - Datos del producto a agregar
 */
async function addProduct(productData) {
    try {
        // Generar ID temporal
        const newProduct = {
            id: Date.now(),
            ...productData
        };

        // Intentar enviar a la API
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const savedProduct = await response.json();
            console.log('POST - Producto agregado a la API:', savedProduct);
            
            // Actualizar con el ID del servidor
            products.push(savedProduct);
            
        } catch (apiError) {
            console.warn('API no disponible, guardando solo localmente:', apiError);
            // Si falla la API, guardar solo localmente
            products.push(newProduct);
        }

        // Guardar en Local Storage
        saveToLocalStorage();
        
        // Renderizar en el DOM
        renderProducts();
        
        // Limpiar formulario
        productForm.reset();
        
        showAlert('Producto agregado exitosamente', 'success');
        
    } catch (error) {
        console.error('Error al agregar producto:', error);
        showAlert('Error al agregar el producto', 'error');
    }
}

/**
 * PUT: Actualizar un producto existente
 * @param {number} id - ID del producto a actualizar
 * @param {Object} productData - Nuevos datos del producto
 */
async function updateProduct(id, productData) {
    try {
        const updatedProduct = { id, ...productData };

        // Intentar actualizar en la API
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProduct)
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log('PUT - Producto actualizado en la API:', data);
            
        } catch (apiError) {
            console.warn('API no disponible, actualizando solo localmente:', apiError);
        }

        // Actualizar en el array local
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = updatedProduct;
        }

        // Guardar en Local Storage
        saveToLocalStorage();
        
        // Renderizar en el DOM
        renderProducts();
        
        // Resetear formulario
        cancelEdit();
        
        showAlert('Producto actualizado exitosamente', 'success');
        
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        showAlert('Error al actualizar el producto', 'error');
    }
}

/**
 * DELETE: Eliminar un producto
 * @param {number} id - ID del producto a eliminar
 */
async function deleteProduct(id) {
    // Confirmación antes de eliminar
    if (!confirm('¿Estás seguro de eliminar este producto?')) {
        return;
    }

    try {
        // Intentar eliminar de la API
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            console.log('DELETE - Producto eliminado de la API');
            
        } catch (apiError) {
            console.warn('API no disponible, eliminando solo localmente:', apiError);
        }

        // Eliminar del array local
        products = products.filter(p => p.id !== id);

        // Guardar en Local Storage
        saveToLocalStorage();
        
        // Renderizar en el DOM
        renderProducts();
        
        showAlert('Producto eliminado exitosamente', 'success');
        
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        showAlert('Error al eliminar el producto', 'error');
    }
}

/**
 * Función para preparar la edición de un producto
 * @param {number} id - ID del producto a editar
 */
function editProduct(id) {
    const product = products.find(p => p.id === id);
    
    if (!product) {
        showAlert('Producto no encontrado', 'error');
        return;
    }

    // Llenar el formulario con los datos del producto
    productNameInput.value = product.name;
    productPriceInput.value = product.price;
    productDescriptionInput.value = product.description;

    // Actualizar estado de edición
    editingProductId = id;
    submitBtn.textContent = '💾 Guardar Cambios';
    cancelEditBtn.style.display = 'inline-block';
    formTitle.textContent = 'Editar Producto';

    // Scroll al formulario
    productForm.scrollIntoView({ behavior: 'smooth' });
    
    showAlert('Editando producto. Modifica los campos y guarda los cambios.', 'success');
}

/**
 * Evento para sincronizar con el servidor
 */
syncBtn.addEventListener('click', () => {
    fetchProductsFromAPI();
});

// ============================================
// TASK 6: INICIALIZACIÓN DE LA APLICACIÓN
// ============================================

/**
 * Función de inicialización que se ejecuta al cargar la página
 */
function init() {
    console.log('=== Aplicación de Gestión de Productos Iniciada ===');
    console.log('API URL:', API_URL);
    
    // Cargar datos desde Local Storage
    loadFromLocalStorage();
    
    // Intentar sincronizar con la API al inicio
    fetchProductsFromAPI();
    
    console.log('Estado inicial de productos:', products);
    console.log('Local Storage:', localStorage.getItem('products'));
}

// Ejecutar inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);

// ============================================
// UTILIDADES ADICIONALES
// ============================================

/**
 * Función para limpiar todos los datos (útil para pruebas)
 */
function clearAllData() {
    if (confirm('¿Estás seguro de eliminar TODOS los datos?')) {
        products = [];
        saveToLocalStorage();
        renderProducts();
        showAlert('Todos los datos han sido eliminados', 'success');
        console.log('Datos limpiados');
    }
}

// Exponer función al contexto global para pruebas desde consola
window.clearAllData = clearAllData;

console.log('app.js cargado correctamente ✅');
