let accountName = document.getElementById("accountName");
let accountValue = document.getElementById("accountValue");
let username = document.cookie.split("=")[1];
let logout = document.getElementById("logout");

logout.addEventListener("click", submitLogout);

accountName.textContent = (username + "'s" + " Account");

fetch("/account", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "username": username
    })
}).then(response => {
    if (response.status === 200) {
        console.log("Account found");
        return response.json();
    } else {
        console.log("No Account found");
    }
}).then(data => {
    
    accountValue.textContent = ("Total Account Value: " + data);
    console.log(data);

})

function submitLogout() {
    fetch("/logout", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    logoutMessage.innerText = "Logged out successfully"
    location.href = "login.html";
}