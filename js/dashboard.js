"use strict";

const logOut = document.getElementById("logout");
const currentUser = localStorage.getItem("currentUser");
const selectSubject = document.getElementById("session-subject");

const addSelectionSubject = name =>{
    const option = document.createElement("OPTION");
    option.textContent = name;
    option.value = name;
    selectSubject.appendChild(option);
}

document.addEventListener("DOMContentLoaded", e =>{
    

    if(!currentUser){
        window.location.href = "index.html";
    } else {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userData = users.find(u => u.username === currentUser);
        if(userData){
            document.querySelector(".dashboard__title").textContent = `Welcome, ${userData.nickname}!`;
            subjects.forEach(s => addSelectionSubject(s.name));
        } else {
            logout();
        }
        
    }
})



logOut.addEventListener("click", logout);



function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

//TASK LIST



const createTask = (contenido, id = null, completed = false )=>{
    const error = document.querySelector(".taskError");
        error.textContent = "";
    if(contenido.length > 30){
        error.textContent = "No more than 30 characters.";
        return;
    } else if(contador > 11){
        error.textContent = "No more than 12 tasks.";
        return;
    }
    const list = document.querySelector(".dashboard__task_list");
    const listItem = document.createElement("LI");
    const itemCheck = document.createElement("INPUT");
    const itemLabel = document.createElement("LABEL");
    listItem.classList.add("dashboard__task");
    itemCheck.setAttribute("type", "checkbox");
    itemCheck.setAttribute("id", `tarea${contador}`);
    itemLabel.textContent = contenido;
    itemLabel.setAttribute("for", `tarea${contador}`);
    itemCheck.checked = completed;
    
    listItem.appendChild(itemCheck);
    listItem.appendChild(itemLabel);
    list.appendChild(listItem);

    if (!id) {
        tasks.push({ id: `tarea${contador}`, contenido, completed: false });
        user.tasks = tasks; // actualizar tareas del usuario
        localStorage.setItem("users", JSON.stringify(users));
        contador++;
    }

    itemCheck.addEventListener("change", () => {
        const t = tasks.find(t => t.id === tareaId);
        t.completed = itemCheck.checked;
        user.tasks = tasks;
        localStorage.setItem("users", JSON.stringify(users));
    });
}



let contador = 0;

let users = JSON.parse(localStorage.getItem("users")) || [];
let user = users.find(u => u.username === currentUser);

let tasks = user.tasks || [];
contador = tasks.length; 
tasks.forEach(t => createTask(t.contenido, t.id, t.completed));

const newTask = document.querySelector(".todolist__input");
const addTask = document.querySelector(".todolist__add-btn");

addTask.addEventListener("click", e=>{
    e.preventDefault();
    createTask(newTask.value);
    newTask.value = "";
})

const clearTasks = ()=>{
    tasks = [];
    user.tasks = tasks;
    localStorage.setItem("users", JSON.stringify(users));
    contador = 0;
    const list = document.querySelector(".dashboard__task_list");
    list.innerHTML = "";
}

const clearChecked = ()=>{
    const list = document.querySelector(".dashboard__task_list");
    const checkedItems = list.querySelectorAll("input[type='checkbox']:checked");

    checkedItems.forEach(i =>{
        i.parentElement.remove();
        const label = i.nextElementSibling.textContent;
        tasks = tasks.filter(t => t !== label);
    });

    user.tasks = tasks;
    localStorage.setItem("users", JSON.stringify(users));
}

const clear = document.getElementById("clearTasks");
const clearChk = document.getElementById("clearChecked");

clear.addEventListener("click", clearTasks);
clearChk.addEventListener("click", clearChecked);

//ADD A SUBJECT

let subjects = user.subjects || [];

const subjectName = document.getElementById("subject-name");
const subjectYear = document.getElementById("subject-year");
const subjectColor = document.getElementById("subject-color");

const addSubjectButton = document.getElementById("add-subject-btn");

const createSubject = (name, year, color)=>{
    const error = document.querySelector(".subject-error");
    error.textContent = "";
    year = Number(year);
    if(name.trim().length == 0 || year.length == 0){
        error.textContent = "There can't be any empty values."
        console.log("empty values");
        subjectName.value = "";
        subjectYear.value = "";
        return;
    } else if(!Number.isInteger(year)){
        error.textContent = "The value introduced must be a number without commas";
        subjectName.value = "";
        subjectYear.value = "";
        return;
    } else if(subjects.find(s => s.name.trim() === name.trim())){
        error.textContent = "Subject already added!";
        subjectName.value = "";
        subjectYear.value = "";
        return;
    } else {
        subjects.push({
            name: name.trim(),
            year: year,
            color: color
        });
        subjectName.value = "";
        subjectYear.value = "";
        addSelectionSubject(name);
        user.subjects = subjects;
        localStorage.setItem("users", JSON.stringify(users));
        console.log("Subject added:", { name, year, color });
        if ("Notification" in window) {
                if (Notification.permission === "granted") {
                    new Notification("Subject added successfully!");
            } else {
                Notification.requestPermission(); 
            }
        }
    }
}

addSubjectButton.addEventListener("click", e =>{
    e.preventDefault();
    createSubject(subjectName.value, subjectYear.value, subjectColor.value);
});

//ADD A SESSION

const shownTime = document.getElementById("session-minutes");
const addSessionButton = document.getElementById("add-session-btn");
let sessions = user.sessions || [];

const addSession = (subject, time) =>{
    let totalHours = user.totalHours;
    console.log(totalHours);
    totalHours += time / 60.0;
    user.totalHours = totalHours;
    localStorage.setItem("users", JSON.stringify(users));

    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth();
    month = month + 1;
    const day = date.getDate();

    const error = document.querySelector(".session-error");
    error.textContent = "";
    time = Number(time);
    if(isNaN(time)){
        error.textContent = "Please, introduce an integer for the time";
        return;
    } else if(time == 0 || time > 1200){
        error.textContent = "Invalid number";
        return;
    } else {
        sessions.push({
            subject: subject,
            time: time,
            year: year,
            month: month,
            day: day,
        });
        console.log("Session added:", { subject, time, year, month, day });
        shownTime.value = "";
        user.sessions = sessions;
        localStorage.setItem("users", JSON.stringify(users));
        if ("Notification" in window) {
                if (Notification.permission === "granted") {
                    new Notification("Session added successfully!");
            } else {
                Notification.requestPermission(); 
            }
        }
    }
}

addSessionButton.addEventListener("click", e=>{
    e.preventDefault();
    addSession(selectSubject.value, shownTime.value);
})




