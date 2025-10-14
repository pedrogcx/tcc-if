document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o envio real do formulário

            // NOTA: Isto é uma simulação de envio para fins de demonstração do TCC.
            // Nenhuma informação está sendo enviada para um servidor.
            formMessage.textContent = 'Sua mensagem foi enviada com sucesso! Agradecemos o seu contato.';
            formMessage.className = 'text-center mt-4 p-3 rounded-lg bg-green-100 text-green-800';
            formMessage.classList.remove('hidden');

            form.reset(); // Limpa o formulário

            // Esconde a mensagem de sucesso após 5 segundos
            setTimeout(() => {
                formMessage.classList.add('hidden');
            }, 5000);
        });
    }
});