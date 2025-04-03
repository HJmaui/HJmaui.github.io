document.addEventListener("DOMContentLoaded", function () {
    // === Theme Toggle ===
    const toggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    const hour = new Date().getHours();
    const systemTheme = (hour >= 18 || hour < 6) ? 'dark' : 'light';
    const appliedTheme = currentTheme || systemTheme;
  
    document.body.classList.add(appliedTheme);
    if (toggle) toggle.checked = appliedTheme === 'dark';
    if (toggle) {
      toggle.addEventListener('change', () => {
        const newTheme = toggle.checked ? 'dark' : 'light';
        document.body.classList.remove('dark', 'light');
        document.body.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
      });
    }
  
    // === Filtering ===
    const tagFilters = document.querySelectorAll('.tag-filter');
    const searchInput = document.getElementById('search-input');
  
    function filterItems() {
      const items = document.querySelectorAll('.item'); // Must get fresh list
      const activeTag = document.querySelector('.tag-filter.active');
      const activeFilter = activeTag ? activeTag.dataset.filter : 'all';
      const searchTerm = searchInput?.value.toLowerCase() || '';
  
      items.forEach(item => {
        const name = item.querySelector('.item-name')?.textContent.toLowerCase() || '';
        const tags = item.dataset.tags?.toLowerCase().split(' ') || [];
        const matchesSearch = name.includes(searchTerm);
        const matchesTag = activeFilter === 'all' || tags.includes(activeFilter);
        item.style.display = (matchesSearch && matchesTag) ? 'block' : 'none';
      });
    }
  
    // Add filter listeners
    tagFilters.forEach(tag => {
      tag.addEventListener('click', () => {
        tagFilters.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        filterItems();
      });
    });
  
    if (searchInput) {
      searchInput.addEventListener('input', filterItems);
    }
  
    // === Item Fetch & Render + Tag Color Styling ===
    fetch('items.json')
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById('items-container');
        container.innerHTML = '';
  
        data.forEach((item, index) => {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'item';
          itemDiv.dataset.tags = item.tags.join(' ');
  
          itemDiv.innerHTML = `
            <a href="#popup${index}">
              <img src="${item.image}" alt="${item.name}" />
            </a>
            <div class="item-name">${item.name}</div>
            <div class="tags">
              ${item.tags.map(tag => `<span class="tag">${tag.toUpperCase()}</span>`).join('')}
            </div>
          `;
  
          const popup = document.createElement('a');
          popup.className = 'lightbox';
          popup.href = '#';
          popup.id = `popup${index}`;
          popup.innerHTML = `
            <div class="popup-box">
              <img src="${item.image}" alt="${item.name}" />
            </div>
          `;
  
          container.appendChild(itemDiv);
          container.appendChild(popup);
        });
  
        // 🎨 Apply tag colors after items are added
        document.querySelectorAll('.tag').forEach(tag => {
          const tagName = tag.textContent.trim().toLowerCase();
          if (tagName === 'hj') {
            tag.style.backgroundColor = '#4CAF50';
          } else if (tagName === 'mbt') {
            tag.style.backgroundColor = '#2196F3';
          } else {
            tag.style.backgroundColor = '#aaa';
          }
          tag.style.color = 'white';
        });
  
        filterItems(); // Apply initial filtering after load
      });
  
    // In case items are already in DOM
    setTimeout(filterItems, 100);
  });  