// renderBox.js (обновлённый)
/**
 * Render prediction boxes with labels
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} boxes
 */
export const renderBoxes = (ctx, boxes) => {
  const font = `${Math.max(
    Math.round(Math.max(ctx.canvas.width, ctx.canvas.height) / 40),
    14
  )}px Arial`;
  ctx.font = font;
  ctx.textBaseline = "top";

  boxes.forEach((box) => {
    const klass = box.label;
    const color = box.color;
    const score = (box.probability * 100).toFixed(1);
    const [x1, y1, width, height] = box.bounding;

    // Рамка объекта
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(Math.min(ctx.canvas.width, ctx.canvas.height) / 200, 2.5);
    ctx.strokeRect(x1, y1, width, height);

    // Фон подписи
    ctx.fillStyle = color;
    const label = `${klass} ${score}%`;
    const textWidth = ctx.measureText(label).width;
    const textHeight = parseInt(font, 10);
    const yText = y1 - (textHeight + ctx.lineWidth);
    ctx.fillRect(
      x1 - 1,
      yText < 0 ? 0 : yText,
      textWidth + ctx.lineWidth + 8,
      textHeight + ctx.lineWidth
    );

    // Текст подписи
    ctx.fillStyle = "#ffffff";
    ctx.fillText(label, x1 + 3, yText < 0 ? 1 : yText + 1);
  });
};

export class Colors {
  constructor() {
    // Цвета под классы хвойных деревьев: spruce, pine, fir + запасные
    this.palette = [
      "#2E7D32", // spruce (ель)    — тёмно-зелёный
      "#4CAF50", // pine   (сосна)   — зелёный
      "#66BB6A", // fir    (пихта)   — светло-зелёный
      "#1B5E20", // дополнительный зелёный
      "#388E3C", // дополнительный зелёный
      "#43A047", // дополнительный зелёный
      "#81C784",
      "#A5D6A7",
      "#C8E6C9",
      "#2E7D32",
      "#4CAF50",
      "#66BB6A",
      "#1B5E20",
      "#388E3C",
      "#43A047",
      "#689F38",
      "#8BC34A",
      "#9CCC65",
      "#AED581",
      "#DCE775",
    ];
    this.n = this.palette.length;
  }

  get = (i) => this.palette[Math.floor(i) % this.n];

  static hexToRgba = (hex, alpha) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), alpha]
      : null;
  };
}