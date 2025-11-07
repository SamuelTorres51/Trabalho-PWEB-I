// ============================================
// BARBEARIA STYLE - SCRIPT PRINCIPAL (HOME)
// ============================================

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

/**
 * Inicializa todas as funcionalidades da aplicação
 */
function initApp() {
    initGreeting();
    initUserDropdown();
    initHeroCarousel();
    initNavigation();
    initCalendar();
    initBookingSystem();
    initServiceCards();
    initScrollAnimations();
    initServiceModal();
    initPriceCalculator();
    initBarbersSection();
}

// ============================================
// 1. SAUDAÇÃO DINÂMICA
// ============================================
function initGreeting() {
    function updateGreeting() {
        const now = new Date();
        const hour = now.getHours();
        let greeting = '';

        if (hour >= 5 && hour < 12) {
            greeting = 'Bom dia,';
        } else if (hour >= 12 && hour < 18) {
            greeting = 'Boa tarde,';
        } else {
            greeting = 'Boa noite,';
        }

        const greetingElement = document.getElementById('greeting');
        if (greetingElement) {
            greetingElement.textContent = greeting;
        }
    }

    updateGreeting();
    // Atualiza a cada hora
    setInterval(updateGreeting, 3600000);
}

// ============================================
// 2. DROPDOWN DO USUÁRIO
// ============================================
function initUserDropdown() {
    const userBtn = document.querySelector('.user-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (!userBtn || !dropdownMenu) return;

    userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = dropdownMenu.style.display === 'block';
        dropdownMenu.style.display = isVisible ? 'none' : 'block';
        
        // Adiciona animação
        if (!isVisible) {
            dropdownMenu.style.opacity = '0';
            dropdownMenu.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                dropdownMenu.style.transition = 'all 0.3s ease';
                dropdownMenu.style.opacity = '1';
                dropdownMenu.style.transform = 'translateY(0)';
            }, 10);
        }
    });

    // Fecha ao clicar fora
    window.addEventListener('click', (e) => {
        if (!userBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.style.display = 'none';
        }
    });
}

// ============================================
// 3. HERO CAROUSEL
// ============================================
function initHeroCarousel() {
    const heroImages = [
        '/img/pic1.jpg',
        '/img/pic2.jpg',
        '/img/pic3.jpg',
        '/img/pic4.jpg',
        '/img/pic5.jpg'
    ];

    const heroBg1 = document.querySelector('.hero-bg1');
    const heroBg2 = document.querySelector('.hero-bg2');

    if (!heroBg1 || !heroBg2) return;

    let currentHero = 0;
    let topDiv = heroBg1;
    let bottomDiv = heroBg2;

    // Preload das imagens
    heroImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Inicializa com a primeira imagem
    topDiv.style.backgroundImage = `url('${heroImages[currentHero]}')`;
    topDiv.classList.add('show');

    // Troca de imagem a cada 5 segundos
    setInterval(() => {
        const nextHero = (currentHero + 1) % heroImages.length;
        bottomDiv.style.backgroundImage = `url('${heroImages[nextHero]}')`;
        bottomDiv.classList.add('show');

        [topDiv, bottomDiv] = [bottomDiv, topDiv];
        setTimeout(() => bottomDiv.classList.remove('show'), 1000);
        currentHero = nextHero;
    }, 5000);
}

