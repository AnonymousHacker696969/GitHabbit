document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

let currentDate = new Date(2025, 0, 1); // January 1, 2025
let habits = [];
let calendarData = {};
let currentDayIndex = 1;

function initApp() {
    setupThemeToggle();

    initializeHabits();
    
    initializeCalendar();
    
    renderHabits();
    renderCalendar();
    updateDateDisplay();

    document.getElementById('next-day-btn').addEventListener('click', goToNextDay);
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    const savedTheme = localStorage.getItem('habitTrackerTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.className = 'fas fa-moon';
            themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
            localStorage.setItem('habitTrackerTheme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fas fa-sun';
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
            localStorage.setItem('habitTrackerTheme', 'dark');
        }
    });
}

function initializeHabits() {
    habits = [
        {
            id: 1,
            name: "Prayer",
            colorClass: "habit-1",
            streak: 0,
            completedToday: false,
            history: {}
        },
        {
            id: 2,
            name: "Meditate",
            colorClass: "habit-2",
            streak: 0,
            completedToday: false,
            history: {}
        },
        {
            id: 3,
            name: "Exercise",
            colorClass: "habit-3",
            streak: 0,
            completedToday: false,
            history: {}
        },
        {
            id: 4,
            name: "Drink 8 Glasses of Water",
            colorClass: "habit-4",
            streak: 0,
            completedToday: false,
            history: {}
        },
        {
            id: 5,
            name: "Walk 10k Steps",
            colorClass: "habit-5",
            streak: 0,
            completedToday: false,
            history: {}
        }
    ];

    const startDate = new Date(2025, 0, 1); 
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const endDate = new Date(2025, 11, 31); 
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dateString = formatDate(date);
        calendarData[dateString] = { date: new Date(date), habits: {} };
    }
    
    loadSavedData();
}

function initializeCalendar() {

    const monthsContainer = document.querySelector('.calendar-months');
    monthsContainer.innerHTML = '';
    for (let month = 0; month < 12; month++) {
        const monthColumn = document.createElement('div');
        monthColumn.className = 'month-column';
        
        const monthName = document.createElement('div');
        monthName.className = 'month-name';
        monthName.textContent = new Date(2025, month, 1).toLocaleString('default', { month: 'short' });
        
        const calendarGrid = document.createElement('div');
        calendarGrid.className = 'calendar-grid';
        
        const firstDayOfMonth = new Date(2025, month, 1);
        const startingDay = firstDayOfMonth.getDay(); 
        
        for (let i = 0; i < startingDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'day-cell empty';
            calendarGrid.appendChild(emptyCell);
        }
        
        const daysInMonth = new Date(2025, month + 1, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';
            dayCell.dataset.date = formatDate(new Date(2025, month, day));
            calendarGrid.appendChild(dayCell);
        }
        
        monthColumn.appendChild(monthName);
        monthColumn.appendChild(calendarGrid);
        monthsContainer.appendChild(monthColumn);
    }
}

function renderHabits() {
    const habitsContainer = document.querySelector('.habits-container');
    habitsContainer.innerHTML = '';
    
    let totalStreak = 0;
    
    habits.forEach(habit => {
        totalStreak += habit.streak;
        
        const habitCard = document.createElement('div');
        habitCard.className = 'habit-card';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'habit-checkbox';
        checkbox.id = `habit-${habit.id}`;
        checkbox.checked = habit.completedToday;
        checkbox.addEventListener('change', () => toggleHabitCompletion(habit.id));
        
        const habitInfo = document.createElement('div');
        habitInfo.className = 'habit-info';
        
        const habitName = document.createElement('div');
        habitName.className = 'habit-name';
        habitName.textContent = habit.name;
        
        const habitStreak = document.createElement('div');
        habitStreak.className = 'habit-streak';
        habitStreak.innerHTML = `<i class="fas fa-fire"></i> Current streak: ${habit.streak} days`;
        
        habitInfo.appendChild(habitName);
        habitInfo.appendChild(habitStreak);
        
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        
        const progressLabel = document.createElement('div');
        progressLabel.className = 'progress-label';
        
        const progressPercentage = Math.min(100, (habit.streak / 30) * 100);
        
        progressLabel.innerHTML = `<span>Progress</span><span>${Math.round(progressPercentage)}%</span>`;
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = `${progressPercentage}%`;
        progressFill.style.backgroundColor = `var(--${habit.colorClass})`;
        
        progressBar.appendChild(progressFill);
        
        progressContainer.appendChild(progressLabel);
        progressContainer.appendChild(progressBar);
        
        habitCard.appendChild(checkbox);
        habitCard.appendChild(habitInfo);
        habitCard.appendChild(progressContainer);
        
        habitsContainer.appendChild(habitCard);
    });
    
    document.getElementById('total-streak').textContent = totalStreak;
    document.getElementById('current-day-display').textContent = currentDayIndex;
}

