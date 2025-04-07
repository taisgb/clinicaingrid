document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');
    const alertBox = document.getElementById('formAlert');
    
    // Estado de loading
    submitBtn.disabled = true;
    btnText.textContent = 'Enviando...';
    spinner.style.display = 'block';
    alertBox.style.display = 'none';
    
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        alertBox.textContent = '✅ Mensagem enviada com sucesso! Responderemos em breve.';
        alertBox.className = 'alert alert-success';
        form.reset();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro no servidor');
      }
    } catch (error) {
      console.error('Erro no envio:', error);
      alertBox.textContent = '❌ Erro ao enviar: ' + error.message;
      alertBox.className = 'alert alert-error';
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = 'Enviar Mensagem';
      spinner.style.display = 'none';
      alertBox.style.display = 'block';
    }
  });

  // Máscara de telefone automática
  document.getElementById('telefone').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 11);
    
    if (value.length > 0) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }
    
    e.target.value = value;
  });