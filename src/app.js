const fs = require("fs");
const express = require("express");
const ProductManager = require("./productManager");
const app = express();
app.use(express.urlencoded({ extended: true }));

let pm01 = new ProductManager("../archivos/objetos.json");

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
entorno();

app.get("/", async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(
    `<div style='display:flex;align-items:center;justify-content:center;height:100%'><h1 style='text-decoration: underline overline #FF3028;color:blue;font-size:100px'>Bienvenidos al Ecommcerce</h1></div>`
  );
});
app.get("/products", async (req, res) => {
  let productos = await pm01.getProducts();
  const cortar=req.query.limit
  res.setHeader("Content-Type", "application/json")
  if (cortar) {
    let prodCortados = productos.slice(0, cortar);
  
   isNaN(cortar)? res.status(401).json({ error:"ingrese un valor numerico" }):res.json({prodCortados});
  } 
  
  else res.json({ productos });
});

app.get("/products/:id", async (req, res) => {
  let id = req.params.id;
  let productos = await pm01.getProductById(id);
  res.setHeader("Content-Type", "application/json")
  if (isNaN(id)) return res.status(401).json({error:`${id} no es un valor numerico`});
  productos?res.json({productos}):res.status(401).json({error:"ingrese un id valido"})

  
});

app.listen(8080, () => console.log("el servidor esta listo"));
