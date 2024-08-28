'use strict';

const STORE_BASE_URL = 'https://fakestoreapi.com';
const CONTAINER = document.querySelector('.container');

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

// You'll need to play with this function in order to add features and enhance the style.
const renderProducts = (products) => {
  products.map((product) => {
    const productDiv = document.createElement('div');
    productDiv.innerHTML = `
          <img src="${product.image}" alt="${product.title} poster">
          <h3>${product.title}</h3>`;
    productDiv.addEventListener('click', () => {
      productDetails(product);
    });
    CONTAINER.appendChild(productDiv);
  });
};

// You'll need to play with this function in order to add features and enhance the style.
const renderProduct = (product) => {
  CONTAINER.innerHTML = `
      <div class="row">
          ${product.title}
      </div>`;
};

document.addEventListener('DOMContentLoaded', autorun);
