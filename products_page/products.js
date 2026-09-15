(function() {
  // ---------- PRODUCT DATA ----------
  const products = [
    {
      id: 1,
      name: "Madar Washing Powder",
      brand: "Cleaning Products",
      category: "household",
      categoryLabel: "Household",
      image: "../images/madar.webp",
      rating: 4.5,
      reviews: 328,
      recommend: 89,
      description: "A popular household detergent reviewed for cleaning performance, fragrance and value."
    },
    {
      id: 2,
      name: "Nivea Body Lotion",
      brand: "Personal Care",
      category: "beauty",
      categoryLabel: "Beauty",
      image: "../images/nivea.jpg",
      rating: 4.1,
      reviews: 214,
      recommend: 82,
      description: "Users share their experiences with moisture, fragrance, texture and long-term results."
    },
    {
      id: 3,
      name: "Google Pixel 10 Pro XL",
      brand: "Mobile Technology",
      category: "electronics",
      categoryLabel: "Electronics",
      image: "../images/pixel 10  pro xl.jpg",
      rating: 4.8,
      reviews: 741,
      recommend: 94,
      description: "Reviews covering performance, battery life, camera quality and overall value."
    },
    {
      id: 4,
      name: "Fortune Sunflower Oil",
      brand: "Food & Beverage",
      category: "food",
      categoryLabel: "Food",
      image: "../images/fortune sunflower oil.jpg",
      rating: 3.8,
      reviews: 186,
      recommend: 76,
      description: "Consumers rate taste, cooking performance, packaging and overall value for money."
    },
    {
      id: 5,
      name: "Vaseline Lip Balm",
      brand: "Personal Care",
      category: "beauty",
      categoryLabel: "Beauty",
      image: "../images/vaseline lip balm.jpg",
      rating: 3.8,
      reviews: 186,
      recommend: 76,
      description: "Consumers rate taste, cooking performance, packaging and overall value for money."
    },
    {
      id: 6,
      name: "Zara Denim Jacket",
      brand: "Urban Style",
      category: "fashion",
      categoryLabel: "Fashion",
      image: "../images/zara denim jacket.jpg",
      rating: 4.3,
      reviews: 142,
      recommend: 85,
      description: "Durable, stylish and comfortable. Users love the fit and classic look."
    },
    {
      id: 7,
      name: "Synthetic Engine Oil 5W-40",
      brand: "AutoPro",
      category: "automotive",
      categoryLabel: "Automotive",
      image: "../images/shell engine oil.jpg",
      rating: 4.6,
      reviews: 97,
      recommend: 91,
      description: "High-performance oil reviewed for engine protection and fuel efficiency."
    },
    {
      id: 8,
      name: " Sony Wireless Noise-Cancelling Headphones",
      brand: "SoundCore",
      category: "electronics",
      categoryLabel: "Electronics",
      image: "../images/sony wireless headphone.jpg",
      rating: 4.7,
      reviews: 523,
      recommend: 93,
      description: "Exceptional sound quality and comfort. Battery life impresses most users."
    }
  ];

  // ---------- DOM ELEMENTS ----------
  const grid = document.getElementById('productsGrid');
  const searchInput = document.getElementById('productSearch');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  const applyBtn = document.getElementById('applyFilters');

  // Guard: if grid doesn't exist, stop (page not loaded properly)
  if (!grid) return;

  // ---------- RENDER FUNCTION ----------
  function renderProducts(filteredProducts) {
    if (filteredProducts.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <i class="fa-solid fa-box-open"></i>
          <h3>No products found</h3>
          <p>Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      `;
      return;
    }

    let html = '';
    filteredProducts.forEach(p => {
      // Build star rating (full, half, empty)
      const fullStars = Math.floor(p.rating);
      const hasHalf = p.rating % 1 >= 0.5;
      const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

      let starsHtml = '';
      for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fa-solid fa-star"></i>';
      }
      if (hasHalf) {
        starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
      }
      for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="fa-regular fa-star"></i>';
      }

      html += `
        <article class="product-card">
          <div class="product-image">
            <img
              src="${p.image}"
              alt="${p.name}"
              loading="lazy"
              onerror="this.onerror=null; this.src='https://placehold.co/600x400/e8f5ec/166534?text=${encodeURIComponent(p.name)}'"
            >
            <span class="product-category">${p.categoryLabel}</span>
            <button class="bookmark-btn" aria-label="Save product">
              <i class="fa-regular fa-bookmark"></i>
            </button>
          </div>

          <div class="product-content">
            <span class="product-brand">${p.brand}</span>
            <h3>${p.name}</h3>

            <div class="rating-row">
              <div class="stars">${starsHtml}</div>
              <strong>${p.rating.toFixed(1)}</strong>
              <span>(${p.reviews} reviews)</span>
            </div>

            <p class="product-description">${p.description}</p>

            <div class="product-footer">
              <div class="recommendation">
                <i class="fa-solid fa-thumbs-up"></i>
                <span><strong>${p.recommend}%</strong> recommend</span>
              </div>
              <a href="product.html?id=${p.id}" class="product-link">
                View Reviews
                <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </article>
      `;
    });

    grid.innerHTML = html;

    // Re-attach bookmark click handlers (delegated below, but kept for clarity)
    attachBookmarkHandlers();
  }

  // ---------- BOOKMARK TOGGLE ----------
  function attachBookmarkHandlers() {
    const bookmarkBtns = grid.querySelectorAll('.bookmark-btn');
    bookmarkBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const icon = this.querySelector('i');
        if (icon.classList.contains('fa-regular')) {
          icon.classList.remove('fa-regular');
          icon.classList.add('fa-solid');
          this.style.background = '#166534';
          this.style.color = '#ffffff';
        } else {
          icon.classList.remove('fa-solid');
          icon.classList.add('fa-regular');
          this.style.background = 'rgba(255, 255, 255, 0.94)';
          this.style.color = '#4b5563';
        }
      });
    });
  }

  // ---------- FILTER & SORT LOGIC ----------
  function applyFilters() {
    const searchTerm = (searchInput?.value || '').trim().toLowerCase();
    const selectedCategory = categoryFilter?.value || 'all';
    const sortBy = sortFilter?.value || 'popular';

    // 1. Filter
    let filtered = products.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm) ||
        p.brand.toLowerCase().includes(searchTerm) ||
        p.categoryLabel.toLowerCase().includes(searchTerm);

      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // 2. Sort
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'popular':
      default:
        // Popular = recommend percentage descending
        filtered.sort((a, b) => b.recommend - a.recommend);
        break;
    }

    // 3. Render
    renderProducts(filtered);
  }

  // ---------- EVENT LISTENERS ----------
  if (applyBtn) {
    applyBtn.addEventListener('click', applyFilters);
  }

  if (searchInput) {
    // Live search with a small debounce for smoother UX
    let debounceTimer;
    searchInput.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(applyFilters, 250);
    });

    // Enter key triggers search immediately
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        clearTimeout(debounceTimer);
        applyFilters();
      }
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', applyFilters);
  }

  if (sortFilter) {
    sortFilter.addEventListener('change', applyFilters);
  }

  // ---------- INITIAL RENDER ----------
  applyFilters();
})();