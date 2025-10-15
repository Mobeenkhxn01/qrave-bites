import QRCode from "qrcode";

interface GenerateQrOptions {
  tableNumber: number | string;
  menuUrl: string;
  logoUrl: string;
}

export async function generateCustomQR({ tableNumber, menuUrl, logoUrl }: GenerateQrOptions) {
  // 1. Generate QR Code Data URL
  const qrCanvas = document.createElement("canvas");
  await QRCode.toCanvas(qrCanvas, menuUrl, {
    margin: 1,
    width: 300,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  const qrSize = 300;
  const padding = 40;
  const totalWidth = qrSize + padding * 2;
  const totalHeight = qrSize + padding * 2 + 60; // extra for logo/text

  // 2. Create final canvas with background
  const canvas = document.createElement("canvas");
  canvas.width = totalWidth;
  canvas.height = totalHeight;
  const ctx = canvas.getContext("2d")!;

  // Fill background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  // 3. Draw QR code in center
  ctx.drawImage(qrCanvas, padding, padding);

  // 4. Add Logo (optional)
  const logoImg = new Image();
  logoImg.crossOrigin = "anonymous";
  logoImg.src = logoUrl;

  await new Promise((resolve) => {
    logoImg.onload = () => {
      const logoSize = 50;
      const x = totalWidth / 2 - logoSize / 2;
      const y = padding + qrSize / 2 - logoSize / 2;
      ctx.drawImage(logoImg, x, y, logoSize, logoSize);
      resolve(true);
    };
  });

  // 5. Add Table Number or Website Text
  ctx.fillStyle = "#000";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`Table ${tableNumber}`, totalWidth / 2, totalHeight - 20);

  // 6. Convert canvas to image URL
  const finalImageUrl = canvas.toDataURL("image/png");
  return finalImageUrl;
}
