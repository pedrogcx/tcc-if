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
        return text.replace(/(\d+)([a-zA-ZáéíóúâêîôûàçãõÁÉÍÓÚÂÊÎÔÛÀÇÃÕ])/g, '$1 $2');
    };

    const churches = [
        { name: "Catedral de Santo Antônio", address: "Praça da Matriz, 123, Centro, Janaúba - MG", massTimes: [{ day: "Domingo", times: ["07:00", "10:00", "19:00"] }, { day: "Segunda a Sexta", times: ["19:00"] }, { day: "Sábado", times: ["18:00"] }] },
        { name: "Paróquia Nossa Senhora Aparecida", address: "Rua das Flores, 456, Bairro Esplanada, Janaúba - MG", massTimes: [{ day: "Domingo", times: ["08:00", "19:30"] }, { day: "Quarta-feira", times: ["19:30"] }, { day: "Sábado", times: ["19:00"] }] },
        { name: "Comunidade São Francisco de Assis", address: "Avenida Brasil, 789, Bairro Santo Antônio, Janaúba - MG", massTimes: [{ day: "Domingo", times: ["09:00"] }, { day: "Quinta-feira", times: ["19:00"] }] }
    ];

    const massScheduleList = document.getElementById('mass-schedule-list');
    const churchListContainer = document.getElementById('church-list');
    const mapIframe = document.getElementById('map-iframe');

    const renderMassSchedules = () => {
        if (!massScheduleList) return;
        massScheduleList.innerHTML = '';
        churches.forEach(church => {
            const churchDiv = document.createElement('div');
            churchDiv.className = 'bg-white rounded-lg shadow-md p-4';
            let timesHtml = church.massTimes.map(schedule => `<p><strong class="font-semibold">${schedule.day}:</strong> ${schedule.times.join(', ')}</p>`).join('');
            churchDiv.innerHTML = `<h4 class="text-xl font-bold text-blue-800 mb-2">${church.name}</h4><div class="text-gray-700 space-y-1">${timesHtml}</div>`;
            massScheduleList.appendChild(churchDiv);
        });
    };

    const renderChurchListAndMap = () => {
        if (!churchListContainer || !mapIframe) return;
        const defaultAddress = "Janaúba, Minas Gerais";
        
        // --- CORREÇÃO DO MAPA APLICADA AQUI ---
        mapIframe.src = `http://googleusercontent.com/maps.google.com/?q=${encodeURIComponent(defaultAddress)}&z=13&ie=UTF8&iwloc=&output=embed`;
        
        churchListContainer.innerHTML = '';
        churches.forEach(church => {
            const churchItem = document.createElement('div');
            churchItem.className = 'p-4 hover:bg-gray-100 cursor-pointer';
            churchItem.innerHTML = `<h5 class="font-bold text-blue-900">${church.name}</h5><p class="text-sm text-gray-600">${church.address}</p>`;
            churchItem.addEventListener('click', () => {
                const encodedAddress = encodeURIComponent(church.address);
                // --- CORREÇÃO DO MAPA APLICADA AQUI ---
                mapIframe.src = `http://googleusercontent.com/maps.google.com/?q=${encodedAddress}&z=16&ie=UTF8&iwloc=&output=embed`;
            });
            churchListContainer.appendChild(churchItem);
        });
    };
    
    const renderGospelOfDay = async () => {
        const gospelContainer = document.getElementById('gospel-of-day');
        if (!gospelContainer) return;
        const apiUrl = 'https://liturgia.up.railway.app/';
        try {
            const response = await fetchWithTimeout(apiUrl);
            if (!response.ok) throw new Error(`API da liturgia falhou com status: ${response.status}`);
            const data = await response.json();

            // --- CORREÇÃO APLICADA AQUI ---
            const correctedGospelText = formatApiText(data.evangelho.texto);
            const formattedGospel = correctedGospelText.split('\n').map(p => `<p>${p}</p>`).join('');
            
            gospelContainer.innerHTML = `<h4 class="text-2xl font-bold mb-2">${data.evangelho.referencia}</h4><div class="space-y-3">${formattedGospel}</div>`;
        } catch (error) {
            console.error("Erro ao carregar Evangelho do Dia:", error);
            gospelContainer.innerHTML = '<p class="text-white">Não foi possível carregar o evangelho. Tente novamente mais tarde.</p>';
        }
    };

    renderMassSchedules();
    renderChurchListAndMap();
    renderGospelOfDay();
});