<<<<<<< HEAD
// tema1.js - versión corregida y robusta
let puntos = 0;
let rondaRespondida = false;

function generarNumeros() {
  rondaRespondida = false;

  const tipos = ["natural", "decimal", "fraccionario"];
  const tipo = tipos[Math.floor(Math.random() * tipos.length)];

  let num1, num2;

  if (tipo === "natural") {
    num1 = Math.floor(Math.random() * 100);
    num2 = Math.floor(Math.random() * 100);
  } else if (tipo === "decimal") {
    // Generamos como string con punto decimal (2 decimales)
    num1 = (Math.random() * 10).toFixed(2);
    num2 = (Math.random() * 10).toFixed(2);
  } else {
    const fracciones = ["1/2", "1/3", "3/4", "2/5", "5/6", "4/3", "7/8"];
    num1 = fracciones[Math.floor(Math.random() * fracciones.length)];
    num2 = fracciones[Math.floor(Math.random() * fracciones.length)];
  }

  const btn1 = document.getElementById("num1");
  const btn2 = document.getElementById("num2");

  btn1.textContent = num1;
  btn2.textContent = num2;

  // Guardamos tanto el valor numérico (para comparar) como el texto original (para explicar)
  btn1.dataset.valor = convertirAValorNumerico(num1);
  btn2.dataset.valor = convertirAValorNumerico(num2);
  btn1.dataset.original = String(num1);
  btn2.dataset.original = String(num2);

  // limpieza visual
  document.getElementById("resultado").textContent = "";
  document.getElementById("explicacion").textContent = "";
  document.getElementById("puntos").textContent = puntos;

  habilitarBotones(true);
}

function convertirAValorNumerico(valor) {
  // Acepta números, strings decimales con coma o punto, o fracciones "a/b"
  if (valor === null || valor === undefined) return NaN;
  // Si es número ya
  if (typeof valor === "number") return valor;

  const str = String(valor).trim();

  // Si es fracción
  if (str.includes("/")) {
    const partes = str.split("/");
    const n = parseFloat(partes[0]);
    const d = parseFloat(partes[1]);
    if (isNaN(n) || isNaN(d) || d === 0) return NaN;
    return n / d;
  }

  // Reemplaza coma por punto y parsea decimal
  const normal = str.replace(",", ".");
  const f = parseFloat(normal);
  return isNaN(f) ? NaN : f;
}

function verificarRespuesta(opcion) {
  if (rondaRespondida) return; // evitar multiple scoring
  const btn1 = document.getElementById("num1");
  const btn2 = document.getElementById("num2");

  const n1 = parseFloat(btn1.dataset.valor);
  const n2 = parseFloat(btn2.dataset.valor);

  const resultado = document.getElementById("resultado");
  const explicacion = document.getElementById("explicacion");

  // Si alguno no es número válido, informar y generar otra ronda
  if (isNaN(n1) || isNaN(n2)) {
    resultado.textContent = "⚠️ Error: uno de los valores no se pudo interpretar. Nueva ronda generada.";
    resultado.style.color = "orange";
    setTimeout(generarNumeros, 1200);
    return;
  }

  // Comparación real
  if ((opcion === "num1" && n1 > n2) || (opcion === "num2" && n2 > n1)) {
    puntos++;
    resultado.textContent = "✅ ¡Correcto!";
    resultado.style.color = "green";
    explicacion.textContent = `Explicación: ${obtenerTextoComparacion(btn1.dataset.original, btn2.dataset.original, n1, n2)}`;
  } else if (n1 === n2) {
    resultado.textContent = "😅 Son iguales.";
    resultado.style.color = "orange";
    explicacion.textContent = `Ambos valen lo mismo: ${n1}`;
  } else {
    resultado.textContent = "❌ Incorrecto.";
    resultado.style.color = "red";
    explicacion.textContent = `Observa el valor: ${obtenerTextoComparacion(btn1.dataset.original, btn2.dataset.original, n1, n2)}`;
  }

  rondaRespondida = true;
  document.getElementById("puntos").textContent = puntos;
  habilitarBotones(false);
}

// Devuelve una explicación legible usando los textos originales y sus valores numéricos
function obtenerTextoComparacion(texto1, texto2, val1, val2) {
  // redondeamos para mostrar con 3 decimales si es necesario
  const v1 = Number.isInteger(val1) ? val1 : Number(val1.toFixed(3));
  const v2 = Number.isInteger(val2) ? val2 : Number(val2.toFixed(3));
  if (v1 > v2) return `${texto1} (${v1}) es mayor que ${texto2} (${v2}).`;
  if (v2 > v1) return `${texto2} (${v2}) es mayor que ${texto1} (${v1}).`;
  return `${texto1} y ${texto2} representan el mismo valor (${v1}).`;
}

