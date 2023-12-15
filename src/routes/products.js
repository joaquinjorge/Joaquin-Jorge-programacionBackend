const fs = require("fs");

const path = require("path");
const ProductManager = require("../dao/productManager");
const productosModelo = require("../dao/models/products.js");
const mongoose = require("mongoose");
let ruta = path.join(__dirname, "..", "archivos", "objetos.json");

const Router = require("express").Router;

const productsRouter = Router();
let pm01 = new ProductManager(ruta);

const entorno = async () => {
  try {
    await pm01.addProduct(
      "Buzo",
      "este es un producto prueba",
      200,
      "sin imagen",
      "abc123",
      25
    );
    await pm01.addProduct(
      "Remera",
      "este es un producto prueba",
      200,
      "sin imagen",
      "abc1234",
      25
    );
    await pm01.addProduct(
      "Zapatillas",
      "este es un producto prueba",
      200,
      "sin imagen",
      "abc1235",
      25
    );
    await pm01.addProduct(
      "Botines",
      "este es un producto prueba",
      200,
      "sin imagen",
      "abc1236",
      25
    );
    await pm01.addProduct(
      "Campera",
      "este es un producto prueba",
      200,
      "sin imagen",
      "abc1237",
      25
    );
    await pm01.addProduct(
      "Sweater",
      "este es un producto prueba",
      200,
      "sin imagen",
      "abc1238",
      25
    );
    await pm01.addProduct(
      "Pantalon",
      "este es un producto prueba",
      200,
      "sin imagen",
      "abc1239",
      25
    );
    await pm01.addProduct(
      "Bufanda",
      "este es un producto prueba",
      200,
      "sin imagen",
      "abc12310",
      25
    );
    await pm01.addProduct(
      "Medias",
      "este es un producto prueba",
      200,
      "sin imagen",
      "abc12311",
      25
    );
    await pm01.addProduct(
      "Ojotas",
      "este es un producto prueba",
      200,
      "sin imagen",
      "abc12312",
      25
    );
  } catch (error) {
    console.log("ocurrio un error");
  }
};

productsRouter.get("/", async (req, res) => {
  const cortar = req.query.limit;
  const sort = req.query.sort;
  let productos = await productosModelo.find().limit(cortar);
  res.setHeader("Content-Type", "application/json");

  if (sort) {
    let prodOrdenados = await productosModelo
      .find()
      .limit(cortar)
      .sort({ price: Number(sort) });

    res.json({ prodOrdenados });
  } else res.json({ productos });
});
productsRouter.post("/", async (req, res) => {
  let { title, price, description, code, stock, status, category } = req.body;
  if (!status) {
    status = true;
  }

  let nuevoProducto = {
    title,
    price,
    description,
    code,
    stock,
    status,
    category,
  };
  let productoRepetido = false;

  try {
    existe = await productosModelo.findOne({ deleted: false, code });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detalle: error.message,
    });
  }

  if (existe) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `El usuario con code ${code} ya existe en BD...!!!` });
  }

  if (!title || !price || !description || !code || !stock || !category) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `complete todos los campos` });
  }

  if (title && typeof title !== "string") {
    return res
      .status(400)
      .json({ error: "La propiedad title debe ser de tipo string" });
  }
  if (description && typeof description !== "string") {
    return res
      .status(400)
      .json({ error: "La propiedad description debe ser de tipo string" });
  }
  if (code && typeof code !== "string") {
    return res
      .status(400)
      .json({ error: "La propiedad code debe ser de tipo string" });
  }
  if (category && typeof category !== "string") {
    return res
      .status(400)
      .json({ error: "La propiedad category debe ser de tipo string" });
  }
  if (price && typeof price !== "number") {
    return res
      .status(400)
      .json({ error: "La propiedad price debe ser de tipo numérico" });
  }
  if (stock && typeof stock !== "number") {
    return res
      .status(400)
      .json({ error: "La propiedad stock debe ser de tipo numérico" });
  }

  let propiedadesPermitidas = [
    "title",
    "price",
    "description",
    "code",
    "stock",
    "status",
    "category",
    "thumbnails",
    "deleted",
  ];
  let propiedadesQueLlegan = Object.keys(req.body);

  let valido = propiedadesQueLlegan.every((propiedad) =>
    propiedadesPermitidas.includes(propiedad)
  );
  if (!valido) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({
      error: `No se aceptan algunas propiedades`,
      propiedadesPermitidas,
    });
  }
  try {
    let productoNuevo = await productosModelo.create(nuevoProducto);

    req.io.emit("nuevoProdConMiddleware", nuevoProducto);
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ payload: productoNuevo });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detalle: error.message,
    });
  }
});

