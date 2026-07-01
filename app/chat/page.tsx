'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Send, Image as ImageIcon, Home, ChevronLeft, Circle } from 'lucide-react'

const MOCK_ROOMS = [
  {
    id: '1',
    listing: { address: '서울 마포구 합정동', type: '월세', deposit: 1000, rent: 55 },
    other_user: '김집주인',
    last_message: '네, 이번 주 토요일 오후 2시 어떠세요?',
    last_message_at: '2025-06-14T15:30:00Z',
    unread: 2,
  },
  {
    id: '2',
    listing: { address: '서울 성동구 성수동', type: '전세', deposit: 25000, rent: 0 },
    other_user: '이집주인',
    last_message: '안녕하세요! 매물 관련 문의드립니다.',
    last_message_at: '2025-06-13T10:00:00Z',
    unread: 0,
  },
]

const MOCK_MESSAGES = [
  { id: '1', sender: 'other', content: '안녕하세요! 매물 보고 연락드립니다.', time: '14:00' },
  { id: '2', sender: 'me', content: '반갑습니다! 어떤 것이 궁금하신가요?', time: '14:02' },
  { id: '3', sender: 'other', content: '혹시 빠른 입주가 가능할까요?', time: '14:03' },
  { id: '4', sender: 'me', content: '네, 즉시 입주 가능합니다. 보시겠어요?', time: '14:05' },
  { id: '5', sender: 'other', content: '네, 이번 주 토요일 오후 2시 어떠세요?', time: '15:30' },
]

export default function ChatPage() {
  const [activeRoom, setActiveRoom] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, {
      id: String(Date.now()),
      sender: 'me',
      content: input,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    }])
    setInput('')
  }

  const activeRoomData = MOCK_ROOMS.find(r => r.id === activeRoom)

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh' }}>
      <div className="container-main py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-[calc(100vh-140px)]">
          {/* Room List */}
          <div className="card overflow-hidden flex flex-col">
            <div className="p-4 border-b" style={{ borderColor: '#E9ECEF' }}>
              <h2 className="font-extrabold text-lg" style={{ color: '#1A1A2E' }}>채팅</h2>
              <p className="text-xs mt-0.5" style={{ color: '#ADB5BD' }}>
                {MOCK_ROOMS.filter(r => r.unread > 0).length}개 읽지 않은 메시지
              </p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {MOCK_ROOMS.map(room => (
                <button
                  key={room.id}
                  onClick={() => setActiveRoom(room.id)}
                  className="w-full flex items-start gap-3 p-4 border-b text-left transition-colors hover:bg-orange-50"
                  style={{
                    borderColor: '#F1F3F5',
                    background: activeRoom === room.id ? 'rgba(255,107,53,0.05)' : 'white',
                  }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #FF6B35, #E85A24)', color: 'white' }}>
                    {room.other_user[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className="font-semibold text-sm" style={{ color: '#1A1A2E' }}>{room.other_user}</p>
                      <span className="text-xs flex-shrink-0 ml-2" style={{ color: '#ADB5BD' }}>
                        {new Date(room.last_message_at).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs truncate mb-1" style={{ color: '#ADB5BD' }}>
                      {room.listing.address}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs truncate" style={{ color: '#6C757D' }}>{room.last_message}</p>
                      {room.unread > 0 && (
                        <span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: '#FF6B35' }}>
                          {room.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 card overflow-hidden flex flex-col">
            {activeRoom && activeRoomData ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: '#E9ECEF' }}>
                  <button onClick={() => setActiveRoom(null)} className="md:hidden p-1">
                    <ChevronLeft size={20} />
                  </button>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold"
                    style={{ background: 'linear-gradient(135deg, #FF6B35, #E85A24)', color: 'white' }}>
                    {activeRoomData.other_user[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm" style={{ color: '#1A1A2E' }}>{activeRoomData.other_user}</p>
                      <Circle size={8} fill="#28A745" style={{ color: '#28A745' }} />
                    </div>
                    <p className="text-xs" style={{ color: '#ADB5BD' }}>
                      {activeRoomData.listing.address} ·{' '}
                      {activeRoomData.listing.type === '전세'
                        ? `전세 ${(activeRoomData.listing.deposit / 10000).toFixed(0)}억`
                        : `월세 ${activeRoomData.listing.deposit / 100}00만/${activeRoomData.listing.rent}만`}
                    </p>
                  </div>
                  <Link href={`/listings/1`} className="btn-ghost text-xs px-3 py-1.5">
                    <Home size={13} /> 매물 보기
                  </Link>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map(msg => (
                    <div key={msg.id}
                      className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      {msg.sender === 'other' && (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0 font-bold text-xs"
                          style={{ background: 'linear-gradient(135deg, #FF6B35, #E85A24)', color: 'white' }}>
                          {activeRoomData.other_user[0]}
                        </div>
                      )}
                      <div className="max-w-xs">
                        <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                          msg.sender === 'me'
                            ? 'rounded-tr-sm'
                            : 'rounded-tl-sm'
                        }`}
                          style={msg.sender === 'me'
                            ? { background: '#FF6B35', color: 'white' }
                            : { background: '#F1F3F5', color: '#1A1A2E' }}>
                          {msg.content}
                        </div>
                        <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-right' : ''}`}
                          style={{ color: '#ADB5BD' }}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t" style={{ borderColor: '#E9ECEF' }}>
                  <div className="flex gap-2 items-end">
                    <button className="p-2.5 rounded-xl transition-colors hover:bg-gray-100 flex-shrink-0">
                      <ImageIcon size={18} style={{ color: '#6C757D' }} />
                    </button>
                    <textarea
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          sendMessage()
                        }
                      }}
                      placeholder="메시지를 입력하세요... (Enter로 전송)"
                      className="flex-1 input-field resize-none"
                      rows={1}
                    />
                    <button onClick={sendMessage} className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-90"
                      style={{ background: '#FF6B35' }}>
                      <Send size={16} color="white" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center"
                style={{ color: '#ADB5BD' }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                  style={{ background: '#F8F9FA' }}>
                  <Send size={32} style={{ color: '#E9ECEF' }} />
                </div>
                <p className="font-bold text-base" style={{ color: '#6C757D' }}>채팅방을 선택해주세요</p>
                <p className="text-sm mt-1">왼쪽 목록에서 대화를 선택하세요</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
