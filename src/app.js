const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const { Server } = require("socket.io");

const productsRouter = require("./routes/products");
const cartRouter = require("./routes/cart");
const vistasRouter = require("./routes/vistas");

const app = express();
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use("/", vistasRouter);
app.use(
  "/api/products",
  (req, res, next) => {
    req.io = io;

    next();
  },
  productsRouter
);
app.use("/api/carts", cartRouter);

const server = app.listen(8080, () => console.log("el servidor esta listo"));
const io = new Server(server);
io.on("connection", (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);
});
