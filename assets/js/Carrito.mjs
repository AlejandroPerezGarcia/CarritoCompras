export class Carrito {
  constructor() {
    this.productos = []
  }
  /** Agregar producto */
  agregarProducto(producto, cantidad) {
    const productoExistente = this.productos.find(item => item.producto.nombre === producto.nombre)
    if (productoExistente) {
      /**  Si el producto ya existe, sumamos la cantidad */
      productoExistente.cantidad += cantidad
    } else {
      /**  Si no existe, lo añadimos al carrito */
      this.productos.push({ producto, cantidad })
    }
  }

  /** eliminar producto */

  eliminarProducto(nombreProducto) {
    this.productos = this.productos.filter(item => item.producto.nombre !== nombreProducto)
  }

  /** reduce la cantidad de unidades del producto */
  reducirCantidad(nombreProducto) {
    const productoExistente = this.productos.find(item => item.producto.nombre === nombreProducto)
    if (productoExistente) {
      productoExistente.cantidad -= 1
      if (productoExistente.cantidad <= 0) {
        this.eliminarProducto(nombreProducto)
      }
    }
  }

  /** calcula el total del de la comprar */

  calcularTotal() {
    return this.productos.reduce((total, item) => {
      return total + item.producto.precio * item.cantidad
    }, 0)
  }

  /** muestra en pantalla el final de la compra con el total y limpia la pagina */
  finalizarCompra() {
    const total = this.calcularTotal()
    alert(`Total de la compra: $${total}`)
    this.productos = [] /**  Limpiamos el carrito después de la compra */
    return total
  }

  /** Muestra detalle de los productos */

  mostrarDetalles() {
    return this.productos.map(item => `${item.cantidad} x ${item.producto.nombre}`).join(', ')
  }
}
