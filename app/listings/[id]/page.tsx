'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  MapPin, Maximize2, Home, ChevronLeft, Heart, MessageCircle,
  Phone, Share2, CheckCircle, ChevronRight, Shield, Calendar,
  Layers, Car, Wind, Flame
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const MOCK_DETAIL = {
  id: '1',
  type: '월세',
  deposit: 1000,
  rent: 55,
  address: '서울 마포구 합정동',
  address_detail: '101동 3층 (합정역 5분)',
  area: 33.5,
  exclusive_area: 28.5,
  floor: 3,
  total_floor: 15,
  rooms: 2,
  bathrooms: 1,
  description: `신축 아파트로 2024년 12월에 입주한 따끈따끈한 매물입니다.

채광이 매우 좋고 환기가 잘 되는 남향 구조입니다. 주방과 거실이 분리되어 있어 생활이 편리합니다.

합정역까지 도보 5분 거리이며, 주변에 카페, 마트, 병원 등 편의시설이 잘 갖춰져 있습니다.

직거래로 중개수수료 없이 바로 계약 가능합니다. 빠른 입주 원하시는 분 환영합니다!`,
  status: '거래중',
  has_elevator: true,
  has_parking: true,
  has_balcony: true,
  heating_type: '개별난방',
  move_in_date: '즉시 입주',
  created_at: '2025-06-15',
  owner_name: '김**',
  owner_response: '보통 1시간 내 응답',
}

