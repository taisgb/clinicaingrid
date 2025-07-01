// script.js

// 1. Alternar menu mobile
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// 2. Alterar cabeçalho ao rolar
const header = document.getElementById('header');
const navLinksDesktop = document.querySelectorAll('header nav.hidden.md\\:flex a'); // Seleciona os links da navegação desktop
const logoTitle = document.querySelector('header h1'); // Seleciona o título do logo
const logoSubtitle = document.querySelector('header p.text-sm'); // Seleciona o subtítulo do logo

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('bg-white/95');
        header.classList.remove('glass-effect');
        header.classList.remove('border-white/20'); // Remove borda branca para fundo sólido
        header.classList.add('border-purple-200'); // Adiciona borda roxa para fundo sólido

        // Mudar a cor dos links da navegação desktop para um tom de roxo escuro
        navLinksDesktop.forEach(link => {
            link.classList.remove('text-white', 'hover:text-purple-200'); // Remove as classes de cor branca
            link.classList.add('text-purple-800', 'hover:text-purple-600'); // Adiciona as classes de cor roxa
        });

        // Mudar a cor do texto do logo para um tom de roxo
        logoTitle.classList.remove('text-white');
        logoTitle.classList.add('text-purple-800');
        logoSubtitle.classList.remove('text-purple-100');
        logoSubtitle.classList.add('text-purple-600');


    } else {
        header.classList.remove('bg-white/95');
        header.classList.add('glass-effect');
        header.classList.add('border-white/20'); // Restaura borda branca para efeito glass
        header.classList.remove('border-purple-200');

        // Restaurar a cor dos links da navegação desktop para branco
        navLinksDesktop.forEach(link => {
            link.classList.remove('text-purple-800', 'hover:text-purple-600'); // Remove as classes de cor roxa
            link.classList.add('text-white', 'hover:text-purple-200'); // Restaura as classes de cor branca
        });

        // Restaurar a cor do texto do logo para branco/roxo claro
        logoTitle.classList.remove('text-purple-800');
        logoTitle.classList.add('text-white');
        logoSubtitle.classList.remove('text-purple-600');
        logoSubtitle.classList.add('text-purple-100');
    }
});

// 3. Rolagem suave para links de âncora com ajuste para o cabeçalho fixo
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        const headerOffset = header.offsetHeight; // Altura do cabeçalho
        const extraPadding = 20; // Espaçamento extra para melhor visualização

        if (targetElement) {
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset - extraPadding;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            // Fechar menu mobile se estiver aberto
            mobileMenu.classList.add('hidden');
        }
    });
});

// 4. Feedback de envio de formulário e validação aprimorada
const contactForm = document.getElementById('contact-form');
if (contactForm) { // Verifica se o formulário existe na página
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Previne o envio padrão do formulário

        let formIsValid = true;
        const formInputs = contactForm.querySelectorAll('input[required], textarea[required]');

        formInputs.forEach(input => {
            if (!input.validity.valid) {
                formIsValid = false;
                input.classList.add('border-red-500', 'ring-red-500'); // Adiciona borda vermelha para inválido
            } else {
                input.classList.remove('border-red-500', 'ring-red-500'); // Remove borda vermelha se válido
            }
        });

        if (formIsValid) {
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalButtonText = submitBtn.innerHTML; // Salva o texto original do botão

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
            submitBtn.disabled = true;

            // Envia o formulário usando Fetch API para Formspree
            fetch(contactForm.action, {
                method: contactForm.method,
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    submitBtn.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Enviado!';
                    submitBtn.classList.remove('bg-gradient-to-r', 'from-purple-600', 'to-indigo-600');
                    submitBtn.classList.add('bg-green-500'); // Cor de sucesso
                    contactForm.reset(); // Limpa o formulário
                    // Opcional: mostrar uma mensagem de sucesso mais elaborada
                    alert('Sua mensagem foi enviada com sucesso!');
                } else {
                    response.json().then(data => {
                        if (Object.hasOwnProperty.call(data, 'errors')) {
                            alert('Erro ao enviar: ' + data["errors"].map(error => error["message"]).join(", "));
                        } else {
                            alert('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.');
                        }
                    })
                }
            })
            .catch(error => {
                alert('Ocorreu um erro na conexão: ' + error);
            })
            .finally(() => {
                // Restaura o botão após um tempo ou se houver erro
                setTimeout(() => {
                    submitBtn.innerHTML = originalButtonText;
                    submitBtn.classList.add('bg-gradient-to-r', 'from-purple-600', 'to-indigo-600');
                    submitBtn.classList.remove('bg-green-500');
                    submitBtn.disabled = false;
                }, 3000); // 3 segundos para o usuário ver o feedback
            });
        } else {
            alert('Por favor, preencha todos os campos obrigatórios corretamente.');
        }
    });

    // Validação em tempo real para campos de input (exemplo para email)
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', () => {
            if (emailInput.validity.valid) {
                emailInput.classList.remove('border-red-500', 'ring-red-500');
                emailInput.classList.add('border-green-500');
            } else {
                emailInput.classList.add('border-red-500', 'ring-red-500');
                emailInput.classList.remove('border-green-500');
            }
        });
    }
}


