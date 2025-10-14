document.addEventListener('DOMContentLoaded', () => {
    const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    };

    const bookSelect = document.getElementById('book-select');
    const chapterSelect = document.getElementById('chapter-select');
    const bibleTextContainer = document.getElementById('bible-text');
    const chapterTitle = document.getElementById('bible-chapter-title');
    const loadingSpinner = document.getElementById('loading-spinner');

    const API_BASE_URL = 'https://www.abibliadigital.com.br/api';
    const BIBLE_VERSION = 'nvi';

    const mockBooks = [
        { abbrev: { pt: 'sl' }, name: 'Salmos', chapters: 150 },
        { abbrev: { pt: 'gn' }, name: 'Gênesis', chapters: 50 },
        { abbrev: { pt: 'mt' }, name: 'Mateus', chapters: 28 },
        { abbrev: { pt: 'jo' }, name: 'João', chapters: 21 }
    ];
    
    // --- PLANO B: TEXTO DE EXEMPLO CASO A API FALHE ---
    const mockChapterText = {
        book: { name: 'Salmos' },
        chapter: { number: 23 },
        verses: [
            { number: 1, text: 'O Senhor é o meu pastor; de nada terei falta.' },
            { number: 2, text: 'Em verdes pastagens me faz repousar e me conduz a águas tranquilas;' },
            { number: 3, text: 'restaura-me o vigor. Guia-me nas veredas da justiça por amor do seu nome.' },
            { number: 4, text: 'Mesmo quando eu andar por um vale de trevas e morte, não temerei perigo algum, pois tu estás comigo; a tua vara e o teu cajado me protegem.' },
            { number: 5, text: 'Preparas um banquete para mim à vista dos meus inimigos. Tu me honras, ungindo a minha cabeça com óleo e fazendo transbordar o meu cálice.' },
            { number: 6, text: 'Sei que a bondade e a fidelidade me acompanharão todos os dias da minha vida, e voltarei à casa do Senhor enquanto eu viver.' }
        ]
    };

    const loadBooks = async () => {
        let books = [];
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL}/books`);
            if (!response.ok) throw new Error(`API respondeu com erro: ${response.status}`);
            books = await response.json();
        } catch (error) {
            console.error("API de livros falhou. Carregando livros de exemplo.", error);
            books = mockBooks; 
        }
        bookSelect.innerHTML = '<option value="">Selecione um livro</option>';
        books.forEach(book => {
            const option = document.createElement('option');
            option.value = book.abbrev.pt;
            option.textContent = book.name;
            option.dataset.chapters = book.chapters;
            bookSelect.appendChild(option);
        });
    };

    const populateChapters = (selectedBook) => {
        const chapterCount = parseInt(selectedBook.dataset.chapters, 10);
        chapterSelect.innerHTML = '<option value="">Selecione um capítulo</option>';
        if (chapterCount) {
            for (let i = 1; i <= chapterCount; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `Capítulo ${i}`;
                chapterSelect.appendChild(option);
            }
            chapterSelect.disabled = false;
        } else {
            chapterSelect.disabled = true;
        }
        chapterTitle.textContent = '';
        bibleTextContainer.innerHTML = '<p class="text-gray-500">Selecione um capítulo para começar a ler.</p>';
    };

    const renderChapterText = (data) => {
        chapterTitle.textContent = `${data.book.name}, Capítulo ${data.chapter.number}`;
        const versesHtml = data.verses.map(verse => `<p><strong class="text-blue-800 pr-2">${verse.number}</strong>${verse.text}</p>`).join('');
        bibleTextContainer.innerHTML = versesHtml;
    };

    const loadChapterText = async (bookAbbrev, chapter) => {
        bibleTextContainer.innerHTML = '';
        chapterTitle.textContent = '';
        loadingSpinner.style.display = 'block';
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL}/verses/${BIBLE_VERSION}/${bookAbbrev}/${chapter}`);
            if (!response.ok) throw new Error('Falha ao carregar o capítulo.');
            const data = await response.json();
            renderChapterText(data);
        } catch (error) {
            console.error(error);
            chapterTitle.textContent = "API indisponível. Exibindo texto de exemplo.";
            chapterTitle.style.color = "#ef4444";
            renderChapterText(mockChapterText); // Exibe o texto de exemplo
        } finally {
            loadingSpinner.style.display = 'none';
        }
    };

    bookSelect.addEventListener('change', (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        chapterSelect.disabled = true;
        chapterSelect.innerHTML = '<option>Selecione um livro</option>';
        if (selectedOption.value) {
            populateChapters(selectedOption);
        }
    });

    chapterSelect.addEventListener('change', (e) => {
        const bookAbbrev = bookSelect.value;
        const chapter = e.target.value;
        if (bookAbbrev && chapter) {
            loadChapterText(bookAbbrev, chapter);
        }
    });

    loadBooks();
});