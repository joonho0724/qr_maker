import QRCode from 'qrcode';

/**
 * QR코드를 생성하고 중앙에 이미지를 배치합니다.
 * @param {string} url - QR코드에 인코딩할 URL
 * @param {string} imageUrl - 중앙에 배치할 이미지 URL
 * @param {number} imageSize - 이미지 크기 (QR코드 크기 대비 비율, 0.1 ~ 0.3)
 * @param {number} qrSize - QR코드 크기 (픽셀)
 * @returns {Promise<string>} - Data URL (PNG)
 */
export async function generateQRWithImage(url, imageUrl, imageSize = 0.15, qrSize = 512) {
  // QR코드 생성 (Canvas)
  const canvas = document.createElement('canvas');
  await QRCode.toCanvas(canvas, url, {
    width: qrSize,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });

  const ctx = canvas.getContext('2d');
  const qrImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // 이미지 로드
  const img = new Image();
  img.crossOrigin = 'anonymous';
  
  return new Promise((resolve, reject) => {
    img.onload = () => {
      // 이미지 크기 계산
      const imageDisplaySize = Math.floor(qrSize * imageSize);
      
      // 중앙 위치 계산
      const centerX = Math.floor(canvas.width / 2);
      const centerY = Math.floor(canvas.height / 2);
      const imageX = centerX - Math.floor(imageDisplaySize / 2);
      const imageY = centerY - Math.floor(imageDisplaySize / 2);

      // 최종 캔버스 생성
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = qrSize;
      finalCanvas.height = qrSize;
      const finalCtx = finalCanvas.getContext('2d');
      
      // 1. 하얀 배경 그리기
      finalCtx.fillStyle = '#FFFFFF';
      finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      
      // 2. QR코드 그리기
      finalCtx.putImageData(qrImageData, 0, 0);
      
      // 3. 중앙 영역의 QR코드 패턴을 하얀색으로 완전히 덮기 (이미지 뒷배경)
      const padding = 10; // 이미지 주변 여백
      finalCtx.fillStyle = '#FFFFFF';
      finalCtx.fillRect(
        imageX - padding,
        imageY - padding,
        imageDisplaySize + padding * 2,
        imageDisplaySize + padding * 2
      );
      
      // 4. 이미지 그리기 (하얀 배경 위에)
      finalCtx.drawImage(
        img,
        imageX,
        imageY,
        imageDisplaySize,
        imageDisplaySize
      );

      resolve(finalCanvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      reject(new Error('이미지 로드 실패'));
    };

    if (imageUrl.startsWith('data:')) {
      img.src = imageUrl;
    } else {
      // 외부 이미지의 경우 CORS 문제를 피하기 위해 proxy 사용하거나
      // 사용자가 직접 업로드한 이미지를 사용
      img.src = imageUrl;
    }
  });
}

/**
 * Data URL을 Blob으로 변환
 */
export function dataURLtoBlob(dataURL) {
  try {
    if (!dataURL || typeof dataURL !== 'string') {
      throw new Error('유효하지 않은 Data URL');
    }

    const arr = dataURL.split(',');
    if (arr.length !== 2) {
      throw new Error('Data URL 형식이 올바르지 않습니다');
    }

    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error('MIME 타입을 찾을 수 없습니다');
    }

    const mime = mimeMatch[1];
    const base64Data = arr[1];
    
    // Base64 디코딩
    const bstr = atob(base64Data);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    
    const blob = new Blob([u8arr], { type: mime });
    
    if (blob.size === 0) {
      throw new Error('Blob 크기가 0입니다');
    }
    
    return blob;
  } catch (error) {
    console.error('Data URL to Blob 변환 실패:', error);
    throw error;
  }
}
