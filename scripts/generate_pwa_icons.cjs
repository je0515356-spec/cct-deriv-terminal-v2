const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Simple CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcPayload = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(crcPayload);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, crcPayload, crcBuf]);
}

function generatePNG(width, height, isMaskable = false) {
  // Generate RGBA buffer
  const stride = width * 4 + 1; // 1 filter byte per scanline
  const raw = Buffer.alloc(stride * height);

  const cx = width / 2;
  const cy = height / 2;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * stride;
    raw[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Dark futuristic gradient background
      let r = 7;
      let g = 11;
      let b = 20;

      // Distance from center
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Subtle cyan radial ambient glow in center
      if (dist < 0.75) {
        const glowFactor = (1 - dist / 0.75) * 0.4;
        r = Math.min(255, Math.floor(r + 0 * glowFactor));
        g = Math.min(255, Math.floor(g + 180 * glowFactor));
        b = Math.min(255, Math.floor(b + 254 * glowFactor));
      }

      // Draw Crown silhouette
      // Map x, y into normalized coordinates [-1, 1]
      const nx = (x - cx) / (cx * (isMaskable ? 0.6 : 0.75));
      const ny = (y - (cy - (isMaskable ? 10 : 20))) / (cy * (isMaskable ? 0.6 : 0.75));

      // Crown points geometry
      const inCrown =
        ny >= -0.2 &&
        ny <= 0.6 &&
        Math.abs(nx) <= 0.7 &&
        (ny >= 0.35 || // base
          (ny >= -0.6 * Math.abs(nx) && Math.abs(nx) <= 0.2) || // center peak
          (Math.abs(nx) >= 0.4 && ny >= -0.4)); // side peaks

      // Crown base band
      const inBand = ny >= 0.45 && ny <= 0.65 && Math.abs(nx) <= 0.72;

      // Jewels atop peaks
      const dCenterPeak = Math.sqrt(nx * nx + (ny + 0.25) * (ny + 0.25));
      const dLeftPeak = Math.sqrt((nx + 0.6) * (nx + 0.6) + (ny + 0.1) * (ny + 0.1));
      const dRightPeak = Math.sqrt((nx - 0.6) * (nx - 0.6) + (ny + 0.1) * (ny + 0.1));

      if (dCenterPeak < 0.12 || dLeftPeak < 0.09 || dRightPeak < 0.09) {
        // Gold jewel
        r = 251;
        g = 191;
        b = 36;
      } else if (inBand) {
        // Crown cyan band with glow
        r = 0;
        g = 242;
        b = 254;
      } else if (inCrown) {
        // Crown cyan body
        r = 56;
        g = 189;
        b = 248;
      }

      // Safe outer squircle mask if not maskable
      let a = 255;
      if (!isMaskable) {
        // Rounded corners
        const cornerDist = Math.max(Math.abs(dx), Math.abs(dy));
        if (cornerDist > 0.98) a = 0;
      }

      raw[pxOffset] = r;
      raw[pxOffset + 1] = g;
      raw[pxOffset + 2] = b;
      raw[pxOffset + 3] = a;
    }
  }

  // PNG Signature
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type 6: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', zlib.deflateSync(raw, { level: 9 }));
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generatePNG(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generatePNG(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePNG(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generatePNG(512, 512, true));

console.log('Successfully generated PWA PNG icons in public/ !');