function renderCalendar() {
    const dayCells = document.querySelectorAll('.day-cell:not(.empty)');

    dayCells.forEach(cell => {
        cell.style.backgroundColor = '';
        cell.classList.remove('today');
        cell.title = '';
    });

    const todayString = formatDate(currentDate);
    const todayCell = document.querySelector(`.day-cell[data-date="${todayString}"]`);
    if (todayCell) {
        todayCell.classList.add('today');
    }
    
    Object.keys(calendarData).forEach(dateString => {
        const cell = document.querySelector(`.day-cell[data-date="${dateString}"]`);
        if (!cell) return;
        
        const dayData = calendarData[dateString];
        const completedHabits = Object.values(dayData.habits).filter(completed => completed).length;
        
        let intensity = 0;
        if (completedHabits > 0) {
            intensity = 1;
            if (completedHabits >= 3) intensity = 2;
            if (completedHabits >= 5) intensity = 3;
        }
        
        if (intensity > 0) {
            const habitColor = habits[Math.min(completedHabits - 1, habits.length - 1)].colorClass;
            const colorVar = `var(--${habitColor})`;

            let opacity = 0.3;
            if (intensity === 2) opacity = 0.6;
            if (intensity === 3) opacity = 1;
            
            const rgb = getComputedStyle(document.documentElement)
                .getPropertyValue(`--${habitColor}`)
                .trim();
            
            if (rgb.startsWith('#')) {
                const r = parseInt(rgb.slice(1, 3), 16);
                const g = parseInt(rgb.slice(3, 5), 16);
                const b = parseInt(rgb.slice(5, 7), 16);
                cell.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            } else {
                cell.style.backgroundColor = rgb;
            }
        }
        
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        if (completedHabits > 0) {
            cell.title = `${formattedDate}\n${completedHabits} habit${completedHabits !== 1 ? 's' : ''} completed`;
        } else {
            cell.title = `${formattedDate}\nNo habits completed`;
        }
    });
}

function toggleHabitCompletion(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    const dateString = formatDate(currentDate);
    
    habit.completedToday = !habit.completedToday;
    
    if (!calendarData[dateString]) {
        calendarData[dateString] = { date: new Date(currentDate), habits: {} };
    }
    
    calendarData[dateString].habits[habitId] = habit.completedToday;
    
    if (habit.completedToday) {

        const yesterday = new Date(currentDate);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = formatDate(yesterday);
        
        if (calendarData[yesterdayString] && calendarData[yesterdayString].habits[habitId]) {
            habit.streak += 1;
        } else {
            habit.streak = 1;
        }
    } else {
        habit.streak = 0;
    }
    
    saveData();
    
    renderHabits();
    renderCalendar();
}

function goToNextDay() {
    const dateString = formatDate(currentDate);
    const hasCompletedHabits = habits.some(habit => habit.completedToday);
    
    if (!hasCompletedHabits) {
        const proceed = confirm("You haven't completed any habits today. Moving to the next day will break all streaks. Continue?");
        if (!proceed) return;
    }
    
    habits.forEach(habit => {
        habit.completedToday = false;
    });
    
    saveData();
    
    currentDate.setDate(currentDate.getDate() + 1);
    currentDayIndex++;
    
    updateDateDisplay();
    renderHabits();
    renderCalendar();
}

function updateDateDisplay() {
    const dateString = currentDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    document.getElementById('current-date').textContent = dateString;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function saveData() {
    const data = {
        habits: habits,
        calendarData: calendarData,
        currentDate: formatDate(currentDate),
        currentDayIndex: currentDayIndex
    };
    
    localStorage.setItem('habitTrackerData', JSON.stringify(data));
}

function loadSavedData() {
    const savedData = localStorage.getItem('habitTrackerData');
    
    if (savedData) {
        const data = JSON.parse(savedData);
        
        if (data.habits) {
            habits = data.habits;
        }

        if (data.calendarData) {

            Object.keys(data.calendarData).forEach(dateString => {
                if (data.calendarData[dateString].date) {
                    data.calendarData[dateString].date = new Date(data.calendarData[dateString].date);
                }
            });
            calendarData = data.calendarData;
        }
        
        if (data.currentDate) {
            currentDate = new Date(data.currentDate);
        }
        
        if (data.currentDayIndex) {
            currentDayIndex = data.currentDayIndex;
        }
    }
}