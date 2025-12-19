
import React, { useState } from 'react';
import { WordData } from '../types';
import WordCard from './WordCard';

interface SavedWordsProps {
  words: WordData[];
  onRemove: (id: string) => void;
  onPlayAudio: (base64: string) => void;
  onPrint: (selectedIds: string[]) => void;
}

const SavedWords: React.FC<SavedWordsProps> = ({ words, onRemove, onPlayAudio, onPrint }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === words.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(words.map(w => w.id));
    }
  };

  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800">هنوز کلمه‌ای ذخیره نکرده‌اید</h3>
        <p className="text-gray-500 mt-2">کلمات جدیدی را جستجو و آن‌ها را ذخیره کنید.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex gap-2">
          <button 
            onClick={selectAll}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            {selectedIds.length === words.length ? 'لغو انتخاب همه' : 'انتخاب همه'}
          </button>
          <span className="text-sm text-gray-500 py-1.5">{selectedIds.length} کلمه انتخاب شده</span>
        </div>
        
        <button 
          onClick={() => onPrint(selectedIds.length > 0 ? selectedIds : words.map(w => w.id))}
          disabled={words.length === 0}
          className="w-full sm:w-auto px-6 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.89l-4.72-4.72a.75.75 0 011.28-.53l4.72 4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25h2.24z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zM14.25 15h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-2.25h.008v.008H16.5V15zm0 2.25h.008v.008H16.5v-.008z" />
            <path d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          چاپ لغات
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {words.map((word) => (
          <div key={word.id} className="relative group">
            <div className="absolute top-4 left-4 z-10">
              <input 
                type="checkbox" 
                checked={selectedIds.includes(word.id)}
                onChange={() => toggleSelection(word.id)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <WordCard 
              word={word} 
              isSaved={true} 
              onRemove={onRemove} 
              onPlayAudio={onPlayAudio}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedWords;
