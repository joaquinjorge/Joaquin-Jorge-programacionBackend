const fs = require("fs");
const ProductManager = require("../clases/productManager");
const path = require("path");
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
  let productos = await pm01.getProducts();
  const cortar = req.query.limit;
  res.setHeader("Content-Type", "application/json");
  if (cortar) {
    let prodCortados = productos.slice(0, cortar);

    isNaN(cortar)
      ? res.status(400).json({ error: "ingrese un valor numerico" })
      : res.json({ prodCortados });
  } else res.json({ productos });
});
productsRouter.post("/", async (req, res) => {
  let { title, price, description, code, stock, status, category, thumbnails } =
    req.body;
  if (!status) {
    status = true;
  }
  let id = 1;
  let productos = await pm01.getProducts();

  if (productos.length > 0) {
    id = productos[productos.length - 1].id + 1;
  }

  let nuevoProducto = {
    id,
    title,
    price,
    description,
    code,
    stock,
    status,
    category,
    thumbnails,
  };
  let productoRepetido = productos.find((producto) => producto.code === code);

  if (productoRepetido) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `el producto ya existe en DB` });
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

  productos.push(nuevoProducto);
  await fs.promises.writeFile(ruta, JSON.stringify(productos, null, 5));
  req.io.emit("nuevoProdConMiddleware", nuevoProducto);
  res.setHeader("Content-Type", "application/json");
  res.status(201).json({ nuevoProducto });
});

productsRouter.put("/:id", async (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  let productos = await pm01.getProducts();
  let indice = productos.findIndex((prod) => prod.id === id);
  if (indice === -1) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: "no se encontro el producto con id:" + id });
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
  let productoRepetido = productos.find(
    (producto) => producto.code === req.body.code
  );

  if (productoRepetido) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `ya existe el producto con code :${req.body.code}` });
  }

  if (req.body.title && typeof req.body.title !== "string") {
    return res
      .status(400)
      .json({ error: "La propiedad title debe ser de tipo string" });
  }
  if (req.body.description && typeof req.body.description !== "string") {
    return res
      .status(400)
      .json({ error: "La propiedad description debe ser de tipo string" });
  }
  if (req.body.code && typeof req.body.code !== "string") {
    return res
      .status(400)
      .json({ error: "La propiedad code debe ser de tipo string" });
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

  productos[indice] = {
    ...productos[indice],
    ...req.body,
    id,
  };
  await fs.promises.writeFile(ruta, JSON.stringify(productos, null, 5));
  res.setHeader("Content-Type", "application/json");
  res.status(201).json({ productos: productos[indice] });
});

productsRouter.delete("/:pid", async (req, res) => {
  let id = req.params.pid;
  let productos = await pm01.getProducts();
  let indice = productos.findIndex((p) => p.id === Number(id));
  if (indice === -1) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `no existe el producto con id ${id}` });
  }
  productos.splice(indice, 1);
  await fs.promises.writeFile(ruta, JSON.stringify(productos, null, 5));
  req.io.emit("prodEliminado", { id });
  res.setHeader("Content-Type", "application/json");
  res
    .status(201)
    .json({ productoEliminado: `se elimino el producto con id: ${id}` });
});

productsRouter.get("/:pid", async (req, res) => {
  let id = req.params.pid;
  let productos = await pm01.getProductById(id);
  res.setHeader("Content-Type", "application/json");
  if (isNaN(id))
    return res.status(400).json({ error: `${id} no es un valor numerico` });
  productos
    ? res.json({ productos })
    : res.status(400).json({ error: "ingrese un id valido" });
});
module.exports = productsRouter;
