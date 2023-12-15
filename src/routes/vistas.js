const path = require("path");
const ProductManager = require("../dao/productManager");
const productosModelo = require("../dao/models/products.js");
const cartsModelo = require("../dao/models/carts.js");

let ruta = path.join(__dirname, "..", "archivos", "objetos.json");

const Router = require("express").Router;

const vistasRouter = Router();
let pm01 = new ProductManager(ruta);

vistasRouter.get("/", async (req, res) => {
  let pagina = 1;
  if (req.query.pagina) {
    pagina = req.query.pagina;
  }

  let productos;
  try {
    // usuarios=await usuariosModelo.find().lean()
    productos = await productosModelo.paginate(
      { deleted: false },
      { lean: true, limit: 5, page: pagina }
    );
    console.log(productos);
  } catch (error) {
    console.log(error);
    productos = [];
  }

  let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = productos;
  res
    .status(200)
    .render("home", {
      productos: productos.docs,
      totalPages,
      hasNextPage,
      hasPrevPage,
      prevPage,
      nextPage,
      titulo: "Home Page",
      estilo: "stylesHome",
    });
});

vistasRouter.get("/realtimeproducts", async (req, res) => {
  let products = await productosModelo.find();
  res.status(200).render("realTimeProducts", {
    products,
    titulo: "Real Time Products",
    estilo: "stylesHome",
  });
});

vistasRouter.get("/carts", async (req, res) => {
  let carts = await cartsModelo.find().populate();

  res.status(200).render("carts", {
    carts,
    titulo: "Carts",
    estilo: "stylesHome",
  });
});

vistasRouter.get("/chat", (req, res) => {
  res.status(200).render("chat", {
    titulo: "Chat",
    estilo: "styles",
  });
});

module.exports = vistasRouter;
