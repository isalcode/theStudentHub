const notificationModal = document.getElementById("modal");
const notificationButton = document.getElementById("notification-btn");

document.addEventListener("DOMContentLoaded", e =>{
    const currentUser = localStorage.getItem("currentUser");
    if(!currentUser){
        notificationModal.style.display = "flex";
    } else {
        notificationModal.style.display = "none";
    }
})



notificationButton.addEventListener("click", ()=>{
    notificationModal.style.display = "none";
})
