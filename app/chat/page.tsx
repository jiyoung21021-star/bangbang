'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Send, Image as ImageIcon, Home, ChevronLeft, Circle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function ChatPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlRoomId = searchParams.get('room_id')

  const [currentUser, setCurrentUser] = useState<any>(null)
  const [rooms, setRooms] = useState<any[]>([])
  const [activeRoom, setActiveRoom] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [loadingRooms, setLoadingRooms] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 1. 사용자 인증 확인 및 초기화
  useEffect(() => {
    const initUser = async () => {
      const supabase = createClient()
      if (!supabase) {
        setLoadingRooms(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setCurrentUser(user)
    };
    initUser()
  }, [router])

  // 2. 채팅방 목록 가져오기
  useEffect(() => {
    if (!currentUser) return

    const fetchRooms = async () => {
      setLoadingRooms(true)
      const supabase = createClient()
      if (!supabase) {
        setLoadingRooms(false)
        return
      }

      try {
        // 내가 landlord이거나 tenant인 모든 채팅방 조회
        const { data: dbRooms, error } = await supabase
          .from('chat_rooms')
          .select(`
            id,
            listing_id,
            landlord_id,
            tenant_id,
            last_message,
            last_message_at,
            listings (
              address,
              type,
              deposit,
              monthly_rent
            )
          `)
          .or(`landlord_id.eq.${currentUser.id},tenant_id.eq.${currentUser.id}`)
          .order('last_message_at', { ascending: false })

        if (error) throw error

        let formattedRooms: any[] = []

        if (dbRooms && dbRooms.length > 0) {
          // 상대방 프로필 정보들 일괄 조회
          const otherUserIds = dbRooms.map(r => r.landlord_id === currentUser.id ? r.tenant_id : r.landlord_id)
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, nickname, avatar_url')
            .in('id', otherUserIds)

          const profilesMap = new Map(profiles?.map(p => [p.id, p]))

          formattedRooms = dbRooms.map(r => {
            const otherUserId = r.landlord_id === currentUser.id ? r.tenant_id : r.landlord_id
            const otherProfile = profilesMap.get(otherUserId)
            return {
              id: r.id,
              listing_id: r.listing_id,
              listing: r.listings || { address: '일반 문의', type: '기타', deposit: 0, rent: 0 },
              other_user: otherProfile?.nickname || '알 수 없는 사용자',
              other_user_avatar: otherProfile?.avatar_url,
              other_user_id: otherUserId,
              last_message: r.last_message || '대화가 시작되었습니다.',
              last_message_at: r.last_message_at || new Date().toISOString(),
              unread: 0
            }
          })
        }

        // 만약 URL 파라미터로 room_id가 들어왔는데 목록에 없다면 (방금 신규 생성한 경우)
        if (urlRoomId && !formattedRooms.some(r => r.id === urlRoomId)) {
          const { data: newRoom } = await supabase
            .from('chat_rooms')
            .select(`
              id,
              listing_id,
              landlord_id,
              tenant_id,
              last_message,
              last_message_at,
              listings (
                address,
                type,
                deposit,
                monthly_rent
              )
            `)
            .eq('id', urlRoomId)
            .single()

          if (newRoom) {
            const otherUserId = newRoom.landlord_id === currentUser.id ? newRoom.tenant_id : newRoom.landlord_id
            const { data: otherProfile } = await supabase
              .from('profiles')
              .select('id, nickname, avatar_url')
              .eq('id', otherUserId)
              .single()

            const formatted = {
              id: newRoom.id,
              listing_id: newRoom.listing_id,
              listing: newRoom.listings || { address: '일반 문의', type: '기타', deposit: 0, rent: 0 },
              other_user: otherProfile?.nickname || '알 수 없는 사용자',
              other_user_avatar: otherProfile?.avatar_url,
              other_user_id: otherUserId,
              last_message: newRoom.last_message || '대화가 시작되었습니다.',
              last_message_at: newRoom.last_message_at || new Date().toISOString(),
              unread: 0
            }
            formattedRooms.unshift(formatted)
          }
        }

        setRooms(formattedRooms)
        
        // active room 설정
        if (urlRoomId) {
          setActiveRoom(urlRoomId)
        } else if (formattedRooms.length > 0 && !activeRoom) {
          // 모바일 스크린이 아니거나, 첫 진입 시 첫 번째 방 자동 선택 (PC 환경 고려)
          if (window.innerWidth >= 768) {
            setActiveRoom(formattedRooms[0].id)
          }
        }
      } catch (err) {
        console.error('채팅방 로드 실패:', err)
      } finally {
        setLoadingRooms(false)
      }
    };

    fetchRooms()
  }, [currentUser, urlRoomId])

  // 3. 채팅방 실시간 마지막 메시지 업데이트 리스너
  useEffect(() => {
    if (!currentUser) return

    const supabase = createClient()
    if (!supabase) return

    const channel = supabase
      .channel('chat_rooms_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_rooms'
        },
        (payload: any) => {
          const updatedRoom = payload.new
          if (updatedRoom.landlord_id === currentUser.id || updatedRoom.tenant_id === currentUser.id) {
            setRooms(prev => {
              const exists = prev.some(r => r.id === updatedRoom.id)
              if (!exists) {
                // 목록에 없는 새로운 방이 업데이트(또는 생성)된 경우 전체 목록을 다시 불러오는 것이 안전함
                return prev
              }
              return prev.map(r => {
                if (r.id === updatedRoom.id) {
                  return {
                    ...r,
                    last_message: updatedRoom.last_message,
                    last_message_at: updatedRoom.last_message_at
                  }
                }
                return r
              }).sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime())
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUser])

  // 4. 활성화된 채팅방 메시지 불러오기 및 실시간 구독
  useEffect(() => {
    if (!activeRoom || !currentUser) return

    const loadMessages = async () => {
      setLoadingMessages(true)
      const supabase = createClient()
      if (!supabase) {
        setLoadingMessages(false)
        return
      }

      try {
        const { data: dbMessages, error } = await supabase
          .from('chat_messages')
          .select('id, sender_id, content, created_at')
          .eq('room_id', activeRoom)
          .order('created_at', { ascending: true })

        if (error) throw error

        const formatted = dbMessages?.map(m => ({
          id: m.id,
          sender: m.sender_id === currentUser.id ? 'me' : 'other',
          content: m.content,
          time: new Date(m.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        })) || []
        setMessages(formatted)
      } catch (err) {
        console.error('메시지 로드 실패:', err)
      } finally {
        setLoadingMessages(false)
      }
    };

    loadMessages()

    // 실시간 메시지 INSERT 감지 리스너 등록
    const supabase = createClient()
    if (!supabase) return

    const channel = supabase
      .channel(`room:${activeRoom}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${activeRoom}`
        },
        (payload: any) => {
          const newMsg = payload.new
          setMessages(prev => {
            // 중복 방지
            if (prev.some(m => m.id === newMsg.id)) return prev
            return [...prev, {
              id: newMsg.id,
              sender: newMsg.sender_id === currentUser.id ? 'me' : 'other',
              content: newMsg.content,
              time: new Date(newMsg.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
            }]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeRoom, currentUser])

  // 5. 스크롤 제어
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 6. 메시지 전송
  const sendMessage = async () => {
    if (!input.trim() || !activeRoom || !currentUser || sending) return
    
    const messageContent = input.trim()
    setInput('')
    setSending(true)

    const supabase = createClient()
    if (!supabase) {
      setSending(false)
      return
    }

    try {
      // 1. 메시지 삽입
      const { data: newMsg, error: sendError } = await supabase
        .from('chat_messages')
        .insert({
          room_id: activeRoom,
          sender_id: currentUser.id,
          content: messageContent
        })
        .select('id, created_at')
        .single()

      if (sendError) throw sendError

      if (newMsg) {
        // 로컬 UI에 즉시 추가 (Realtime 반응이 오기 전 더 빠른 사용자 피드백)
        setMessages(prev => {
          if (prev.some(m => m.id === newMsg.id)) return prev
          return [...prev, {
            id: newMsg.id,
            sender: 'me',
            content: messageContent,
            time: new Date(newMsg.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
          }]
        })

        // 2. 채팅방의 마지막 메시지 정보 갱신
        await supabase
          .from('chat_rooms')
          .update({
            last_message: messageContent,
            last_message_at: newMsg.created_at
          })
          .eq('id', activeRoom)
      }
    } catch (err) {
      console.error('메시지 전송 실패:', err)
      alert('메시지 전송에 실패했습니다.')
    } finally {
      setSending(false)
    }
  }

  const activeRoomData = rooms.find(r => r.id === activeRoom)

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh' }}>
      <div className="container-main py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-[calc(100vh-140px)]">
          
          {/* Room List (모바일일 때는 활성 방이 없을 때만 보임) */}
          <div className={`card overflow-hidden flex flex-col ${activeRoom ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b" style={{ borderColor: '#E9ECEF' }}>
              <h2 className="font-extrabold text-lg" style={{ color: '#1A1A2E' }}>채팅</h2>
              <p className="text-xs mt-0.5" style={{ color: '#ADB5BD' }}>
                실시간 1:1 대화방 목록입니다.
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {loadingRooms ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="animate-spin text-[#FF6B35]" size={24} />
                </div>
              ) : rooms.length === 0 ? (
                <div className="p-6 text-center text-sm" style={{ color: '#ADB5BD' }}>
                  진행 중인 채팅방이 없습니다.
                </div>
              ) : (
                rooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => {
                      setActiveRoom(room.id)
                      // URL 파라미터 조작
                      router.replace(`/chat?room_id=${room.id}`, { scroll: false })
                    }}
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
                      <p className="text-xs truncate" style={{ color: '#6C757D' }}>{room.last_message}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area (모바일일 때는 활성 방이 있을 때만 보임) */}
          <div className={`md:col-span-2 card overflow-hidden flex flex-col ${!activeRoom ? 'hidden md:flex' : 'flex'}`}>
            {activeRoom && activeRoomData ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: '#E9ECEF' }}>
                  <button onClick={() => {
                    setActiveRoom(null)
                    router.replace('/chat', { scroll: false })
                  }} className="md:hidden p-1">
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
                        : activeRoomData.listing.type === '월세'
                        ? `월세 ${activeRoomData.listing.deposit}만/${activeRoomData.listing.rent}만`
                        : '일반 상담'}
                    </p>
                  </div>

                  {activeRoomData.listing_id && (
                    <Link href={`/listings/${activeRoomData.listing_id}`} className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1">
                      <Home size={13} /> 매물 보기
                    </Link>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8F9FA]">
                  {loadingMessages ? (
                    <div className="h-full flex items-center justify-center">
                      <Loader2 className="animate-spin text-[#FF6B35]" size={20} />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="p-6 text-center text-xs text-gray-400">
                      메시지를 보내 대화를 시작해 보세요.
                    </div>
                  ) : (
                    messages.map(msg => (
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
                            msg.sender === 'me' ? 'rounded-tr-sm' : 'rounded-tl-sm'
                          }`}
                            style={msg.sender === 'me'
                              ? { background: '#FF6B35', color: 'white' }
                              : { background: 'white', color: '#1A1A2E', border: '1px solid #E9ECEF' }}>
                            {msg.content}
                          </div>
                          <p className={`text-[10px] mt-1 ${msg.sender === 'me' ? 'text-right' : ''}`}
                            style={{ color: '#ADB5BD' }}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
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
                      className="flex-1 input-field resize-none max-h-24 min-h-[40px] py-2"
                      rows={1}
                    />
                    <button 
                      onClick={sendMessage} 
                      disabled={!input.trim() || sending}
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-90 disabled:opacity-50"
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

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#FF6B35]" size={32} />
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  )
}
