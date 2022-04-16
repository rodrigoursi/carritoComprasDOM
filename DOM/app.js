// CREO LOS ELEMENTOS A UTILIZAR
const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
let carrito = {};
///////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded',()=> {   // ACA CARGO TODO EL CONTENIDO DEL DOM
  fetchData()
  if(localStorage.getItem("carrito")){   ///SI EN EL LOCALSTORAGE HAY CONTENIDO LO VUELVE A CARGAR
    carrito = JSON.parse(localStorage.getItem("carrito"))
    pintarCarrito()   ///ENTONCES VUELVO A PINTAR CARRITO
  }
})

cards.addEventListener('click', e =>{
  addCarrito(e)
})

items.addEventListener('click', e =>{
  btnAccion(e);
})

////////////////////////////////////////
// ACA TRAIGO EL API EN JYSON
////////////////////////////////////////
const fetchData = async () => {
    const res = await fetch('api.json')
    const data = await res.json()
    pintarCards(data)

}

/////////////////////////////////
// ACA ESTOY PINTANDO LO Q TENGO EN EL JSON (DATA)
/////////////////////////////////

const pintarCards = (data) => {
  data.forEach(producto => {
    templateCard.querySelector("h5").innerHTML = producto.title
    templateCard.querySelector("p").innerHTML = producto.precio
    templateCard.querySelector("img").setAttribute("src", producto.thumbnailUrl)
    templateCard.querySelector(".btn-dark").dataset.id = producto.id
    const clone = templateCard.cloneNode(true)
    fragment.appendChild(clone)
  })
  cards.appendChild(fragment)
}

//////////////////////////////////////////////////////////////////////////////
// ACA ESTOY CREANDO EL CARRITO EN COLECCION DE OBJETO USANDO EVENTLISTENER
/////////////////////////////////////////////////////////////////////////////
const addCarrito = e => {
//console.log(e.target)
  if (e.target.classList.contains('btn-dark')==true) {
    setCarrito(e.target.parentElement);
  }
e.stopPropagation();
}

//////////////////////////////////////////////////////////////////////////////
// ACA CON setcarrito ESTOY CAPTURANDO LOS ELEMENTOS.
/////////////////////////////////////////////////////////////////////////////
const setCarrito = objeto => {
  const producto = {
    id: objeto.querySelector(".btn-dark").dataset.id,
    title: objeto.querySelector("h5").innerHTML,
    precio:objeto.querySelector("p").innerHTML,
    cantidad: 1
  }
  if(carrito.hasOwnProperty(producto.id)==true){   /// ACA ESTOY PREGUNTANDO SI CLICKIO EL MISMO ELEMENTO
    producto.cantidad = carrito[producto.id].cantidad + 1;  /// ACA ESTOY SUMANDO LA .CANTIDAD SI ES TRUE
  }
  carrito[producto.id] = {...producto}   /// ACA ESTAMOS HACIENDO UNA COPIA DE PRODUCTO, SOBREESCRIBIENDOLO
  pintarCarrito();
}

const pintarCarrito = () => {
  console.log(carrito)
  items.innerHTML=""
  Object.values(carrito).forEach(producto => {
    templateCarrito.querySelector("th").innerHTML = producto.id
    templateCarrito.querySelectorAll("td")[0].innerHTML = producto.title
    templateCarrito.querySelectorAll("td")[1].innerHTML = producto.cantidad
    templateCarrito.querySelector(".btn-info").dataset.id = producto.id
    templateCarrito.querySelector(".btn-danger").dataset.id = producto.id
    templateCarrito.querySelector("span").innerHTML = producto.cantidad * producto.precio
    const clone= templateCarrito.cloneNode(true)
    fragment.appendChild(clone)
  })
  items.appendChild(fragment)

  pintarFooter()

  localStorage.setItem("carrito", JSON.stringify(carrito))   /// GUARDO EL CONTENIDO DEL CARRITO EN EL STORAGE.
}

const pintarFooter = () => {
  footer.innerHTML =""
  if(Object.keys(carrito).length==0){
    footer.innerHTML = '<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>'
    return
  }

  //// ACA REALIZO LA ACUMULACION DE CANTIDAD DE ITEMS Y DEL PRECIO AL MISMO TIEMPO QUE LO ESTOY PINTANDO.
  const nCantidad = Object.values(carrito).reduce((acc,{cantidad}) => acc + cantidad,0)
  const nPrecio = Object.values(carrito).reduce((acc,{cantidad,precio}) => acc + cantidad * precio,0)

  templateFooter.querySelectorAll('td')[0].innerHTML = nCantidad
  templateFooter.querySelector('span').innerHTML = nPrecio

  const clone = templateFooter.cloneNode(true)
  fragment.appendChild(clone)
  footer.appendChild(fragment)

/// ACA LE DOY FUNCIONALIDAD AL BOTON VACIAR
  const btnVaciar = document.getElementById('vaciar-carrito')
  btnVaciar.addEventListener('click', () => {
    carrito = {}
    pintarCarrito()
  })
}

/// LE DAMOS FUNCIONALIDAD A LOS BOTONES + Y -

const btnAccion = e => {
  //console.log(e.target)
  /// ACCION DE AUMENTAR
  if(e.target.classList.contains('btn-info')){
    console.log(carrito[e.target.dataset.id])
    const productoMas = carrito[e.target.dataset.id]
    productoMas.cantidad++
    //carrito[e.target.dataset.id] = {...productoMas}
    pintarCarrito()
  }
  /// ACCION DE DESMINUIR
  if(e.target.classList.contains('btn-danger')){
    const productoMenos = carrito[e.target.dataset.id]
    productoMenos.cantidad--
    if(productoMenos.cantidad == 0){
      delete carrito[e.target.dataset.id]
    }
    pintarCarrito()
  }
}
