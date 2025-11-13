/* ===========================
   FUNCIONES DE UTILIDAD
   =========================== */

// Genera un número aleatorio entre min y max (puede ser decimal)
function randomNum(min, max, decimals = 0) {
  const factor = Math.pow(10, decimals);
  return Math.round((Math.random() * (max - min) + min) * factor) / factor;
}

// Elige un elemento aleatorio de una lista
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ===========================
   PROBLEMAS ADITIVOS
   =========================== */

// Genera un problema aditivo con 2 o más transformaciones
function generarProblemaAditivo() {
  const a = randomNum(10, 50);
  const b = randomNum(5, 25);
  const c = randomNum(1, 10);

  const tipo = randomChoice([
    `${a} + ${b} - ${c}`,
    `${a} - ${b} + ${c}`,
    `${a} + ${b} + ${c}`,
  ]);

  const resultado = eval(tipo);
  document.getElementById("add-problem").textContent = `Calcula: ${tipo}`;
  document.getElementById("add-problem").dataset.resultado = resultado;
  document.getElementById("add-output").textContent = "";
  document.getElementById("add-answer").value = "";
}

// Verifica la respuesta del usuario
function comprobarAditivo() {
  const respuesta = parseFloat(document.getElementById("add-answer").value);
  const resultado = parseFloat(
    document.getElementById("add-problem").dataset.resultado
  );
  const salida = document.getElementById("add-output");

  if (respuesta === resultado) {
    salida.textContent = "✅ Correcto. Bien hecho.";
    salida.style.color = "green";
  } else {
    salida.textContent = `❌ Incorrecto. La respuesta era ${resultado}.`;
    salida.style.color = "red";
  }
}

// Da una pista para el problema aditivo
function pistaAditivo() {
  const texto = document.getElementById("add-problem").textContent;
  document.getElementById("add-output").textContent =
    "Pista: resuelve las operaciones paso a paso → " + texto.replace("Calcula: ", "");
}

/* ===========================
   PROBLEMAS MULTIPLICATIVOS / DIVISIÓN
   =========================== */

// Genera un problema contextual de multiplicación o división
function generarProblemaMultiplicativo() {
  const contextos = [
    (a, b) => [`Una caja tiene ${a} manzanas. ¿Cuántas hay en ${b} cajas?`, a * b],
    (a, b) => [`Un pastel se reparte entre ${b} personas. Si el pastel pesa ${a} kg, ¿cuántos kg recibe cada uno?`, a / b],
    (a, b) => [`Un producto cuesta $${a}. Si compras ${b}, ¿cuánto pagas en total?`, a * b],
  ];

  const a = randomNum(2, 20, 1);
  const b = randomNum(2, 10);
  const [texto, resultado] = randomChoice(contextos)(a, b);

  document.getElementById("mul-problem").textContent = texto;
  document.getElementById("mul-problem").dataset.resultado = resultado.toFixed(2);
  document.getElementById("mul-output").textContent = "";
  document.getElementById("mul-answer").value = "";
}

// Verifica la respuesta del usuario
function comprobarMultiplicativo() {
  const respuesta = parseFloat(document.getElementById("mul-answer").value);
  const resultado = parseFloat(
    document.getElementById("mul-problem").dataset.resultado
  );
  const salida = document.getElementById("mul-output");

  if (Math.abs(respuesta - resultado) < 0.01) {
    salida.textContent = "✅ Correcto. ¡Buen trabajo!";
    salida.style.color = "green";
  } else {
    salida.textContent = `❌ Incorrecto. La respuesta era ${resultado}.`;
    salida.style.color = "red";
  }
}

// Da una pista para el problema multiplicativo
function pistaMultiplicativo() {
  document.getElementById("mul-output").textContent =
    "Pista: identifica si el problema requiere multiplicar o dividir antes de operar.";
}

/* ===========================
   HOJA IMPRIMIBLE
   =========================== */

// Genera una pequeña hoja con ejercicios listos para imprimir
function generarHoja() {
  const hoja = document.getElementById("sheet");
  hoja.innerHTML = "<h4>Ejercicios imprimibles</h4>";

  for (let i = 1; i <= 3; i++) {
    hoja.innerHTML += `<p>${i}. ${randomNum(10, 40)} + ${randomNum(5, 20)} - ${randomNum(1, 10)} = _____</p>`;
  }

  hoja.innerHTML += "<hr />";

  for (let i = 1; i <= 3; i++) {
    hoja.innerHTML += `<p>${i}. ${randomNum(2, 10)} × ${randomNum(2, 5)} = _____</p>`;
  }
}

/* ===========================
   EVENTOS PRINCIPALES
   =========================== */
document.getElementById("check-add").addEventListener("click", comprobarAditivo);
document.getElementById("hint-add").addEventListener("click", pistaAditivo);
document.getElementById("new-add").addEventListener("click", generarProblemaAditivo);

document.getElementById("check-mul").addEventListener("click", comprobarMultiplicativo);
document.getElementById("hint-mul").addEventListener("click", pistaMultiplicativo);
document.getElementById("new-mul").addEventListener("click", generarProblemaMultiplicativo);

document.getElementById("generate-sheet").addEventListener("click", generarHoja);

/* ===========================
   INICIALIZACIÓN
   =========================== */
generarProblemaAditivo();
generarProblemaMultiplicativo();
