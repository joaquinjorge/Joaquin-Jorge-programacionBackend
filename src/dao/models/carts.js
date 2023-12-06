const mongoose = require("mongoose");

const cartColeccion = "carts";
const cartEsquema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
          quantity: Number,
        },
      ],
    },
  },
  {
    timestamps: true,

    strict: true,
  }
);
cartEsquema.pre("findById", function () {
  this.populate({
    path: "products.product",
  }).lean();
});
cartEsquema.pre("find", function () {
  this.populate({
    path: "products.product",
  }).lean();
});
cartEsquema.pre("findOne", function () {
  this.populate({
    path: "products.product",
  }).lean();
});
const cartsModelo = mongoose.model(cartColeccion, cartEsquema);
module.exports = cartsModelo;
