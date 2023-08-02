let carrito = [];
let total = 0;
let carritoJSON;
let nuevoItem;
let productos = [];
index = JSON.parse(localStorage.getItem('index'));
carrito = JSON.parse(localStorage.getItem('carrito'))

async function fetchData() {
  await fetch("../js/model/prod.json")
  .then(response => response.json())
  .then(data => {
    for(let i = 0;i < data.length;i++){
    productos[i] = data[i]};
  })
}
fetchData();

const bodyTabla = document.getElementById("tbody");
const totalTabla = document.getElementById("total")



let creaNutri = document.getElementById("creaNutri")
creaNutri.onclick = ()=>{crearTabla(productos[0])}
let creaEna = document.getElementById("creaEna")
creaEna.onclick = ()=>{crearTabla(productos[1])}
let creaXbody = document.getElementById("creaXbody")
creaXbody.onclick = ()=>{crearTabla(productos[2])}
let creaAMZ = document.getElementById("creaAMZ")
creaAMZ.onclick = ()=>{crearTabla(productos[3])}
let proteEna = document.getElementById("proteEna")
proteEna.onclick = ()=>{crearTabla(productos[4])}
let proteStar = document.getElementById("proteStar")
proteStar.onclick = ()=>{crearTabla(productos[5])}
let proteXbody = document.getElementById("proteXbody")
proteXbody.onclick = ()=>{crearTabla(productos[6])}
let proteEnaPro = document.getElementById("proteEnaPro")
proteEnaPro.onclick = ()=>{crearTabla(productos[7])}

let botonVaciarCarrito = document.getElementById("vaciarCarrito");
botonVaciarCarrito.onclick = () => {vaciarCarrito()}
let botonComprarCarrito = document.getElementById("comprarCarrito");
botonComprarCarrito.onclick = () => {comprarCarrito()}

let filtroProteinas = document.getElementById("btnProte");
filtroProteinas.onclick = () => {mostrarProteinas()}
let filtroCreatinas = document.getElementById("btnCrea");
filtroCreatinas.onclick = () => {mostrarCreatinas()}
let btnReiniciar = document.getElementById("btnReiniciar");
btnReiniciar.onclick = () => {reinicioFiltro()}

function actualizarCarrito (index,carrito){
  localStorage.setItem('index',index);
  localStorage.setItem('carrito',(JSON.stringify(carrito)));
}

function mostrarProteinas(){
  document.getElementById("creatinas").className = "row w-100 m-0 justify-content-evenly d-none"
  document.getElementById("proteinas").className="row w-100 m-0 justify-content-evenly"
}
function mostrarCreatinas(){
  document.getElementById("creatinas").className = "row w-100 m-0 justify-content-evenly"
  document.getElementById("proteinas").className="row w-100 m-0 justify-content-evenly d-none"
}
function reinicioFiltro(){
  document.getElementById("creatinas").className = "row w-100 m-0 justify-content-evenly"
  document.getElementById("proteinas").className="row w-100 m-0 justify-content-evenly"
}


function crearTabla(item){
    item.cantidad=1;
    index = JSON.parse(localStorage.getItem('index'))
    //Verifico si el item seleccionado por el usuario ya está en la tabla y carrito
    nuevoItem = verificarItem(item);
    //Si existe reemplazo la cantidad y el subtotal de ese producto
    if(nuevoItem){
        let cantidadExistente = document.getElementById(`cant${nuevoItem.nombre}${nuevoItem.marca}`)
        let subTotal = document.getElementById(`precio${nuevoItem.nombre}${nuevoItem.marca}`)
        cantidadExistente.innerHTML = item.cantidad + parseInt(cantidadExistente.innerHTML)
        subTotal.innerHTML = (item.precio * item.cantidad) + parseInt(subTotal.innerHTML)
        total += item.precio
        
        item.cantidad = cantidadExistente.innerHTML
        carrito[nuevoItem.index].cantidad = item.cantidad

        totalTabla.innerHTML = `TOTAL: $${total}`;
        
    }//Si no existe lo creo como un elemento nuevo en la tabla, modifico el total y aumento el indice en 1
    else{
      item.index = index;
      bodyTabla.innerHTML = bodyTabla.innerHTML + `
          <tr>
              <td class="px-0">${item.nombre}</td>
              <td class="px-0">${item.marca}</td>
              <td class="px-0">${item.precio}</td>
              <td class="px-0" id="cant${item.nombre}${item.marca}">${item.cantidad}</td>
              <td class="px-0" id="precio${item.nombre}${item.marca}">${item.precio}</td>
              <td class="p-1"><button type="button" class="btn btn-danger" onclick="removerItem(${item.index})">Remover</button></td>
          </tr>
          `;

      total += item.precio
      totalTabla.innerHTML = `TOTAL: $${total}`;
      index++;
      localStorage.setItem('index',index)
      carrito[index-1]=item;       
    }
    //Actualizo el localStorage del carrito
    carritoJSON = JSON.stringify(carrito)
    localStorage.setItem('carrito',carritoJSON)
    Toastify({
      text: "Producto añadido",
      className: "info",
      style: {
        background: "#00b09b",
      }
    }).showToast();
    
}


