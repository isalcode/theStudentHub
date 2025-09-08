"use strict";

const username = document.getElementById("username");
const password = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const users = JSON.parse(localStorage.getItem("users")) || [];

loginButton.addEventListener("click",e =>{
    e.preventDefault();
    if(!users.find(u => u.username === username.value)){
        document.querySelector(".login-username-error").textContent = "User not found, please register first.";
    } else {
        const userData = users.find(u => u.username === username.value);
        if(password.value !== userData.password){
            document.querySelector(".login-password-error").textContent = "Incorrect password, try again.";
        } else {
            localStorage.removeItem("currentUser");
            localStorage.setItem("currentUser",username.value);
            window.location.href = "dashboard.html";
            if ("Notification" in window) {
                if (Notification.permission === "granted") {
                    new Notification("User logged in successfully!");
            } else {
                Notification.requestPermission(); 
            }
        }
        
        
        }
    }
})
