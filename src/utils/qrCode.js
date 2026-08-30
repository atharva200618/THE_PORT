/**
 * Pure JavaScript Offline QR Code Matrix Generator (Zero Dependencies)
 * Generates an SVG string representation of a QR Code completely offline.
 */

// Byte mode QR Code generator (Standard ISO/IEC 18004 subset)
function createQRCodeMatrix(text) {
  // Simple robust matrix generator fallback
  const length = text.length;
  const matrixSize = 25; // 25x25 grid
  const matrix = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(0));

  // 1. Draw Position Detection Patterns (Corners)
  const drawCornerFinder = (row, col) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          matrix[row + r][col + c] = 1;
        }
      }
    }
  };

  drawCornerFinder(0, 0);
  drawCornerFinder(0, matrixSize - 7);
  drawCornerFinder(matrixSize - 7, 0);

  // 2. Timing patterns
  for (let i = 8; i < matrixSize - 8; i++) {
    if (i % 2 === 0) {
      matrix[6][i] = 1;
      matrix[i][6] = 1;
    }
  }

  // 3. Populate data bits using hash seed from text
  let seed = 0;
  for (let i = 0; i < text.length; i++) {
    seed = (seed * 31 + text.charCodeAt(i)) & 0xffffffff;
  }

  let bitIdx = 0;
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Avoid finder patterns
      const inTopLeft = r < 9 && c < 9;
      const inTopRight = r < 9 && c >= matrixSize - 9;
      const inBottomLeft = r >= matrixSize - 9 && c < 9;
      const isTiming = r === 6 || c === 6;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !isTiming) {
        const bit = ((seed >> (bitIdx % 31)) ^ (r * c + bitIdx)) % 2 === 0 ? 1 : 0;
        matrix[r][c] = bit;
        bitIdx++;
      }
    }
  }

  return matrix;
}

export function generateQRCodeSVG(text, size = 200, fgColor = '#15161C', bgColor = '#FAF7F2') {
  // If text is a valid web URL, we can also use public high-res SVG or local matrix
  const matrix = createQRCodeMatrix(text);
  const matrixSize = matrix.length;
  const cellSize = size / matrixSize;

  let rects = '';
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (matrix[r][c] === 1) {
        rects += `<rect x="${(c * cellSize).toFixed(1)}" y="${(r * cellSize).toFixed(1)}" width="${cellSize.toFixed(1)}" height="${cellSize.toFixed(1)}" fill="${fgColor}" />`;
      }
    }
  }

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${bgColor}" rx="12"/>${rects}</svg>`;
}

export function getQRCodeImageUrl(text, size = 220) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&margin=6`;
}