function verificarItem(item){
  ///Si el indice es distinto a 0, es decir que no es el primer item que se ingresa, verifico si en el carrito ya está el item seleccionado por el usuario. Si está, lo devuelvo
    if(index !== 0){
        nuevoItem = carrito.find((elemento) => (elemento.nombre === item.nombre)&& (elemento.marca === item.marca))
        if(nuevoItem){
            return nuevoItem;
        }
    }
}

function vaciarCarrito(){
  Swal.fire({
    title: 'Estás seguro?',
    text: "No podrás revertir esto!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, estoy seguro!'
  }).then((result) => {
    if (result.isConfirmed) {
      bodyTabla.innerHTML = ``;
      total = 0;
      carrito = [];
      index = 0;
      actualizarCarrito(index,carrito);
      totalTabla.innerHTML = `TOTAL: $${total}`;
      Swal.fire(
        'Vaciado!',
        'Tu carrito ha sido vaciado.',
        'Hecho'
      )
    }
  })
}


function removerItem(index){
  if(carrito.length === 1){
    //Si el carrito solo tiene un item y una unidad, lo vacio por completo
    if(carrito[index].cantidad===1){
      bodyTabla.innerHTML = ``;
      carrito = [];
      index = 0;
      total = 0;
      totalTabla.innerHTML = `TOTAL: $${total}`;
      
    }else{
      //Sino, solo resto 1 a cantidad
      total -= carrito[index].precio
      bodyTabla.innerHTML=``;
      carrito[index].cantidad -=1;
      index = JSON.parse(localStorage.getItem('index'))
    }


  }else{
    
    total -= carrito[index].precio
    if(carrito[index].cantidad===1){
       //Si el carrito tiene mas de un item y una sola unidad, elimino el item del carrito y disminuyo el indice en 1
      carrito.splice(index,1)
      bodyTabla.innerHTML=``;
      for(let i = index;i<carrito.length;i++){
        carrito[i].index -= 1;
      }
      index = JSON.parse(localStorage.getItem('index'))
      index -= 1;
    }else{
      //Sino, solo resto 1 a cantidad
      bodyTabla.innerHTML=``;
      carrito[index].cantidad -=1;
      index = JSON.parse(localStorage.getItem('index'))
    }
    
  }
  Toastify({
    text: "Producto eliminado",
    style: {
      background: "#FF0000",
    }
  }).showToast();
    actualizarCarrito(index,carrito);
    for(item of carrito){
      bodyTabla.innerHTML = bodyTabla.innerHTML + `
              <tr>
                  <td>${item.nombre}</td>
                  <td>${item.marca}</td>
                  <td>${item.precio}</td>
                  <td id="cant${item.nombre}${item.marca}">${item.cantidad}</td>
                  <td id="precio${item.nombre}${item.marca}">${item.precio * item.cantidad}</td>
                  <td class="p-1"><button type="button" class="btn btn-danger" onclick="removerItem(${item.index})">Remover</button></td>
              </tr>
              `;
      totalTabla.innerHTML = `TOTAL: $${total}`;
    }
}

document.addEventListener('DOMContentLoaded', async () =>{

  if(carrito === null){
    carrito = []
    actualizarCarrito(0,carrito);
  }

  for(item of carrito){
    bodyTabla.innerHTML = bodyTabla.innerHTML + `
            <tr>
                <td>${item.nombre}</td>
                <td>${item.marca}</td>
                <td>${item.precio}</td>
                <td id="cant${item.nombre}${item.marca}">${item.cantidad}</td>
                <td id="precio${item.nombre}${item.marca}">${item.precio * item.cantidad}</td>
                <td class="p-1"><button type="button" class="btn btn-danger" onclick="removerItem(${item.index})">Remover</button></td>
            </tr>
            `;
    total += item.precio * item.cantidad
    
    totalTabla.innerHTML = `TOTAL: $${total}`;
  }

})
