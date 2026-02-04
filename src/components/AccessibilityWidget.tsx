import { useState } from 'react';
import { Accessibility, X, Type, Sun, Globe } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';

type FontSize = 'small' | 'medium' | 'large';

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [highContrast, setHighContrast] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const handleFontSize = (size: FontSize) => {
    setFontSize(size);
    const root = document.documentElement;
    switch (size) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'medium':
        root.style.fontSize = '16px';
        break;
      case 'large':
        root.style.fontSize = '20px';
        break;
    }
  };

  const handleHighContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle('high-contrast');
  };

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label={t('accessibility')}
        className="fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center transition-all active:scale-95 hover:bg-primary/90"
        style={{ boxShadow: '0 4px 20px rgba(185, 28, 28, 0.4)' }}
      >
        <Accessibility className="w-7 h-7" />
      </button>

      {/* Panel Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-3xl p-6 animate-slide-up max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Accessibility className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">{t('accessibility')}</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label={t('close')}
                className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center active:bg-secondary/80"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>

            {/* Font Size Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Type className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">{t('font_size')}</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFontSize(size)}
                    className={`py-4 px-4 rounded-xl font-semibold transition-all ${
                      fontSize === size
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <span className={size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-base'}>
                      {t(size)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Sun className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">{t('high_contrast')}</span>
              </div>
              <button
                onClick={handleHighContrast}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-between ${
                  highContrast
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                <span>{t('high_contrast')}</span>
                <div className={`w-12 h-7 rounded-full transition-colors ${highContrast ? 'bg-white/30' : 'bg-muted'}`}>
                  <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform mt-0.5 ${highContrast ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </button>
            </div>

            {/* Language Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">{t('language')}</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`py-4 px-6 rounded-xl font-semibold transition-all flex items-center gap-4 ${
                      language === lang.code
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Safe area padding for mobile */}
            <div className="h-8 safe-area-bottom" />
          </div>
        </div>
      )}
    </>
  );
}
