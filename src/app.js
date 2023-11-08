const express = require("express");

const productsRouter = require("./routes/products");
const cartRouter = require("./routes/cart");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.listen(8080, () => console.log("el servidor esta listo"));
