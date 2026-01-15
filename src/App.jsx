import { useState } from 'react';
import QRItem from './components/QRItem';
import { generateQRWithImage, dataURLtoBlob } from './utils/qrGenerator';
import JSZip from 'jszip';

function App() {
  const [items, setItems] = useState([
    { url: '', imageUrl: null, imageSize: 0.15 }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrls, setPreviewUrls] = useState({});

  const handleAddItem = () => {
    if (items.length < 10) {
      setItems([...items, { url: '', imageUrl: null, imageSize: 0.15 }]);
    }
  };

  const handleUpdateItem = (index, updatedItem) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    setItems(newItems);
    
    // 미리보기 업데이트
    if (updatedItem.url && updatedItem.imageUrl) {
      generatePreview(index, updatedItem);
    } else {
      setPreviewUrls(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[index];
        return newPreviews;
      });
    }
  };

  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      setPreviewUrls(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[index];
        // 인덱스 재정렬
        const reordered = {};
        newItems.forEach((_, newIndex) => {
          if (prev[newIndex] !== undefined) {
            reordered[newIndex] = prev[newIndex];
          }
        });
        return reordered;
      });
    }
  };

  const generatePreview = async (index, item) => {
    try {
      const dataUrl = await generateQRWithImage(
        item.url,
        item.imageUrl,
        item.imageSize,
        256 // 미리보기는 작은 크기
      );
      setPreviewUrls(prev => ({ ...prev, [index]: dataUrl }));
    } catch (error) {
      console.error('미리보기 생성 실패:', error);
    }
  };

  const handleGenerateAll = async () => {
    // 유효성 검사
    const validItems = items.filter(item => item.url.trim() !== '');
    if (validItems.length === 0) {
      alert('최소 하나의 링크를 입력해주세요.');
      return;
    }

    const itemsWithoutImage = validItems.filter(item => !item.imageUrl);
    if (itemsWithoutImage.length > 0) {
      const confirm = window.confirm(
        `${itemsWithoutImage.length}개의 항목에 이미지가 없습니다. 이미지 없이 생성하시겠습니까?`
      );
      if (!confirm) return;
    }

    setIsGenerating(true);

    try {
      const zip = new JSZip();
      const filePromises = validItems.map(async (item, index) => {
        try {
          let dataUrl;
          if (item.imageUrl) {
            dataUrl = await generateQRWithImage(
              item.url,
              item.imageUrl,
              item.imageSize,
              512 // 최종 생성은 큰 크기
            );
          } else {
            // 이미지가 없는 경우 기본 QR코드 생성
            const QRCode = (await import('qrcode')).default;
            const canvas = document.createElement('canvas');
            await QRCode.toCanvas(canvas, item.url, {
              width: 512,
              margin: 2,
            });
            dataUrl = canvas.toDataURL('image/png');
          }

          const blob = dataURLtoBlob(dataUrl);
          const fileName = `qr-code-${index + 1}.png`;
          
          // 파일이 제대로 생성되었는지 확인
          if (blob && blob.size > 0) {
            zip.file(fileName, blob);
            return { success: true, index: index + 1 };
          } else {
            throw new Error(`QR코드 ${index + 1}의 Blob 생성 실패`);
          }
        } catch (error) {
          console.error(`QR코드 ${index + 1} 생성 실패:`, error);
          return { success: false, index: index + 1, error };
        }
      });

      const results = await Promise.all(filePromises);
      const successCount = results.filter(r => r.success).length;
      
      if (successCount === 0) {
        throw new Error('모든 QR코드 생성에 실패했습니다.');
      }

      // ZIP 파일이 비어있는지 확인
      const fileCount = Object.keys(zip.files).length;
      if (fileCount === 0) {
        throw new Error('ZIP 파일에 추가된 파일이 없습니다.');
      }

      // ZIP 파일 생성 및 다운로드
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      // Blob이 제대로 생성되었는지 확인
      if (!zipBlob || zipBlob.size === 0) {
        throw new Error('ZIP 파일 생성 실패');
      }

      // 다운로드
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-codes-${new Date().getTime()}.zip`;
      document.body.appendChild(a);
      a.click();
      
      // 약간의 지연 후 정리
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

      if (successCount < validItems.length) {
        alert(`${successCount}개의 QR코드가 생성되어 다운로드되었습니다. (일부 실패: ${validItems.length - successCount}개)`);
      } else {
        alert(`${successCount}개의 QR코드가 생성되어 ZIP 파일로 다운로드되었습니다.`);
      }
    } catch (error) {
      console.error('생성 실패:', error);
      alert(`QR코드 생성 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            QR 코드 생성기
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-2">
            링크와 이미지를 입력하여 맞춤형 QR코드를 생성하세요
          </p>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* 입력 영역 */}
          <div className="space-y-3 sm:space-y-4">
            {items.map((item, index) => (
              <div key={index}>
                <QRItem
                  item={item}
                  index={index}
                  onUpdate={handleUpdateItem}
                  onRemove={handleRemoveItem}
                  canRemove={items.length > 1}
                />
                {/* 미리보기 */}
                {previewUrls[index] && (
                  <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-white rounded-lg shadow-md border border-gray-200">
                    <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">미리보기</p>
                    <div className="flex justify-center">
                      <img
                        src={previewUrls[index]}
                        alt={`QR 미리보기 ${index + 1}`}
                        className="w-full max-w-[200px] sm:max-w-xs mx-auto border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* 추가 버튼 */}
            {items.length < 10 && (
              <button
                onClick={handleAddItem}
                className="w-full py-3 sm:py-3.5 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white font-medium text-base sm:text-lg rounded-lg transition-colors flex items-center justify-center gap-2 touch-manipulation min-h-[48px]"
              >
                <span className="text-xl sm:text-2xl">+</span>
                <span>추가</span>
              </button>
            )}

            {items.length >= 10 && (
              <div className="text-center text-sm text-gray-500 py-2">
                최대 10개까지 추가할 수 있습니다.
              </div>
            )}
          </div>

          {/* 안내 영역 */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                사용 방법
              </h2>
              <ol className="space-y-3 text-gray-600">
                <li className="flex gap-2">
                  <span className="font-semibold text-indigo-600">1.</span>
                  <span>링크(URL)를 입력하세요</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-indigo-600">2.</span>
                  <span>중앙에 배치할 이미지를 선택하세요</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-indigo-600">3.</span>
                  <span>이미지 크기를 조절하세요</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-indigo-600">4.</span>
                  <span>필요시 [+추가] 버튼으로 더 추가하세요</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-indigo-600">5.</span>
                  <span>[생성] 버튼을 눌러 QR코드를 다운로드하세요</span>
                </li>
              </ol>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>참고:</strong> 생성된 QR코드는 ZIP 파일로 다운로드되며, 
                  각 파일은 <code className="bg-white px-1 rounded">qr-code-1.png</code>, 
                  <code className="bg-white px-1 rounded">qr-code-2.png</code> 형식으로 저장됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 생성 버튼 */}
        <div className="flex justify-center mt-6 sm:mt-8 px-2">
          <button
            onClick={handleGenerateAll}
            disabled={isGenerating}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:from-indigo-700 active:to-purple-800 text-white font-bold text-base sm:text-lg rounded-lg shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none touch-manipulation min-h-[52px] sm:min-h-[56px]"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                생성 중...
              </span>
            ) : (
              'QR코드 생성'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