productsRouter.put("/:id", async (req, res) => {
  let { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Ingrese un id válido...!!!` });
  }
  let productos = await productosModelo.findById(id);

  if (!productos) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: "no se encontro el producto con id:" + id });
  }

  let propiedadesPermitidas = [
    "title",
    "price",
    "description",
    "deleted",
    "stock",
    "status",
    "category",
    "thumbnails",
  ];
  let propiedadesQueLlegan = Object.keys(req.body);

  let valido = propiedadesQueLlegan.every((propiedad) =>
    propiedadesPermitidas.includes(propiedad)
  );
  if (!valido) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({
      error: `No se aceptan algunas propiedades`,
      propiedadesPermitidas,
    });
  }

  if (req.body.title && typeof req.body.title !== "string") {
    return res
      .status(400)
      .json({ error: "La propiedad title debe ser de tipo string" });
  }
  if (req.body.deleted && typeof req.body.deleted !== "boolean") {
    return res
      .status(400)
      .json({ error: "La propiedad deleted debe ser de tipo boolean" });
  }
  if (req.body.description && typeof req.body.description !== "string") {
    return res
      .status(400)
      .json({ error: "La propiedad description debe ser de tipo string" });
  }

  if (req.body.category && typeof req.body.category !== "string") {
    return res
      .status(400)
      .json({ error: "La propiedad category debe ser de tipo string" });
  }
  if (req.body.price && typeof req.body.price !== "number") {
    return res
      .status(400)
      .json({ error: "La propiedad price debe ser de tipo numérico" });
  }
  if (req.body.stock && typeof req.body.stock !== "number") {
    return res
      .status(400)
      .json({ error: "La propiedad stock debe ser de tipo numérico" });
  }
  let productoActualizado;
  try {
    productoActualizado = await productosModelo.updateOne(
      { _id: id },
      req.body
    );
    if (productoActualizado.modifiedCount > 0) {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ payload: "modificacion realizada" });
      let productoUpdateado = await productosModelo.findById(id);
      req.io.emit("productoUpdate", productoUpdateado);
    } else {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `No se concretó la modificación` });
    }
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detalle: error.message,
    });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  let id = req.params.pid;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Ingrese un id válido...!!!` });
  }
  let productos = await productosModelo.findById(id);

  if (!productos) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `no existe el producto con id ${id}` });
  }
  let productoEliminado;
  try {
    productoEliminado = await productosModelo.updateOne(
      { deleted: false, _id: id },
      { $set: { deleted: true } }
    );

    if (productoEliminado.modifiedCount > 0) {
      req.io.emit("prodEliminado", { id });
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ payload: "Eliminacion realizada" });
    } else {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `No se concretó la eliminacion` });
    }
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detalle: error.message,
    });
  }
});

productsRouter.get("/:pid", async (req, res) => {
  let id = req.params.pid;
  let productos = await productosModelo.findById(id);
  res.setHeader("Content-Type", "application/json");

  productos
    ? res.json({ productos })
    : res.status(400).json({ error: "ingrese un id valido" });
});
module.exports = productsRouter;
