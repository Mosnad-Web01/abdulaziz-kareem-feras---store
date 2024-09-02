'use strict';

const STORE_BASE_URL = 'https://fakestoreapi.com';
const CONTAINER = document.querySelector('.container');
const CART = []; // Array to store cart items

// Don't touch this function please
const autorun = async () => {
  const products = await fetchProducts();
  renderProducts(products);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${STORE_BASE_URL}/${path}`;
};

// This function is to fetch products. You may need to add it or change some part in it in order to apply some of the features.
const fetchProducts = async () => {
  const url = constructUrl(`products`);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one product.
const fetchProduct = async (productId) => {
  const url = constructUrl(`products/${productId}`);
  const res = await fetch(url);
  return res.json();
};

// You may need to add to this function, definitely don't delete it.
const productDetails = async (product) => {
  const res = await fetchProduct(product.id);
  renderProduct(res);
};


const renderProducts = (products) => {
  CONTAINER.innerHTML = ''; // Clear previous products

  const cardRow = document.createElement('div');
  cardRow.classList.add('row');

  products.map((product) => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('col-md-3', 'mb-5', 'd-flex', 'justify-content-center'); // Bootstrap classes for layout

    productDiv.innerHTML = `
          <div class="card p-3" style="width: 18rem;">
            <img src="${product.image}" class="card-img-top d-flex align-items-center h-100 product-image" alt="${product.title} poster" style="width: 100%; max-height: 150px; object-fit: contain;">
            <div class="card-body d-flex flex-column">
              <h6 class="card-title product-title">${product.title}</h6>
              <p class="card-text">${product.description.substring(0, 50)}...</p>
              <p class="card-text">Price: $${product.price.toFixed(2)}</p>
              </div>
              <button class="btn btn-primary  fw-bold add-to-cart" data-product-id="${product.id}">Add to Cart</button>
          </div>
          `;

    // Add event listener for image and title click
    productDiv.querySelector('.product-image').addEventListener('click', () => {
      productDetails(product);
    });
    productDiv.querySelector('.product-title').addEventListener('click', () => {
      productDetails(product);
    });

    productDiv.querySelector('.add-to-cart').addEventListener('click', () => {
      addToCart(product.id);
    });

    cardRow.appendChild(productDiv);
  });

  CONTAINER.appendChild(cardRow);
};


// You'll need to play with this function in order to add features and enhance the style.
const renderProduct = (product) => {
  CONTAINER.innerHTML = `
       <div class="card h-100 bg-500">
            <img src="${product.image}" class="card-img-top" alt="${product.title} poster">
            <div class="card-body">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-text">${product.description}</p> <p class="card-text">Price: $${product.price.toFixed(2)}</p>
              <button class="btn btn-primary  add-to-cart" data-product-id="${product.id}">Add to Cart</button>
            </div>
          </div>`;
  CONTAINER.querySelector('.add-to-cart').addEventListener('click', () => {
    addToCart(product.id);
  });
};

// Add to Cart functionality
const addToCart = (productId) => {
  fetchProduct(productId).then((product) => {
    // Find the existing product by ID
    const existingProductIndex = CART.findIndex((item) => item.id === productId);

    if (existingProductIndex !== -1) {
      // If product exists, increase quantity
      CART[existingProductIndex].quantity += 1; // Correctly increment quantity
    } else {
      // If product doesn't exist, add it with quantity 1
      CART.push({ ...product, quantity: 1 });
    }
    updateCartCount();
    // renderCartPage(); // Uncomment this if you want to re-render the cart on adding items 
  });
};

// Update cart count in the navbar
const updateCartCount = () => {
  const cartCountElement = document.getElementById('cartCount');
  cartCountElement.textContent = CART.length;
};

// Function to filter products by category
const filterCategory = (category) => {
  fetchProductsByCategory(category).then((products) => {
    renderProducts(products);
  });
};

// Function to search products
const searchProducts = (event) => {
  event.preventDefault();
  const query = document.getElementById('searchInput').value.toLowerCase();
  fetchProducts().then((products) => {
    const filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(query)
    );
    renderProducts(filteredProducts);
  });
};

// Function to filter products by rating or price
const filterProducts = (filterType) => {
  fetchProducts().then((products) => {
    let filteredProducts = [];
    if (filterType === 'rating') {
      filteredProducts = products.sort((a, b) => b.rating.rate - a.rating.rate);
    } else if (filterType === 'price') {
      filteredProducts = products.sort((a, b) => a.price - b.price);
    }
    renderProducts(filteredProducts);
  });
};

// Function to fetch products by category
const fetchProductsByCategory = async (category) => {
  const url = constructUrl(`products/category/${category}`);
  const res = await fetch(url);
  return res.json();
};

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  autorun(); // Existing autorun function to load products

  // Create the Navbar
  const navbar = document.createElement('nav');
  navbar.className = 'navbar navbar-expand-lg navbar-light bg-gray';

  navbar.innerHTML = `
     <div class="container-fluid p-2 bg-dark mb-5">
      <a class="navbar-brand text-primary fw-bold" href="/">Ezz Store</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse ms-5" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <a class="nav-link active text-white fw-bold" aria-current="page" href="/">Home</a>
          <li class="nav-item d-flex align-items-center gap-2 text-muted ms-4">
            <a class="dropdown-item rounded-pill border text-white px-2" href="#" onclick="filterCategory('electronics')">Electronics</a>
            <a class="dropdown-item rounded-pill border text-white px-2" href="#" onclick="filterCategory('jewelery')">Jewelery</a>
            <a class="dropdown-item rounded-pill border text-white px-2" href="#" onclick="filterCategory(&quot;men's clothing&quot;)">Men's Clothing</a>
            <a class="dropdown-item rounded-pill border text-white px-2" href="#" onclick="filterCategory(&quot;women's clothing&quot;)">Women's Clothing</a>
          </li>
        </ul>
        <form class="d-flex" onsubmit="searchProducts(event)">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" id="searchInput">
          <button class="btn rounded-pill bg-primary text-white" type="submit">Search</button>
        </form>
        <div class="nav-item dropdown ms-3">
          <a class="nav-link dropdown-toggle" href="#" id="filterDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Filter
          </a>
          <ul class="dropdown-menu" aria-labelledby="filterDropdown">
            <li><a class="dropdown-item" href="#" onclick="filterProducts('rating')">Rating</a></li>
            <li><a class="dropdown-item" href="#" onclick="filterProducts('price')">Price</a></li>
          </ul>
        </div>
        <div class="nav-item ms-3">
          <a class="nav-link" href="#" id="cartIcon" onclick="renderCartPage()">Cart <span class="badge bg-secondary" id="cartCount">0</span></a>
        </div>
      </div>
    </div>
     
  `;

  // Append the Navbar to the body
  document.body.insertBefore(navbar, document.body.firstChild);

  // Create the Cart Modal

  });


// Function to render cart items in the modal
const renderCart = () => {
  const cartModalBody = document.getElementById('cartModalBody');
  cartModalBody.innerHTML = ''; // Clear previous cart items

  if (CART.length === 0) {
    cartModalBody.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  CART.map((item) => {
    const cartItemDiv = document.createElement('div');
    cartItemDiv.classList.add('d-flex', 'align-items-center', 'mb-2');
    cartItemDiv.innerHTML = `
      <img src="${item.image}" class="cart-item-image" alt="${item.title} poster" style="width: 50px; height: 50px;">
      <div class="ms-3">
        <p class="mb-0">${item.title}</p>
        <p class="mb-0">Price: $${item.price.toFixed(2)}</p>
        <p class="mb-0">Quantity: ${item.quantity}</p>
      </div>
    `;
    cartModalBody.appendChild(cartItemDiv);
  });
};


const renderCartPage = () => {
  CONTAINER.innerHTML = ''; // Clear previous content

  const cartTitle = document.createElement('h2');
  cartTitle.textContent = 'Your Cart';
  cartTitle.classList.add('my-4');
  CONTAINER.appendChild(cartTitle);

  if (CART.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'Your cart is empty.';
    CONTAINER.appendChild(emptyMessage);
  } else {
    CART.forEach((item) => {
      const cartItemDiv = document.createElement('div');
      cartItemDiv.classList.add('card', 'mb-3');
      cartItemDiv.innerHTML = `
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${item.image}" class="img-fluid rounded-start" alt="${item.title}" style="max-height: 150px; object-fit: contain;">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
              <p class="card-text">Price: $${item.price.toFixed(2)}</p>
              <p class="card-text">Quantity: ${item.quantity}</p>
              <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
          </div>
        </div>
      `;
      CONTAINER.appendChild(cartItemDiv);
    });
  }
};

const removeFromCart = (productId) => {
  const productIndex = CART.findIndex((item) => item.id === productId);
  if (productIndex !== -1) {
    CART.splice(productIndex, 1); // Remove the product from the cart
    updateCartCount(); // Update cart count
    renderCartPage();  // Re-render the cart page
  }
};


const footer = document.createElement('footer');
footer.className = 'footer text-center';
footer.innerHTML = `
  <p>©2023 Built By Abdulaziz Alhashedi </p>
  <a href="https://github.com/Hash-Ezz" target="_blank" rel="noopener noreferrer">
    <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" width="30" height="30">
  </a>
  <!-- Add social media links if needed -->
`;
// Append the Footer to the body
document.body.appendChild(footer);