// Habilita o deshabilita los botones de números (evita clicks repetidos)
function habilitarBotones(habilitar) {
  const btn1 = document.getElementById("num1");
  const btn2 = document.getElementById("num2");
  if (habilitar) {
    btn1.classList.remove("disabled");
    btn2.classList.remove("disabled");
    btn1.disabled = false;
    btn2.disabled = false;
  } else {
    btn1.classList.add("disabled");
    btn2.classList.add("disabled");
    btn1.disabled = true;
    btn2.disabled = true;
  }
}

// Eventos
document.getElementById("num1").addEventListener("click", () => verificarRespuesta("num1"));
document.getElementById("num2").addEventListener("click", () => verificarRespuesta("num2"));
document.getElementById("nuevo").addEventListener("click", generarNumeros);

// Evaluación final (quiz)
document.getElementById("verificarQuiz").addEventListener("click", () => {
  const respuestasCorrectas = {
    p1: "b", // 7,000 unidades
    p2: "c", // Son iguales
    p3: "b"  // ⅔
  };

  let correctas = 0;
  const preguntas = Object.keys(respuestasCorrectas);

  preguntas.forEach((p) => {
    const opciones = document.querySelectorAll(`input[name="${p}"]`);
    opciones.forEach((op) => {
      op.parentElement.style.color = ""; // resetear color
      if (op.checked) {
        if (op.value === respuestasCorrectas[p]) {
          correctas++;
          op.parentElement.style.color = "green";
        } else {
          op.parentElement.style.color = "red";
        }
      }
    });
  });

  const res = document.getElementById("resultadoQuiz");
  res.innerHTML = `Has respondido correctamente <b>${correctas}</b> de ${preguntas.length} preguntas.`;

  if (correctas === preguntas.length) {
    res.style.color = "green";
    res.innerHTML += "<br>🎉 ¡Excelente trabajo!";
  } else if (correctas >= 2) {
    res.style.color = "orange";
    res.innerHTML += "<br>🙂 Casi perfecto, repasa un poco más.";
  } else {
    res.style.color = "red";
    res.innerHTML += "<br>📘 Vuelve a leer la teoría y vuelve a intentarlo.";
  }
});
=======
// tema1.js - versión corregida y robusta
let puntos = 0;
let rondaRespondida = false;

function generarNumeros() {
  rondaRespondida = false;

  const tipos = ["natural", "decimal", "fraccionario"];
  const tipo = tipos[Math.floor(Math.random() * tipos.length)];

  let num1, num2;

  if (tipo === "natural") {
    num1 = Math.floor(Math.random() * 100);
    num2 = Math.floor(Math.random() * 100);
  } else if (tipo === "decimal") {
    // Generamos como string con punto decimal (2 decimales)
    num1 = (Math.random() * 10).toFixed(2);
    num2 = (Math.random() * 10).toFixed(2);
  } else {
    const fracciones = ["1/2", "1/3", "3/4", "2/5", "5/6", "4/3", "7/8"];
    num1 = fracciones[Math.floor(Math.random() * fracciones.length)];
    num2 = fracciones[Math.floor(Math.random() * fracciones.length)];
  }

  const btn1 = document.getElementById("num1");
  const btn2 = document.getElementById("num2");

  btn1.textContent = num1;
  btn2.textContent = num2;

  // Guardamos tanto el valor numérico (para comparar) como el texto original (para explicar)
  btn1.dataset.valor = convertirAValorNumerico(num1);
  btn2.dataset.valor = convertirAValorNumerico(num2);
  btn1.dataset.original = String(num1);
  btn2.dataset.original = String(num2);

  // limpieza visual
  document.getElementById("resultado").textContent = "";
  document.getElementById("explicacion").textContent = "";
  document.getElementById("puntos").textContent = puntos;

  habilitarBotones(true);
}

function convertirAValorNumerico(valor) {
  // Acepta números, strings decimales con coma o punto, o fracciones "a/b"
  if (valor === null || valor === undefined) return NaN;
  // Si es número ya
  if (typeof valor === "number") return valor;

  const str = String(valor).trim();

  // Si es fracción
  if (str.includes("/")) {
    const partes = str.split("/");
    const n = parseFloat(partes[0]);
    const d = parseFloat(partes[1]);
    if (isNaN(n) || isNaN(d) || d === 0) return NaN;
    return n / d;
  }

  // Reemplaza coma por punto y parsea decimal
  const normal = str.replace(",", ".");
  const f = parseFloat(normal);
  return isNaN(f) ? NaN : f;
}

