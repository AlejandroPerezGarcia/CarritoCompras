import { Producto } from './Producto.mjs'
import { Carrito } from './Carrito.mjs'

let carrito = new Carrito()
let productos = []

/** se carga el Archivo Json */
fetch('./assets/js/productos.json')
  .then(response => response.json())
  .then(data => {
    productos = data.productos.map(prod => new Producto(prod.nombre, prod.precio))
    mostrarProductos()
  })



function mostrarProductos() {
  const productSelect = document.getElementById('product-select')

  productos.forEach((producto, index) => {
    const option = document.createElement('option')
    option.value = index
    option.textContent = `${producto.nombre} - $${producto.precio}`
    productSelect.appendChild(option)
  })

  /** Habilitar inputs y botones después de cargar productos */
  habilitarInputs()
}

function habilitarInputs() {
  const addToCartButton = document.getElementById('add-to-cart')
  const checkoutButton = document.getElementById('checkout')
  const clearCartButton = document.getElementById('clear-cart')

  addToCartButton.addEventListener('click', () => {
    const selectedIndex = document.getElementById('product-select').value
    const quantity = parseInt(document.getElementById('quantity').value)

    if (selectedIndex >= 0 && quantity > 0) {
      const selectedProduct = productos[selectedIndex]
      carrito.agregarProducto(selectedProduct, quantity)
      mostrarDetallesCarrito()
      checkoutButton.disabled = false /** Habilitar botón de finalizar compra */
      clearCartButton.disabled = false /** Habilitar botón de limpiar carrito */
    } else {
      alert('Por favor selecciona un producto y una cantidad válida.')
    }
  })

  checkoutButton.addEventListener('click', () => {
    carrito.finalizarCompra()
    mostrarDetallesCarrito()
    limpiarPagina()
  })

  clearCartButton.addEventListener('click', () => {
    carrito.productos = []
    mostrarDetallesCarrito()
    limpiarPagina()
  })
}

function mostrarDetallesCarrito() {
  const cartDetails = document.getElementById('cart-details')
  cartDetails.innerHTML = '' /** Limpiar el contenido anterior */

  carrito.productos.forEach(item => {
    const listItem = document.createElement('li')
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center'

    /**  Mostrar cantidad y nombre del producto */
    const productText = document.createElement('span')
    productText.textContent = `${item.producto.nombre} (Cantidad: ${item.cantidad})`

    const priceBadge = document.createElement('span')
    priceBadge.className = 'badge bg-primary rounded-pill'
    priceBadge.textContent = `$${item.producto.precio * item.cantidad}`

    const buttonGroup = document.createElement('div')
    buttonGroup.className = 'btn-group'

    /** Botón para aumentar cantidad */
    const increaseButton = document.createElement('button')
    increaseButton.className = 'btn btn-success btn-sm'
    increaseButton.textContent = '+'
    increaseButton.onclick = () => {
      carrito.agregarProducto(item.producto, 1)
      mostrarDetallesCarrito()
    }

    /** Botón para reducir cantidad */
    const reduceButton = document.createElement('button')
    reduceButton.className = 'btn btn-secondary btn-sm'
    reduceButton.textContent = '-'
    reduceButton.onclick = () => {
      carrito.reducirCantidad(item.producto.nombre)
      mostrarDetallesCarrito()
    }

    /** Botón para eliminar producto */
    const removeButton = document.createElement('button')
    removeButton.className = 'btn btn-danger btn-sm'
    removeButton.textContent = 'Eliminar'
    removeButton.onclick = () => {
      carrito.eliminarProducto(item.producto.nombre)
      mostrarDetallesCarrito()
    }

    buttonGroup.appendChild(increaseButton)
    buttonGroup.appendChild(reduceButton)
    buttonGroup.appendChild(removeButton)
    listItem.appendChild(productText)
    listItem.appendChild(priceBadge)
    listItem.appendChild(buttonGroup)
    cartDetails.appendChild(listItem)
  })

  const total = carrito.calcularTotal()
  const totalElement = document.getElementById('cart-total')
  totalElement.textContent = `Total: $${total}`
  totalElement.className = 'total'
}

/** limpia la pagina */
function limpiarPagina() {
  const productSelect = document.getElementById('product-select')
  const quantityInput = document.getElementById('quantity')
  productSelect.selectedIndex = 0
  quantityInput.value = 1
}
