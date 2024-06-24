let capchaValor = crearCapcha();

//let btnGenerarCapcha = document.getElementById("buttonGenerarCapcha");
//btnGenerarCapcha.addEventListener('click', crearCapcha);

let btnGenerarCapcha = document.getElementById("buttonGenerarCapcha");
btnGenerarCapcha.addEventListener("click", () => {
  capchaValor = crearCapcha();
});

//console.log(typeof capchaValor);

function crearCapcha() {
  const CHARS =
    "asvcsfbed23355b2144543de12sqa2242dfcda2ed23dd23245gkr123211cniswijfwrofey1383ede";
  const NUMERO = 6;
  let capcha = "";

  for (let i = 0; i < NUMERO; i++) {
    capcha += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }

  let mostrarCapcha = document.getElementById("mostrarCapcha");
  let span = document.createElement("span");
  span.innerHTML = capcha;
  mostrarCapcha.innerHTML = "";
  mostrarCapcha.appendChild(span);

  return capcha;
}

let formP = document.getElementById("formP");
formP.addEventListener("submit", verificar);

function verificar(e) {
  e.preventDefault();

  let Data = new FormData(formP);

  let nombre = Data.get("nombre");
  let apellido = Data.get("apellido");
  let gamertag = Data.get("gamertag");
  let correo = Data.get("correo");
  let contraseña = Data.get("contraseña");

  let objeto = {
    nombre: nombre,
    apellido: apellido,
    gamertag: gamertag,
    correo: correo,
    contraseña: contraseña,
  };
  let capchaIngresado = String(Data.get("capchaIngresado"));

  //  console.log(nombre, apellido, email, contraseña, capchaIngresado);

  // console.log(typeof capchaIngresado);

  let capchaIsValid = document.getElementById("capchaIsValid");
  console.log(capchaValor + "VALOR DEL CAPCHA");
  console.log(capchaIngresado + "CAPCHA INGRESADO");

  if (capchaIngresado == capchaValor) {
    capchaIsValid.innerHTML = "CAPCHA ES VALIDO";
    cargarDatosServer(objeto);
    crearCapcha()

    console.log("EL CAPCHA ES VALIDO");
  } else {
    capchaIsValid.innerHTML = "CAPCHA ES INVALIDO";
    console.log("EL CAPCHA ES INVALIDO");
    
  }
}

let url = "https://6678a0940bd45250561f4d3f.mockapi.io/users";

cargarDatosTabla();

//FUNCION 2 ENVIAMOS LOS DATOS AL SERVER CON UN POST

let idAuxiliar = 1;
let opcion = "agregar";

function cargarDatosServer(objeto) {
  //SI LA SOLICITUD ES AGREGAR, SE ENVIAN DATOS NUEVOS AL SERVIDOR
  if (opcion == "agregar") {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(objeto),
    };
    let promises = fetch(url, requestOptions);
    promises
      .then((response) => {
        if (response.ok) {
          console.log("DATOS ENVIADOS AL SERVIDOR EXITOSAMENTE");
          cargarDatosTabla();
          formP.reset();
        } else {
          console.log("HUBO UN FALLO, NO SE PUDO ENVIAR LOS DATOS");
        }
      })

      .catch((error) => {
        console.log("ERROR", error);
      });
  }

  //SI LA SOLICITUD ES EDITAR, SE SOBREESCRIBEN LOS DATOS SELECCIONADOS CON EL ID

  if (opcion == "editar") {
    let requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objeto),
    };

    let promises = fetch(url + "/" + idAuxiliar, requestOptions);
    promises
      .then((response) => {
        if (response.ok) {
          console.log("ACTUALIZACION DE DATOS EXITOSA");
          cargarDatosTabla();
          formP.reset();
          opcion = "agregar";
        } else {
          console.log("HUBO UN FALLO, NO SE PUDO ACTUALIZAR LOS DATOS");
        }
      })

      .catch((error) => {
        console.log("ERROR", error);
      });
  }
}

