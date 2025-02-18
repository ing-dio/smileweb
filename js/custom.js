let cameraPermissionGranted = false;
let deferredPrompt;

const addBtn = document.createElement('button');

function requestCameraPermission() {
  return navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      cameraPermissionGranted = true;
      console.log('Camera access granted');
    })
    .catch((err) => {
      cameraPermissionGranted = false;
      console.error('Camera access denied', err);
    });
}

async function fetchData() {
  const messageElement = document.getElementById('message');

  try {
    const content = await getRandomContent();
    messageElement.innerHTML = content.replace(/\n/g, '<br>');
  } catch (error) {
    console.error('Error fetching data:', error);
    messageElement.textContent = 'Failed to load content.';
  }
}

async function getRandomContent() {
  const SQL = await initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}` });
  const response = await fetch('/db/data.db');
  const arrayBuffer = await response.arrayBuffer();
  const Uint8ArrayData = new Uint8Array(arrayBuffer);
  const db = new SQL.Database(Uint8ArrayData);

  const stmt = db.prepare("SELECT content FROM sdb ORDER BY RANDOM() LIMIT 1");
  stmt.step();
  const row = stmt.getAsObject();

  return row.content;
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggleButton.classList.toggle('fa-moon', !isDark);
  themeToggleButton.classList.toggle('fa-sun', isDark);
}

function initializeTheme() {
  const themeToggleButton = document.getElementById('themeToggleButton');
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggleButton.classList.remove('fa-moon');
    themeToggleButton.classList.add('fa-sun');
  } else {
    themeToggleButton.classList.remove('fa-sun');
    themeToggleButton.classList.add('fa-moon');
  }
}

window.addEventListener('load', () => {
  const getStartedButton = document.getElementById('getStartedButton');
  if (getStartedButton) {
    getStartedButton.addEventListener('click', async (event) => {
      event.preventDefault();
      if (!cameraPermissionGranted) {
        await requestCameraPermission();
      }

      if (cameraPermissionGranted) {
        window.location.href = 'app.html';
      } else {
        alert('Camera permission is required to proceed.');
      }
    });
  }

  const themeToggleButton = document.getElementById('themeToggleButton');
  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', toggleTheme);
    initializeTheme();
  }
  
  if (document.getElementById('message')) {
    fetchData();
  }
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/js/service-worker.js', {scope: './'}).then(response => {
      return response;
    }).catch(reason => {
      return reason;
    });
  }
  addBtn.textContent = 'Install App';
  addBtn.style.display = 'none';
  document.body.appendChild(addBtn);

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    addBtn.style.display = 'block';
    addBtn.addEventListener('click', (e) => {
      addBtn.style.display = 'none';
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        deferredPrompt = null;
      });
    });
  });
});