document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('navMount').innerHTML = renderNav('report-lost.html');
      initNav();

      // Populate selects
      const catSel = document.getElementById('category');
      const locSel = document.getElementById('location');
      CATEGORIES.forEach(c => catSel.add(new Option(c, c)));
      LOCATIONS.forEach(l  => locSel.add(new Option(l, l)));

      // Default date to today
      document.getElementById('dateLost').valueAsDate = new Date();

      // Photo preview
      document.getElementById('photoInput').addEventListener('change', function() {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
          const preview = document.getElementById('photoPreview');
          preview.src = e.target.result;
          preview.style.display = 'block';
          document.getElementById('uploadPrompt').style.display = 'none';
        };
        reader.readAsDataURL(file);
      });

      // Form submit
      document.getElementById('lostForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const title       = document.getElementById('title').value.trim();
        const category    = document.getElementById('category').value;
        const dateLost    = document.getElementById('dateLost').value;
        const location    = document.getElementById('location').value;
        const description = document.getElementById('description').value.trim();
        const reporterName    = document.getElementById('reporterName').value.trim();
        const reporterContact = document.getElementById('reporterContact').value.trim();
        const reporterEmail   = document.getElementById('reporterEmail').value.trim();

        if (!title || !category || !dateLost || !location || !description || !reporterName || !reporterContact) {
          showToast('Please fill in all required fields.', 'error');
          return;
        }

        const imageUrl = document.getElementById('photoPreview').src || '';

        const item = addItem({
          type: 'lost',
          title, category, dateLost, location, description,
          reporterName, reporterContact, reporterEmail,
          imageUrl: imageUrl.startsWith('data:') ? imageUrl : '',
          status: 'lost',
        });

        document.getElementById('formCard').style.display = 'none';
        const banner = document.getElementById('successBanner');
        banner.style.display = 'block';
        document.getElementById('successMsg').textContent =
          `"${item.title}" has been reported. Item ID: ${item.id}`;
      });
    });

    function resetForm() {
      document.getElementById('lostForm').reset();
      document.getElementById('photoPreview').style.display = 'none';
      document.getElementById('photoPreview').src = '';
      document.getElementById('uploadPrompt').style.display = 'block';
      document.getElementById('formCard').style.display = 'block';
      document.getElementById('successBanner').style.display = 'none';
      document.getElementById('dateLost').valueAsDate = new Date();
    }