//FUNCION 3 CARGAMOS LA TABLA CON LOS DATOS DE NUESTRA API USANDO API REST
function cargarDatosTabla() {
  let tabla = document.getElementById("tabla-dinamica");

  tabla.innerHTML = "";
  let promises = fetch(url);
  promises
    .then((response) => {
      if (response.ok) {
        console.log("DATOS EXTRAIDOS EXITOSAMENTE");
      } else {
        console.log("FALLO, NO SE PUDO EXTRAER LOS DATOS");
      }
      console.log(response);
      return response.json();
    })

    .then((data) => {
      data.forEach((element) => {
        let fila = document.createElement("tr");
        let celdaGamertag = document.createElement("td");
        let celdaCorreo = document.createElement("td");

        celdaGamertag.textContent = element.gamertag;
        celdaCorreo.textContent = element.correo;

        let btnEliminar = document.createElement("button");
        btnEliminar.textContent = "ELIMINAR";
        btnEliminar.setAttribute("data-id", element.id);
        btnEliminar.setAttribute("class", "btnEliminar");

        let btnEditar = document.createElement("button");
        btnEditar.textContent = "EDITAR";
        btnEditar.setAttribute("data-id", element.id);
        btnEditar.setAttribute("class", "btnEditar");

        fila.appendChild(celdaGamertag);
        fila.appendChild(celdaCorreo);
        fila.appendChild(btnEliminar);
        fila.appendChild(btnEditar);
        tabla.appendChild(fila);
      });

      cargarAddEventListenerEliminar();
      cargarAddEventListenerEditar();
    })

    .catch((error) => {
      console.log("error", error);
    });
}

//FUNCION 4 CARGAR ADD EVENT LISTENERS ELIMINAR EN TODOS LOS BOTONES
function cargarAddEventListenerEliminar() {
  let btnEliminar = document.querySelectorAll(".btnEliminar");
  btnEliminar.forEach((btn) => {
    btn.addEventListener("click", eliminarItem);
  });
}

// FUNCION 5 CARGAR ADD EVENT LISTENER EDITAR EN TODOS LOS BOTONES
function cargarAddEventListenerEditar() {
  let btnEditar = document.querySelectorAll(".btnEditar");
  btnEditar.forEach((btn) => {
    btn.addEventListener("click", editarItem);
  });
}
//FUNCION 6 ELIMINAR

function eliminarItem() {
  let itemId = this.getAttribute("data-id");

  let requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let promises = fetch(url + "/" + itemId, requestOptions);
  promises
    .then((response) => {
      if (response.ok) {
        console.log("LOS DATOS FUERON ELIMINADOS EXITOSAMENTE");
        cargarDatosTabla();
      } else {
        console.log("HUBO UN FALLO, NO SE PUDO ELIMINAR LOS DATOS");
      }
    })

    .catch((error) => {
      console.log("ERROR", error);
    });
}

//FUNCION 7 EDITAR
let btnActivo = null;
let Inputnombre = document.getElementById("nombre");
let Inputcorreo = document.getElementById("correo");
function editarItem(event) {
  let itemId = this.getAttribute("data-id");
  let elemento = event.target.closest("tr");

 
  //let nombre = elemento.querySelector('li:first-child').innerText;
 // let correo = elemento.querySelector('li:nth-child(2)').innerText;

  let nombre = elemento.cells[0].innerText; // Primera celda (nombre)
let correo = elemento.cells[1].innerText; // Segunda celda (correo)

Inputnombre.value = nombre;
Inputcorreo.value = correo;

idAuxiliar = itemId;
opcion = "editar"

}


//let btnEditar = event.target;

  /* let btnNoEditar = document.querySelector(".noEditar");
  btnNoEditar.addEventListener("click", modBtnEditar);
    btnEditar.textContent = "EDITAR";
    opcion = "agregar";
    btnNoEditar.classList.remove("noEditar");
    elemento.cells[0].innerText = nombreAux;
    elemento.cells[1].innerText = correoAux;
    Inputnombre.value = nombre;
    Inputcorreo.value = correo;
  */


//let nombre = elemento.querySelector('li:first-child').innerText;
//    cargarDatosTabla()
// let correo = elemento.querySelector('li:nth-child(2)').innerText;

    /* AllBtnEditar.forEach((btn) => {
      let btnId = btn.getAttribute("data-id");
       if (btnId === itemId) {
         btnEditar.textContent = "NO EDITAR";
   
         btnEditar.setAttribute("class", "noEditar");
         btnActivo = btnEditar;
   
         let nombre = elemento.cells[0].innerText; // Primera celda (nombre)
         let correo = elemento.cells[1].innerText; // Segunda celda (correo)
   
         elemento.cells[0].innerText = "EDITANDO";
         elemento.cells[1].innerText = "EDITANDO";
   
         Inputnombre.value = nombre;
         Inputcorreo.value = correo;
   
         nombreAux = nombre;
         correoAux = correo;
   
         idAuxiliar = itemId;
         opcion = "editar";
   
         
       }
     });
   */