function verificarRespuesta(opcion) {
  if (rondaRespondida) return; // evitar multiple scoring
  const btn1 = document.getElementById("num1");
  const btn2 = document.getElementById("num2");

  const n1 = parseFloat(btn1.dataset.valor);
  const n2 = parseFloat(btn2.dataset.valor);

  const resultado = document.getElementById("resultado");
  const explicacion = document.getElementById("explicacion");

  // Si alguno no es número válido, informar y generar otra ronda
  if (isNaN(n1) || isNaN(n2)) {
    resultado.textContent = "⚠️ Error: uno de los valores no se pudo interpretar. Nueva ronda generada.";
    resultado.style.color = "orange";
    setTimeout(generarNumeros, 1200);
    return;
  }

  // Comparación real
  if ((opcion === "num1" && n1 > n2) || (opcion === "num2" && n2 > n1)) {
    puntos++;
    resultado.textContent = "✅ ¡Correcto!";
    resultado.style.color = "green";
    explicacion.textContent = `Explicación: ${obtenerTextoComparacion(btn1.dataset.original, btn2.dataset.original, n1, n2)}`;
  } else if (n1 === n2) {
    resultado.textContent = "😅 Son iguales.";
    resultado.style.color = "orange";
    explicacion.textContent = `Ambos valen lo mismo: ${n1}`;
  } else {
    resultado.textContent = "❌ Incorrecto.";
    resultado.style.color = "red";
    explicacion.textContent = `Observa el valor: ${obtenerTextoComparacion(btn1.dataset.original, btn2.dataset.original, n1, n2)}`;
  }

  rondaRespondida = true;
  document.getElementById("puntos").textContent = puntos;
  habilitarBotones(false);
}

// Devuelve una explicación legible usando los textos originales y sus valores numéricos
function obtenerTextoComparacion(texto1, texto2, val1, val2) {
  // redondeamos para mostrar con 3 decimales si es necesario
  const v1 = Number.isInteger(val1) ? val1 : Number(val1.toFixed(3));
  const v2 = Number.isInteger(val2) ? val2 : Number(val2.toFixed(3));
  if (v1 > v2) return `${texto1} (${v1}) es mayor que ${texto2} (${v2}).`;
  if (v2 > v1) return `${texto2} (${v2}) es mayor que ${texto1} (${v1}).`;
  return `${texto1} y ${texto2} representan el mismo valor (${v1}).`;
}

// Habilita o deshabilita los botones de números (evita clicks repetidos)
function habilitarBotones(habilitar) {
  const btn1 = document.getElementById("num1");
  const btn2 = document.getElementById("num2");
  if (habilitar) {
    btn1.classList.remove("disabled");
    btn2.classList.remove("disabled");
    btn1.disabled = false;
    btn2.disabled = false;
  } else {
    btn1.classList.add("disabled");
    btn2.classList.add("disabled");
    btn1.disabled = true;
    btn2.disabled = true;
  }
}

// Eventos
document.getElementById("num1").addEventListener("click", () => verificarRespuesta("num1"));
document.getElementById("num2").addEventListener("click", () => verificarRespuesta("num2"));
document.getElementById("nuevo").addEventListener("click", generarNumeros);

// Evaluación final (quiz)
document.getElementById("verificarQuiz").addEventListener("click", () => {
  const respuestasCorrectas = {
    p1: "b", // 7,000 unidades
    p2: "c", // Son iguales
    p3: "b"  // ⅔
  };

  let correctas = 0;
  const preguntas = Object.keys(respuestasCorrectas);

  preguntas.forEach((p) => {
    const opciones = document.querySelectorAll(`input[name="${p}"]`);
    opciones.forEach((op) => {
      op.parentElement.style.color = ""; // resetear color
      if (op.checked) {
        if (op.value === respuestasCorrectas[p]) {
          correctas++;
          op.parentElement.style.color = "green";
        } else {
          op.parentElement.style.color = "red";
        }
      }
    });
  });

  const res = document.getElementById("resultadoQuiz");
  res.innerHTML = `Has respondido correctamente <b>${correctas}</b> de ${preguntas.length} preguntas.`;

  if (correctas === preguntas.length) {
    res.style.color = "green";
    res.innerHTML += "<br>🎉 ¡Excelente trabajo!";
  } else if (correctas >= 2) {
    res.style.color = "orange";
    res.innerHTML += "<br>🙂 Casi perfecto, repasa un poco más.";
  } else {
    res.style.color = "red";
    res.innerHTML += "<br>📘 Vuelve a leer la teoría y vuelve a intentarlo.";
  }
});
>>>>>>> 6953e1193cc30d017f529228d62f175d0ac7ba82
