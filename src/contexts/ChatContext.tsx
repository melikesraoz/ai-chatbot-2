import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface Message {
  id: string
  sender: 'user' | 'bot'
  message: string
  timestamp: string
}//tek bir mesajın bilgileri

interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: string
  updatedAt: string
  language: 'tr' | 'en' | 'de' | 'ru'
}//chatin bilgileri

interface ChatContextType {
  chats: Chat[]
  currentChatId: string | null
  currentChat: Chat | null
  createNewChat: () => string
  selectChat: (chatId: string) => void
  addMessageToChat: (chatId: string, message: Message) => void
  deleteChat: (chatId: string) => void
  updateChatTitle: (chatId: string, title: string) => void
  clearChat: (chatId: string) => void
  updateChatLanguage: (chatId: string, language: 'tr' | 'en' | 'de' | 'ru') => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}

interface ChatProviderProps {
  children: ReactNode
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)

  const currentChat = chats.find(chat => chat.id === currentChatId) || null

  useEffect(() => {
    const savedChats = localStorage.getItem('ai-chatbot-chats')
    const savedCurrentChatId = localStorage.getItem('ai-chatbot-current-chat-id')
    
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats)
        setChats(parsedChats)
        
        if (savedCurrentChatId && parsedChats.find((chat: Chat) => chat.id === savedCurrentChatId)) {
          setCurrentChatId(savedCurrentChatId)
        }
      } catch (error) {
        console.error('Sohbetler yüklenirken hata:', error)
      }
    }
  }, [])


  useEffect(() => {//local storega a kaydediyoruz
    localStorage.setItem('ai-chatbot-chats', JSON.stringify(chats))
  }, [chats])

  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem('ai-chatbot-current-chat-id', currentChatId)
    } else {
      localStorage.removeItem('ai-chatbot-current-chat-id')
    }
  }, [currentChatId])

  const createNewChat = (): string => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'Yeni Sohbet',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      language: 'tr' // varsayılan dil türkçe
    }

    setChats(prev => [newChat, ...prev])
    setCurrentChatId(newChat.id)
    return newChat.id
  }

  const selectChat = (chatId: string) => {
    setCurrentChatId(chatId)
  }

  const addMessageToChat = (chatId: string, message: Message) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        const updatedMessages = [...chat.messages, message]
        let title = chat.title
        if (message.sender === 'user' && chat.messages.length === 0 && chat.title === 'Yeni Sohbet') {
          title = message.message.length > 30 
            ? message.message.substring(0, 30) + '...' 
            : message.message
        }
        
        return {
          ...chat,
          title,
          messages: updatedMessages,
          updatedAt: new Date().toISOString()
        }
      }
      return chat
    }))
  }

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId))
    if (currentChatId === chatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId)
      setCurrentChatId(remainingChats.length > 0 ? remainingChats[0].id : null)
    }
  }

  const updateChatTitle = (chatId: string, title: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, title } : chat
    ))
  }

  const clearChat = (chatId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, messages: [] } : chat
    ))
  }

  const updateChatLanguage = (chatId: string, language: 'tr' | 'en' | 'de' | 'ru') => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, language } : chat
    ))
  }

  return (
    <ChatContext.Provider value={{
      chats,
      currentChatId,
      currentChat,
      createNewChat,
      selectChat,
      addMessageToChat,
      deleteChat,
      updateChatTitle,
      clearChat,
      updateChatLanguage
    }}>
      {children}
    </ChatContext.Provider>
  )
} 