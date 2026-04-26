// ── Painter Quotes ──────────────────────────────────────────────────────────
const PAINTER_QUOTES = [
  {
    quote: "すべての子どもは芸術家だ。問題は、大人になっても芸術家でいられるかどうかだ。",
    name: "パブロ・ピカソ",
    image: "images/painters/picasso.jpg"
  },
  {
    quote: "偉大なことは、衝動によってではなく、小さなことの積み重ねによって成し遂げられる。",
    name: "フィンセント・ファン・ゴッホ",
    image: "images/painters/van-gogh.jpg"
  },
  {
    quote: "芸術は決して完成しない。ただ、放棄されるだけだ。",
    name: "レオナルド・ダ・ヴィンチ",
    image: "images/painters/da-vinci.jpg"
  },
  {
    quote: "色彩は一日中、絶え間なく変化している。",
    name: "クロード・モネ",
    image: "images/painters/monet.jpg"
  },
  {
    quote: "私は決して夢を描かなかった。私自身の現実を描いた。",
    name: "フリーダ・カーロ",
    image: "images/painters/kahlo.jpg"
  },
  {
    quote: "最大の危険は、高すぎる目標を立てて失敗することではなく、低すぎる目標を立てて達成することだ。",
    name: "ミケランジェロ",
    image: "images/painters/michelangelo.jpg"
  },
  {
    quote: "絵を描くことは難しくない。難しいのは、描こうとするものを感じることだ。",
    name: "オーギュスト・ルノワール",
    image: "images/painters/renoir.jpg"
  },
  {
    quote: "創造するには勇気が必要だ。",
    name: "アンリ・マティス",
    image: "images/painters/matisse.jpg"
  },
  {
    quote: "完璧を恐れるな。どうせ完璧にはなれないのだから。",
    name: "サルバドール・ダリ",
    image: "images/painters/dali.jpg"
  },
  {
    quote: "偉大な芸術はすべて、愛に関するものだ。",
    name: "マルク・シャガール",
    image: "images/painters/chagall.jpg"
  },
  {
    quote: "私は目に見えるものではなく、かつてあったもの、そしてありうるものを描く。",
    name: "ポール・ゴーガン",
    image: "images/painters/gauguin.jpg"
  },
  {
    quote: "天才とは、最も感受性の鋭い人間のことだ。",
    name: "ポール・セザンヌ",
    image: "images/painters/cezanne.jpg"
  },
  {
    quote: "色彩は、魂に直接影響を与える力を持っている。",
    name: "ワシリー・カンディンスキー",
    image: "images/painters/kandinsky.jpg"
  },
  {
    quote: "私の芸術は、自己告白だ。",
    name: "エドヴァルド・ムンク",
    image: "images/painters/munch.jpg"
  },
  {
    quote: "絵は自分自身の生命を持っている。私はその生命を外に出してやるだけだ。",
    name: "ジャクソン・ポロック",
    image: "images/painters/pollock.jpg"
  },
  {
    quote: "誰でも15分間は世界的に有名になれる。",
    name: "アンディ・ウォーホル",
    image: "images/painters/warhol.jpg"
  },
  {
    quote: "幸福なことは、絵を描くことへの情熱を失わないことだ。",
    name: "カミーユ・ピサロ",
    image: "images/painters/pissarro.jpg"
  },
  {
    quote: "光は絵画において最も重要な要素だ。",
    name: "レンブラント・ファン・レイン",
    image: "images/painters/rembrandt.jpg"
  },
  {
    quote: "芸術は解放であり、すべての縛りからの自由だ。",
    name: "グスタフ・クリムト",
    image: "images/painters/klimt.jpg"
  },
  {
    quote: "見ることを学ぶこと——それがすべての芸術の基礎だ。",
    name: "エドガー・ドガ",
    image: "images/painters/degas.jpg"
  }
];

