// ============================================
// BARBEARIA STYLE - SCRIPT DE PERFIL
// ============================================

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    initProfilePage();
});

/**
 * Inicializa todas as funcionalidades da página de perfil
 */
function initProfilePage() {
    initProfileForm();
    initBookingHistory();
    initProfilePicture();
    initNavigation();
    loadUserData();
}

// ============================================
// 1. FORMULÁRIO DE PERFIL
// ============================================
function initProfileForm() {
    const profileForm = document.getElementById('profileForm');
    if (!profileForm) return;

    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const fullNameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const passwordInput = document.getElementById('password');
        const notesInput = document.getElementById('notes');

        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const password = passwordInput.value;
        const notes = notesInput.value.trim();

        // Remove validações anteriores
        [fullNameInput, emailInput, phoneInput, passwordInput].forEach(input => {
            clearFieldErrors(input);
        });

        let hasErrors = false;

        // Validação de nome
        if (!fullName) {
            showFieldError(fullNameInput, 'Nome completo é obrigatório');
            hasErrors = true;
        } else if (fullName.length < 3) {
            showFieldError(fullNameInput, 'Nome deve ter pelo menos 3 caracteres');
            hasErrors = true;
        }

        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            showFieldError(emailInput, 'E-mail é obrigatório');
            hasErrors = true;
        } else if (!emailRegex.test(email)) {
            showFieldError(emailInput, 'Por favor, insira um e-mail válido');
            hasErrors = true;
        }

        // Validação de telefone
        const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
        if (!phone) {
            showFieldError(phoneInput, 'Telefone é obrigatório');
            hasErrors = true;
        } else if (!phoneRegex.test(phone)) {
            showFieldError(phoneInput, 'Telefone inválido');
            hasErrors = true;
        }

        // Validação de senha (se preenchida)
        if (password && password.length < 6) {
            showFieldError(passwordInput, 'A senha deve ter pelo menos 6 caracteres');
            hasErrors = true;
        }

        if (hasErrors) {
            showNotification('Por favor, corrija os erros no formulário', 'error');
            return;
        }

        // Mostra loading
        const submitBtn = profileForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
        submitBtn.disabled = true;

        // Simula salvamento (em produção seria uma chamada à API)
        setTimeout(() => {
            // Atualiza dados exibidos
            updateProfileDisplay(fullName, email, phone);
            
            // Salva no localStorage (simulação)
            localStorage.setItem('userName', fullName);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userPhone', phone);
            if (password) {
                localStorage.setItem('userPassword', password);
            }
            if (notes) {
                localStorage.setItem('userNotes', notes);
            }

            showNotification('Perfil atualizado com sucesso!', 'success');
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Limpa campo de senha se foi alterado
            if (password) {
                passwordInput.value = '';
            }
        }, 1500);
    });

    // Validação em tempo real
    const inputs = profileForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

// ============================================
// 2. HISTÓRICO DE AGENDAMENTOS
// ============================================
function initBookingHistory() {
    // Dados de exemplo (em produção viria de uma API)
    let allBookings = [
        {
            id: 1,
            date: '15/10/2025',
            dateObj: new Date(2025, 9, 15),
            time: '14:30',
            service: 'Corte Masculino',
            barber: 'Pedro H.',
            status: 'Concluído'
        },
        {
            id: 2,
            date: '10/09/2025',
            dateObj: new Date(2025, 8, 10),
            time: '09:00',
            service: 'Barba',
            barber: 'Luciano S.',
            status: 'Cancelado'
        },
        {
            id: 3,
            date: '05/08/2025',
            dateObj: new Date(2025, 7, 5),
            time: '16:00',
            service: 'Corte + Barba',
            barber: 'Samuel T.',
            status: 'Concluído'
        },
        {
            id: 4,
            date: '20/07/2025',
            dateObj: new Date(2025, 6, 20),
            time: '11:30',
            service: 'Sobrancelha',
            barber: 'João V.',
            status: 'Concluído'
        },
        {
            id: 5,
            date: '25/11/2025',
            dateObj: new Date(2025, 10, 25),
            time: '15:00',
            service: 'Corte Masculino',
            barber: 'Samuel T.',
            status: 'Futuro'
        },
        {
            id: 6,
            date: '28/11/2025',
            dateObj: new Date(2025, 10, 28),
            time: '10:00',
            service: 'Barba',
            barber: 'Pedro H.',
            status: 'Futuro'
        }
    ];

    // Carrega do localStorage se existir
    const savedBookings = localStorage.getItem('userBookings');
    if (savedBookings) {
        try {
            const parsed = JSON.parse(savedBookings);
            parsed.forEach(b => {
                b.dateObj = new Date(b.dateObj);
            });
            allBookings = parsed;
        } catch (e) {
            console.error('Erro ao carregar agendamentos:', e);
        }
    }

    // Renderiza histórico dinamicamente
    renderBookingHistory(allBookings);
    initHistoryFilters(allBookings);
    updateHistoryStats(allBookings);
}

