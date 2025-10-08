document.addEventListener('DOMContentLoaded', () => {
    const btnCopiar = document.getElementById('btnCopiarPrompt');
    const textoPrompt = document.getElementById('promptMaestro');

    if (btnCopiar && textoPrompt) {
        // Asegúrate de pegar el texto del prompt en el HTML.
        // Por ahora, lo dejaremos con un texto de ejemplo si está vacío.
        if (textoPrompt.textContent.includes('[Aquí va el texto')) {
            textoPrompt.textContent = "Error: Pega el texto del Prompt Maestro en el archivo ayuda.html.";
        }
        
        btnCopiar.addEventListener('click', () => {
            navigator.clipboard.writeText(textoPrompt.textContent)
                .then(() => {
                    btnCopiar.textContent = '¡Copiado!';
                    setTimeout(() => {
                        btnCopiar.textContent = 'Copiar Prompt';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Error al copiar el texto: ', err);
                    btnCopiar.textContent = 'Error al copiar';
                });
        });
    }
});