function initPainterQuote() {
  const quote = PAINTER_QUOTES[Math.floor(Math.random() * PAINTER_QUOTES.length)];
  const avatar = document.getElementById('painterAvatar');
  avatar.alt = quote.name;
  avatar.src = quote.image;
  avatar.onerror = function() {
    const initial = encodeURIComponent(quote.name.charAt(0));
    this.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle cx="26" cy="26" r="26" fill="%23d8cfa8"/><text x="26" y="35" text-anchor="middle" font-size="22" fill="%23786840" font-family="sans-serif">${initial}</text></svg>`;
    this.onerror = null;
  };
  document.getElementById('painterQuoteText').textContent = `「${quote.quote}」`;
  document.getElementById('painterQuoteName').textContent = `— ${quote.name}`;
}

try { initPainterQuote(); } catch (e) { console.warn('painter quote:', e); }

// ────────────────────────────────────────────────────────────────────────────
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const previewImage = document.getElementById('previewImage');
const analyzeBtn = document.getElementById('analyzeBtn');
const analyzeBtnText = document.getElementById('analyzeBtnText');
const resultSection = document.getElementById('resultSection');
const errorMessage = document.getElementById('errorMessage');
const saveBtn = document.getElementById('saveBtn');
const saveSuccess = document.getElementById('saveSuccess');

let currentFile = null;

function showPreview(file) {
  if (!file || !file.type.startsWith('image/')) return;
  currentFile = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.src = e.target.result;
    previewImage.classList.remove('hidden');
    uploadPlaceholder.classList.add('hidden');
    analyzeBtn.classList.remove('hidden');
    resultSection.classList.add('hidden');
    saveBtn.classList.add('hidden');
    saveSuccess.classList.add('hidden');
    errorMessage.classList.add('hidden');
  };
  reader.readAsDataURL(file);
}

uploadBtn.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => showPreview(e.target.files[0]));

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = '#333';
});
uploadArea.addEventListener('dragleave', () => { uploadArea.style.borderColor = ''; });
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = '';
  showPreview(e.dataTransfer.files[0]);
});

analyzeBtn.addEventListener('click', async () => {
  const apiKey = localStorage.getItem('geminiApiKey');
  if (!apiKey) { showError('先にGemini APIキーを設定してください（☰ メニュー → 設定）'); return; }
  if (!currentFile) return;

  analyzeBtn.disabled = true;
  analyzeBtnText.textContent = '解析中...';
  errorMessage.classList.add('hidden');
  saveBtn.classList.add('hidden');
  saveSuccess.classList.add('hidden');

  try {
    const base64 = await toBase64(currentFile);
    const result = await analyzeWithGemini(base64, currentFile.type, apiKey);
    document.getElementById('resultArtist').value = result.artist || '';
    document.getElementById('resultTitle').value = result.title || '';
    document.getElementById('resultYear').value = result.year || '';
    resultSection.classList.remove('hidden');
    saveBtn.classList.remove('hidden');
  } catch (e) {
    showError(e.message);
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtnText.textContent = 'AIで作品情報を取得する';
  }
});

saveBtn.addEventListener('click', async () => {
  if (previewImage.classList.contains('hidden')) return;
  const image = await compress(previewImage.src, 800, 0.75);
  const yearVal = document.getElementById('resultYear').value || '不明';
  const yearNum = parseInt(yearVal);
  const century = isNaN(yearNum) ? null : Math.floor(yearNum / 100) * 100;
  const artwork = {
    id: Date.now(),
    image,
    artist: document.getElementById('resultArtist').value || '不明',
    title: document.getElementById('resultTitle').value || '不明',
    year: yearVal,
    century,
    memo: document.getElementById('memo').value,
    savedAt: new Date().toISOString(),
  };
  try {
    await artDB.save(artwork);
    saveBtn.classList.add('hidden');
    saveSuccess.classList.remove('hidden');
  } catch (e) {
    showError('保存に失敗しました: ' + e.message);
  }
});


function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function analyzeWithGemini(base64, mimeType, apiKey) {
  const prompt = `この画像に写っている絵画の作者名、作品タイトル、制作年を特定してください。
作品タイトルは必ず日本語に翻訳してください（例：「モナ・リザ」「星月夜」など）。
必ず以下のJSON形式のみで返答してください（説明文は不要）:
{"artist": "作者名", "title": "日本語タイトル", "year": "制作年"}
不明な場合は該当フィールドを "不明" としてください。`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [
          { inline_data: { mime_type: mimeType, data: base64 } },
          { text: prompt }
        ]}]
      })
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `APIエラー (${res.status})`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const match = text.match(/\{[\s\S]*?\}/);
  if (!match) throw new Error('レスポンスの解析に失敗しました');
  return JSON.parse(match[0]);
}

function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.classList.remove('hidden');
}
