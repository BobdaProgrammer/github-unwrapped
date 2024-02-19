function selectAccount() {
    document.getElementById("a").setAttribute("href", `main.html?username=` + document.getElementById(`username`).value);
}