
/**
 * @param {HTMLCanvasElement} canvas 
 * @param {Object} grouped 
 */
export function drawBarChart(canvas, grouped) {
  const ctx = canvas.getContext('2d');
  const categories = Object.keys(grouped);
  const values = categories.map(cat => grouped[cat].sum / grouped[cat].count);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const padding = 40;
  const width = canvas.width - padding * 2;
  const height = canvas.height - padding * 2;
  const barWidth = width / categories.length;
  const maxVal = Math.max(...values, 10);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, padding + height);
  ctx.lineTo(padding + width, padding + height);
  ctx.stroke();
  ctx.fillStyle = '#3f51b5';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  categories.forEach((cat, index) => {
    const value = values[index];
    const barHeight = value / maxVal * height;
    const x = padding + index * barWidth + barWidth * 0.1;
    const y = padding + height - barHeight;
    const bw = barWidth * 0.8;
    ctx.fillRect(x, y, bw, barHeight);
    ctx.fillStyle = '#333';
    ctx.save();
    if (categories.length > 6) {
      ctx.translate(x + bw / 2, padding + height + 14);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(cat, 0, 0);
    } else {
      ctx.fillText(cat, x + bw / 2, padding + height + 14);
    }
    ctx.restore();
    // Valor encima de barra
    ctx.fillText(value.toFixed(1), x + bw / 2, y - 4);
    ctx.fillStyle = '#3f51b5';
  });
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.translate(10, padding + height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#333';
  ctx.fillText('Promedio', 0, 0);
  ctx.restore();
}

/**
 * @param {HTMLCanvasElement} canvas 
 * @param {Object} grouped 
 */
export function drawPieChart(canvas, grouped) {
  const ctx = canvas.getContext('2d');
  const categories = Object.keys(grouped);
  const counts = categories.map(cat => grouped[cat].count);
  const total = counts.reduce((a, b) => a + b, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(canvas.width, canvas.height) / 2 - 20;
  let startAngle = 0;
  categories.forEach((cat, index) => {
    const count = counts[index];
    const sliceAngle = (count / total) * Math.PI * 2;
    ctx.fillStyle = index % 2 === 0 ? '#3f51b5' : '#5c6bc0';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fill();
    // Etiqueta
    const midAngle = startAngle + sliceAngle / 2;
    const textX = centerX + (radius + 20) * Math.cos(midAngle);
    const textY = centerY + (radius + 20) * Math.sin(midAngle);
    ctx.fillStyle = '#333';
    ctx.textAlign = midAngle > Math.PI / 2 && midAngle < 3 * Math.PI / 2 ? 'end' : 'start';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${cat} (${count})`, textX, textY);
    startAngle += sliceAngle;
  });
}