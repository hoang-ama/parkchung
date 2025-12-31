// File: client/host/src/components/LanguageSwitcher.tsx

import { useLanguage } from '../i18n';

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-1">
            <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-sm rounded transition-colors ${language === 'en'
                        ? 'text-emerald-400 font-bold'
                        : 'text-gray-400 hover:text-white'
                    }`}
            >
                EN
            </button>
            <span className="text-gray-600">/</span>
            <button
                onClick={() => setLanguage('vi')}
                className={`px-2 py-1 text-sm rounded transition-colors ${language === 'vi'
                        ? 'text-emerald-400 font-bold'
                        : 'text-gray-400 hover:text-white'
                    }`}
            >
                VI
            </button>
        </div>
    );
}
