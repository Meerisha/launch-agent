"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Sparkles, TrendingUp, DollarSign, Target } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  isLoading?: boolean
}

interface ChatInterfaceProps {
  onAnalysisGenerated?: (analysis: any) => void
}

export default function ChatInterface({ onAnalysisGenerated }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your LaunchPilot AI consultant. I can help you analyze your project idea, create revenue projections, and develop a launch strategy. What's your project about?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationContext, setConversationContext] = useState<any>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Add loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true
    }
    setMessages(prev => [...prev, loadingMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue.trim(),
          conversationHistory: messages.map(m => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.content
          })),
          context: conversationContext
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      // Remove loading message and add response
      setMessages(prev => prev.slice(0, -1))
      
      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      // Update conversation context
      if (data.context) {
        setConversationContext(data.context)
      }

      // If analysis was generated, pass it to parent
      if (data.analysis && onAnalysisGenerated) {
        onAnalysisGenerated(data.analysis)
      }

    } catch (error) {
      console.error('Chat error:', error)
      
      // Remove loading message and add error
      setMessages(prev => prev.slice(0, -1))
      
      const errorMessage: Message = {
        id: (Date.now() + 3).toString(),
        type: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again or use the form above for project analysis.",
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getMessageIcon = (type: string) => {
    return type === 'user' ? (
      <User className="w-5 h-5" />
    ) : (
      <Bot className="w-5 h-5" />
    )
  }

  const formatMessageContent = (content: string) => {
    // Simple formatting for key information
    const lines = content.split('\n')
    return lines.map((line, index) => {
      // Format headers
      if (line.startsWith('##')) {
        return <h3 key={index} className="font-semibold text-lg mt-4 mb-2 text-blue-600">{line.replace('##', '').trim()}</h3>
      }
      if (line.startsWith('###')) {
        return <h4 key={index} className="font-semibold text-md mt-3 mb-2 text-gray-700">{line.replace('###', '').trim()}</h4>
      }
      
      // Format bullet points
      if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
        return <li key={index} className="ml-4 mb-1">{line.replace(/^[-•]\s*/, '').trim()}</li>
      }
      
      // Format key metrics
      if (line.includes('$') || line.includes('%') || line.includes('Revenue')) {
        return <p key={index} className="font-medium text-green-600 mb-2">{line}</p>
      }
      
      // Regular paragraphs
      if (line.trim()) {
        return <p key={index} className="mb-2">{line}</p>
      }
      
      return <br key={index} />
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">LaunchPilot AI Assistant</h2>
            <p className="text-blue-100 text-sm">Interactive Project Guidance & Analysis</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setInputValue("I want to launch a SaaS product")}
            className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
          >
            <Target className="w-4 h-4" />
            SaaS Launch
          </button>
          <button 
            onClick={() => setInputValue("Help me calculate revenue projections")}
            className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
          >
            <DollarSign className="w-4 h-4" />
            Revenue Projections
          </button>
          <button 
            onClick={() => setInputValue("I need market research for my idea")}
            className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            Market Research
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex gap-3 max-w-[85%] ${
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {getMessageIcon(message.type)}
              </div>
              <div
                className={`rounded-2xl p-4 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                ) : (
                  <div className="text-sm leading-relaxed">
                    {formatMessageContent(message.content)}
                  </div>
                )}
                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your project, market analysis, revenue projections, or launch strategy..."
              className="w-full p-3 pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  )
} 