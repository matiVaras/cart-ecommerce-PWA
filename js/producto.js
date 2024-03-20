let verMas = document.getElementById('inforCard')
const infoProduct = document.createElement('div')
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

///reusar opendb
  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('productsDB', 1);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result
        db.createObjectStore('products', { keyPath: 'id' });
      };
  
      request.onsuccess = (event) => {
        const db = event.target.result
        resolve(db)
      }
  
      request.onerror = (event) => {
        reject(event.target.error)
      }
    })
  }
/// ver description funcion 

async function verDescription(id) {
    try {
      const db = await openDB();
      const transaction = db.transaction('products', 'readonly');
      const store = transaction.objectStore('products');
      const request = store.get(id);
  
      request.onsuccess = (e) => {
        const productDB = e.target.result;
        if (productDB) {
          pintarVerMas(productDB);
        } else {
          console.log('Producto no encontrado en IndexedDB');
        }
      };
  
      request.onerror = (e) => {
        console.log('Error al obtener el producto de IndexedDB:', e.target.error);
      };
    } catch (error) {
      console.log('Error al abrir la base de datos:', error);
    }
  }
  
  verDescription(Number(productId));

  
  async function pintarVerMas(product) {
   
    verMas.appendChild(infoProduct)
    infoProduct.innerHTML = '';
    infoProduct.innerHTML = `
    <div class="row g-0">
    <div class="col-md-5 mt-5">
        <img src="${product.image}" class="img-fluid w-1 rounded-start border-end" alt="Portada de">
    </div>
    <div class="col-md-7 d-flex flex-column p-3">
        <div class="card-body flex-grow-0">
        <h5 class="card-title">${product.title}</h5>
        </div>

        <p id="informacion">
                
                ${product.description}
                </p>
        <div class="card-body flex-grow-0 mt-auto">
       
        </div>
    </div>
    `;
  }
  
