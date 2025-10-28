// ---------------------------
// Saudação dinâmica
// ---------------------------
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

    document.getElementById('greeting').textContent = greeting;
}
updateGreeting();

// ---------------------------
// Dropdown do usuário
// ---------------------------
const userBtn = document.querySelector('.user-btn');
const dropdownMenu = document.querySelector('.dropdown-menu');

userBtn.addEventListener('click', () => {
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
});

window.addEventListener('click', (e) => {
    if (!userBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.style.display = 'none';
    }
});

// ---------------------------
// Hero carousel
// ---------------------------
const heroImages = [
    '/img/pic1.jpg',
    '/img/pic2.jpg',
    '/img/pic3.jpg',
    '/img/pic4.jpg',
    '/img/pic5.jpg'
];

let currentHero = 0;
const heroBg1 = document.querySelector('.hero-bg1');
const heroBg2 = document.querySelector('.hero-bg2');
let topDiv = heroBg1;
let bottomDiv = heroBg2;

// Preload
heroImages.forEach(src => { const img = new Image(); img.src = src; });
topDiv.style.backgroundImage = `url('${heroImages[currentHero]}')`;
topDiv.classList.add('show');

setInterval(() => {
    const nextHero = (currentHero + 1) % heroImages.length;
    bottomDiv.style.backgroundImage = `url('${heroImages[nextHero]}')`;
    bottomDiv.classList.add('show');

    [topDiv, bottomDiv] = [bottomDiv, topDiv];
    setTimeout(() => bottomDiv.classList.remove('show'), 1000);
    currentHero = nextHero;
}, 5000);

// ---------------------------
// Agendamento: calendário realista
// ---------------------------
const stepCalendar = document.getElementById('step-calendar');
const stepTime = document.getElementById('step-time');
const stepService = document.getElementById('step-service');

const selectedDateSpan = document.querySelector('.selected-date-info span');
const selectedInfoDate = document.querySelector('.selected-info p span');
const selectedInfoTime = document.querySelector('.selected-info p:nth-child(2) span');

const calendarGrid = document.querySelector('.calendar-grid');
const calendarHeader = document.querySelector('.calendar-header h4');
const navButtons = document.querySelectorAll('.calendar-nav');

const timeSlotsContainer = document.querySelector('.time-slots');

const diasSemana = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
const nomesMes = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

let today = new Date();
today.setHours(0,0,0,0);
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

const workingHours = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00'];

// Renderizar calendário
function renderCalendar(month, year) {
    calendarGrid.innerHTML = '';
    calendarHeader.textContent = `${nomesMes[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('calendar-day', 'empty');
        calendarGrid.appendChild(emptyDiv);
    }

    for (let day = 1; day <= lastDate; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');

        const dateObj = new Date(year, month, day);
        dateObj.setHours(0,0,0,0);

        if(dateObj < today) dayDiv.classList.add('disabled');

        dayDiv.textContent = day;
        calendarGrid.appendChild(dayDiv);

        dayDiv.addEventListener('click', () => {
            if(dayDiv.classList.contains('disabled')) return;
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            dayDiv.classList.add('selected');

            const dataFormatada = `${diasSemana[dateObj.getDay()]}, ${day} de ${nomesMes[month]} de ${year}`;
            selectedDateSpan.textContent = dataFormatada;
            selectedInfoDate.textContent = dataFormatada;

            renderTimeSlots(dateObj);

            stepCalendar.classList.remove('active');
            stepTime.classList.add('active');
        });
    }
}

// Navegação meses
navButtons[0].addEventListener('click', () => { // Prev
    if(currentMonth === today.getMonth() && currentYear === today.getFullYear()) return;
    currentMonth--;
    if(currentMonth < 0){ currentMonth = 11; currentYear--; }
    renderCalendar(currentMonth, currentYear);
});

navButtons[1].addEventListener('click', () => { // Next
    currentMonth++;
    if(currentMonth > 11){ currentMonth = 0; currentYear++; }
    renderCalendar(currentMonth, currentYear);
});

// Inicializa
renderCalendar(currentMonth, currentYear);

// Renderizar horários
function renderTimeSlots(date) {
    timeSlotsContainer.innerHTML = '';
    workingHours.forEach(hour => {
        const slot = document.createElement('div');
        slot.classList.add('time-slot');

        const [h,m] = hour.split(':');
        const slotDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m);

        if(slotDate < new Date()) slot.classList.add('unavailable');
        slot.textContent = hour;
        timeSlotsContainer.appendChild(slot);

        slot.addEventListener('click', () => {
            if(slot.classList.contains('unavailable')) return;
            document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            selectedInfoTime.textContent = slot.textContent;

            stepTime.classList.remove('active');
            stepService.classList.add('active');
        });
    });
}



const bookingForm = document.getElementById('bookingForm');
const confirmationPopup = document.getElementById('confirmationPopup');
const closePopup = document.getElementById('closePopup');
const popupDate = document.getElementById('popupDate');
const popupTime = document.getElementById('popupTime');
const popupService = document.getElementById('popupService');
const popupBarber = document.getElementById('popupBarber');

bookingForm.addEventListener('submit', function(e){
    e.preventDefault(); // impede o envio real do form

    // Pegando valores selecionados
    const selectedDate = document.querySelector('#step-service .selected-info p:nth-child(1) span').textContent;
    const selectedTime = document.querySelector('#step-service .selected-info p:nth-child(2) span').textContent;
    const service = document.getElementById('service').selectedOptions[0].textContent;
    const barber = document.getElementById('barber').selectedOptions[0].textContent;

    // Preenche o popup
    popupDate.textContent = selectedDate;
    popupTime.textContent = selectedTime;
    popupService.textContent = service;
    popupBarber.textContent = barber;

    // Exibe o popup
    confirmationPopup.style.display = 'flex';

    // Esconde a etapa de serviço
    stepService.classList.remove('active');
});

// Fechar popup
closePopup.addEventListener('click', function() {
    confirmationPopup.style.display = 'none';
    // Opcional: voltar para calendário ou tela inicial
    stepCalendar.classList.add('active');
});

