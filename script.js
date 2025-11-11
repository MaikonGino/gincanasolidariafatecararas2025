/* =================================
   script.js
   (Filtro de Busca + Busca por Voz + Troca de Abas)
   ================================= */

// Executa o script quando o conteúdo da página estiver totalmente carregado
document.addEventListener("DOMContentLoaded", () => {

    // --- 1. LÓGICA DE FILTRO POR TEXTO ---

    const searchInput = document.getElementById("search-input");
    const table = document.getElementById("donation-table");
    const tableRows = table.querySelectorAll("tbody tr");

    function filterTable(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        tableRows.forEach(row => {
            const itemText = row.querySelector("td").textContent.toLowerCase();
            if (itemText.includes(term)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }

    if (searchInput) { // Verifica se o campo de busca existe (boa prática)
        searchInput.addEventListener("keyup", () => {
            filterTable(searchInput.value);
        });
    }


    // --- 2. LÓGICA DE BUSCA POR VOZ (Web Speech API) ---

    const voiceSearchBtn = document.getElementById("voice-search-btn");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition && voiceSearchBtn) {
        const recognition = new SpeechRecognition();

        recognition.lang = 'pt-BR';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        voiceSearchBtn.addEventListener("click", () => {
            try {
                recognition.start();
                voiceSearchBtn.classList.add("is-listening");
                voiceSearchBtn.disabled = true;
            } catch (error) {
                console.error("Erro ao iniciar o reconhecimento de voz:", error);
                voiceSearchBtn.classList.remove("is-listening");
                voiceSearchBtn.disabled = false;
            }
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            searchInput.value = transcript;
            filterTable(transcript); // Chama o filtro
        };

        recognition.onend = () => {
            voiceSearchBtn.classList.remove("is-listening");
            voiceSearchBtn.disabled = false;
        };

        recognition.onerror = (event) => {
            console.error("Erro no reconhecimento de voz:", event.error);
            if (event.error === 'not-allowed') {
                alert("Você precisa permitir o acesso ao microfone para usar a busca por voz.");
            }
            voiceSearchBtn.classList.remove("is-listening");
            voiceSearchBtn.disabled = false;
        };

    } else if (voiceSearchBtn) {
        console.warn("API de Reconhecimento de Fala não suportada neste navegador.");
        voiceSearchBtn.style.display = "none";
    }


    // --- 3. LÓGICA DE TROCA DE ABAS (TABS) ---

    const tabToggles = document.querySelectorAll(".tab-toggle");
    const tabPanes = document.querySelectorAll(".tab-pane");

    tabToggles.forEach(button => {
        button.addEventListener("click", () => {

            // 1. Remove 'active' de todos os botões e painéis
            tabToggles.forEach(btn => btn.classList.remove("active"));
            tabPanes.forEach(pane => pane.classList.remove("active"));

            // 2. Adiciona 'active' ao botão clicado
            button.classList.add("active");

            // 3. Adiciona 'active' ao painel correspondente
            const targetPaneId = button.getAttribute("data-target");
            const targetPane = document.querySelector(targetPaneId);
            if (targetPane) {
                targetPane.classList.add("active");
            }
        });
    });

});