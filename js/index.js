//Para cargar el array
const Products = []
//captura de contenedor
const avisoCarrito = document.getElementById('avisoCarrito')
const divGeneral = document.querySelector('#general');
const btnCarrito = document.getElementById('botonCarrito')
//Crear un carro
const cart = []
//limite de productos en el carrito

let pag = 0



// crear el contador
let contador = document.createElement('span')

// contador display una vez hecho el clic
  contador.style.color ="white"
      contador.style.padding ="10px"
      contador.style.borderRadius="10px"
      contador.style.height="fit-content"
      btnCarrito.appendChild(contador)

      ///


      //evento del boton de carrito
      
const loadEvents = function() 
{
    const buttons = document.querySelectorAll('.btn')
    for (const button of buttons) 
    {
       // Dentro del evento de click del botón Agregar al carrito
button.addEventListener('click', () => {
    const selectedProduct = Products.find(product => product.id === Number(button.id));
    if (selectedProduct) {
      cart.push(selectedProduct);
      contador.innerText = cart.length;
      saveCartToStorage();
    }
  });
     
    }
      
      
}

// crear base de datos y crear promesa para el fetc

const openDB = function (){
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('productsDB', 1);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result
        db.createObjectStore('products', { keyPath: 'id' });
      }
  
      request.onsuccess = (event) => {
        const db = event.target.result
        resolve(db)
      }
  
      request.onerror = (event) => {
        reject(event.target.error);
      }
    })
  }
  
  ///funcion para almacenar datos
  const storeProductsInDB = async function (products) {
    try {
      const db = await openDB();
      const transaction = db.transaction('products', 'readwrite');
      const store = transaction.objectStore('products')
  
      products.forEach((product) => {
        store.add(product);
      })
  
      transaction.oncomplete = () => {
        console.log('Productos almacenados en IndexedDB')
      }
    } catch (error) {
      console.log('Error al almacenar los productos en IndexedDB:', error);
    }
  };

  


//funcion para crear el producto

const createProducts = function() 
{
    
    Products.forEach(product => {

       // recorrer las cards     
                    const divCard = document.createElement('div')
     
                    divCard.className ='mb-3 col-md-6 col-lg-4 col-xxl-3 mx-a'
                    divCard.innerHTML =`
                       
                            <div  class="card m-auto" style="width: 18rem;">
                            <img src="${product.image}" class="card-img-top" alt="${product.title}">
                            <div class="card-body">
                                <h5 class="card-title">${product.title}</h5>
                                <p id="informacion">${product.description.substring(0, 80)} </p>
                                                  
                                <button id="${product.id}" type="button" class="btn btn-success colorMarca fw-bold">Agregar al carrito</button>                           
                                <button data-id="${product.id}" type="button" class="btn fw-bold ver-descripcion">Ver descripción</button>

                               
                            </div>
                            </div>
                     
                   ` 
                    ///crear una visdta en otra ventana
 const verDescripcionButton = divCard.querySelector('.ver-descripcion');
 verDescripcionButton.addEventListener('click', () => {
   const productId = verDescripcionButton.getAttribute('data-id')
   window.location.href = `../pag/producto.html?id=${productId}`
 });
                divGeneral.appendChild(divCard)


                  
                            });
                            
    loadEvents()
}
///cargar carrutio desde el storage

const loadCartFromStorage = () => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      cart.length = ""; 
      cart.push(...JSON.parse(storedCart))
      contador.innerText = cart.length;
    }
  };

  //guardar el contenido del carro
  const saveCartToStorage = function() {
    localStorage.setItem('cart', JSON.stringify(cart));
  };



 /// obtener productos

const getProducts = async function() {
  try {
    const response = await fetch(`https://fakestoreapi.com/products?limit=${pag}`);
    const data = await response.json()
    Products.push(...data)
    storeProductsInDB(data)
    loadCartFromStorage()
    createProducts()
  } catch (error) {
    console.log(error)
  }
};

getProducts()


//Agregar mas productos


const btnPosterior = document.getElementById('btnPosterior');

btnPosterior.addEventListener('click', () =>{
    pag += 3
    createProducts() 
})

const carritoEvents = function() {
  btnCarrito.addEventListener('click', () => {
    avisoCarrito.innerHTML = ""; // Limpiar el contenido del aviso del carrito

    const tarjeta = document.createElement('div');
    tarjeta.className = "alert alert-success mt-3";
    tarjeta.setAttribute('role', "alert");
    tarjeta.innerHTML = "Se ha agregado al carrito los siguientes elementos:<br>";

    const btnLimpiar = document.createElement('button');
    btnLimpiar.id = 'btnLimpiarCarrito';
    btnLimpiar.innerText = "Limpiar carrito";
    btnLimpiar.className = "btn btn-success colorMarca fw-bold mt-2";

    const listadoG = document.createElement('ul');
    listadoG.className = "list-group";

    cart.forEach(product => {
      const listItem = document.createElement('li');
      listItem.className = "list-group-item";

      // Crear contenedor para la imagen y el título del producto
      const productContainer = document.createElement('div');
      productContainer.style.display = 'flex';
      productContainer.style.alignItems = 'center';

      // Crear imagen del producto
      const productImage = document.createElement('img');
      productImage.src = product.image;
      productImage.alt = product.title;
      productImage.style.width = '50px';
      productImage.style.marginRight = '12px';

      // Crear título del producto
      const productTitle = document.createElement('span');
      productTitle.textContent = product.title;

      // Agregar un evento de clic al elemento de la lista
      listItem.addEventListener('click', () => {
        // Redirigir a la página de detalle del producto
        window.location.href = `../pag/producto.html?id=${product.id}`;
      });
      listItem.style.cursor = 'pointer';


      // Agregar la imagen y el título al contenedor
      productContainer.appendChild(productImage);
      productContainer.appendChild(productTitle);

      // Agregar el contenedor al elemento de la lista
      listItem.appendChild(productContainer);

      // Agregar el elemento de la lista al contenedor principal
      listadoG.appendChild(listItem);
    });

    tarjeta.appendChild(listadoG);
    avisoCarrito.appendChild(tarjeta);
    tarjeta.appendChild(btnLimpiar);

    // Limpiar carrito
    const clearCart = () => {
      cart.length = 0; // Vaciar el carrito
      contador.innerText = cart.length;
      saveCartToStorage();
      listadoG.innerHTML = "";
    };

    btnLimpiar.addEventListener('click', clearCart);
  });
};

carritoEvents();
loadEvents();
loadCartFromStorage();





//serviceWorker

if ("serviceWorker" in navigator) {

    const fsw = async () =>{
        try {
       await navigator.serviceWorker.register("../sw.js")
        .then(res => console.log("service worker esta funcionando correctamente",res))
        } catch (error) {
            console.log("service worker no se registra", error)
        }
    }
 fsw()
}else{
    console.log("service worker no soportado")
}
  
///al cargar la página cargar el carrito
window.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
  });

  loadCartFromStorage();