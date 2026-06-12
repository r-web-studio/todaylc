import uz from './uz.json';
import ru from './ru.json';
import en from './en.json';

export type Language = 'uz' | 'ru' | 'en';

const translations: Record<Language, Record<string, unknown>> = { uz, ru, en };

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function t(key: string, lang: Language, vars?: Record<string, string | number>): string {
  const langData = translations[lang];
  if (!langData) return key;

  let value = getNestedValue(langData, key);

  if (value === undefined) {
    const fallback = getNestedValue(translations.en, key);
    value = fallback ?? key;
  }

  let result = String(value);

  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      result = result.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
    }
  }

  return result;
}

export function getAvailableLanguages(): { code: Language; flag: string; name: string }[] {
  return [
    { code: 'uz', flag: '🇺🇿', name: "O'zbekcha" },
    { code: 'ru', flag: '🇷🇺', name: 'Русский' },
    { code: 'en', flag: '🇬🇧', name: 'English' },
  ];
}

export function getLanguageFlag(code: Language): string {
  const map: Record<Language, string> = { uz: '🇺🇿', ru: '🇷🇺', en: '🇬🇧' };
  return map[code];
}