// ============================================
// 4. NAVEGAÇÃO SUAVE
// ============================================
function initNavigation() {
    // Menu hambúrguer
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Fecha menu ao clicar em um link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Scroll suave para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// 5. SISTEMA DE CALENDÁRIO
// ============================================
function initCalendar() {
    const stepCalendar = document.getElementById('step-calendar');
    const calendarGrid = document.querySelector('.calendar-grid');
    const calendarHeader = document.querySelector('.calendar-header h4');
    const navButtons = document.querySelectorAll('.calendar-nav');

    if (!stepCalendar || !calendarGrid || !calendarHeader) return;

    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const nomesMes = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    // Renderiza o calendário
    function renderCalendar(month, year) {
        calendarGrid.innerHTML = '';
        calendarHeader.textContent = `${nomesMes[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        // Cabeçalhos dos dias da semana
        const dayHeaders = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.classList.add('calendar-day-header');
            header.textContent = day;
            calendarGrid.appendChild(header);
        });

        // Espaços vazios antes do primeiro dia
        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('calendar-day', 'empty');
            calendarGrid.appendChild(emptyDiv);
        }

        // Dias do mês
        for (let day = 1; day <= lastDate; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('calendar-day');

            const dateObj = new Date(year, month, day);
            dateObj.setHours(0, 0, 0, 0);

            if (dateObj < today) {
                dayDiv.classList.add('disabled');
            }

            // Destaca o dia de hoje
            if (dateObj.getTime() === today.getTime()) {
                dayDiv.classList.add('today');
            }

            dayDiv.textContent = day;
            calendarGrid.appendChild(dayDiv);

            dayDiv.addEventListener('click', () => {
                if (dayDiv.classList.contains('disabled')) {
                    showNotification('Não é possível agendar em datas passadas', 'error');
                    return;
                }

                document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                dayDiv.classList.add('selected');

                const dataFormatada = `${diasSemana[dateObj.getDay()]}, ${day} de ${nomesMes[month]} de ${year}`;
                
                // Atualiza informações selecionadas
                const selectedDateSpan = document.querySelector('.selected-date-info span');
                const selectedInfoDate = document.querySelector('.selected-info p span');
                
                if (selectedDateSpan) selectedDateSpan.textContent = dataFormatada;
                if (selectedInfoDate) selectedInfoDate.textContent = dataFormatada;

                // Armazena a data selecionada
                window.selectedDate = dateObj;

                // Renderiza horários disponíveis
                renderTimeSlots(dateObj);

                // Transição suave para próxima etapa
                setTimeout(() => {
                    stepCalendar.classList.remove('active');
                    document.getElementById('step-time').classList.add('active');
                    scrollToSection('booking');
                }, 300);
            });
        }
    }

    // Navegação entre meses
    if (navButtons.length >= 2) {
        navButtons[0].addEventListener('click', () => {
            if (currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                showNotification('Você já está no mês atual', 'info');
                return;
            }
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar(currentMonth, currentYear);
        });

        navButtons[1].addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar(currentMonth, currentYear);
        });
    }

    // Inicializa o calendário
    renderCalendar(currentMonth, currentYear);
}

// ============================================
// 6. SISTEMA DE AGENDAMENTO
// ============================================
function initBookingSystem() {
    const stepTime = document.getElementById('step-time');
    const stepService = document.getElementById('step-service');
    const timeSlotsContainer = document.querySelector('.time-slots');
    const bookingForm = document.getElementById('bookingForm');
    const confirmationPopup = document.getElementById('confirmationPopup');
    const closePopup = document.getElementById('closePopup');

    if (!timeSlotsContainer || !bookingForm) return;

    const workingHours = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
                         '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

    // Horários já ocupados (simulação - em produção viria de uma API)
    const occupiedSlots = ['14:00', '16:00'];

    // Renderiza horários disponíveis
    window.renderTimeSlots = function(date) {
        if (!timeSlotsContainer) return;
        
        timeSlotsContainer.innerHTML = '';
        
        // Adiciona loading
        const loading = document.createElement('div');
        loading.classList.add('loading-slots');
        loading.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando horários...';
        timeSlotsContainer.appendChild(loading);

        // Simula carregamento
        setTimeout(() => {
            timeSlotsContainer.innerHTML = '';
            
            workingHours.forEach(hour => {
                const slot = document.createElement('div');
                slot.classList.add('time-slot');

                const [h, m] = hour.split(':');
                const slotDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(h), parseInt(m));
                const now = new Date();

                // Verifica se o horário já passou
                if (slotDate < now) {
                    slot.classList.add('unavailable');
                    slot.title = 'Horário já passou';
                } 
                // Verifica se está ocupado
                else if (occupiedSlots.includes(hour)) {
                    slot.classList.add('unavailable');
                    slot.title = 'Horário já ocupado';
                } 
                // Horário disponível
                else {
                    slot.title = 'Clique para selecionar';
                }

                slot.textContent = hour;
                timeSlotsContainer.appendChild(slot);

                slot.addEventListener('click', () => {
                    if (slot.classList.contains('unavailable')) {
                        showNotification('Este horário não está disponível', 'error');
                        return;
                    }

                    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
                    slot.classList.add('selected');
                    
                    window.selectedTime = hour;
                    
                    const selectedInfoTime = document.querySelector('.selected-info p:nth-child(2) span');
                    if (selectedInfoTime) selectedInfoTime.textContent = hour;

                    // Transição suave para próxima etapa
                    setTimeout(() => {
                        if (stepTime) stepTime.classList.remove('active');
                        if (stepService) stepService.classList.add('active');
                        scrollToSection('booking');
                    }, 300);
                });
            });

            // Animação de entrada
            const slots = timeSlotsContainer.querySelectorAll('.time-slot');
            slots.forEach((slot, index) => {
                slot.style.opacity = '0';
                slot.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    slot.style.transition = 'all 0.3s ease';
                    slot.style.opacity = '1';
                    slot.style.transform = 'translateY(0)';
                }, index * 30);
            });
        }, 500);
    };

    // Validação e submissão do formulário
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const service = document.getElementById('service');
        const barber = document.getElementById('barber');

        // Validações
        if (!service.value) {
            showNotification('Por favor, selecione um serviço', 'error');
            service.focus();
            return;
        }

        if (!barber.value) {
            showNotification('Por favor, selecione um barbeiro', 'error');
            barber.focus();
            return;
        }

        if (!window.selectedDate || !window.selectedTime) {
            showNotification('Por favor, selecione data e horário', 'error');
            return;
        }

        // Mostra loading
        const submitBtn = bookingForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Agendando...';
        submitBtn.disabled = true;

        // Simula processamento
        setTimeout(() => {
            const selectedDate = document.querySelector('.selected-info p span').textContent;
            const selectedTime = document.querySelector('.selected-info p:nth-child(2) span').textContent;
            const serviceText = service.selectedOptions[0].textContent;
            const barberText = barber.selectedOptions[0].textContent;

            // Salva agendamento no localStorage
            const booking = {
                id: Date.now(),
                date: formatDateForStorage(window.selectedDate),
                dateObj: window.selectedDate,
                time: window.selectedTime,
                service: serviceText.split(' - ')[0], // Remove o preço
                barber: barberText,
                status: 'Futuro'
            };

            // Carrega agendamentos existentes
            let bookings = [];
            const savedBookings = localStorage.getItem('userBookings');
            if (savedBookings) {
                try {
                    bookings = JSON.parse(savedBookings);
                    bookings.forEach(b => {
                        b.dateObj = new Date(b.dateObj);
                    });
                } catch (e) {
                    console.error('Erro ao carregar agendamentos:', e);
                }
            }

            // Adiciona novo agendamento
            bookings.push(booking);
            localStorage.setItem('userBookings', JSON.stringify(bookings));

            // Preenche o popup
            const popupDate = document.getElementById('popupDate');
            const popupTime = document.getElementById('popupTime');
            const popupService = document.getElementById('popupService');
            const popupBarber = document.getElementById('popupBarber');

            if (popupDate) popupDate.textContent = selectedDate;
            if (popupTime) popupTime.textContent = selectedTime;
            if (popupService) popupService.textContent = serviceText;
            if (popupBarber) popupBarber.textContent = barberText;

            // Exibe o popup
            if (confirmationPopup) {
                confirmationPopup.style.display = 'flex';
                confirmationPopup.style.opacity = '0';
                setTimeout(() => {
                    confirmationPopup.style.transition = 'opacity 0.3s ease';
                    confirmationPopup.style.opacity = '1';
                }, 10);
            }

            // Reseta o formulário
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            bookingForm.reset();
            
            // Limpa seleções
            window.selectedDate = null;
            window.selectedTime = null;
            
            if (stepService) stepService.classList.remove('active');
            
            showNotification('Agendamento realizado com sucesso!', 'success');
        }, 1500);
    });

    // Fechar popup
    if (closePopup) {
        closePopup.addEventListener('click', function() {
            if (confirmationPopup) {
                confirmationPopup.style.opacity = '0';
                setTimeout(() => {
                    confirmationPopup.style.display = 'none';
                    document.getElementById('step-calendar').classList.add('active');
                    scrollToSection('booking');
                }, 300);
            }
        });

        // Fecha ao clicar fora do popup
        if (confirmationPopup) {
            confirmationPopup.addEventListener('click', function(e) {
                if (e.target === confirmationPopup) {
                    closePopup.click();
                }
            });
        }
    }

    // Botões de voltar
    document.querySelectorAll('.btn-secondary[data-step-back]').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetStep = this.getAttribute('data-step-back');
            const currentStep = this.closest('.booking-step');
            
            if (currentStep) {
                currentStep.classList.remove('active');
            }
            
            if (targetStep === 'calendar') {
                document.getElementById('step-calendar').classList.add('active');
            } else if (targetStep === 'time') {
                document.getElementById('step-time').classList.add('active');
            }
            
            scrollToSection('booking');
        });
    });
}

// ============================================
// 7. INTERATIVIDADE DOS CARDS DE SERVIÇO
// ============================================
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        // Ao clicar, rola até o agendamento
        card.addEventListener('click', function() {
            scrollToSection('booking');
            showNotification('Selecione uma data e horário para agendar', 'info');
        });
    });
}

// ============================================
// 8. ANIMAÇÕES DE SCROLL
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observa elementos para animação
    document.querySelectorAll('.service-card, .contact-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Mostra notificação ao usuário
 */
function showNotification(message, type = 'info') {
    // Remove notificação anterior se existir
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Animação de entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remove após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Scroll suave para uma seção
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerOffset = 80;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// ============================================
// 9. MODAL DE DETALHES DOS SERVIÇOS
// ============================================
function initServiceModal() {
    const serviceModal = document.getElementById('serviceModal');
    const closeModal = document.getElementById('closeServiceModal');
    const serviceCards = document.querySelectorAll('.service-card');
    const addToCalculatorBtn = document.getElementById('addToCalculatorBtn');
    const bookServiceBtn = document.getElementById('bookServiceBtn');

    if (!serviceModal) return;

    // Dados dos serviços
    const servicesData = {
        corte: {
            title: 'Corte Masculino',
            price: 'R$ 25,00',
            duration: '30 minutos',
            description: 'Corte moderno e estiloso realizado por profissionais experientes. Inclui corte personalizado, acabamento profissional e produtos de qualidade.',
            includes: ['Corte personalizado', 'Acabamento profissional', 'Produtos de qualidade', 'Consulta de estilo'],
            icon: 'fa-cut'
        },
        barba: {
            title: 'Barba',
            price: 'R$ 15,00',
            duration: '20 minutos',
            description: 'Modelagem e aparar barba com técnicas profissionais. Deixe sua barba sempre impecável.',
            includes: ['Modelagem personalizada', 'Aparar e alinhar', 'Produtos para barba', 'Finalização'],
            icon: 'fa-scissors'
        },
        corte_barba: {
            title: 'Corte + Barba',
            price: 'R$ 35,00',
            duration: '45 minutos',
            description: 'Pacote completo com corte e barba. O melhor custo-benefício para cuidar do seu visual.',
            includes: ['Corte completo', 'Barba modelada', 'Produtos premium', 'Consulta de estilo', 'Desconto especial'],
            icon: 'fa-spa'
        },
        sobrancelha: {
            title: 'Sobrancelha',
            price: 'R$ 10,00',
            duration: '15 minutos',
            description: 'Design e limpeza de sobrancelhas para um visual mais definido e harmonioso.',
            includes: ['Design personalizado', 'Limpeza completa', 'Produtos específicos'],
            icon: 'fa-magic'
        }
    };

    // Abre modal ao clicar no card ou botão
    serviceCards.forEach(card => {
        const detailsBtn = card.querySelector('.service-details-btn');
        if (detailsBtn) {
            detailsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const serviceId = card.getAttribute('data-service');
                openServiceModal(serviceId, servicesData[serviceId]);
            });
        }

        // Também abre ao clicar no card inteiro
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('service-details-btn')) return;
            const serviceId = card.getAttribute('data-service');
            openServiceModal(serviceId, servicesData[serviceId]);
        });
    });

    // Fecha modal
    if (closeModal) {
        closeModal.addEventListener('click', closeServiceModal);
    }

    if (serviceModal) {
        serviceModal.addEventListener('click', (e) => {
            if (e.target.classList.contains('service-modal') || e.target.classList.contains('modal-overlay')) {
                closeServiceModal();
            }
        });
    }

    // Adicionar à calculadora
    if (addToCalculatorBtn) {
        addToCalculatorBtn.addEventListener('click', () => {
            const serviceId = addToCalculatorBtn.getAttribute('data-service');
            if (serviceId) {
                addServiceToCalculator(serviceId);
                closeServiceModal();
                scrollToSection('calculator');
            }
        });
    }

    // Agendar serviço
    if (bookServiceBtn) {
        bookServiceBtn.addEventListener('click', () => {
            const serviceId = bookServiceBtn.getAttribute('data-service');
            if (serviceId) {
                selectServiceForBooking(serviceId);
                closeServiceModal();
                scrollToSection('booking');
            }
        });
    }

    function openServiceModal(serviceId, data) {
        if (!data) return;

        document.getElementById('modalServiceTitle').textContent = data.title;
        document.getElementById('modalServicePrice').textContent = data.price;
        document.getElementById('modalServiceDuration').textContent = data.duration;
        document.getElementById('modalServiceDescription').textContent = data.description;
        
        const iconElement = document.getElementById('modalServiceIcon').querySelector('i');
        iconElement.className = `fas ${data.icon}`;

        const includesList = document.getElementById('modalServiceIncludes');
        includesList.innerHTML = '';
        data.includes.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            includesList.appendChild(li);
        });

        // Atualiza botões com data-service
        if (addToCalculatorBtn) {
            addToCalculatorBtn.setAttribute('data-service', serviceId);
        }
        if (bookServiceBtn) {
            bookServiceBtn.setAttribute('data-service', serviceId);
        }

        serviceModal.style.display = 'flex';
        setTimeout(() => {
            serviceModal.style.opacity = '1';
        }, 10);
    }

    function closeServiceModal() {
        serviceModal.style.opacity = '0';
        setTimeout(() => {
            serviceModal.style.display = 'none';
        }, 300);
    }

    window.openServiceModal = openServiceModal;
    window.closeServiceModal = closeServiceModal;
}

// ============================================
// 10. CALCULADORA DE PREÇOS
// ============================================
function initPriceCalculator() {
    const checkboxes = document.querySelectorAll('.calculator-option input[type="checkbox"]');
    const selectedServicesList = document.getElementById('selectedServicesList');
    const subtotalElement = document.getElementById('subtotal');
    const discountElement = document.getElementById('discount');
    const discountLine = document.getElementById('discountLine');
    const totalElement = document.getElementById('total');
    const bookSelectedBtn = document.getElementById('bookSelectedBtn');

    const services = {
        corte: { name: 'Corte Masculino', price: 25.00 },
        barba: { name: 'Barba', price: 15.00 },
        corte_barba: { name: 'Corte + Barba', price: 35.00 },
        sobrancelha: { name: 'Sobrancelha', price: 10.00 }
    };

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateCalculator);
    });

    if (bookSelectedBtn) {
        bookSelectedBtn.addEventListener('click', () => {
            const selected = Array.from(checkboxes).filter(cb => cb.checked);
            if (selected.length > 0) {
                scrollToSection('booking');
                showNotification('Selecione data e horário para agendar', 'info');
            }
        });
    }

    function updateCalculator() {
        const selected = Array.from(checkboxes).filter(cb => cb.checked);
        
        if (selected.length === 0) {
            selectedServicesList.innerHTML = '<p class="no-selection">Nenhum serviço selecionado</p>';
            subtotalElement.textContent = 'R$ 0,00';
            discountElement.textContent = '-R$ 0,00';
            totalElement.textContent = 'R$ 0,00';
            discountLine.style.display = 'none';
            bookSelectedBtn.disabled = true;
            return;
        }

        // Lista de serviços selecionados
        selectedServicesList.innerHTML = '';
        selected.forEach(checkbox => {
            const serviceId = checkbox.value;
            const service = services[serviceId];
            const div = document.createElement('div');
            div.className = 'selected-service-item';
            div.innerHTML = `
                <span>${service.name}</span>
                <span class="service-price">R$ ${service.price.toFixed(2).replace('.', ',')}</span>
            `;
            selectedServicesList.appendChild(div);
        });

        // Calcula subtotal
        let subtotal = 0;
        selected.forEach(checkbox => {
            const price = parseFloat(checkbox.getAttribute('data-price'));
            subtotal += price;
        });

        // Verifica desconto (se selecionar corte + barba separados, oferece desconto)
        let discount = 0;
        const hasCorte = selected.some(cb => cb.value === 'corte');
        const hasBarba = selected.some(cb => cb.value === 'barba');
        const hasPacote = selected.some(cb => cb.value === 'corte_barba');

        if (hasCorte && hasBarba && !hasPacote) {
            // Se selecionou corte e barba separados, desconto de 5 reais
            discount = 5.00;
            discountLine.style.display = 'flex';
        } else if (hasPacote) {
            // Se selecionou o pacote, já tem desconto embutido
            discountLine.style.display = 'none';
        } else {
            discountLine.style.display = 'none';
        }

        const total = subtotal - discount;

        subtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        discountElement.textContent = `-R$ ${discount.toFixed(2).replace('.', ',')}`;
        totalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        
        bookSelectedBtn.disabled = false;
    }

    window.addServiceToCalculator = function(serviceId) {
        const checkbox = document.querySelector(`.calculator-option input[value="${serviceId}"]`);
        if (checkbox && !checkbox.checked) {
            checkbox.checked = true;
            updateCalculator();
            showNotification('Serviço adicionado à calculadora!', 'success');
        }
    };
}

// ============================================
// 11. SEÇÃO DE BARBEIROS
// ============================================
function initBarbersSection() {
    const barberCards = document.querySelectorAll('.barber-card');
    
    barberCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Função global para selecionar barbeiro
window.selectBarber = function(barberId, barberName) {
    const barberSelect = document.getElementById('barber');
    if (barberSelect) {
        barberSelect.value = barberId;
        scrollToSection('booking');
        showNotification(`Barbeiro ${barberName} selecionado!`, 'success');
        
        // Se já estiver na etapa de serviço, destaca o select
        const stepService = document.getElementById('step-service');
        if (stepService && stepService.classList.contains('active')) {
            barberSelect.focus();
            barberSelect.style.borderColor = '#e74c3c';
            setTimeout(() => {
                barberSelect.style.borderColor = '';
            }, 2000);
        }
    }
};

// Função para selecionar serviço para agendamento
window.selectServiceForBooking = function(serviceId) {
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
        serviceSelect.value = serviceId;
        showNotification('Serviço selecionado! Agora escolha data e horário.', 'success');
    }
};

/**
 * Formata data para armazenamento
 */
function formatDateForStorage(date) {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
