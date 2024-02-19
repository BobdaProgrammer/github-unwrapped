function selectAccount() {
    document.getElementById("a").setAttribute("href", `stats/main.html?username=` + document.getElementById(`username`).value);
}
