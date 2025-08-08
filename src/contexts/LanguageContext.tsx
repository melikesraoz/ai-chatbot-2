import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type Language = 'tr' | 'en' | 'de' | 'ru'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  tr: {
    'new_chat': 'Yeni Sohbet',
    'chats': 'Sohbetler',
    'welcome_title': 'Bugün programda ne var?',
    'welcome_subtitle': 'Size nasıl yardımcı olabilirim?',
    'input_placeholder': 'Herhangi bir şey sor...',
    'send': 'Gönder',
    'typing': 'Yazıyor',
    'error_message': 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
    'chat': 'Sohbet',
    'hotel': 'Otel',
    'medical': 'Medikal',
    'settings': 'Ayarlar',
    'close': 'Kapat',
    'no_chats': 'Henüz sohbet yok',
    'delete_chat': 'Sohbeti sil',
    'edit_chat': 'Sohbeti düzenle',
    'clear_chat': 'Sohbeti temizle',
    'edit_message': 'Düzenle',
    'delete_message': 'Sil',
    'regenerate_response': 'Yeniden Yanıtla',
    'save': 'Kaydet',
    'cancel': 'İptal',
    'edited': 'düzenlendi',
    'options': 'Seçenekler'
  },
  en: {
    'new_chat': 'New Chat',
    'chats': 'Chats',
    'welcome_title': 'What\'s on the program today?',
    'welcome_subtitle': 'How can I help you?',
    'input_placeholder': 'Ask anything...',
    'send': 'Send',
    'typing': 'Typing',
    'error_message': 'Sorry, an error occurred. Please try again.',
    'chat': 'Chat',
    'hotel': 'Hotel',
    'medical': 'Medical',
    'settings': 'Settings',
    'close': 'Close',
    'no_chats': 'No chats yet',
    'delete_chat': 'Delete chat',
    'edit_chat': 'Edit chat',
    'clear_chat': 'Clear chat',
    'edit_message': 'Edit',
    'delete_message': 'Delete',
    'regenerate_response': 'Regenerate Response',
    'save': 'Save',
    'cancel': 'Cancel',
    'edited': 'edited',
    'options': 'Options'
  },
  de: {
    'new_chat': 'Neuer Chat',
    'chats': 'Chats',
    'welcome_title': 'Was steht heute auf dem Programm?',
    'welcome_subtitle': 'Wie kann ich Ihnen helfen?',
    'input_placeholder': 'Fragen Sie etwas...',
    'send': 'Senden',
    'typing': 'Schreibt',
    'error_message': 'Entschuldigung, ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    'chat': 'Chat',
    'hotel': 'Hotel',
    'medical': 'Medizinisch',
    'settings': 'Einstellungen',
    'close': 'Schließen',
    'no_chats': 'Noch keine Chats',
    'delete_chat': 'Chat löschen',
    'edit_chat': 'Chat bearbeiten',
    'clear_chat': 'Chat leeren',
    'edit_message': 'Bearbeiten',
    'delete_message': 'Löschen',
    'regenerate_response': 'Antwort neu generieren',
    'save': 'Speichern',
    'cancel': 'Abbrechen',
    'edited': 'bearbeitet',
    'options': 'Optionen'
  },
  ru: {
    'new_chat': 'Новый чат',
    'chats': 'Чаты',
    'welcome_title': 'Что на программе сегодня?',
    'welcome_subtitle': 'Как я могу вам помочь?',
    'input_placeholder': 'Спросите что-нибудь...',
    'send': 'Отправить',
    'typing': 'Печатает',
    'error_message': 'Извините, произошла ошибка. Пожалуйста, попробуйте еще раз.',
    'chat': 'Чат',
    'hotel': 'Отель',
    'medical': 'Медицинский',
    'settings': 'Настройки',
    'close': 'Закрыть',
    'no_chats': 'Пока нет чатов',
    'delete_chat': 'Удалить чат',
    'edit_chat': 'Редактировать чат',
    'clear_chat': 'Очистить чат',
    'edit_message': 'Редактировать',
    'delete_message': 'Удалить',
    'regenerate_response': 'Перегенерировать ответ',
    'save': 'Сохранить',
    'cancel': 'Отмена',
    'edited': 'отредактировано',
    'options': 'Опции'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('tr')

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
} 