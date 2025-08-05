import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useChat } from '../contexts/ChatContext'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { t } = useLanguage()
  const { chats, currentChatId, createNewChat, selectChat, deleteChat, updateChatTitle, clearChat } = useChat()
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  const handleNewChat = () => {
    createNewChat()
  }

  const handleChatSelect = (chatId: string) => {
    selectChat(chatId)
  }

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation()
    deleteChat(chatId)
  }

  const handleClearChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation()
    clearChat(chatId)
  }

  const handleEditChat = (e: React.MouseEvent, chat: any) => {
    e.stopPropagation()
    setEditingChatId(chat.id)
    setEditingTitle(chat.title)
  }

  const handleSaveEdit = (chatId: string) => {
    if (editingTitle.trim()) {
      updateChatTitle(chatId, editingTitle.trim())
    }
    setEditingChatId(null)
    setEditingTitle('')
  }

  const handleCancelEdit = () => {
    setEditingChatId(null)
    setEditingTitle('')
  }

  const handleKeyPress = (e: React.KeyboardEvent, chatId: string) => {
    if (e.key === 'Enter') {
      handleSaveEdit(chatId)
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 168) { // 7 gün
      return date.toLocaleDateString('tr-TR', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })
    }
  }

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">AI</div>
        </div>
        <button className="close-btn" onClick={onToggle}>
          ×
        </button>
      </div>

      <div className="sidebar-content">
        <div className="section">
          <button className="new-chat-btn" onClick={handleNewChat}>
            <span className="new-chat-icon">+</span>
            {t('new_chat')}
          </button>
        </div>

        <div className="section">
          <div className="section-title">{t('chats')}</div>
          <div className="chat-list">
            {chats.length === 0 ? (
              <div className="no-chats">
                <p>{t('no_chats')}</p>
              </div>
            ) : (
              chats.map(chat => (
                <div 
                  key={chat.id} 
                  className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}
                  onClick={() => handleChatSelect(chat.id)}
                >
                  <span className="chat-icon">●</span>
                  <div className="chat-info">
                    {editingChatId === chat.id ? (
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, chat.id)}
                        onBlur={() => handleSaveEdit(chat.id)}
                        className="chat-title-edit"
                        autoFocus
                      />
                    ) : (
                      <span className="chat-title">{chat.title}</span>
                    )}
                    <span className="chat-date">{formatDate(chat.updatedAt)}</span>
                  </div>
                  <div className="chat-actions">
                    <button 
                      className="edit-chat-btn"
                      onClick={(e) => handleEditChat(e, chat)}
                      title={t('edit_chat')}
                    >
                      ✎
                    </button>
                    <button 
                      className="clear-chat-btn"
                      onClick={(e) => handleClearChat(e, chat.id)}
                      title={t('clear_chat')}
                    >
                      ⊗
                    </button>
                    <button 
                      className="delete-chat-btn"
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                      title={t('delete_chat')}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 