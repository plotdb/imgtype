const getColorMode = async (input) => {
  let uint8;

  // --- 1. 資料來源處理 ---
  if (typeof input === 'string') {
    if (typeof process !== 'undefined' && process.env) {
      const fs = require('fs');
      const fd = fs.openSync(input, 'r');
      const tempBuf = Buffer.alloc(1048576); // 增加到 1MB
      const bytesRead = fs.readSync(fd, tempBuf, 0, 1048576, 0);
      fs.closeSync(fd);
      uint8 = new Uint8Array(tempBuf.buffer, 0, bytesRead);
    } else {
      throw new Error("Browser environment does not support file paths.");
    }
  } else if (typeof Blob !== 'undefined' && input instanceof Blob) {
    const arrayBuffer = await input.slice(0, 1048576).arrayBuffer();
    uint8 = new Uint8Array(arrayBuffer);
  } else {
    // 處理 Node.js Buffer 或 Uint8Array
    uint8 = new Uint8Array(input);
  }

  // --- 2. 建立 DataView ---
  const view = new DataView(uint8.buffer, uint8.byteOffset, uint8.byteLength);

  // --- 3. 解析邏輯 ---
  if (view.byteLength < 2 || view.getUint16(0) !== 0xFFD8) {
    if (view.byteLength > 8 && view.getUint32(0) === 0x89504E47) {
      const colorType = view.getUint8(25);
      return (colorType === 0 || colorType === 4) ? 'grayscale' : 'rgb';
    }
    return 'unknown';
  }

  let offset = 2;
  let isAdobeCMYK = false;

  while (offset < view.byteLength - 4) {
    const marker = view.getUint16(offset);

    // 如果不是有效的 Marker (0xFFxx)
    if ((marker & 0xFF00) !== 0xFF00) {
      offset++; // 嘗試逐位元組搜尋下一個 0xFF
      continue;
    }

    // 這些是沒有長度參數的 Marker
    if (marker === 0xFF01 || (marker >= 0xFFD0 && marker <= 0xFFD7)) {
      offset += 2;
      continue;
    }
    
    // 遇到內嵌縮圖開頭，不停止，繼續往後找真正的 SOF
    if (marker === 0xFFD8) {
      offset += 2;
      continue;
    }

    // 避免讀取長度時越界
    if (offset + 4 > view.byteLength) break;
    const length = view.getUint16(offset + 2);

    // 檢查 Adobe APP14 (如你 Hex 中的 0x0455 處)
    if (marker === 0xFFEE && length >= 12) {
      const transform = view.getUint8(offset + 15);
      if (transform === 2 || transform === 0) isAdobeCMYK = true;
    }

    // 檢查 SOF (如你 Hex 中的 0x04EB 處)
    if (marker >= 0xFFC0 && marker <= 0xFFCF && ![0xFFC4, 0xFFC8, 0xFFCC].includes(marker)) {
      const components = view.getUint8(offset + 9);
      if (components === 4) return 'cmyk';
      // 針對某些 Photoshop 產出的 3 通道 JPEG 且帶有 Adobe CMYK 標記的情況
      if (components === 3) return isAdobeCMYK ? 'cmyk' : 'rgb';
      if (components === 1) return 'grayscale';
      break;
    }

    // 安全跳轉
    offset += (length + 2);
  }

  return 'unknown';
};