const checks = [
  '등기부등본 확인 완료',
  '건축물대장 확인 완료',
  '선순위 임차인 없음',
  '전입신고 가능 확인',
]

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const [chatLoading, setChatLoading] = useState(false)
  const listing = MOCK_DETAIL

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id)
      }
    })
  }, [])

  const handleChatStart = async () => {
    if (chatLoading) return
    setChatLoading(true)
    try {
      const supabase = createClient()
      if (!supabase) {
        alert('Supabase가 활성화되지 않았습니다.')
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      let landlordId = null
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      const isRealUuid = typeof params.id === 'string' && uuidRegex.test(params.id)

      if (isRealUuid) {
        const { data: realListing } = await supabase
          .from('listings')
          .select('user_id')
          .eq('id', params.id)
          .single()
        
        if (realListing) {
          landlordId = realListing.user_id
        }
      }

      if (!landlordId) {
        // Fallback for mock listings
        const { data: otherProfiles } = await supabase
          .from('profiles')
          .select('id')
          .neq('id', user.id)
          .limit(1)

        if (otherProfiles && otherProfiles.length > 0) {
          landlordId = otherProfiles[0].id
        } else {
          alert('채팅을 테스트하려면 가입된 다른 계정(집주인 역할)이 최소 한 개 더 필요합니다. 다른 브라우저에서 회원가입을 추가로 진행해 주세요.')
          return
        }
      }

      if (landlordId === user.id) {
        alert('자신의 매물에는 채팅 문의를 할 수 없습니다.')
        return
      }

      // Check existing room
      const { data: rooms } = await supabase
        .from('chat_rooms')
        .select('id, landlord_id, tenant_id')
        .or(`landlord_id.eq.${user.id},tenant_id.eq.${user.id}`)

      const existingRoom = rooms?.find(r => 
        (r.landlord_id === landlordId && r.tenant_id === user.id) ||
        (r.landlord_id === user.id && r.tenant_id === landlordId)
      )

      if (existingRoom) {
        router.push(`/chat?room_id=${existingRoom.id}`)
        return
      }

      // Create new room
      const { data: newRoom, error: createError } = await supabase
        .from('chat_rooms')
        .insert({
          listing_id: isRealUuid ? params.id : null,
          landlord_id: landlordId,
          tenant_id: user.id,
          last_message: '채팅방이 개설되었습니다.',
          last_message_at: new Date().toISOString()
        })
        .select('id')
        .single()

      if (newRoom) {
        router.push(`/chat?room_id=${newRoom.id}`)
      } else {
        console.error('채팅방 생성 에러:', createError)
        alert('채팅방 개설에 실패했습니다.')
      }
    } catch (err) {
      console.error(err)
      alert('오류가 발생했습니다.')
    } finally {
      setChatLoading(false)
    }
  }

  const images = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', // 거실
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80', // 주방
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', // 침실
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', // 욕실
  ]

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ background: 'white', borderBottom: '1px solid #E9ECEF' }}>
        <div className="container-main py-3">
          <div className="flex items-center gap-2 text-sm" style={{ color: '#6C757D' }}>
            <Link href="/listings" className="flex items-center gap-1 hover:text-orange-500 transition-colors">
              <ChevronLeft size={14} /> 목록으로
            </Link>
            <span>/</span>
            <span style={{ color: '#1A1A2E' }}>{listing.address}</span>
          </div>
        </div>
      </div>

      <div className="container-main py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Images + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="card overflow-hidden">
              <div className="relative h-72 md:h-96 bg-gray-900">
                <img
                  src={images[activeImage]}
                  alt={`${listing.address} 상세 사진`}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`badge ${listing.type === '전세' ? 'badge-jeonse' : 'badge-wolse'}`}>
                    {listing.type}
                  </span>
                  <span className="badge" style={{ background: 'rgba(40,167,69,0.9)', color: 'white' }}>
                    직거래
                  </span>
                </div>
                
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => setIsBookmarked(!isBookmarked)}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95"
                    style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    <Heart size={18} fill={isBookmarked ? '#FF6B35' : 'none'}
                      style={{ color: isBookmarked ? '#FF6B35' : '#6C757D' }} />
                  </button>
                  <button className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    <Share2 size={18} style={{ color: '#6C757D' }} />
                  </button>
                </div>
                
                <div className="absolute bottom-4 right-4 text-xs px-2.5 py-1 rounded-lg font-bold"
                  style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}>
                  {activeImage + 1} / {images.length}
                </div>
              </div>
              
              {/* Thumbnails */}
              <div className="flex gap-2 p-3 bg-white">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden transition-all"
                    style={{
                      border: `2.5px solid ${activeImage === i ? '#FF6B35' : 'transparent'}`,
                      opacity: activeImage === i ? 1 : 0.65
                    }}>
                    <img src={img} alt={`미리보기 ${i+1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Basic Info */}
            <div className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm mb-1" style={{ color: '#ADB5BD' }}>
                    {listing.address} · {listing.address_detail}
                  </p>
                  <h1 className="text-2xl font-extrabold" style={{ color: '#1A1A2E' }}>
                    {listing.type === '전세'
                      ? `전세 ${(listing.deposit / 10000).toFixed(0)}억`
                      : `월세 ${listing.deposit / 100 >= 10 ? listing.deposit / 10000 + '억' : listing.deposit / 100 + '00만'} / ${listing.rent}만원`}
                  </h1>
                  {listing.type === '월세' && (
                    <p className="text-sm mt-1" style={{ color: '#6C757D' }}>
                      보증금 {listing.deposit.toLocaleString()}만원
                    </p>
                  )}
                </div>
                <span className="badge" style={{
                  background: listing.status === '거래중' ? 'rgba(40,167,69,0.1)' : 'rgba(108,117,125,0.1)',
                  color: listing.status === '거래중' ? '#28A745' : '#6C757D',
                }}>
                  {listing.status}
                </span>
              </div>

              {/* Tags */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Maximize2, label: '면적', value: `${listing.area}㎡` },
                  { icon: Layers, label: '층수', value: `${listing.floor}/${listing.total_floor}층` },
                  { icon: Home, label: '방/욕실', value: `${listing.rooms}/${listing.bathrooms}` },
                  { icon: Calendar, label: '입주가능', value: listing.move_in_date },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-xl p-3 text-center"
                    style={{ background: '#F8F9FA' }}>
                    <Icon size={18} className="mx-auto mb-1" style={{ color: '#FF6B35' }} />
                    <p className="text-xs mb-0.5" style={{ color: '#ADB5BD' }}>{label}</p>
                    <p className="text-sm font-bold" style={{ color: '#1A1A2E' }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-4" style={{ color: '#1A1A2E' }}>옵션 및 시설</h2>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Car, label: '주차 가능', active: listing.has_parking },
                  { icon: Wind, label: '에어컨', active: true },
                  { icon: Flame, label: '개별난방', active: true },
                  { icon: CheckCircle, label: '엘리베이터', active: listing.has_elevator },
                  { icon: CheckCircle, label: '발코니', active: listing.has_balcony },
                ].map(({ icon: Icon, label, active }) => (
                  <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{
                      background: active ? 'rgba(255,107,53,0.08)' : '#F8F9FA',
                      color: active ? '#FF6B35' : '#ADB5BD',
                    }}>
                    <Icon size={14} />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-4" style={{ color: '#1A1A2E' }}>매물 설명</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#6C757D' }}>
                {listing.description}
              </p>
            </div>

            {/* Location */}
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-4" style={{ color: '#1A1A2E' }}>위치</h2>
              <div className="rounded-xl h-48 flex items-center justify-center"
                style={{ background: '#F8F9FA', border: '1px solid #E9ECEF' }}>
                <div className="text-center">
                  <MapPin size={32} className="mx-auto mb-2" style={{ color: '#ADB5BD' }} />
                  <p className="text-sm" style={{ color: '#6C757D' }}>{listing.address}</p>
                  <p className="text-xs mt-1" style={{ color: '#ADB5BD' }}>지도 기능은 카카오맵 API 연동 후 제공됩니다</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact & Safety */}
          <div className="space-y-5">
            {/* Contact Card - Sticky */}
            <div className="card p-6 sticky top-20">
              <h2 className="font-bold text-lg mb-4" style={{ color: '#1A1A2E' }}>집주인에게 연락하기</h2>
              
              <div className="flex items-center gap-3 mb-5 p-3 rounded-xl" style={{ background: '#F8F9FA' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #FF6B35, #E85A24)' }}>
                  <span className="text-white font-bold text-sm">{listing.owner_name[0]}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#1A1A2E' }}>{listing.owner_name}</p>
                  <p className="text-xs" style={{ color: '#28A745' }}>⚡ {listing.owner_response}</p>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleChatStart}
                  disabled={chatLoading}
                  className="btn-primary w-full justify-center disabled:opacity-50"
                >
                  <MessageCircle size={16} />
                  {chatLoading ? '채팅방 연결 중...' : '채팅으로 문의하기'}
                </button>
                <button className="btn-secondary w-full justify-center">
                  <Phone size={16} />
                  전화번호 확인
                </button>
              </div>

              <p className="text-xs text-center mt-3" style={{ color: '#ADB5BD' }}>
                {userId ? '집주인과 바로 대화해 보세요' : '로그인 후 연락처 확인이 가능합니다'}
              </p>
            </div>

            {/* Safety Check */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={18} style={{ color: '#28A745' }} />
                <h3 className="font-bold" style={{ color: '#1A1A2E' }}>안전거래 체크</h3>
              </div>
              <div className="space-y-2">
                {checks.map(check => (
                  <div key={check} className="flex items-center gap-2 text-sm" style={{ color: '#6C757D' }}>
                    <CheckCircle size={14} style={{ color: '#28A745' }} />
                    {check}
                  </div>
                ))}
              </div>
              <Link href="/guide" className="mt-4 text-xs flex items-center gap-1"
                style={{ color: '#FF6B35' }}>
                계약 체크리스트 보기 <ChevronRight size={12} />
              </Link>
            </div>

            {/* Similar Listings */}
            <div className="card p-5">
              <h3 className="font-bold mb-4" style={{ color: '#1A1A2E' }}>유사 매물</h3>
              <div className="space-y-3">
                {[
                  { deposit: 800, rent: 60, area: 31, address: '마포구 망원동' },
                  { deposit: 1200, rent: 50, area: 36, address: '마포구 상수동' },
                ].map((s, i) => (
                  <Link key={i} href="/listings/2" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: '#F8F9FA' }}>
                      <Home size={18} style={{ color: '#ADB5BD' }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#1A1A2E' }}>
                        월세 {s.deposit / 100}00만/{s.rent}만
                      </p>
                      <p className="text-xs" style={{ color: '#ADB5BD' }}>{s.address} · {s.area}㎡</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
