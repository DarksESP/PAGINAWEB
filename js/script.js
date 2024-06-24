"use strict"
let btnMostrarMenu = document.getElementById("buttonMenu");
btnMostrarMenu.addEventListener('click', mostrarMenu);

function mostrarMenu() {
    let navPrincipal = document.querySelector(".nav-principal");
    navPrincipal.classList.add("mostrar");
}

let BtnSalirMenu = document.getElementById("buttonSalirMenu");
BtnSalirMenu.addEventListener('click', salirMenu);

function salirMenu() {
    let navPrincipal = document.querySelector(".nav-principal");
    navPrincipal.classList.remove("mostrar");
}