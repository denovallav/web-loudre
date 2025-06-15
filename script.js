// Konfigurasi Tailwind (dipindahkan dari HTML)
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    }
  }
};

// API Configuration
const API_URL = "https://fakestoreapi.com/products";
const PRODUCT_LIMIT = 8;

// DOM Elements
const productList = document.getElementById('product-list');
const productLoading = document.getElementById('product-loading');

// Format price to IDR
function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(price * 15000);
}

// Fetch products from API
async function fetchProducts() {
  try {
    productLoading.style.display = 'grid';
    productList.innerHTML = '';
    
    const response = await fetch(`${API_URL}?limit=${PRODUCT_LIMIT}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    
    const products = await response.json();
    productLoading.style.display = 'none';
    displayProducts(products);
  } catch (error) {
    console.error('Error:', error);
    productLoading.style.display = 'none';
    productList.innerHTML = `
      <div class="col-span-full text-center py-12">
        <p class="text-red-500">Gagal memuat produk. Silakan coba lagi nanti.</p>
        <button onclick="fetchProducts()" class="mt-4 bg-black text-white px-4 py-2 rounded">
          Coba Lagi
        </button>
      </div>
    `;
  }
}

// Display products
function displayProducts(products) {
  productList.innerHTML = products.map(product => `
    <a href="detailproduk.html?id=${product.id}" class="group">
      <div class="relative overflow-hidden bg-gray-100 aspect-square mb-4">
        <img src="${product.image}"
             alt="${product.title}" 
             class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105">
        <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <button class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Quick View
        </button>
      </div>
      <h3 class="font-medium">${product.title}</h3>
      <p class="text-gray-600 text-sm">LOUDRÉ</p>
      <div class="grid grid-cols-2">
      <p class="font-medium mt-1">${formatPrice(product.price)}</p>
      <i class="fas fa-shopping-bag text-lg"></i>
      </div>
    </a>
  `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', fetchProducts);