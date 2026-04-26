const menuBtn = document.getElementById('menuBtn');
const drawer = document.getElementById('drawer');
const drawerBackdrop = document.getElementById('drawerBackdrop');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveKeyBtn = document.getElementById('saveKeyBtn');
const apiKeyStatus = document.getElementById('apiKeyStatus');

const savedKey = localStorage.getItem('geminiApiKey');
if (savedKey) {
  apiKeyInput.value = savedKey;
  apiKeyStatus.textContent = 'APIキーが保存されています';
  apiKeyStatus.className = 'api-key-hint saved';
}

menuBtn.addEventListener('click', () => drawer.classList.add('open'));
drawerBackdrop.addEventListener('click', () => drawer.classList.remove('open'));

saveKeyBtn.addEventListener('click', () => {
  const key = apiKeyInput.value.trim();
  if (!key) {
    apiKeyStatus.textContent = 'APIキーを入力してください';
    apiKeyStatus.className = 'api-key-hint';
    return;
  }
  localStorage.setItem('geminiApiKey', key);
  apiKeyStatus.textContent = '保存しました';
  apiKeyStatus.className = 'api-key-hint saved';
  setTimeout(() => drawer.classList.remove('open'), 600);
});
