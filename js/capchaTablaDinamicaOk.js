let capchaValor = crearCapcha(); //DECLARAMOS UN CAPCHA POR DEFECTO


//BOTON CAPCHA
let btnGenerarCapcha = document.getElementById("buttonGenerarCapcha"); 
btnGenerarCapcha.addEventListener("click", () => {
  capchaValor = crearCapcha();
});

//FUNCION 1: GENERAR CAPCHA
function crearCapcha() {
  const CHARS =
    "asvcsfbed23355b2144543de12sqa2242dfcda2ed23dd23245gkr123211cniswijfwrofey1383ede";
  const MAX = 6;
  let capcha = "";

  for (let i = 0; i < MAX; i++) {
    capcha += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }

  let mostrarCapcha = document.getElementById("mostrarCapcha");
  mostrarCapcha.innerHTML = "";
  let span = document.createElement("span");
  span.innerHTML = capcha;
  mostrarCapcha.appendChild(span);

  return capcha;
}

//SELECCIONAMOS NUESTRO FORM
let formP = document.getElementById("formP");
formP.addEventListener("submit", verificar);

let cantidadDatos = "x1";


//FUNCION 2: VERIFICAMOS LOS DATOS ANTES DE HACER EL POST
function verificar(event) {
  event.preventDefault();

  //TOMAMOS LOS DATOS INGRESADOS
  let Data = new FormData(formP);

  let nombre = Data.get("nombre");
  let apellido = Data.get("apellido");
  let gamertag = Data.get("gamertag");
  let correo = Data.get("correo");
  let contraseña = Data.get("contraseña");

  //GUARDAMOS DATOS EN UN JSON
  let objeto = {
    'nombre': nombre,
    'apellido': apellido,
    'gamertag': gamertag,
    'correo': correo,
    'contraseña': contraseña,
  };

  //TOMAMOS EL CAPCHA INGRESADO
  let capchaIngresado = String(Data.get("capchaIngresado"));

 
  let capchaIsValid = document.getElementById("capchaIsValid");
  //console.log(capchaValor + "VALOR DEL CAPCHA");
  //console.log(capchaIngresado + "CAPCHA INGRESADO"); //USAMOS ESTO PARA VERIFICAR SI LOS VALORES DE LOS CAPCHA SE ACTUALIZABAN MEDIANTE CONSOLA

  //VERIFICAMOS QUE LOS VALORES COINCIDAD O NO
  if (capchaIngresado == capchaValor) {
    capchaIsValid.innerHTML = "CAPCHA ES VALIDO";
    capchaValor = crearCapcha();
    cargarDatosServer(objeto);

    console.log("EL CAPCHA ES VALIDO");
  } else {
    capchaIsValid.innerHTML = "CAPCHA ES INVALIDO";
    console.log("EL CAPCHA ES INVALIDO");
  }
}


//MOCKAPI LINK
const url = "https://6678f3070bd45250562065ee.mockapi.io/users";

//ELEMENTOS PAGINACION
let botonAnterior = document.getElementById("botonAnterior");
let botonSiguiente = document.getElementById("botonSiguiente");
let paginaActual = 1;
let limitePagina = 10;
botonAnterior.addEventListener("click", paginaAnterior);
botonSiguiente.addEventListener("click", paginaSiguiente);

//CARGAR DATOS POR DEFECTO LA PRIMERA VEZ
cargarDatosTabla();


//ELEMENTOS AUXILIARES PARA EDITAR Y/O AGREGAR (METODO POST, PUT)
let idAuxiliar = 1;
let opcion = "agregar";

//LE DAMOS A CADA BOTON UN VALOR: X1 O X3
let btnEnviarx1 = document.getElementById("submitx1");
btnEnviarx1.addEventListener("click", function () {
  cantidadDatos = "x1";
});

let btnEnviarx3 = document.getElementById("submitx3");
btnEnviarx3.addEventListener("click", function () {
  cantidadDatos = "x3";
});

