
import { getData, addRecord, removeRecord, clearData } from './storage.js';
import { validateRecord, groupByCategory, computeStats, generateInterpretation, convertToCSV } from './utils.js';
import { drawBarChart, drawPieChart } from './charts.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('data-form');
  const categoriaInput = document.getElementById('categoria');
  const valorInput = document.getElementById('valor');
  const fechaInput = document.getElementById('fecha');
  const tablaBody = document.getElementById('tabla-body');
  const promedioSpan = document.getElementById('stat-promedio');
  const maxSpan = document.getElementById('stat-max');
  const minSpan = document.getElementById('stat-min');
  const interpretacionP = document.getElementById('interpretacion');
  const barCanvas = document.getElementById('barChart');
  const pieCanvas = document.getElementById('pieChart');
  const exportBtn = document.getElementById('export-csv');
  const clearBtn = document.getElementById('clear-data');
  const demoBtn = document.getElementById('load-demo');

  renderAll();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const record = {
      id: Date.now().toString(),
      categoria: categoriaInput.value.trim(),
      valor: parseFloat(valorInput.value),
      fecha: fechaInput.value
    };
    const error = validateRecord(record);
    if (error) {
      alert(error);
      return;
    }
    addRecord(record);
    form.reset();
    renderAll();
  });

  tablaBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-button')) {
      const id = e.target.dataset.id;
      removeRecord(id);
      renderAll();
    }
  });

  clearBtn.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que deseas eliminar todos los datos?')) {
      clearData();
      renderAll();
    }
  });

  exportBtn.addEventListener('click', () => {
    const data = getData();
    if (data.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'datos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  demoBtn.addEventListener('click', () => {
    if (confirm('Esto eliminará los datos actuales y cargará un conjunto de demostración. ¿Continuar?')) {
      const demo = generarDemostracion();
      clearData();
      demo.forEach(item => addRecord(item));
      renderAll();
    }
  });

  
  function renderAll() {
    const data = getData();
    renderTable(data);
    const stats = computeStats(data);
    promedioSpan.textContent = data.length ? stats.promedio.toFixed(2) : '-';
    maxSpan.textContent = data.length ? stats.max.toFixed(2) : '-';
    minSpan.textContent = data.length ? stats.min.toFixed(2) : '-';
    const grouped = groupByCategory(data);
    interpretacionP.textContent = generateInterpretation(stats, grouped);
    resizeCanvas(barCanvas);
    resizeCanvas(pieCanvas);
    drawBarChart(barCanvas, grouped);
    drawPieChart(pieCanvas, grouped);
  }

  /**
   * Renderiza la tabla con los datos.
   * @param {Array} data
   */
  function renderTable(data) {
    tablaBody.innerHTML = '';
    data.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.categoria}</td>
        <td>${item.valor.toFixed(2)}</td>
        <td>${item.fecha}</td>
        <td><button class="delete-button" data-id="${item.id}">Eliminar</button></td>
      `;
      tablaBody.appendChild(tr);
    });
  }

  /**
   * @param {HTMLCanvasElement} canvas
   */
  function resizeCanvas(canvas) {
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  }

  /**
   * @returns {Array} Datos de ejemplo.
   */
  function generarDemostracion() {
    const categorias = ['Matemáticas', 'Historia', 'Ciencias', 'Español', 'Geografía'];
    const demoData = [];
    for (let i = 0; i < 15; i++) {
      const cat = categorias[Math.floor(Math.random() * categorias.length)];
      const val = parseFloat((Math.random() * 10).toFixed(2));
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      demoData.push({
        id: Date.now().toString() + i,
        categoria: cat,
        valor: val,
        fecha: date.toISOString().split('T')[0]
      });
    }
    return demoData;
  }
});