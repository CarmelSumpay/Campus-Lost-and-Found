let activeType = 'all';
    let currentPage = 1;
    const itemsPerPage = 6;

    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('navMount').innerHTML = renderNav('browse.html');
      initNav();

      // Populate filters
      const catSel = document.getElementById('filterCategory');
      const locSel = document.getElementById('filterLocation');
      CATEGORIES.forEach(c => catSel.add(new Option(c, c)));
      LOCATIONS.forEach(l  => locSel.add(new Option(l, l)));

      // Read URL params
      const typeParam   = getQueryParam('type');
      const statusParam = getQueryParam('status');
      if (typeParam && ['lost','found'].includes(typeParam)) {
        activeType = typeParam;
        document.querySelectorAll('.type-tab').forEach(tab => {
          tab.classList.toggle('active', tab.dataset.type === activeType);
        });
      }
      if (statusParam) {
        document.getElementById('filterStatus').value = statusParam;
      }

      // Tab clicks
      document.querySelectorAll('.type-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          activeType = tab.dataset.type;
          document.querySelectorAll('.type-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          renderGrid();
        });
      });

      // Reactive filters
      ['searchInput','filterCategory','filterLocation','filterStatus','sortSelect'].forEach(id => {
        document.getElementById(id).addEventListener('input', renderGrid);
      });

      document.getElementById('clearFilters').addEventListener('click', () => {
        document.getElementById('searchInput').value = '';
        document.getElementById('filterCategory').value = '';
        document.getElementById('filterLocation').value = '';
        document.getElementById('filterStatus').value = '';
        activeType = 'all';
        document.querySelectorAll('.type-tab').forEach(t => t.classList.toggle('active', t.dataset.type === 'all'));
        renderGrid();
      });

      renderGrid();
    });

    function renderGrid(resetPage = true) {
      if (resetPage) currentPage = 1;
      let items = getItems();

      // Type filter
      if (activeType !== 'all') items = items.filter(i => i.type === activeType);

      // Search
      const q = document.getElementById('searchInput').value.toLowerCase().trim();
      if (q) items = items.filter(i =>
        (i.title || '').toLowerCase().includes(q) ||
        (i.description || '').toLowerCase().includes(q) ||
        (i.category || '').toLowerCase().includes(q)
      );

      // Category
      const cat = document.getElementById('filterCategory').value;
      if (cat) items = items.filter(i => i.category === cat);

      // Location
      const loc = document.getElementById('filterLocation').value;
      if (loc) items = items.filter(i => i.location === loc);

      // Status
      const status = document.getElementById('filterStatus').value;
      if (status) items = items.filter(i => i.status === status);

      // Sort
      const sort = document.getElementById('sortSelect').value;
      if (sort === 'newest') items.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
      else if (sort === 'oldest') items.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
      else if (sort === 'az') items.sort((a,b) => a.title.localeCompare(b.title));
      else if (sort === 'za') items.sort((a,b) => b.title.localeCompare(a.title));

      // Count
      const total = getItems().length;
      document.getElementById('resultsCount').innerHTML =
        `Showing <strong>${items.length}</strong> of <strong>${total}</strong> items`;

      // Render
      const grid = document.getElementById('browseGrid');
      const pagination = document.getElementById('itemsPagination');
      if (items.length === 0) {
        pagination.innerHTML = '';
        grid.innerHTML = `
          <div class="empty-state" style="grid-column:1/-1">
            <div class="empty-state-icon">🔍</div>
            <h3>No items found</h3>
            <p>Try adjusting your filters or <a href="report-lost.html" style="color:var(--blue-main)">report a new item</a>.</p>
          </div>`;
      } else {
        const totalPages = Math.ceil(items.length / itemsPerPage);
        if (currentPage > totalPages) currentPage = totalPages;
        const pageItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
        grid.innerHTML = pageItems.map(buildItemCard).join('');
        renderItemsPagination(totalPages);
      }
    }

    function renderItemsPagination(totalPages) {
      const pagination = document.getElementById('itemsPagination');
      if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
      }

      let controls = `<button class="pagination-btn" onclick="goToItemsPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>`;
      for (let page = 1; page <= totalPages; page++) {
        controls += `<button class="pagination-btn ${page === currentPage ? 'active' : ''}" onclick="goToItemsPage(${page})" aria-label="Page ${page}">${page}</button>`;
      }
      controls += `<button class="pagination-btn" onclick="goToItemsPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>`;
      pagination.innerHTML = controls;
    }

    function goToItemsPage(page) {
      currentPage = page;
      renderGrid(false);
      document.getElementById('browseGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
