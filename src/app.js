const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const productsRouter = require("./routes/products");
const cartRouter = require("./routes/cart");
const vistasRouter = require("./routes/vistas");
const messagesModelo = require("./dao/models/messages.js");
const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

try {
  mongoose.connect(
    "mongodb+srv://joaquinjorge1998:poresterol123@cluster0.ooya4ec.mongodb.net/"
  );
  console.log("conectado a DB");
} catch (error) {
  console.log("no se pudo conectar a la base de datos" + error);
}

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

const entornoChat = async () => {
  io.on("connection", async (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);
    socket.on("id", async (nombre) => {
      await messagesModelo.create({ user: nombre, id: socket.id });

      socket.broadcast.emit("nuevoUsuario", nombre);
      let mensajesGuardados = await messagesModelo.find();
      socket.emit("hello", mensajesGuardados);
    });

    socket.on("mensaje", async (datos) => {
      await messagesModelo.updateOne(
        { id: socket.id },
        { $push: { message: datos.mensaje } }
      );

      io.emit("nuevoMensaje", datos);
    });

    socket.on("disconnect", async () => {
      let usuario = await messagesModelo.findOne(
        { id: socket.id },
        { _id: 0, user: 1 }
      );
      if (usuario) {
        io.emit("usuarioDesconectado", usuario.user);
      }
    });
  });
};
entornoChat();
module.exports = io;