// ============================================
// FILTROS E BUSCA DO HISTÓRICO
// ============================================
function initHistoryFilters(allBookings) {
    const searchInput = document.getElementById('historySearch');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const noResults = document.getElementById('noResults');

    let currentFilter = 'all';
    let currentSearch = '';

    // Busca
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            filterAndRender();
        });
    }

    // Filtros
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            filterAndRender();
        });
    });

    function filterAndRender() {
        let filtered = [...allBookings];

        // Aplica filtro de status
        if (currentFilter !== 'all') {
            filtered = filtered.filter(booking => {
                const statusLower = booking.status.toLowerCase();
                if (currentFilter === 'futuro') {
                    return statusLower === 'futuro' || (booking.dateObj > new Date() && statusLower !== 'cancelado');
                }
                return statusLower === currentFilter;
            });
        }

        // Aplica busca
        if (currentSearch) {
            filtered = filtered.filter(booking => {
                return booking.service.toLowerCase().includes(currentSearch) ||
                       booking.barber.toLowerCase().includes(currentSearch) ||
                       booking.date.includes(currentSearch) ||
                       booking.time.includes(currentSearch);
            });
        }

        // Renderiza resultados
        renderBookingHistory(filtered);
        updateHistoryStats(filtered);

        // Mostra mensagem se não houver resultados
        if (noResults) {
            noResults.style.display = filtered.length === 0 ? 'block' : 'none';
        }
    }

    window.allBookings = allBookings;
    window.filterAndRender = filterAndRender;
}

/**
 * Renderiza o histórico de agendamentos
 */
function renderBookingHistory(bookings) {
    const tableBody = document.getElementById('bookingsTableBody');
    if (!tableBody) return;

    // Limpa conteúdo existente
    tableBody.innerHTML = '';

    if (bookings.length === 0) {
        return; // A mensagem "no results" será mostrada pelo filtro
    }

    // Ordena por data (mais recentes primeiro)
    const sortedBookings = [...bookings].sort((a, b) => {
        return b.dateObj - a.dateObj;
    });

    sortedBookings.forEach((booking, index) => {
        const row = document.createElement('tr');
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        
        const statusClass = booking.status.toLowerCase();
        const statusIcon = booking.status === 'Concluído' ? 'fa-check-circle' : 
                          booking.status === 'Cancelado' ? 'fa-times-circle' : 
                          'fa-clock';
        
        const isFuture = booking.status === 'Futuro' || (booking.dateObj > new Date() && booking.status !== 'Cancelado');
        const canCancel = isFuture && booking.status !== 'Cancelado';
        
        row.innerHTML = `
            <td>${booking.date}</td>
            <td>${booking.time}</td>
            <td>${booking.service}</td>
            <td>${booking.barber}</td>
            <td class="${statusClass}">
                <i class="fas ${statusIcon}"></i> ${booking.status}
            </td>
            <td class="actions-cell">
                ${canCancel ? `<button class="cancel-booking-btn" data-id="${booking.id}" title="Cancelar agendamento">
                    <i class="fas fa-times"></i>
                </button>` : '-'}
            </td>
        `;

        tableBody.appendChild(row);

        // Animação de entrada
        setTimeout(() => {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
        }, index * 50);

        // Botão de cancelar
        if (canCancel) {
            const cancelBtn = row.querySelector('.cancel-booking-btn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    cancelBooking(booking.id);
                });
            }
        }
    });
}

/**
 * Atualiza estatísticas do histórico
 */
function updateHistoryStats(bookings) {
    const total = bookings.length;
    const completed = bookings.filter(b => b.status.toLowerCase() === 'concluído').length;
    const future = bookings.filter(b => {
        const statusLower = b.status.toLowerCase();
        return statusLower === 'futuro' || (b.dateObj > new Date() && statusLower !== 'cancelado');
    }).length;

    const totalElement = document.getElementById('totalBookings');
    const completedElement = document.getElementById('completedBookings');
    const futureElement = document.getElementById('futureBookings');

    if (totalElement) totalElement.textContent = total;
    if (completedElement) completedElement.textContent = completed;
    if (futureElement) futureElement.textContent = future;
}

/**
 * Cancela um agendamento
 */
