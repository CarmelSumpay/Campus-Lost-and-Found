const THEME_STORAGE_KEY = 'cspc_theme';

function loadTheme() {
  const theme = localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcon();
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  document.querySelectorAll('.theme-toggle').forEach(button => {
    button.innerHTML = `<span class="theme-toggle-icon">${theme === 'light' ? '\u2600\ufe0f' : '\ud83c\udf19'}</span>`;
    button.setAttribute('title', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    button.setAttribute('aria-label', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
  });
}

function initNav() {
  updateThemeIcon();
}

function toggleMobileNav(event) {
  const button = event.target.closest('.menu-toggle');
  const navbar = button && button.closest('.navbar');
  const links = navbar && navbar.querySelector('.nav-links');
  if (links) links.classList.toggle('open');
}

loadTheme();
document.addEventListener('DOMContentLoaded', initNav);
document.addEventListener('click', event => {
  if (event.target.closest('.theme-toggle')) {
    toggleTheme();
    return;
  }

  if (event.target.closest('.menu-toggle')) {
    event.stopPropagation();
    toggleMobileNav(event);
    return;
  }

  document.querySelectorAll('.nav-links.open').forEach(links => {
    const navbar = links.closest('.navbar');
    if (navbar && !navbar.contains(event.target) || event.target.closest('.nav-links a, .nav-links button')) {
      links.classList.remove('open');
    }
  });
});
