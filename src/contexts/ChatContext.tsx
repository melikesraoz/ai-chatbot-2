import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface Message {
  id: string
  sender: 'user' | 'bot'
  message: string
  timestamp: string
  isEdited?: boolean
  originalMessage?: string
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
  editMessage: (chatId: string, messageId: string, newMessage: string) => void
  deleteMessage: (chatId: string, messageId: string) => void
  regenerateResponse: (chatId: string, messageId: string) => Promise<Message | undefined>
  clearAllData: () => void
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
    const loadSavedData = () => {
      try {
        const savedChats = localStorage.getItem('ai-chatbot-chats')
        const savedCurrentChatId = localStorage.getItem('ai-chatbot-current-chat-id')
        
        if (savedChats) {
          const parsedChats = JSON.parse(savedChats)
          
          if (Array.isArray(parsedChats)) {
            setChats(parsedChats)
            
            if (savedCurrentChatId && parsedChats.find((chat: Chat) => chat.id === savedCurrentChatId)) {
              setCurrentChatId(savedCurrentChatId)
            } else if (parsedChats.length > 0) {
              setCurrentChatId(parsedChats[0].id)
            }
          } else {
            console.warn('Kaydedilen sohbet verisi geçersiz format')
            localStorage.removeItem('ai-chatbot-chats')
          }
        }
      } catch (error) {
        console.error('Sohbetler yüklenirken hata:', error)
        
        localStorage.removeItem('ai-chatbot-chats')
        localStorage.removeItem('ai-chatbot-current-chat-id')
      }
    }

    loadSavedData()
  }, [])


  useEffect(() => {
    try {
      if (chats.length > 0) {
        localStorage.setItem('ai-chatbot-chats', JSON.stringify(chats))
      } else {
        localStorage.removeItem('ai-chatbot-chats')
      }
    } catch (error) {
      console.error('Sohbetler kaydedilirken hata:', error)
    }
  }, [chats])

  useEffect(() => {
    try {
      if (currentChatId) {
        localStorage.setItem('ai-chatbot-current-chat-id', currentChatId)
      } else {
        localStorage.removeItem('ai-chatbot-current-chat-id')
      }
    } catch (error) {
      console.error('Mevcut sohbet ID kaydedilirken hata:', error)
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
          title = message.message.length > 10
            ? message.message.substring(0, 10) + '...' 
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
    setChats(prev => {
      const updatedChats = prev.filter(chat => chat.id !== chatId)
      
      if (currentChatId === chatId) {
        if (updatedChats.length > 0) {
          setCurrentChatId(updatedChats[0].id)
        } else {
          setCurrentChatId(null)
        }
      }
      
      return updatedChats
    })
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

  const editMessage = (chatId: string, messageId: string, newMessage: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        const updatedMessages = chat.messages.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              message: newMessage,
              isEdited: true,
              originalMessage: msg.originalMessage || msg.message
            }
          }
          return msg
        })
        
        return {
          ...chat,
          messages: updatedMessages,
          updatedAt: new Date().toISOString()
        }
      }
      return chat
    }))
  }

  const deleteMessage = (chatId: string, messageId: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        const updatedMessages = chat.messages.filter(msg => msg.id !== messageId)
        
        return {
          ...chat,
          messages: updatedMessages,
          updatedAt: new Date().toISOString()
        }
      }
      return chat
    }))
  }

  const regenerateResponse = async (chatId: string, messageId: string) => {
    const chat = chats.find(c => c.id === chatId)
    if (!chat) return

    const messageIndex = chat.messages.findIndex(msg => msg.id === messageId)
    if (messageIndex === -1 || chat.messages[messageIndex].sender !== 'bot') return

    let userMessageIndex = messageIndex - 1
    while (userMessageIndex >= 0 && chat.messages[userMessageIndex].sender !== 'user') {
      userMessageIndex--
    }

    if (userMessageIndex === -1) return

    const userMessage = chat.messages[userMessageIndex]
    
    const messagesBeforeResponse = chat.messages.slice(0, messageIndex)
    
    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          messages: messagesBeforeResponse,
          updatedAt: new Date().toISOString()
        }
      }
      return c
    }))

    return userMessage
  }

  const clearAllData = () => {
    setChats([])
    setCurrentChatId(null)
    localStorage.removeItem('ai-chatbot-chats')
    localStorage.removeItem('ai-chatbot-current-chat-id')
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
      updateChatLanguage,
      editMessage,
      deleteMessage,
      regenerateResponse,
      clearAllData
    }}>
      {children}
    </ChatContext.Provider>
  )
} 