function cancelBooking(bookingId) {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) {
        return;
    }

    if (window.allBookings) {
        const booking = window.allBookings.find(b => b.id === bookingId);
        if (booking) {
            booking.status = 'Cancelado';
            
            // Salva no localStorage
            localStorage.setItem('userBookings', JSON.stringify(window.allBookings));
            
            // Re-renderiza
            if (window.filterAndRender) {
                window.filterAndRender();
            } else {
                renderBookingHistory(window.allBookings);
                updateHistoryStats(window.allBookings);
            }
            
            showNotification('Agendamento cancelado com sucesso', 'success');
        }
    }
}

// ============================================
// 3. FOTO DE PERFIL
// ============================================
function initProfilePicture() {
    const profilePicture = document.querySelector('.profile-picture img') || 
                          document.querySelector('.profile-picture-placeholder');
    if (!profilePicture) return;

    // Adiciona efeito hover
    profilePicture.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.transition = 'transform 0.3s ease';
    });

    profilePicture.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });

    // Simula upload de foto (em produção teria upload real)
    const uploadBtn = document.createElement('button');
    uploadBtn.innerHTML = '<i class="fas fa-camera"></i> Alterar Foto';
    uploadBtn.className = 'upload-photo-btn';
    uploadBtn.style.cssText = `
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: #e74c3c;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
    `;
    
    uploadBtn.addEventListener('mouseenter', function() {
        this.style.background = '#c0392b';
        this.style.transform = 'translateY(-2px)';
    });
    
    uploadBtn.addEventListener('mouseleave', function() {
        this.style.background = '#e74c3c';
        this.style.transform = 'translateY(0)';
    });

    uploadBtn.addEventListener('click', function() {
        showNotification('Funcionalidade de upload de foto em desenvolvimento', 'info');
    });

    const pictureContainer = document.querySelector('.profile-picture');
    if (pictureContainer) {
        pictureContainer.appendChild(uploadBtn);
    }
}

// ============================================
// 4. NAVEGAÇÃO
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
    }

    // Scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ============================================
// 5. CARREGAR DADOS DO USUÁRIO
// ============================================
function loadUserData() {
    // Carrega dados do localStorage (simulação)
    const userName = localStorage.getItem('userName') || 'Matheus M.';
    const userEmail = localStorage.getItem('userEmail') || 'matheus@email.com';
    const userPhone = localStorage.getItem('userPhone') || '(11) 99999-9999';
    const userNotes = localStorage.getItem('userNotes') || '';

    // Atualiza campos do formulário
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const notesInput = document.getElementById('notes');

    if (fullNameInput) fullNameInput.value = userName;
    if (emailInput) emailInput.value = userEmail;
    if (phoneInput) phoneInput.value = userPhone;
    if (notesInput) notesInput.value = userNotes;

    // Atualiza sidebar
    updateProfileDisplay(userName, userEmail, userPhone);
}

/**
 * Atualiza a exibição do perfil na sidebar
 */
function updateProfileDisplay(name, email, phone) {
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    const userPhoneElement = document.getElementById('userPhone');

    if (userNameElement) {
        userNameElement.textContent = name;
        // Animação
        userNameElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            userNameElement.style.transition = 'transform 0.3s ease';
            userNameElement.style.transform = 'scale(1)';
        }, 200);
    }

    if (userEmailElement) userEmailElement.textContent = email;
    if (userPhoneElement) userPhoneElement.textContent = phone;
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Valida um campo individual
 */
function validateField(input) {
    const value = input.value.trim();
    
    clearFieldErrors(input);

    if (input.hasAttribute('required') && !value) {
        showFieldError(input, 'Este campo é obrigatório');
        return false;
    }

    if (input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(input, 'E-mail inválido');
            return false;
        }
    }

    if (input.type === 'tel' && value) {
        const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(input, 'Telefone inválido');
            return false;
        }
    }

    if (input.type === 'password' && value && value.length < 6) {
        showFieldError(input, 'Senha deve ter pelo menos 6 caracteres');
        return false;
    }

    return true;
}

/**
 * Mostra erro em um campo
 */
function showFieldError(input, message) {
    clearFieldErrors(input);
    
    input.style.borderColor = '#e74c3c';
    input.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    input.parentElement.appendChild(errorDiv);
}

/**
 * Remove erros de um campo
 */
function clearFieldErrors(input) {
    input.style.borderColor = '';
    input.classList.remove('error');
    
    const errorDiv = input.parentElement.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

/**
 * Mostra notificação ao usuário
 */
function showNotification(message, type = 'info') {
    // Remove notificação anterior se existir
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Animação de entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remove após 4 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

