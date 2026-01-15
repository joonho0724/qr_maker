import { useState, useRef } from 'react';

function QRItem({ item, index, onUpdate, onRemove, canRemove }) {
  const [imagePreview, setImagePreview] = useState(item.imageUrl || null);
  const [imageSize, setImageSize] = useState(item.imageSize || 0.15);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setImagePreview(imageUrl);
        onUpdate(index, { ...item, imageUrl, imageSize });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSizeChange = (e) => {
    const newSize = parseFloat(e.target.value);
    setImageSize(newSize);
    onUpdate(index, { ...item, imageSize: newSize });
  };

  const handleUrlChange = (e) => {
    onUpdate(index, { ...item, url: e.target.value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">QR 코드 #{index + 1}</h3>
        {canRemove && (
          <button
            onClick={() => onRemove(index)}
            className="text-red-500 hover:text-red-700 active:text-red-800 font-medium text-sm sm:text-base px-2 py-1 rounded touch-manipulation min-h-[36px] min-w-[44px]"
          >
            삭제
          </button>
        )}
      </div>

      <div className="space-y-3 sm:space-y-4">
        {/* URL 입력 */}
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            링크 (URL)
          </label>
          <input
            type="url"
            inputMode="url"
            value={item.url || ''}
            onChange={handleUrlChange}
            placeholder="https://example.com"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
          />
        </div>

        {/* 이미지 업로드 */}
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            중앙 이미지
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg text-sm sm:text-base font-medium text-gray-700 transition-colors touch-manipulation min-h-[44px]"
            >
              이미지 선택
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {imagePreview && (
              <div className="flex items-center gap-2 sm:gap-3">
                <img
                  src={imagePreview}
                  alt="미리보기"
                  className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded border border-gray-300 flex-shrink-0"
                />
                <span className="text-xs sm:text-sm text-gray-600">이미지 선택됨</span>
              </div>
            )}
          </div>
        </div>

        {/* 이미지 크기 조절 */}
        {imagePreview && (
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              이미지 크기: <span className="text-indigo-600">{(imageSize * 100).toFixed(0)}%</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="0.3"
              step="0.01"
              value={imageSize}
              onChange={handleImageSizeChange}
              className="w-full h-2 sm:h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
              style={{
                background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${((imageSize - 0.1) / 0.2) * 100}%, #e5e7eb ${((imageSize - 0.1) / 0.2) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1.5">
              <span>작게 (10%)</span>
              <span>크게 (30%)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QRItem;
