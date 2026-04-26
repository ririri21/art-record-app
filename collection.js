const collectionEmpty = document.getElementById('collectionEmpty');
const collectionToolbar = document.getElementById('collectionToolbar');
const collectionGrid = document.getElementById('collectionGrid');
const modal = document.getElementById('modal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalSave = document.getElementById('modalSave');
const modalDelete = document.getElementById('modalDelete');
const sortBtn = document.getElementById('sortBtn');

let selectedArtwork = null;
let sortOrder = 'desc'; // 'desc' = 新しい順, 'asc' = 古い順

function getCentury(artwork) {
  if (artwork.century != null) return artwork.century;
  const n = parseInt(artwork.year);
  return isNaN(n) ? null : Math.floor(n / 100) * 100;
}

function centuryLabel(century) {
  if (century === null) return '制作年不明';
  return `${century}年代`;
}

async function render() {
  const collection = await artDB.getAll();
  collectionGrid.innerHTML = '';

  if (collection.length === 0) {
    collectionEmpty.classList.remove('hidden');
    collectionToolbar.classList.add('hidden');
    return;
  }
  collectionEmpty.classList.add('hidden');
  collectionToolbar.classList.remove('hidden');

  // グルーピング
  const groups = new Map();
  collection.forEach((artwork) => {
    const c = getCentury(artwork);
    const key = c === null ? 'unknown' : String(c);
    if (!groups.has(key)) groups.set(key, { century: c, items: [] });
    groups.get(key).items.push(artwork);
  });

  // ソート（世紀単位）
  const sorted = [...groups.values()].sort((a, b) => {
    if (a.century === null) return 1;
    if (b.century === null) return -1;
    return sortOrder === 'desc' ? b.century - a.century : a.century - b.century;
  });

  sorted.forEach(({ century, items }) => {
    const section = document.createElement('div');
    section.className = 'century-section';

    const heading = document.createElement('h2');
    heading.className = 'century-heading';
    heading.textContent = centuryLabel(century);
    section.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'collection-grid';

    items.forEach((artwork) => {
      const card = document.createElement('div');
      card.className = 'artwork-card';
      card.innerHTML = `
        <img src="${artwork.image}" alt="${artwork.title}" class="card-image">
        <div class="card-info">
          <p class="card-title">${artwork.title}</p>
          <p class="card-artist">${artwork.artist} · ${artwork.year}</p>
        </div>
      `;
      card.addEventListener('click', () => openModal(artwork));
      grid.appendChild(card);
    });

    section.appendChild(grid);
    collectionGrid.appendChild(section);
  });
}

sortBtn.addEventListener('click', () => {
  sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
  sortBtn.textContent = sortOrder === 'desc' ? '新しい順' : '古い順';
  render();
});

function openModal(artwork) {
  selectedArtwork = artwork;
  modalImage.src = artwork.image;
  document.getElementById('modalArtist').value = artwork.artist;
  document.getElementById('modalTitle').value = artwork.title;
  document.getElementById('modalYear').value = artwork.year;
  document.getElementById('modalMemo').value = artwork.memo || '';
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  selectedArtwork = null;
}

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

modalSave.addEventListener('click', async () => {
  if (!selectedArtwork) return;
  const yearVal = document.getElementById('modalYear').value || '不明';
  const yearNum = parseInt(yearVal);
  const century = isNaN(yearNum) ? null : Math.floor(yearNum / 100) * 100;
  const updated = {
    ...selectedArtwork,
    artist: document.getElementById('modalArtist').value || '不明',
    title: document.getElementById('modalTitle').value || '不明',
    year: yearVal,
    century,
    memo: document.getElementById('modalMemo').value,
  };
  await artDB.save(updated);
  closeModal();
  render();
});

modalDelete.addEventListener('click', async () => {
  if (!selectedArtwork) return;
  await artDB.delete(selectedArtwork.id);
  closeModal();
  render();
});

artDB.migrateFromLocalStorage().then(() => render());

// エクスポート
document.getElementById('exportBtn').addEventListener('click', async () => {
  const data = await artDB.getAll();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'art-collection.json';
  a.click();
  URL.revokeObjectURL(url);
});

// インポート
document.getElementById('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const status = document.getElementById('importStatus');
  try {
    const text = await file.text();
    const artworks = JSON.parse(text);
    for (const artwork of artworks) {
      await artDB.save(artwork);
    }
    status.textContent = `${artworks.length}件をインポートしました`;
    e.target.value = '';
    render();
  } catch {
    status.textContent = 'インポートに失敗しました';
  }
});
