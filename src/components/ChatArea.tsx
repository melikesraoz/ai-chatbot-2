import React, { useState, useRef, useEffect } from 'react'
import { fetchChatResponse } from '../utils/fetchChatResponse'
import { useLanguage } from '../contexts/LanguageContext'
import { useChat } from '../contexts/ChatContext'
import { getSystemPrompt } from '../lib/getSystemPrompt'

interface Message {
  id: string
  sender: 'user' | 'bot'
  message: string
  timestamp: string
  isEdited?: boolean
  originalMessage?: string
}

interface ChatAreaProps {
  selectedModel: string
  selectedMode: string
}

export default function ChatArea({ 
  selectedModel, 
  selectedMode
}: ChatAreaProps) {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [showMenuForMessage, setShowMenuForMessage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { t } = useLanguage()
  const { 
    currentChat, 
    currentChatId, 
    addMessageToChat, 
    editMessage, 
    deleteMessage, 
    regenerateResponse 
  } = useChat()
  
  const chatLanguage = currentChat?.language || 'tr'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentChat?.messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading && currentChatId) {
      const userMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString('tr-TR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }

      addMessageToChat(currentChatId, userMessage)
      const userInput = message.trim()
      setMessage('')
      setIsLoading(true)

      try {
        await generateBotResponse(userInput)
      } catch (error) {
        console.error('Mesaj gönderme hatası:', error)
        
        let errorMessage = t('error_message')
        if (error instanceof Error) {
          errorMessage = error.message
        }
        
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          message: `Error: ${errorMessage}`,
          timestamp: new Date().toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        }
        addMessageToChat(currentChatId, errorMsg)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const generateBotResponse = async (userInput: string) => {
    if (!currentChatId || !currentChat) return

    const systemPrompt = getSystemPrompt(selectedMode, chatLanguage)
    
    const conversationHistory = currentChat.messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.message
    }))

    const apiMessages = [
      {
        role: 'system' as const,
        content: systemPrompt
      },
      ...conversationHistory,
      {
        role: 'user' as const,
        content: userInput
      }
    ]

    const response = await fetchChatResponse(apiMessages, selectedModel)
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      message: response,
      timestamp: new Date().toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }

    addMessageToChat(currentChatId, botMessage)
  }

  const handleEditMessage = (messageId: string, currentText: string) => {
    setEditingMessageId(messageId)
    setEditText(currentText)
    setShowMenuForMessage(null)
  }

  const handleSaveEdit = async () => {
    if (editingMessageId && currentChatId && editText.trim()) {
      editMessage(currentChatId, editingMessageId, editText.trim())
      setEditingMessageId(null)
      setEditText('')
      
      const editedMessage = currentChat?.messages.find(msg => msg.id === editingMessageId)
      if (editedMessage?.sender === 'user') {
        const messageIndex = currentChat?.messages.findIndex(msg => msg.id === editingMessageId) || -1
        const nextMessage = currentChat?.messages[messageIndex + 1]
        
        if (nextMessage?.sender === 'bot') {
          deleteMessage(currentChatId, nextMessage.id)
          setIsLoading(true)
          try {
            await generateBotResponse(editText.trim())
          } catch (error) {
            console.error('Düzenlenen mesaj için yanıt üretme hatası:', error)
          } finally {
            setIsLoading(false)
          }
        }
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingMessageId(null)
    setEditText('')
  }

  const handleDeleteMessage = (messageId: string) => {
    if (currentChatId) {
      deleteMessage(currentChatId, messageId)
      setShowMenuForMessage(null)
    }
  }

  const handleRegenerateResponse = async (messageId: string) => {
    if (!currentChatId) return
    
    setIsLoading(true)
    setShowMenuForMessage(null)
    
    try {
      const userMessage = await regenerateResponse(currentChatId, messageId)
      if (userMessage) {
        await generateBotResponse(userMessage.message)
      }
    } catch (error) {
      console.error('Yeniden yanıt üretme hatası:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMessageMenu = (messageId: string) => {
    setShowMenuForMessage(showMenuForMessage === messageId ? null : messageId)
  }

  if (!currentChatId) {
    return (
      <div className="chat-container">
        <div className="chat-messages">
          <div className="welcome-message">
            <h1>{t('welcome_title')}</h1>
            <p>{t('welcome_subtitle')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {currentChat?.messages.length === 0 ? (
          <div className="welcome-message">
            <h1>{t('welcome_title')}</h1>
            <p>{t('welcome_subtitle')}</p>
          </div>
        ) : (
          <div className="messages-list">
            {currentChat?.messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  {editingMessageId === msg.id ? (
                    <div className="edit-message-container">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="edit-message-input"
                        rows={3}
                        autoFocus
                      />
                      <div className="edit-actions">
                        <button 
                          onClick={handleSaveEdit}
                          className="edit-save-btn"
                          disabled={!editText.trim()}
                        >
                          {t('save')}
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="edit-cancel-btn"
                        >
                          {t('cancel')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="message-text">
                        {msg.message}
                        {msg.isEdited && (
                          <span className="edited-indicator"> ({t('edited')})</span>
                        )}
                      </div>
                      <div className="message-time">{msg.timestamp}</div>
                    </>
                  )}
                </div>
                
                <div className="message-actions">
                  <button 
                    className="message-menu-btn"
                    onClick={() => toggleMessageMenu(msg.id)}
                    title={t('options')}
                  >
                    ⋮
                  </button>
                  
                  {showMenuForMessage === msg.id && (
                    <div className="message-menu">
                      {msg.sender === 'user' && (
                        <>
                          <button 
                            onClick={() => handleEditMessage(msg.id, msg.message)}
                            className="menu-item"
                          >
                            {t('edit_message')}
                          </button>
                          <button 
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="menu-item delete"
                          >
                            {t('delete_message')}
                          </button>
                        </>
                      )}
                      {msg.sender === 'bot' && (
                        <button 
                          onClick={() => handleRegenerateResponse(msg.id)}
                          className="menu-item"
                          disabled={isLoading}
                        >
                          {t('regenerate_response')}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot-message">
                <div className="message-content">
                  <div className="loading-indicator">
                    <span>{t('typing')}</span>
                    <div className="dots">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <div className="chat-input-container">
        <form onSubmit={handleSubmit} className="chat-input-form">
          <div className="input-wrapper">
            <div className="input-field-container">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('input_placeholder')}
                className="chat-input"
                disabled={isLoading}
              />
            </div>
            
            <div className="input-actions">
              <button 
                type="submit" 
                className="send-btn" 
                disabled={!message.trim() || isLoading}
                title={t('send')}
              >
                →
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
