
const STORAGE_KEY = 'viz-datos';

/**
 * @returns {Array} 
 */
export function getData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Error al leer datos del almacenamiento:', error);
    return [];
  }
}

/**
 * @param {Array} data 
 */
export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error al guardar datos en el almacenamiento:', error);
  }
}

/**
 * @param {Object} record 
 */
export function addRecord(record) {
  const data = getData();
  data.push(record);
  saveData(data);
}

/**
 * @param {string} id 
 */
export function removeRecord(id) {
  let data = getData();
  data = data.filter(item => item.id !== id);
  saveData(data);
}

export function clearData() {
  saveData([]);
}