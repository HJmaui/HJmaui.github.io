
document.addEventListener("DOMContentLoaded", function () {
    // Theme toggle logic
    const toggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    const hour = new Date().getHours();
    const systemTheme = (hour >= 18 || hour < 6) ? 'dark' : 'light';

    // Apply theme
    const appliedTheme = currentTheme || systemTheme;
    document.body.classList.add(appliedTheme);
    if (toggle) toggle.checked = appliedTheme === 'dark';

    // Toggle handler
    if (toggle) {
        toggle.addEventListener('change', () => {
            const newTheme = toggle.checked ? 'dark' : 'light';
            document.body.classList.remove('dark', 'light');
            document.body.classList.add(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Tag + Search Filtering
    const tagFilters = document.querySelectorAll('.tag-filter');
    const searchInput = document.getElementById('search-input');
    const items = document.querySelectorAll('.item');

    function filterItems() {
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

    filterItems();
});