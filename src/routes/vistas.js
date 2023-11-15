const ProductManager = require("../clases/productManager");
const path = require("path");
let ruta = path.join(__dirname, "..", "archivos", "objetos.json");

const Router = require("express").Router;

const vistasRouter = Router();
let pm01 = new ProductManager(ruta);

vistasRouter.get("/",async (req,res)=>{
    let products=await pm01.getProducts()
    res.status(200).render('home',{products})
})


vistasRouter.get("/realtimeproducts",async (req,res)=>{
    let products=await pm01.getProducts()
    res.status(200).render('realTimeProducts',{products})
})

module.exports = vistasRouter;