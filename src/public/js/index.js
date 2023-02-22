const socket = io()
const main = document.getElementById('list-products')

socket.on('init-products', ({ products }) => {
  main.innerHTML = ''
  products.forEach((product) => {
    main.innerHTML += `<div class="card" style="width: 18rem;" id=${product.id}>
		<div class="card-body">
		  <h5 class="card-title">${product.title}</h5>
		  <h6 class="card-subtitle mb-2 text-muted"> $${product.price}</h6>
		  <p class="card-text">${product.description}</p>
		</div>
	  </div>`
  })
})

socket.on('add-product', (product) => {
  main.innerHTML += `<div class="card" style="width: 18rem;" id=${product.id}>
		<div class="card-body">
		  <h5 class="card-title">${product.title}</h5>
		  <h6 class="card-subtitle mb-2 text-muted"> $${product.price}</h6>
		  <p class="card-text">${product.description}</p>
		</div>
	  </div>`
})

socket.on('delete-product', (id) => {
  const productToDelete = document.getElementById(id)
  productToDelete.remove()
})

socket.on('update-product', (product) => {
  const productToUpdate = document.getElementById(product.id)
  productToUpdate.remove()
  main.innerHTML += `<div class="card" style="width: 18rem;" id=${product.id}>
		<div class="card-body">
		  <h5 class="card-title">${product.title}</h5>
		  <h6 class="card-subtitle mb-2 text-muted"> $${product.price}</h6>
		  <p class="card-text">${product.description}</p>
		</div>
	  </div>`
})