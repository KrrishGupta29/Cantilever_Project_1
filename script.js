const apiKey = ''; // Replace with your NewsAPI key
const newsList = document.getElementById('news-list');
const categorySelect = document.getElementById('category');
const searchInput = document.getElementById('searchInput');
const logoutBtn = document.getElementById('logout-btn');
const authForm = document.getElementById('auth-form');
const newsControls = document.getElementById('news-controls');

// Load auth state
document.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('user');
  if (user) {
    showNewsControls();
  } else {
    showLoginForm();
  }
});

// Fetch news
async function fetchNews() {
  const category = categorySelect.value;
  const searchQuery = searchInput.value;

  const url = new URL('http://localhost:5000/api/news');
  if (category) url.searchParams.append('category', category);
  if (searchQuery) url.searchParams.append('query', searchQuery);

  const res = await fetch(url);
  const data = await res.json();
  displayNews(data.articles || []);
}


// Display news
function displayNews(articles) {
  newsList.innerHTML = '';
  if (!articles.length) {
    newsList.innerHTML = '<p>No articles found.</p>';
    return;
  }

  articles.forEach(article => {
    const div = document.createElement('div');
    div.className = 'news-item';
    div.innerHTML = `
      <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
      <p>${article.description || ''}</p>
    `;
    newsList.appendChild(div);
  });
}

// Show login/registration
function showLoginForm() {
  authForm.innerHTML = `
    <h3>Login or Register</h3>
    <input type="text" id="username" placeholder="Username" /><br/><br/>
    <input type="password" id="password" placeholder="Password" /><br/><br/>
    <button onclick="login()">Login</button>
    <button onclick="register()">Register</button>
  `;
  logoutBtn.classList.add('hidden');
  newsControls.classList.add('hidden');
  newsList.innerHTML = '';
}

// Login function
function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  const savedUser = JSON.parse(localStorage.getItem(`user_${username}`));
  if (savedUser && savedUser.password === password) {
    localStorage.setItem('user', username);
    showNewsControls();
  } else {
    alert('Invalid credentials!');
  }
}

// Register function
function register() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (localStorage.getItem(`user_${username}`)) {
    alert('User already exists!');
    return;
  }

  localStorage.setItem(`user_${username}`, JSON.stringify({ username, password }));
  localStorage.setItem('user', username);
  showNewsControls();
}

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('user');
  showLoginForm();
});

// Show news UI
function showNewsControls() {
  authForm.innerHTML = `<p>Welcome, ${localStorage.getItem('user')}!</p>`;
  logoutBtn.classList.remove('hidden');
  newsControls.classList.remove('hidden');
  fetchNews();
}
