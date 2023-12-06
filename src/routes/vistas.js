const path = require("path");
const ProductManager = require("../dao/productManager");
const productosModelo = require("../dao/models/products.js");
let ruta = path.join(__dirname, "..", "archivos", "objetos.json");

const Router = require("express").Router;

const vistasRouter = Router();
let pm01 = new ProductManager(ruta);

vistasRouter.get("/", async (req, res) => {
  let products = await productosModelo.find();
  res
    .status(200)
    .render("home", { products, titulo: "Home Page", estilo: "stylesHome" });
});

vistasRouter.get("/realtimeproducts", async (req, res) => {
  let products = await productosModelo.find();
  res.status(200).render("realTimeProducts", {
    products,
    titulo: "Home Page",
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
