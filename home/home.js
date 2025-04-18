const products = [
  {
    id: 1,
    name: 'Angel Tee',
    price: 799,
    salePrice: 299,
    image: '/images/back_1.png',
    category: 'Tees',
  },
  {
    id: 2,
    name: 'Fate Dominant',
    price: 899,
    salePrice: 749,
    image: '/images/Fate_Dominant_1.png',
    category: 'Tees',
  },
  {
    id: 3,
    name: 'Trasher',
    price: 1199,
    salePrice: 899,
    image: '/images/Trasher.jpg',
    category: 'Tees',
  },
  {
    id: 4,
    name: 'The 77',
    price: 3499,
    salePrice: 1999,
    image: '/images/Jacket_1.jpg',
    category: 'Hoodies',
  }
];

function renderProducts(category = 'All') {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';

  const filtered = category === 'All' ? products : products.filter(p => p.category === category);

  if (filtered.length === 0) {
    grid.innerHTML = '<p>No products available in this category.</p>';
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" style="width:100%; border-radius: 8px;"/>
      <h3>${product.name}</h3>
      <p><del>₹${product.price}</del> <strong>₹${product.salePrice}</strong></p>
      <button onclick="alert('Added to cart!')">Add to Cart 🛒</button>
    `;
    grid.appendChild(card);
  });
}

function filterProducts(category) {
  renderProducts(category);
}

function navigateTo(page) {
  alert('Navigating to ' + page);
  // Use location.href = '/path' for real links
}

function subscribeNewsletter(e) {
  e.preventDefault();
  alert('Thank you for subscribing!');
}

// Initial render
renderProducts();