//FUNCION 3 ENVIAMOS LOS DATOS AL SERVER CON UN POST
function cargarDatosServer(objeto) {
    //AGREGAR DATOS X1
  if (opcion == "agregar" && cantidadDatos != "x3") {
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

  //AGREGAR DATOS X3
  if (opcion == "agregar" && cantidadDatos === "x3") {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(objeto),
    };

    let exitosas = 0;
    for (let i = 0; i < 3; i++) {
      let promises = fetch(url, requestOptions);
      promises
        .then((responses) => {
          if (responses.ok) {
            exitosas++;
            console.log("SE ENVIÓ LOS DATOS EXITOSAMENTE" + exitosas);
          } else {
            console.log("FALLO, NO SE PUDO ENVIAR LOS DATOS");
          }
          if (exitosas === 3) {
            cantidadDatos = "x1";
            let tabla = document.getElementById("tabla-dinamica");
            tabla.innerHTML = ""; // Limpiar tabla
            formP.reset(); // Reiniciar formulario
            cargarDatosTabla(); // Volver a cargar datos en la tabla
          }
        })

        .catch((error) => {
          console.log("ERROR", error);
        });
    }
  }

  //EDITAR DATOS
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




//FUNCION 4 CARGAMOS LA TABLA CON LOS DATOS DE NUESTRA API USANDO API REST

//CAMBIOS:
//1) AHORA FETCHEA UNA PÁGINA EN VEZ DEL CONTENIDO COMPLETO.
function cargarDatosTabla() {
  let tabla = document.getElementById("tabla-dinamica");
  tabla.innerHTML = "";
  let promises = fetch(
    url + "?page=" + paginaActual + "&limit=" + limitePagina
  );
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
        celdaGamertag.setAttribute("id", "tdItem");
        let celdaCorreo = document.createElement("td");
        celdaCorreo.setAttribute("id", "tdItem");

        celdaGamertag.textContent = element.gamertag;
        celdaCorreo.textContent = element.correo;

        let btnEditar = document.createElement("button");
        btnEditar.textContent = "✏️";
        btnEditar.setAttribute("data-id", element.id);
        btnEditar.setAttribute("class", "btnEditar");

        let btnEliminar = document.createElement("button");
        btnEliminar.textContent = "🗑️";
        btnEliminar.setAttribute("data-id", element.id);
        btnEliminar.setAttribute("class", "btnEliminar");

        fila.appendChild(celdaGamertag);
        fila.appendChild(celdaCorreo);
        fila.appendChild(btnEditar);
        fila.appendChild(btnEliminar);
        tabla.appendChild(fila);
      });

      cargarAddEventListenerEliminar();
      cargarAddEventListenerEditar();
    })

    .catch((error) => {
      console.log("error", error);
    });
}

//FUNCION 5 CARGAR ADD EVENT LISTENERS ELIMINAR EN TODOS LOS BOTONES
function cargarAddEventListenerEliminar() {
  let btnEliminar = document.querySelectorAll(".btnEliminar");
  btnEliminar.forEach((btn) => {
    btn.addEventListener("click", eliminarItem);
  });
}

// FUNCION 6 CARGAR ADD EVENT LISTENER EDITAR EN TODOS LOS BOTONES
function cargarAddEventListenerEditar() {
  let btnEditar = document.querySelectorAll(".btnEditar");
  btnEditar.forEach((btn) => {
    btn.addEventListener("click", editarItem);
  });
}
//FUNCION 7 ELIMINAR

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

//FUNCION 8 EDITAR

let Inputgamertag = document.getElementById("gamertag");
let Inputcorreo = document.getElementById("correo");

function editarItem(event) {
  let itemId = this.getAttribute("data-id");
  let elemento = event.target.closest("tr");

  //let nombre = elemento.querySelector('li:first-child').innerText;
  // let correo = elemento.querySelector('li:nth-child(2)').innerText;

  let nombre = elemento.cells[0].innerText; // Primera celda (nombre)
  let correo = elemento.cells[1].innerText; // Segunda celda (correo)

  Inputgamertag.value = nombre;
  Inputcorreo.value = correo;

  idAuxiliar = itemId;
  opcion = "editar";
}

//FUNCION 9: PAGINA ANTERIOR.
function paginaAnterior() {
  if (paginaActual > 1) {
    paginaActual--;
    cargarDatosTabla();
  }
}

//FUNCION 10: PAGINA SIGUIENTE.
function paginaSiguiente() {
  if (elementosIgualLimitePagina()) {
    paginaActual++;
    cargarDatosTabla();
  }
}

//FUNCION 11: CHEQUEAR SI LA TABLA TIENE UNA CANTIDAD DE ELEMENTOS IGUAL A x
//DONDE x ES EL VALOR DE limitePagina.
function elementosIgualLimitePagina() {
  let tabladinamica = document.getElementById("tabla-dinamica");
  if (tabladinamica.childElementCount === limitePagina) {
    return true;
  } else {
    return false;
  }
}
