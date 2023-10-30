const fs = require("fs");

class ProductManager {
  constructor(enlace) {
    // this.products = [];
    this.pd = enlace;
  }

  async getProducts() {
    if (fs.existsSync(this.pd)) {
      return JSON.parse(await fs.promises.readFile(this.pd, "utf-8"));
    } else {
      return [];
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    let id = 1;
    let productos = await this.getProducts();

    if (productos.length > 0) {
      id = productos[productos.length - 1].id + 1;
    }
    let nuevoProducto = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      id,
    };
    let productoRepetido = productos.find(
      (producto) => producto.code === nuevoProducto.code
    );
    if (productoRepetido) {
      console.log("el code del producto ya existe");
    } else if (
      !nuevoProducto.title ||
      !nuevoProducto.price ||
      !nuevoProducto.description ||
      !nuevoProducto.thumbnail ||
      !nuevoProducto.code ||
      !nuevoProducto.stock
    ) {
      console.log("complete todos los campos");
    } else {
      productos.push(nuevoProducto);
      await fs.promises.writeFile(this.pd, JSON.stringify(productos, null, 5));
    }
  }

  async getProductById(id) {
    let productos = await this.getProducts();
    let indice = productos.find((prod) => prod.id === Number(id));
    if (!indice) {
      console.log("no se encontro el producto con ese id");
      return;
    }
    return indice;
  }

  async deleteProductById(id) {
    let productos = await this.getProducts();
    let indice = productos.findIndex((prod) => prod.id === id);
    if (indice === -1) {
      console.log("no se encontro el producto con id :" + id);
    } else {
      productos.splice(indice, 1);
      await fs.promises.writeFile(this.pd, JSON.stringify(productos, null, 5));
    }
  }

  async updateProductById(id, objeto) {
    let productos = await this.getProducts();
    let indice = productos.findIndex((prod) => prod.id === id);
    if (indice === -1) {
      console.log("no se encontro el producto con id :" + id);
    } else {
      productos[indice] = {
        ...productos[indice],
        ...objeto,
        id,
      };
      await fs.promises.writeFile(this.pd, JSON.stringify(productos, null, 5));
    }
  }
}

module.exports = ProductManager;
