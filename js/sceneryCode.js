"use strict";

document.addEventListener("DOMContentLoaded", e =>{
    const currentUser = localStorage.getItem("currentUser");

    if(!currentUser){
        window.location.href = "index.html";
    }
})


function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

/* CAMBIO DE ESCENARIO */

/*Botones para cambiar de escena*/
const cafeBtn = document.getElementById("btn-cafe");
const beachBtn = document.getElementById("btn-beach");
const gardenBtn = document.getElementById("btn-garden");
const forestBtn = document.getElementById("btn-forest");
/*Para cambiar el src del audio según la escena */
const audio = document.getElementById("audio");

cafeBtn.hidden = true;

const mainScenery = document.querySelector(".scenery__main");


/* Función para cambiar de escenario con un switch simple de 4 casos:
    en cada caso, se quita el botón perteneciente a ese escenario y se
    dejan los otros 3 */
function changeScenery(boton){
    switch(boton){
        case 1: //beach
            {
                mainScenery.classList.remove("scenery__cafe");
                mainScenery.classList.remove("scenery__garden");
                mainScenery.classList.remove("scenery__forest");
                mainScenery.classList.add("scenery__beach");
                beachBtn.hidden = true;
                gardenBtn.hidden = false;
                forestBtn.hidden = false;
                cafeBtn.hidden = false;
                audio.src = "../audio/ocean-beach-waves-332383.mp3";
                audio.load();
            }
            
            break;
        case 2: //garden
            {
                mainScenery.classList.remove("scenery__beach");
                mainScenery.classList.remove("scenery__cafe");
                mainScenery.classList.remove("scenery__forest");
                mainScenery.classList.add("scenery__garden");
                gardenBtn.hidden = true;
                forestBtn.hidden = false;
                cafeBtn.hidden = false;
                beachBtn.hidden = false;
                audio.src = "../audio/garden-ambience-236744.mp3";
                audio.load();
            }
            break;
        case 3: //forest
            {
                mainScenery.classList.remove("scenery__garden");
                mainScenery.classList.remove("scenery__beach");
                mainScenery.classList.remove("scenery__cafe");
                mainScenery.classList.add("scenery__forest");
                forestBtn.hidden = true;
                gardenBtn.hidden = false;
                cafeBtn.hidden = false;
                beachBtn.hidden = false;
                audio.src = "../audio/forest-sounds-259933.mp3";
                audio.load();
            }
            break;
        case 4: //café
            {
                mainScenery.classList.remove("scenery__forest");
                mainScenery.classList.remove("scenery__garden");
                mainScenery.classList.remove("scenery__beach");
                mainScenery.classList.add("scenery__cafe");
                cafeBtn.hidden = true;
                forestBtn.hidden = false;
                beachBtn.hidden = false;
                gardenBtn.hidden = false;
                audio.src = "../audio/ambience-cafe001-52520.mp3";
                audio.load();
            }
            break;
    }
}


beachBtn.addEventListener("click", () => changeScenery(1));
gardenBtn.addEventListener("click", () => changeScenery(2));
forestBtn.addEventListener("click", () => changeScenery(3));
cafeBtn.addEventListener("click", () => changeScenery(4));

/*CLOCK AND SOUND*/ 

/* Variables y objetos esenciales */

const play = document.getElementById("btn-play");
const pause = document.getElementById("btn-pause");
const clock = document.querySelector(".scenery__clock_circle");
const mode = document.querySelector(".scenery__clock_mode");

pause.hidden = true;
let isPaused = false;
let shouldStop = false;

const playSound = document.getElementById("sound-play");
const pauseSound = document.getElementById("sound-pause");
const soundMode = document.getElementById("sound-mode");


pauseSound.hidden = true;

/* Añade ceros a los minutos o segundos que lo necesiten */
function addZeros(number){
    if(number.toString().length < 2) return "0".concat(number);
    return number;
}


/* Para establecer el número de minutos en el reloj */
const setPomodoroTime = (number) => {
    let minutos = document.querySelector(".minutes");
    let segundos = document.querySelector(".seconds");

    minutos.textContent = addZeros(number);
    segundos.textContent = "00";
}

/* función que usaremos para esperar 1000 ms/ 1 s entre cada cambio de segundo*/
const esperar = ms => new Promise(resolve => setTimeout(resolve, ms));


/* Función que se encarga de la cuenta atrás: 
    se le pasa como parámetro los minutos y lo que va 
    haciendo es restar segundos cada 1000s (con el await esperar)*/
async function startCountdown(minutes) {
    let totalSeconds = minutes * 60;

    const minutos = document.querySelector(".minutes");
    const segundos = document.querySelector(".seconds");

    while (totalSeconds > 0) {
        if (shouldStop) break;

        if (!isPaused) {
            totalSeconds--;

            let min = Math.floor(totalSeconds / 60);
            let seg = totalSeconds % 60;

            minutos.textContent = addZeros(min);
            segundos.textContent = addZeros(seg);
        }

        await esperar(1000);
    }
}

function reiniciarAnimacion(clase) {
    clock.classList.remove("animar", "animar2");
    void clock.offsetWidth; // Fuerza el reinicio
    clock.classList.add(clase);
    clock.style.animationPlayState = "running";
}


async function startPomodoro() {
    shouldStop = false;

    for (let i = 0; i < 4 && !shouldStop; i++) {
        // Estudio
        setPomodoroTime(25);
        await esperar(100);
        reiniciarAnimacion("animar");
        mode.textContent = "Studying";
        await startCountdown(25);
        if (shouldStop) break;

        // Descanso
        setPomodoroTime(5);
        await esperar(100);
        reiniciarAnimacion("animar2");
        mode.textContent = "Resting";
        await startCountdown(5);
        if (shouldStop) break;

        const session = document.querySelector(`.session-${i + 1}`);
        if (session) session.classList.add("session-filled");
    }

    const s1 = document.querySelector(".session-1");
    s1.classList.remove("session-filled");
    const s2 = document.querySelector(".session-2");
    s2.classList.remove("session-filled");
    const s3 = document.querySelector(".session-3");
    s3.classList.remove("session-filled");
    const s4 = document.querySelector(".session-4");
    s4.classList.remove("session-filled");
}

play.addEventListener("click", () => {
    play.style.display = "none";
    pause.style.display = "inline";

    clock.style.animationPlayState = "running";
    isPaused = false;

    if (!clock.dataset.running) {
        clock.dataset.running = "true";
        startPomodoro();
    }
});

pause.addEventListener("click", () => {
    play.style.display = "inline";
    pause.style.display = "none";

    isPaused = true;
    clock.style.animationPlayState = "paused";
});

playSound.addEventListener("click", () =>{
    playSound.style.display = "none";
    pauseSound.style.display = "inline";
    soundMode.textContent = "Sound on";
    audio.play();
    audio.muted = false;
});


pauseSound.addEventListener("click", () =>{
    pauseSound.style.display = "none";
    playSound.style.display = "inline";
    soundMode.textContent = "Sound off";
    audio.muted = true;
});
