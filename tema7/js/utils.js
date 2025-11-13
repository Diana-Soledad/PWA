

/**
 * @param {Object} record
 * @returns {string|null} 
 */
export function validateRecord(record) {
  if (!record.categoria || record.categoria.trim() === '') {
    return 'La categoría es obligatoria.';
  }
  if (typeof record.valor !== 'number' || isNaN(record.valor)) {
    return 'El valor debe ser un número válido.';
  }
  if (record.valor < 0) {
    return 'El valor no puede ser negativo.';
  }
  if (!record.fecha) {
    return 'La fecha es obligatoria.';
  }
  const date = new Date(record.fecha);
  if (isNaN(date.getTime())) {
    return 'La fecha no es válida.';
  }
  return null;
}

/**
 * @param {Array} data
 * @returns {Object} 
 */
export function groupByCategory(data) {
  return data.reduce((acc, item) => {
    const key = item.categoria;
    if (!acc[key]) {
      acc[key] = { count: 0, sum: 0 };
    }
    acc[key].count += 1;
    acc[key].sum += item.valor;
    return acc;
  }, {});
}

/**
 * @param {Array} data
 * @returns {Object} 
 */
export function computeStats(data) {
  if (data.length === 0) {
    return { promedio: 0, max: 0, min: 0 };
  }
  const valores = data.map(item => item.valor);
  const sum = valores.reduce((a, b) => a + b, 0);
  const promedio = sum / valores.length;
  const max = Math.max(...valores);
  const min = Math.min(...valores);
  return { promedio, max, min };
}

/**
 * @param {Object} stats 
 * @param {Object} grouped 
 * @returns {string} 
 */
export function generateInterpretation(stats, grouped) {
  const categorias = Object.keys(grouped);
  if (categorias.length === 0) {
    return 'No hay datos para interpretar.';
  }
  const promediosCat = categorias.map(cat => {
    return {
      categoria: cat,
      promedio: grouped[cat].sum / grouped[cat].count
    };
  });
  promediosCat.sort((a, b) => b.promedio - a.promedio);
  const mejor = promediosCat[0];
  const peor = promediosCat[promediosCat.length - 1];
  let mensaje = `Promedio general: ${stats.promedio.toFixed(2)}.\n`;
  mensaje += `Mejor categoría: ${mejor.categoria} (${mejor.promedio.toFixed(2)}).\n`;
  if (promediosCat.length > 1) {
    mensaje += `Categoría a mejorar: ${peor.categoria} (${peor.promedio.toFixed(2)}).`;
  }
  return mensaje;
}

/**
 * @param {Array} data
 * @returns {string} 
 */
export function convertToCSV(data) {
  const headers = ['Categoria', 'Valor', 'Fecha'];
  const lines = data.map(item => {
    return `${escapeCSV(item.categoria)},${item.valor},${item.fecha}`;
  });
  return headers.join(',') + '\n' + lines.join('\n');
}

function escapeCSV(value) {
  if (typeof value !== 'string') return value;
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}