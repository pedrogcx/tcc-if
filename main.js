document.addEventListener('DOMContentLoaded', () => {
    const fetchWithTimeout = async (url, options = {}, timeout = 8000) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    };

    // --- FUNÇÃO PARA CORRIGIR TEXTO (ex: "2Jesus" -> "2 Jesus") ---
    const formatApiText = (text) => {
        if (!text) return '';
        // Adiciona um espaço entre um número e uma letra (incluindo acentuadas)
        return text.replace(/(\d+)([a-zA-ZáéíóúâêîôûàçãõÁÉÍÓÚÂÊÎÔÛÀÇÃÕ])/g, '$1 $2');
    };

    const renderDailyLiturgy = async () => {
        const liturgyContainer = document.getElementById('daily-liturgy-content');
        if (!liturgyContainer) return;

        const apiUrl = 'https://liturgia.up.railway.app/';
        try {
            const response = await fetchWithTimeout(apiUrl);
            if (!response.ok) throw new Error(`API da liturgia falhou com status: ${response.status}`);
            const data = await response.json();

            // --- CORREÇÃO APLICADA AQUI ---
            const correctedGospelText = formatApiText(data.evangelho.texto);
            const formattedGospel = correctedGospelText.split('\n').map(p => `<p>${p}</p>`).join('');

            liturgyContainer.innerHTML = `
                <p class="text-sm text-gray-500">${data.data}</p>
                <h4 class="text-xl font-bold text-blue-800">${data.liturgia}</h4>
                <div class="mt-4 border-t pt-4">
                    <h5 class="font-semibold mb-2">${data.evangelho.referencia} - ${data.cor}</h5>
                    <div class="text-gray-600 leading-relaxed space-y-2">${formattedGospel}</div>
                </div>
            `;
        } catch (error) {
            console.error("Erro ao carregar Liturgia Diária:", error);
            liturgyContainer.innerHTML = '<p class="text-red-500">Não foi possível carregar a liturgia. A API pode estar indisponível. Tente novamente mais tarde.</p>';
        }
    };
    
    const renderVerseOfTheDay = async () => {
        const verseContainer = document.getElementById('verse-of-the-day');
        if (!verseContainer) return;
        const API_URL = 'https://www.abibliadigital.com.br/api/verses/nvi/random';
        try {
            const response = await fetchWithTimeout(API_URL);
            if (!response.ok) throw new Error('API de versículos falhou.');
            const verse = await response.json();
            verseContainer.innerHTML = `<p class="text-lg text-gray-600">"${verse.text}"</p><p class="font-bold text-blue-800 text-right mt-2">- ${verse.book.name} ${verse.chapter}:${verse.number}</p>`;
        } catch (error) {
            console.error("Erro ao carregar Versículo do Dia:", error);
            verseContainer.innerHTML = `<p class="text-lg text-gray-600">"Tudo posso naquele que me fortalece."</p><p class="font-bold text-blue-800 text-right mt-2">- Filipenses 4:13</p>`;
        }
    };

    renderDailyLiturgy();
    renderVerseOfTheDay();
});