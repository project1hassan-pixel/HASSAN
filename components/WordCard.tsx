
import React from 'react';
import { WordData } from '../types';

interface WordCardProps {
  word: WordData;
  onSave?: (word: WordData) => void;
  onRemove?: (id: string) => void;
  isSaved: boolean;
  onPlayAudio: (base64: string) => void;
}

const WordCard: React.FC<WordCardProps> = ({ word, onSave, onRemove, isSaved, onPlayAudio }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-48 h-48 bg-gray-50 flex items-center justify-center">
          <img 
            src={word.imageUrl} 
            alt={word.english} 
            className="w-full h-full object-contain p-4"
          />
        </div>
        
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 capitalize">{word.english}</h2>
                <div className="rtl text-right mt-1">
                  <p className="text-2xl font-bold text-blue-600 mb-1">{word.persianMeaning}</p>
                  <p className="text-gray-500 text-sm font-medium">تلفظ: <span className="bg-gray-100 px-2 py-0.5 rounded">{word.persianPhonetic}</span></p>
                </div>
              </div>
              <button 
                onClick={() => word.audioBase64 && onPlayAudio(word.audioBase64)}
                className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                title="Listen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                </svg>
              </button>
            </div>
            
            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
              <p className="text-sm font-semibold text-gray-400 mb-1 uppercase tracking-wider">Example</p>
              <p className="text-gray-700 italic font-medium leading-relaxed mb-2">"{word.exampleSentence}"</p>
              <div className="rtl text-right">
                <p className="text-blue-700/80 text-sm leading-relaxed">{word.exampleTranslation}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            {isSaved ? (
              <button 
                onClick={() => onRemove && onRemove(word.id)}
                className="flex-1 py-2 px-4 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                حذف
              </button>
            ) : (
              <button 
                onClick={() => onSave && onSave(word)}
                className="flex-1 py-2 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
                ذخیره کلمه
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCard;
