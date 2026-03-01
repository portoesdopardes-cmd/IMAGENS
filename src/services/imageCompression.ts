export async function compressBase64ToWebP(base64: string, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas rendering context unavailable'));
        return;
      }
      ctx.drawImage(image, 0, 0);
      resolve(canvas.toDataURL('image/webp', quality));
    };
    image.onerror = reject;
    image.src = base64;
  });
}
