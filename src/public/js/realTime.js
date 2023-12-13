const socket = io();

socket.on("nuevoProdConMiddleware", (producto) => {
  
  let ulProd = document.querySelector("ul");
  let liNuevoProd = document.createElement("li");
  liNuevoProd.setAttribute(`id`, `producto-${producto._id}`);
  liNuevoProd.innerHTML = producto.title;
  ulProd.append(liNuevoProd);
});

socket.on("prodEliminado", ({ id }) => {
  const productoAEliminar = document.getElementById(`producto-${id}`);

  productoAEliminar.remove();
});
