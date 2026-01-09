// Admin Dashboard App
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

if (navLinks && navLinks.length > 0) {
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionName = link.getAttribute('data-section');
      showSection(sectionName);
    });
  });
}

function showSection(sectionName) {
  sections.forEach(section => section.classList.remove('active'));
  const selectedSection = document.getElementById(sectionName);
  if (selectedSection) selectedSection.classList.add('active');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') === sectionName) link.classList.add('active');
  });
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    window.location.href = 'login.html';
  });
}

console.log('Admin App Loaded');
