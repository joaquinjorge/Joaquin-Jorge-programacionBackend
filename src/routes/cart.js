const fs = require("fs");

const path = require("path");
const ProductManager = require("../dao/productManager");
let ruta = path.join(__dirname, "..", "archivos", "carrito.json");
let ruta2 = path.join(__dirname, "..", "archivos", "objetos.json");
const Router = require("express").Router;

const cartRouter = Router();
let pm01 = new ProductManager(ruta2);
let pm02 = new ProductManager(ruta);
cartRouter.post("/", async (req, res) => {
  let carrito = await pm02.getProducts();

  let id = 1;
  if (carrito.length > 0) {
    id = carrito[carrito.length - 1].id + 1;
  }
  let nuevoCarrito = {
    id,
    products: [],
  };
  carrito.push(nuevoCarrito);
  await fs.promises.writeFile(ruta, JSON.stringify(carrito, null, 4));
  res.setHeader("Content-Type", "application/json");
  res.status(201).json({ nuevoCarrito: nuevoCarrito });
});

cartRouter.get("/:cid", async (req, res) => {
  let id = req.params.cid;

  let carrito = await pm02.getProductById(id);

  if (isNaN(id)) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `${id} no es un valor numerico` });
  }
  if (!carrito) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `no se encontro el carrito con id : ${id}` });
  }
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ carrito: carrito });
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  let { cid, pid } = req.params;
  cid = parseInt(cid);
  pid = parseInt(pid);
  let carrito = await pm02.getProducts();
  let productos = await pm01.getProducts();
  let indexCart = carrito.findIndex((c) => c.id === cid);
  let indexProd = productos.findIndex((p) => p.id === pid);

  if (indexCart === -1 || indexProd === -1) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `no se encontro el carrito o el producto ` });
  }

  let productoEnCarrito = carrito[indexCart].products.find(
    (p) => p.product === productos[indexProd].id
  );

  if (productoEnCarrito) {
    productoEnCarrito.quantity++;
  } else {
    carrito[indexCart].products.push({
      product: productos[indexProd].id,
      quantity: 1,
    });
  }

  await fs.promises.writeFile(ruta, JSON.stringify(carrito, null, 5));
  res.setHeader("Content-Type", "application/json");
  res.status(201).json({ success: "producto agregado con exito" });
});

module.exports = cartRouter;
