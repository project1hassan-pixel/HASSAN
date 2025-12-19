
import React, { useState, useEffect, useCallback } from 'react';
import { WordData, AppTab } from './types';
import { fetchWordInfo, generateWordImage, generateSpeech } from './services/geminiService';
import WordCard from './components/WordCard';
import SavedWords from './components/SavedWords';

const STORAGE_KEY = 'lingosnap_saved_words';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('search');
  const [query, setQuery] = useState('');
  const [currentWord, setCurrentWord] = useState<WordData | null>(null);
  const [savedWords, setSavedWords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved words from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedWords(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved words", e);
      }
    }
  }, []);

  // Save to localStorage whenever savedWords changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedWords));
  }, [savedWords]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setCurrentWord(null);

    try {
      // Step 1: Get Translation, Phonetic & Example
      const info = await fetchWordInfo(query);
      
      // Step 2 & 3: Generate Image & Audio in parallel
      const [imageUrl, audioBase64] = await Promise.all([
        generateWordImage(info.illustrationPrompt),
        generateSpeech(query)
      ]);

      const newWord: WordData = {
        id: Date.now().toString(),
        english: query.toLowerCase(),
        persianMeaning: info.persianMeaning,
        persianPhonetic: info.persianPhonetic,
        exampleSentence: info.exampleSentence,
        exampleTranslation: info.exampleTranslation,
        imageUrl,
        audioBase64,
        createdAt: Date.now(),
      };

      setCurrentWord(newWord);
    } catch (err: any) {
      setError('متأسفانه کلمه مورد نظر پیدا نشد یا خطایی در سیستم رخ داد.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (word: WordData) => {
    if (savedWords.some(w => w.english === word.english)) {
      alert('این کلمه قبلاً ذخیره شده است.');
      return;
    }
    setSavedWords(prev => [word, ...prev]);
  };

  const handleRemove = (id: string) => {
    setSavedWords(prev => prev.filter(w => w.id !== id));
  };

  const playAudio = useCallback((base64: string) => {
    const audio = new Audio(`data:audio/pcm;base64,${base64}`);
    // Native Speech Fallback as simple implementation
    const utterance = new SpeechSynthesisUtterance(currentWord?.english || query);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }, [currentWord, query]);

  const handlePrint = (ids: string[]) => {
    const wordsToPrint = savedWords.filter(w => ids.includes(w.id));
    if (wordsToPrint.length === 0) return;

    // Create a printable window content
    const printContent = document.createElement('div');
    printContent.className = 'p-8 space-y-8 rtl';
    printContent.dir = 'rtl';
    
    wordsToPrint.forEach(word => {
      const item = document.createElement('div');
      item.className = 'flex border-b pb-8 mb-4 gap-8 items-start';
      item.innerHTML = `
        <img src="${word.imageUrl}" style="width: 140px; height: 140px; object-fit: contain; border: 1px solid #eee; padding: 10px; border-radius: 12px;" />
        <div style="flex: 1; text-align: right;">
          <h2 style="font-size: 28px; font-weight: bold; margin: 0; text-transform: capitalize; text-align: left;">${word.english}</h2>
          <p style="font-size: 24px; color: #2563eb; font-weight: bold; margin: 8px 0;">${word.persianMeaning}</p>
          <p style="color: #6b7280; font-size: 16px; margin-bottom: 12px;">تلفظ: ${word.persianPhonetic}</p>
          <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border-right: 4px solid #3b82f6;">
            <p style="font-size: 14px; font-weight: bold; color: #94a3b8; margin: 0 0 4px 0; text-transform: uppercase; text-align: left;">Example</p>
            <p style="font-size: 18px; margin: 0 0 8px 0; font-style: italic; text-align: left;">"${word.exampleSentence}"</p>
            <p style="font-size: 16px; color: #1e40af; margin: 0;">${word.exampleTranslation}</p>
          </div>
        </div>
      `;
      printContent.appendChild(item);
    });

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <html>
          <head>
            <title>LingoSnap - لغات من</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap');
              body { font-family: 'Vazirmatn', sans-serif; margin: 0; padding: 0; }
              .rtl { direction: rtl; text-align: right; }
              @page { margin: 15mm; size: A4; }
              h1 { border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 30px; text-align: center; }
            </style>
          </head>
          <body>
            <h1>لیست لغات انگلیسی من</h1>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      win.document.close();
      // Delay print to ensure fonts/images load
      setTimeout(() => {
        win.print();
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold italic">L</div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">LingoSnap</h1>
          </div>
          <nav className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('search')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'search' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              جستجو
            </button>
            <button 
              onClick={() => setActiveTab('saved')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'saved' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              ذخیره شده‌ها
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-8">
        {activeTab === 'search' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type an English word... (e.g. Apple)"
                className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <button 
                type="submit"
                disabled={loading || !query}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                جستجو
              </button>
            </form>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="text-center rtl">
                  <p className="text-gray-600 font-medium">در حال تحلیل کلمه و تولید مثال و تصویر...</p>
                  <p className="text-gray-400 text-sm mt-1">این فرآیند چند لحظه زمان می‌برد</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-600 flex items-center gap-3 rtl text-right">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Search Result */}
            {currentWord && !loading && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <WordCard 
                  word={currentWord} 
                  onSave={handleSave} 
                  isSaved={savedWords.some(w => w.english === currentWord.english)} 
                  onPlayAudio={playAudio}
                />
              </div>
            )}

            {/* Empty State */}
            {!currentWord && !loading && !error && (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                <img src="https://picsum.photos/seed/learn/200/200" alt="Learn" className="w-32 h-32 rounded-full mb-6 grayscale" />
                <h3 className="text-lg font-medium text-gray-700">کلمه‌ای برای یادگیری وارد کنید</h3>
                <p className="text-gray-500 max-w-xs mx-auto mt-2">معنی، تلفظ، مثال کاربردی و تصویر اختصاصی را دریافت کنید.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <SavedWords 
              words={savedWords} 
              onRemove={handleRemove} 
              onPlayAudio={playAudio} 
              onPrint={handlePrint}
            />
          </div>
        )}
      </main>

      {/* Floating Action Button (Mobile Only) */}
      <div className="fixed bottom-6 right-6 md:hidden no-print">
        <button 
          onClick={() => setActiveTab('search')}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default App;