// 5. Carregamento dinâmico do mapa
const mapContainer = document.getElementById('map-container');
const mapPlaceholder = document.getElementById('map-placeholder');

if (mapContainer && mapPlaceholder) { // Verifica se os elementos do mapa existem
    const mapObserverOptions = {
        threshold: 0.1, // Carregar quando 10% do contêiner do mapa estiver visível
        rootMargin: '0px 0px -50px 0px' // Margem para carregar um pouco antes
    };

    const mapObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Substitua este src pelo URL de incorporação real do seu mapa (Google Maps, OpenStreetMap, etc.)
                // Exemplo de Google Maps Embed URL:
                // Certifique-se de obter um URL de incorporação de mapa válido.
                const mapEmbedSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1155.8513911895984!2d-38.454057569705355!3d-12.984310061748243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7161b10049d63ef%3A0x5db7abe00761d876!2sSalvador%20Trade%20Center!5e0!3m2!1spt-BR!2sbr!4v1751394110656!5m2!1spt-BR!2sbr"; // **ATUALIZE COM SEU MAPA REAL**


         
                const mapIframe = document.createElement('iframe');
                mapIframe.src = mapEmbedSrc;
                mapIframe.width = "100%";
                mapIframe.height = "100%";
                mapIframe.style.border = "0";
                mapIframe.allowFullscreen = true;
                mapIframe.loading = "lazy";
                mapIframe.referrerPolicy = "no-referrer-when-downgrade";
                mapIframe.title = "Localização do Consultório no Mapa"; // Adiciona título para acessibilidade

                mapContainer.innerHTML = ''; // Limpa o conteúdo do placeholder
                mapContainer.appendChild(mapIframe);
                observer.unobserve(entry.target); // Para de observar uma vez que o mapa é carregado
            }
        });
    }, mapObserverOptions);

    const localizacaoSection = document.getElementById('localizacao');
    mapObserver.observe(localizacaoSection);
}


// 6. Botão "Voltar ao Topo"
const backToTopButton = document.getElementById('back-to-top');

if (backToTopButton) { // Verifica se o botão existe
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Mostra o botão após rolar 300px
            backToTopButton.classList.remove('opacity-0', 'invisible');
            backToTopButton.classList.add('opacity-100', 'visible');
        } else {
            backToTopButton.classList.remove('opacity-100', 'visible');
            backToTopButton.classList.add('opacity-0', 'invisible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


// 7. Intersection Observer para animações de entrada de seções (geral)
const observerOptions = {
    threshold: 0.1, // Elemento visível em 10%
    rootMargin: '0px 0px -50px 0px' // Carrega um pouco antes de entrar totalmente na tela
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
            // Você pode adicionar mais classes ou remover o observer aqui se a animação for única
            // observer.unobserve(entry.target);
        } else {
            // Opcional: remover a classe para reanimar ao rolar para cima e para baixo
            // entry.target.classList.remove('animate-slide-up');
        }
    });
}, observerOptions);

// Observa todas as seções (ou elementos específicos que você quer animar)
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Animação de cards de serviço com delay (exemplo mais avançado)
const serviceCards = document.querySelectorAll('#servicos > div > div'); // Seleciona os cards individuais

const cardObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Aplica um atraso para cada card
            setTimeout(() => {
                entry.target.classList.add('animate-slide-up');
                entry.target.style.opacity = '1'; // Garante que a opacidade final seja 1
                entry.target.style.transform = 'translateY(0)'; // Garante que a transformação final seja 0
            }, index * 150); // Escalonar por 150ms
            observer.unobserve(entry.target); // Parar de observar depois de animar
        }
    });
}, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

serviceCards.forEach(card => {
    // Esconder inicialmente para que o JS os revele
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    cardObserver.observe(card);
});