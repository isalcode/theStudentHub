"use strict";

const registerButton = document.getElementById("registerButton");
const nickname = document.getElementById("name");
const username = document.getElementById("username");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("password2");
let users = JSON.parse(localStorage.getItem("users")) || [];

const exists = user =>{
    if(users.some(u => u.username === user)){
        return true;
    }
    return false;
}

registerButton.addEventListener("click",async e =>{
    e.preventDefault(); //temporal
    document.querySelector(".nickname-error").textContent = "";
    document.querySelector(".username-error").textContent = "";
    document.querySelector(".confirmPassword-error").textContent = "";
    if(nickname.value.length == 0 || username.value.length == 0 || password.value.length == 0 || confirmPassword.value.length == 0){
        document.querySelector(".confirmPassword-error").textContent = "Empty values.";
        return;
    }
    if(nickname.value.length > 20){
        document.querySelector(".nickname-error").textContent = "Nickname can't be longer than 20 characters.";
        return;
    } else if (exists(username.value)){
        document.querySelector(".username-error").textContent = "Username already exists.";
        return;
    }else if(password.value !== confirmPassword.value){
        document.querySelector(".confirmPassword-error").textContent = "Different password typed.";
        return;
    } else {
        users.push({
            nickname: nickname.value,
            username: username.value,
            password: password.value,
            tasks: [],
            subjects: [],
            sessions: [],
            totalHours: 0,
        })
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("currentUser",username.value);
        if ("Notification" in window) {
                try {
                    const permission = await Notification.requestPermission();
                    if (permission === "granted") {
                    new Notification("User registered successfully!");
                }
                } catch (err) {
                    console.error("Notification permission error:", err);
                }
    }
        window.location.href = "dashboard.html";
    }
    
})