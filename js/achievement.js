"use strict";


const logOut = document.getElementById("logout");

const currentUser = localStorage.getItem("currentUser");
let users = JSON.parse(localStorage.getItem("users")) || [];
let user = users.find(u => u.username === currentUser);

const hoursTotal = document.getElementById("hoursTotal");
const activeDays = document.getElementById("activeDays");
const streak = document.getElementById("streak");
const hoursPerdDay = document.getElementById("hoursPerDay");

// ACTIVE DAYS

const getActiveDays = () =>{
    let sessions = user?.sessions || [];
    let activeDays = new Set();
    
    sessions.forEach(s =>{
        let dateKey = `${s.year}-${String(s.month).padStart(2, '0')}-${String(s.day).padStart(2, '0')}`;
        activeDays.add(dateKey);
    })

    return activeDays.size;
}

// STREAK

const getStreak = () => {
    let sessions = user?.sessions || [];
    if (sessions.length === 0) return 0;

    // Ordenamos por fecha
    sessions.sort((a, b) => 
        new Date(a.year, a.month - 1, a.day) - new Date(b.year, b.month - 1, b.day)
    );

    let streak = 1;
    let maxStreak = 1;

    for (let i = 1; i < sessions.length; i++) {
        let prev = new Date(sessions[i-1].year, sessions[i-1].month - 1, sessions[i-1].day);
        let curr = new Date(sessions[i].year, sessions[i].month - 1, sessions[i].day);

        let diffDays = (curr - prev) / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
            streak++;
            maxStreak = Math.max(maxStreak, streak);
        } else if (diffDays > 1) {
            streak = 1; // se rompe la racha
        }
    }

    return maxStreak;
};

// HOURS PER DAY


const getHoursPerMonth = month =>{
    let sessions = user.sessions || [];
    let hours = 0;
    if(!sessions){
        return 0;
    } else {
        let sesMonth = sessions.filter(s => s.month == month);
        for(let i = 0; i < sesMonth.length ; i++){
            hours += sesMonth[i].time / 60;
        }
        return hours;
    }
}

const getHoursPerDay = ()=>{
    const date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hoursThisMonth = getHoursPerMonth(month);
    return hoursThisMonth/day;
}



document.addEventListener("DOMContentLoaded", e =>{
    const currentUser = localStorage.getItem("currentUser");

    if(!currentUser){
        window.location.href = "index.html";
    }
    hoursTotal.textContent = Number((user.totalHours).toFixed(2));
    activeDays.textContent = getActiveDays();
    streak.textContent = getStreak();
    hoursPerdDay.textContent = Number(getHoursPerDay().toFixed(2));

})

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

logOut.addEventListener("click", logout);



const ctx = document.getElementById('chart1').getContext('2d');
const year = new Date().getFullYear();






// CHART 1

const myChart = new Chart(ctx, {
    type: 'line', // tipos: 'bar', 'line', 'pie', 'doughnut'
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August' , 'September', 'October', 'November', 'December'], // etiquetas del eje X
        datasets: [{
            label: 'Hours',
            data: [getHoursPerMonth(1), getHoursPerMonth(2), getHoursPerMonth(3), getHoursPerMonth(4), getHoursPerMonth(5),getHoursPerMonth(6),getHoursPerMonth(7),getHoursPerMonth(8),getHoursPerMonth(9),getHoursPerMonth(10),getHoursPerMonth(11),getHoursPerMonth(12)], // valores del eje Y
            backgroundColor: '#213e60' 
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true
            },
            title: {
                display: true,
                text: `Hours per month, year ${year}`
            }
        },
        scales: {
            y: {
                beginAtZero: true // para que el eje Y empiece en 0
            }
        }
    }
});

//DAYS OF THE MONTH

const daysOfTheMonth = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    let numDays;

    if ([1,3,5,7,8,10,12].includes(month)) {
        numDays = 31;
    } else if ([4,6,9,11].includes(month)) {
        numDays = 30;
    } else { // febrero
        numDays = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
    }

    const array = Array.from({length: numDays}, (_, i) => (i + 1).toString());
    return array;
}

const getHours = day =>{
    let hours = 0;
    const date = new Date();
    const month = date.getMonth() + 1;
    let sessions = user.sessions || [];
    let sesMonth = sessions.filter(s => s.month == month);
    let sesDay = sesMonth.filter(s => s.day == day);
    for(let i = 0; i < sesDay.length; i++){
        hours += sesDay[i].time / 60;
    }
    return hours;
}

const hoursData = () =>{
    const date = new Date();
    let array = [];
    const month = date.getMonth() + 1;
    if ([1,3,5,7,8,10,12].includes(month)){
        for(let i = 0; i < 31; i++){
            array[i] = getHours(i+1);
        }
    } else if ([4,6,9,11].includes(month)){
        for(let i = 0; i < 30; i++){
            array[i] = getHours(i+1);
        }
    } else if(month == 2){
        for(let i = 0; i < 29; i++){
            array[i] = getHours(i+1);
        }
    }
    return array;

}

const month = new Date().getMonth() + 1;

const subjects = [...new Set((user.sessions || []).filter(s => s.month === month).map(s => s.subject))];

const hoursBySubject = (subject) => {
    const days = daysOfTheMonth();
    return days.map((_, i) => {
        let total = 0;
        const sessionsDay = (user.sessions || [])
            .filter(s => s.month === month && s.day === i+1 && s.subject === subject);
        for(let s of sessionsDay) total += s.time / 60;
        return total;
    });
};

// Generar colores aleatorios (o puedes usar un array de colores predefinidos)
const getRandomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16);

const getSubjectColor = subject =>{
    const sub = (user.subjects || []).find(s => s.name === subject);
    if(sub.color){
        return sub.color;
    } else {
        return getRandomColor();
    }
}

const datasets = subjects.map(sub => ({
    label: sub,
    data: hoursBySubject(sub),
    backgroundColor: getSubjectColor(sub)
}));




const ctx2 = document.getElementById('chart2').getContext('2d');


const myChart2 = new Chart(ctx2, {
    type: 'bar', // tipos: 'bar', 'line', 'pie', 'doughnut'
    data: {
        labels: daysOfTheMonth(), // etiquetas del eje X
        datasets: datasets
    },
    options: {
        responsive: false,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true
            },
            title: {
                display: true,
                text: `Hours per day by subject`
            }
        },
        scales: {
            y: {
                stacked: true,
                beginAtZero: true // para que el eje Y empiece en 0
            },
            x: {
                stacked: true,
                ticks: {
                    autoSkip: false, // no omite labels
                    maxRotation: 90, 
                    minRotation: 45
                }
            }
        }
    }
});



