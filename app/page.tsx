'use client'

import Link from 'next/link'
import {
  Search, Shield, TrendingDown, ChevronRight, Home,
  BookOpen, ArrowRight, CheckCircle, AlertTriangle,
  FileText, Sparkles, MapPin, Building2, Star,
  Users, MessageCircle, Zap, X, Copy, Check
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

/* ─── 애니메이션 숫자 카운터 훅 ─── */
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

/* ─── 데이터 ─── */
const recentListings = [
  { id: '1', type: '월세', deposit: 1000, rent: 55, address: '마포구 합정동', area: 33.5, floor: 3, tag: '신축', tagColor: '#FF6B35', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80' },
  { id: '2', type: '전세', deposit: 25000, rent: 0, address: '성동구 성수동', area: 59.3, floor: 7, tag: '역세권', tagColor: '#6F42C1', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80' },
  { id: '3', type: '월세', deposit: 500, rent: 70, address: '영등포구 여의도', area: 40.0, floor: 12, tag: '한강뷰', tagColor: '#17A2B8', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=400&q=80' },
  { id: '4', type: '전세', deposit: 18000, rent: 0, address: '광진구 자양동', area: 49.0, floor: 2, tag: '직거래', tagColor: '#28A745', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80' },
]

const features = [
  { icon: TrendingDown, title: '중개수수료 0원', desc: '집주인 직접 연결, 평균 150만원 절약', color: '#FF6B35', bg: 'rgba(255,107,53,0.1)' },
  { icon: Shield, title: '안전 직거래', desc: '전세사기 예방 가이드 & 계약 체크리스트', color: '#28A745', bg: 'rgba(40,167,69,0.1)' },
  { icon: MessageCircle, title: '실시간 1:1 채팅', desc: '집주인과 바로 소통, 즉시 답변 가능', color: '#17A2B8', bg: 'rgba(23,162,184,0.1)' },
  { icon: BookOpen, title: '정보 커뮤니티', desc: '사회초년생을 위한 부동산 A to Z', color: '#6F42C1', bg: 'rgba(111,66,193,0.1)' },
]

const reviews = [
  { name: '김*현', role: '취업 1년차', text: '중개수수료 130만원 절약했어요! 집주인분도 친절하시고 직거래라 계약도 간단했습니다 😊', rating: 5 },
  { name: '이*은', role: '대학원생', text: '전세사기 걱정됐는데 가이드 보고 안심하고 계약했어요. 체크리스트 너무 유용해요!', rating: 5 },
  { name: '박*준', role: '사회초년생', text: '앱이 직관적이고 매물도 많아요. 일주일만에 원하는 집 찾았습니다 👍', rating: 5 },
]

const guides = [
  { title: '전세사기 예방 필수 체크', desc: '송금 전 반드시 자가진단해야 할 7가지 안전 장치와 확인서류', tag: '안전 보증', readTime: '5분 분량', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80' },
  { title: '등기부등본 3단계 해독법', desc: '어려운 단어 가득한 갑구, 을구 속 근저당권 금액 쉽게 계산하기', tag: '서류 분석', readTime: '4분 분량', image: '/registry_guide.png' },
  { title: '계약 체크리스트 20가지', desc: '배수, 수압부터 관리비 내역까지 꼼꼼히 챙기는 체크북', tag: '계약 실무', readTime: '3분 분량', image: '/checklist_guide.png' },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'전체' | '전세' | '월세'>('전체')
  const [statsStarted, setStatsStarted] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  /* ─── 안전 직거래 모달 상태 ─── */
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'check' | 'special' | 'after'>('check')
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(idx)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  /* ─── 정보 커뮤니티 모달 상태 ─── */
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false)
  const [commTab, setCommTab] = useState<'guide' | 'qa' | 'rules'>('guide')

  /* ─── 중개수수료 0원 모달 상태 ─── */
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false)
  const [commisTab, setCommisTab] = useState<'calc' | 'why' | 'tips'>('calc')
  const [calcDeposit, setCalcDeposit] = useState<string>('5000')
  const [calcMonthlyRent, setCalcMonthlyRent] = useState<string>('50')

  const c1 = useCountUp(2400, 1800, statsStarted)
  const c2 = useCountUp(150, 1800, statsStarted)
  const c3 = useCountUp(1200, 1800, statsStarted)
  const c4 = useCountUp(8500, 1800, statsStarted)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setStatsStarted(true)
    }, { threshold: 0.3 })
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (searchType !== '전체') params.set('type', searchType)
    router.push(`/listings?${params.toString()}`)
  }

  return (
    <div style={{ background: '#F8F9FA' }}>

      {/* ══════════════ HERO (Reference Style) ══════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '660px', background: 'linear-gradient(135deg, #FFF5F1 0%, #FDFBFB 60%, #F5EAE6 100%)' }}>
        
        {/* Soft Decorative Ambient Light */}
        <div className="absolute top-[10%] left-[-10%] w-[350px] h-[350px] rounded-full opacity-40 filter blur-[40px]"
          style={{ background: 'radial-gradient(circle, #FFD3C4 0%, transparent 70%)' }} />

        {/* Floating Real Estate Status Badges */}
        <div className="hidden lg:block absolute animate-bounce" style={{ top: '15%', left: '8%', animationDuration: '3.5s' }}>
          <div className="px-4 py-2.5 rounded-2xl text-xs font-extrabold shadow-sm border"
            style={{ background: 'white', borderColor: '#FFEBE5', color: '#FF6B35' }}>
            🎉 복비 0원 직거래 성공 1,200건 돌파
          </div>
        </div>

        <div className="container-main relative z-10 pt-20 pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            
            {/* Left Column: Text Content & Search Form */}
            <div className="lg:col-span-7 text-left pb-16 flex flex-col items-start">
              {/* Brand Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-6 text-xs font-extrabold"
                style={{ background: '#FFF0EB', border: '1px solid #FFD8CC', color: '#FF6B35' }}>
                <Sparkles size={12} />
                공인중개사 없는 전·월세 직거래
              </div>

              {/* Headline (Orange and Dark Charcoal) */}
              <h1 className="text-4xl md:text-6xl font-black text-[#2D2D2D] mb-6 leading-tight tracking-tight">
                집 구할 때<br />
                <span style={{ color: '#FF6B35' }}>수수료는 0원</span>
              </h1>

              <p className="text-base md:text-lg mb-8 leading-relaxed text-[#666666]">
                집주인과 직접 연락하여 불필요한 비용을 세이브하세요.<br />
                사회초년생을 위한 실시간 1:1 대화 및 안전 가이드를 제공합니다.
              </p>

              {/* Clean White Search Card - Expanded Size */}
              <form onSubmit={handleSearch}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100/90 overflow-hidden mb-6 transition-all focus-within:shadow-2xl">
                
                {/* Search Type Filter */}
                <div className="flex bg-gray-50/50 border-b border-gray-100">
                  {(['전체', '전세', '월세'] as const).map(t => (
                    <button key={t} type="button" onClick={() => setSearchType(t)}
                      className="flex-1 py-4 text-sm font-bold transition-all"
                      style={{
                        background: searchType === t ? '#FF6B35' : 'transparent',
                        color: searchType === t ? 'white' : '#6C757D',
                      }}>
                      {t}
                    </button>
                  ))}
                </div>

                {/* Input Area */}
                <div className="flex items-center gap-3 p-3">
                  <div className="flex-1 flex items-center gap-3 px-3">
                    <Search size={20} className="text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="지역, 동네를 입력하세요 (예: 마포구 합정동)"
                      className="w-full bg-transparent outline-none text-sm text-gray-800 py-2.5 font-medium placeholder-gray-400"
                    />
                  </div>
                  <button type="submit"
                    className="px-8 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:bg-orange-600 active:scale-95"
                    style={{ background: '#FF6B35' }}>
                    검색
                  </button>
                </div>
              </form>

              {/* Popular tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-400">추천 검색:</span>
                {['마포구', '성수동', '여의도동', '신촌', '자양동'].map(area => (
                  <button key={area} onClick={() => setSearchQuery(area)}
                    className="text-xs px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-600 rounded-full border border-gray-200 transition-colors">
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Premium Polaroid/Editorial Card Style for Winking Model */}
            <div className="lg:col-span-5 hidden lg:flex justify-center relative select-none">
              {/* Backlight ambient glow */}
              <div className="absolute w-[360px] h-[360px] rounded-full filter blur-[40px] opacity-30"
                style={{
                  background: 'radial-gradient(circle, #FFD3C4 0%, #E8F0FE 70%)',
                  bottom: '10%'
                }} />

              {/* Tilted Polaroid Frame */}
              <div className="relative w-[310px] h-[400px] bg-white p-3 pb-12 rounded-3xl shadow-[0_20px_40px_rgba(255,107,53,0.12)] border border-gray-100 z-10 rotate-[2deg] transition-all duration-300 hover:rotate-0 hover:scale-[1.02] flex flex-col">
                <div className="w-full h-full rounded-2xl overflow-hidden bg-gray-50 flex-1">
                  <img
                    src="/model.png"
                    alt="방방 브랜드 모델 장원영 윙크"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Text under polaroid photo */}
                <div className="pt-3 text-center">
                  <span className="text-[10px] font-black tracking-widest text-orange-500">BANGBANG × WONYOUNG</span>
                </div>
              </div>

              {/* Speech Bubble pointing left */}
              <div className="absolute top-[15%] -left-16 z-20 bg-white text-gray-900 px-4 py-3 rounded-2xl shadow-lg border border-orange-100 flex flex-col items-start rotate-[-4deg] max-w-[200px]">
                <div className="absolute bottom-[-6px] right-[24px] w-3 h-3 bg-white rotate-45 border-r border-b border-orange-50/50" />
                <p className="text-[11px] font-bold text-gray-800 leading-normal">
                  &ldquo;수수료 0원으로 아낀 복비,<br />내 방 꾸미기에 양보해요! 🧡&rdquo;
                </p>
                <span className="text-[9px] text-orange-500 font-extrabold mt-1">방방 뮤즈 장원영</span>
              </div>
            </div>
            
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display: 'block', height: 40 }}>
            <path d="M0,0 C360,60 1080,60 1440,0 L1440,60 L0,60 Z" fill="#F8F9FA" />
          </svg>
        </div>
      </section>

      {/* ══════════════ STATS ══════════════ */}
      <section ref={statsRef} style={{ background: 'white', borderBottom: '1px solid #E9ECEF' }}>
        <div className="container-main py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: '등록 매물', value: c1, suffix: '+', unit: '개', icon: Building2, color: '#FF6B35' },
              { label: '평균 절감 수수료', value: c2, suffix: '만원', unit: '', icon: TrendingDown, color: '#28A745' },
              { label: '직거래 성공', value: c3, suffix: '건+', unit: '', icon: CheckCircle, color: '#17A2B8' },
              { label: '활성 사용자', value: c4, suffix: '명+', unit: '', icon: Users, color: '#6F42C1' },
            ].map(({ label, value, suffix, icon: Icon, color }) => (
              <div key={label} className="flex flex-col items-center text-center md:items-start md:flex-row md:text-left gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}15` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <div>
                  <div className="text-2xl font-extrabold" style={{ color: '#1A1A2E' }}>
                    {value.toLocaleString()}{suffix}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#6C757D' }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section className="py-24" style={{ background: '#F8F9FA' }}>
        <div className="container-main">
          <div className="text-center mb-16">
            <p className="text-sm font-bold mb-2 uppercase tracking-widest" style={{ color: '#FF6B35' }}>
              Why bangbang?
            </p>
            <h2 className="section-title">직거래의 모든 것</h2>
            <p className="mt-3 text-base max-w-md mx-auto" style={{ color: '#6C757D' }}>
              복잡한 부동산 거래를 방방이 쉽고 안전하게 만들어 드립니다
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <div key={title}
                onClick={() => {
                  if (title === '안전 직거래') {
                    setIsSafetyModalOpen(true)
                  } else if (title === '정보 커뮤니티') {
                    setIsCommunityModalOpen(true)
                  } else if (title === '중개수수료 0원') {
                    setIsCommissionModalOpen(true)
                  } else if (title === '실시간 1:1 채팅') {
                    router.push('/chat')
                  }
                }}
                className="card p-7 group cursor-pointer"
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all group-hover:scale-110"
                  style={{ background: bg }}>
                  <Icon size={26} style={{ color }} />
                </div>
                <h3 className="text-lg font-extrabold mb-2" style={{ color: '#1A1A2E' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6C757D' }}>{desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color }}>
                  자세히 보기 <ArrowRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ LISTINGS ══════════════ */}
      <section className="py-24" style={{ background: 'white' }}>
        <div className="container-main">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-sm font-bold mb-2 uppercase tracking-widest" style={{ color: '#FF6B35' }}>New Listings</p>
              <h2 className="section-title">방금 올라온 매물</h2>
            </div>
            <Link href="/listings" className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(255,107,53,0.08)', color: '#FF6B35' }}>
              전체 매물 보기 <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentListings.map((listing, i) => (
              <Link key={listing.id} href={`/listings/${listing.id}`}>
                <div className="card overflow-hidden group cursor-pointer h-full">
                  {/* Image area */}
                  <div className="relative h-48 overflow-hidden"
                    style={{ background: `linear-gradient(${135 + i * 30}deg, #1A1A2E, #302B63)` }}>
                    {/* Actual House Image */}
                    <img
                      src={listing.image}
                      alt={`${listing.address} 매물 이미지`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Shadow overlay to make text readable */}
                    <div className="absolute inset-0 bg-black/20" />

                    {/* Top badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold"
                        style={{ background: listing.type === '전세' ? 'rgba(26,26,46,0.85)' : 'rgba(255,107,53,0.85)', color: 'white', backdropFilter: 'blur(4px)' }}>
                        {listing.type}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold"
                        style={{ background: `${listing.tagColor}CC`, color: 'white', backdropFilter: 'blur(4px)' }}>
                        {listing.tag}
                      </span>
                    </div>

                    {/* Price overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-3"
                      style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                      <p className="text-white font-extrabold text-base">
                        {listing.type === '전세'
                          ? `전세 ${(listing.deposit / 10000).toFixed(0)}억`
                          : `월세 ${listing.deposit / 100 >= 10 ? (listing.deposit / 10000).toFixed(1) + '억' : listing.deposit / 100 + '00만'}/${listing.rent}만`}
                      </p>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      style={{ background: 'rgba(255,107,53,0.15)' }}>
                      <span className="text-white text-sm font-bold px-4 py-2 rounded-xl"
                        style={{ background: 'rgba(255,107,53,0.8)' }}>
                        상세 보기 →
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-1.5">
                      <MapPin size={12} style={{ color: '#ADB5BD', flexShrink: 0 }} />
                      <p className="text-xs font-medium" style={{ color: '#ADB5BD' }}>서울 {listing.address}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs" style={{ color: '#6C757D' }}>
                      <span>{listing.area}㎡</span>
                      <span>{listing.floor}층</span>
                      <span className="px-2 py-0.5 rounded-md font-medium" style={{ background: '#F8F9FA', color: '#28A745' }}>
                        직거래
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════ GUIDE ══════════════ */}
      <section className="py-24" style={{ background: 'white' }}>
        <div className="container-main">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-sm font-bold mb-2 uppercase tracking-widest" style={{ color: '#FF6B35' }}>사회초년생 필독</p>
              <h2 className="section-title">알면 돈 버는 정보</h2>
            </div>
            <Link href="/guide" className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all"
              style={{ background: 'rgba(255,107,53,0.08)', color: '#FF6B35' }}>
              전체 가이드 <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <Link key={guide.title} href="/guide">
                <div className="card overflow-hidden group cursor-pointer flex flex-col h-full bg-white border border-gray-100 hover:shadow-lg transition-all duration-300">
                  {/* Thumbnail Image */}
                  <div className="relative h-44 overflow-hidden bg-gray-50">
                    <img
                      src={guide.image}
                      alt={guide.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold text-white"
                        style={{ background: '#FF6B35' }}>
                        {guide.tag}
                      </span>
                    </div>
                  </div>

                  {/* Contents */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold mb-1">{guide.readTime}</div>
                      <h3 className="font-extrabold text-base text-gray-900 mb-2 leading-snug group-hover:text-orange-500 transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">
                        {guide.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-[11px] font-bold text-gray-700">
                      <span>방방 매거진</span>
                      <span className="flex items-center gap-0.5 text-orange-500">
                        자세히 보기 <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ REVIEWS ══════════════ */}
      <section className="py-24" style={{ background: '#F8F9FA' }}>
        <div className="container-main">
          <div className="text-center mb-14">
            <p className="text-sm font-bold mb-2 uppercase tracking-widest" style={{ color: '#FF6B35' }}>Real Reviews</p>
            <h2 className="section-title">실제 이용자 후기</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div key={i} className="card p-7">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} size={14} fill="#FF6B35" style={{ color: '#FF6B35' }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#1A1A2E' }}>
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm"
                    style={{ background: 'linear-gradient(135deg, #FF6B35, #E85A24)', color: 'white' }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#1A1A2E' }}>{r.name}</p>
                    <p className="text-xs" style={{ color: '#ADB5BD' }}>{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ SAFETY DIRECT DEAL MODAL ══════════════ */}
      {isSafetyModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsSafetyModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #FFF5F2 0%, #FFFFFF 100%)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Shield size={20} className="text-[#FF6B35]" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">안전 직거래 가이드 & 체크리스트</h3>
                  <p className="text-xs text-gray-500">사전 예방부터 최종 계약서 특약까지 한눈에 확인하세요</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSafetyModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50/50">
              <button 
                onClick={() => setActiveTab('check')}
                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'check' ? 'border-[#FF6B35] text-[#FF6B35] bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                1. 계약 전 필수 확인
              </button>
              <button 
                onClick={() => setActiveTab('special')}
                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'special' ? 'border-[#FF6B35] text-[#FF6B35] bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                2. 추천 특약 조항
              </button>
              <button 
                onClick={() => setActiveTab('after')}
                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'after' ? 'border-[#FF6B35] text-[#FF6B35] bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                3. 계약 후 안심 가이드
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* TAB 1: 계약 전 필수 확인 */}
              {activeTab === 'check' && (
                <div className="space-y-4">
                  <div className="flex gap-3 items-start p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                    <AlertTriangle size={18} className="text-[#FF6B35] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-[#FF6B35] font-semibold leading-relaxed">
                      직거래 계약 시에는 공인중개업자의 중개 보증이 없으므로 계약 상대방이 등기부 상 실제 소유주가 맞는지 서류 대조가 필수적입니다.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-orange-50 text-[#FF6B35] font-extrabold text-sm flex items-center justify-center flex-shrink-0 border border-orange-100">1</div>
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900 mb-1">등기부등본 당일 열람</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          계약 직전 대법원 인터넷등기소에서 등기부등본을 직접 열람하여 갑구의 소유주와 계약 상대방이 일치하는지, 을구에 근저당(은행 대출) 및 압류가 과다하지 않은지 반드시 확인하세요.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-orange-50 text-[#FF6B35] font-extrabold text-sm flex items-center justify-center flex-shrink-0 border border-orange-100">2</div>
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900 mb-1">임대인 신분증 진위 확인</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          주민등록증 진위 확인(정부24 국번없이 1382) 또는 운전면허증 진위 확인(도로교통공단 안전운전 통합민원)을 통해 임대인 신분증이 위조되지 않았는지 실시간 검증하세요.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-orange-50 text-[#FF6B35] font-extrabold text-sm flex items-center justify-center flex-shrink-0 border border-orange-100">3</div>
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900 mb-1">소유주 명의 계좌 송금 원칙</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          계약금, 중도금, 잔금은 어떠한 경우에도 대리인이나 타인 명의 계좌로 입금하지 않으며, 오직 등기부등본상 소유주 명의의 은행 계좌로만 이체해야 송금 내역으로 명확한 법적 효력을 갖습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: 추천 특약 조항 */}
              {activeTab === 'special' && (
                <div className="space-y-4">
                  <div className="flex gap-3 items-start p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <FileText size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-600 font-semibold leading-relaxed">
                      임대차 계약서 작성 시 아래 특약을 포함시키면 전세사기 및 대출 문제 발생 시 안전하게 보증금을 전액 돌려받을 수 있습니다.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        title: "대항력 확보 전 신규 권리 설정 금지 특약",
                        desc: "임대인은 잔금 지급일 다음 날(임차인이 전입신고 및 대항력을 완비하는 시점)까지 본 임대차 목적물에 대하여 근저당권 설정 등 새로운 권리를 설정하지 않는다. 이를 위반 시 본 계약은 무효로 하며, 임대인은 임차인에게 보증금 전액 반환 및 계약금의 배액을 배상한다."
                      },
                      {
                        title: "전세보증보험 가입 불가 시 해제 특약",
                        desc: "임대인 또는 본 임대차 목적물의 하자로 인하여 전세보증금 반환보증보험 가입이 거절될 경우 본 계약은 자동으로 무효가 되며, 임대인은 임차인에게 보증금 및 계약금 전액을 지체 없이 즉시 반환한다."
                      },
                      {
                        title: "국세·지방세 완납 증명 의무 특약",
                        desc: "임대인은 잔금 지급 전까지 국세 및 지방세 완납증명서를 임차인에게 제시하여야 하며, 미납 세금이 존재하거나 잔금 지급 전 미납 세금으로 인해 압류 등이 개시될 경우 임차인은 계약을 해제할 수 있다."
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-sm text-gray-900">{item.title}</h4>
                          <button
                            onClick={() => copyToClipboard(item.desc, idx)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-gray-500 hover:bg-gray-100 transition-colors border flex items-center gap-1 bg-white"
                          >
                            {copiedId === idx ? <Check size={10} className="text-[#FF6B35]" /> : <Copy size={10} />}
                            {copiedId === idx ? "복사 완료!" : "특약 복사"}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl leading-relaxed font-mono select-all">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: 계약 후 안심 가이드 */}
              {activeTab === 'after' && (
                <div className="space-y-4">
                  <div className="flex gap-3 items-start p-4 bg-green-50/50 rounded-2xl border border-green-100/50">
                    <CheckCircle size={18} className="text-[#28A745] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-[#28A745] font-semibold leading-relaxed">
                      계약을 마친 후에도 아래의 조치들을 신속하게 이행해야 최종적으로 법적 대항력과 우선변제권을 확보하여 보증금을 온전히 지킬 수 있습니다.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-green-50 text-[#28A745] font-extrabold text-sm flex items-center justify-center flex-shrink-0 border border-green-100">1</div>
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900 mb-1">임대차 계약 즉시 신고 (확정일자 부여)</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          계약 체결일로부터 30일 이내에 관할 주민센터를 방문하거나 부동산거래관리시스템에서 주택 임대차 계약 신고를 완료하세요. 신고와 동시에 확정일자가 자동으로 부여됩니다.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-green-50 text-[#28A745] font-extrabold text-sm flex items-center justify-center flex-shrink-0 border border-green-100">2</div>
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900 mb-1">잔금일 즉시 전입신고 및 점유</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          이사 당일, 잔금을 입금하고 열쇠를 수령하면 즉시 주민센터나 정부24에서 전입신고를 완료해야 합니다. 전입신고와 확정일자가 모두 갖춰져야 대항력과 우선변제권이 생겨 납입한 보증금을 보호받을 수 있습니다.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-green-50 text-[#28A745] font-extrabold text-sm flex items-center justify-center flex-shrink-0 border border-green-100">3</div>
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900 mb-1">전세보증금 반환보증 가입 신청</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          HUG(주택도시보증공사), HF(한국주택금융공사), SGI(서울보증보험) 등 보증기관의 전세금반환보증에 가입하여 임대차 계약 만료 시 보증금을 안전하게 돌려받을 수 있도록 최후의 보장 장치를 마련하세요.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-medium">본 가이드는 주택임대차보호법 및 관계 법령을 기준으로 작성되었습니다.</span>
              <button 
                onClick={() => setIsSafetyModalOpen(false)}
                className="btn-primary text-xs py-2 px-5"
              >
                가이드 확인 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ COMMUNITY MODAL ══════════════ */}
      {isCommunityModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsCommunityModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #F5EEFF 0%, #FFFFFF 100%)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <BookOpen size={20} className="text-[#6F42C1]" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">방방 정보 커뮤니티 가이드</h3>
                  <p className="text-xs text-gray-500">부동산 초보자를 위한 A to Z 유용한 꿀팁과 실시간 질문 답변</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCommunityModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50/50">
              <button 
                onClick={() => setCommTab('guide')}
                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${
                  commTab === 'guide' ? 'border-[#6F42C1] text-[#6F42C1] bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                1. 추천 부동산 가이드
              </button>
              <button 
                onClick={() => setCommTab('qa')}
                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${
                  commTab === 'qa' ? 'border-[#6F42C1] text-[#6F42C1] bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                2. 실시간 단골 질문 (Q&A)
              </button>
              <button 
                onClick={() => setCommTab('rules')}
                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${
                  commTab === 'rules' ? 'border-[#6F42C1] text-[#6F42C1] bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                3. 커뮤니티 소통 매너
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* TAB 1: 추천 부동산 가이드 */}
              {commTab === 'guide' && (
                <div className="space-y-4">
                  <div className="flex gap-3 items-start p-4 bg-purple-50/50 rounded-2xl border border-purple-100/50">
                    <BookOpen size={18} className="text-[#6F42C1] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-[#6F42C1] font-semibold leading-relaxed">
                      방방 매거진에서 초보 회원들이 가장 유용하게 읽은 인기 가이드를 요약해 드립니다. 자세한 본문은 가이드 보기 링크에서 확인해보세요.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-extrabold text-sm text-gray-900">등기부등본 3단계 해독법</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-50 text-[#6F42C1] font-bold">서류 분석</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        갑구(소유권)에서는 신분증과 등기인 명의 대조, 을구(소유권 외 권리)에서는 대출 근저당을 확인해 보증금을 지켜내세요. 융자금이 집값 시세의 60% 이상이면 깡통전세 위험이 있습니다.
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-extrabold text-sm text-gray-900">전세보증금 반환보증 가입 가이드</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-50 text-[#6F42C1] font-bold">안전 보증</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        HUG 보증보험 가입 기준은 전세가율이 시세의 90% 이내여야 합니다. 직거래 계약일지라도 등기부상 위반건축물 표시가 없어야 하고 임차인 대항력 요건을 완비해야 신청 가능합니다.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <Link 
                      href="/guide" 
                      onClick={() => setIsCommunityModalOpen(false)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6F42C1] px-4 py-2 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                    >
                      전체 가이드 및 매거진 보기 <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              )}

              {/* TAB 2: 실시간 인기 질문 */}
              {commTab === 'qa' && (
                <div className="space-y-4">
                  <div className="flex gap-3 items-start p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <MessageCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-600 font-semibold leading-relaxed">
                      커뮤니티 Q&A 게시판에서 가장 질문 빈도가 높았던 부동산 관련 실제 답변입니다.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-2">
                      <div className="flex gap-2 items-start">
                        <span className="text-xs font-bold text-[#FF6B35] bg-orange-50 px-1.5 py-0.5 rounded-md">Q</span>
                        <h4 className="font-extrabold text-sm text-gray-900">직거래할 때 임대인의 대리인이 온다는데 계약해도 되나요?</h4>
                      </div>
                      <div className="text-xs text-gray-500 leading-relaxed pl-6 border-l-2 border-gray-100">
                        임대인의 <strong>위임장과 인감증명서 원본</strong>을 철저히 확인해야 하며, 인감증명서 발급 날짜가 3개월 이내인지 체크해야 합니다. 임대인 소유주 본인과 직접 영상통화로 위임 사실을 확인하고, 송금은 반드시 실소유주 명의 계좌로 입금해야 유효합니다.
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-2">
                      <div className="flex gap-2 items-start">
                        <span className="text-xs font-bold text-[#FF6B35] bg-orange-50 px-1.5 py-0.5 rounded-md">Q</span>
                        <h4 className="font-extrabold text-sm text-gray-900">세금 미납으로 인한 압류는 어떻게 예방할 수 있나요?</h4>
                      </div>
                      <div className="text-xs text-gray-500 leading-relaxed pl-6 border-l-2 border-gray-100">
                        임대차계약 전에 세금 체납이 있으면 국세청 압류가 발생하여 임차보증금보다 배당 순위가 밀릴 수 있습니다. 계약서 작성 시 <strong>국세·지방세 완납증명서</strong> 제시를 약정하거나 세무서에서 미납 국세 열람 동의를 임대인에게 요청하여 체크해야 안전합니다.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: 커뮤니티 이용 수칙 */}
              {commTab === 'rules' && (
                <div className="space-y-4">
                  <div className="flex gap-3 items-start p-4 bg-green-50/50 rounded-2xl border border-green-100/50">
                    <CheckCircle size={18} className="text-[#28A745] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-[#28A745] font-semibold leading-relaxed">
                      방방 커뮤니티는 집주인과 세입자가 직접 신뢰를 바탕으로 소통하는 공간입니다. 안전하고 투명한 중개 환경을 만들기 위해 아래 수칙을 반드시 준수해 주세요.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-lg bg-green-50 text-[#28A745] text-xs font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900 mb-1">허위 매물 등록 금지</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          거래가 완료된 매물은 즉시 거래완료 상태로 변경해야 하며, 실제 사실과 다른 면적이나 사진을 올려 미끼 매물 행위를 할 경우 게시물 삭제 및 계정 이용이 즉시 정지됩니다.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-lg bg-green-50 text-[#28A745] text-xs font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900 mb-1">매너 있는 소통 및 1:1 대화</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          집주인과 세입자는 상호 존중어를 사용해야 하며, 개인 계좌번호나 주민번호 등의 개인정보는 계약서 작성 등 정식 절차 전까지 채팅을 통해 불필요하게 노출하지 않도록 조심하세요.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-medium">건강하고 투명한 거래 커뮤니티 문화를 함께 만들어요.</span>
              <button 
                onClick={() => setIsCommunityModalOpen(false)}
                className="btn-primary text-xs py-2 px-5"
                style={{ background: 'linear-gradient(135deg, #6F42C1, #5A32A3)' }}
              >
                안내 확인 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ COMMISSION MODAL ══════════════ */}
      {isCommissionModalOpen && (() => {
        const depositVal = parseFloat(calcDeposit) * 10000 || 0;
        const rentVal = parseFloat(calcMonthlyRent) * 10000 || 0;
        
        let transactionAmount = depositVal + (rentVal * 100);
        if (transactionAmount < 50000000) {
          transactionAmount = depositVal + (rentVal * 70);
        }
        
        let rate = 0;
        let limit = Infinity;
        
        if (transactionAmount < 50000000) {
          rate = 0.005;
          limit = 200000;
        } else if (transactionAmount < 100000000) {
          rate = 0.004;
          limit = 300000;
        } else if (transactionAmount < 300000000) {
          rate = 0.003;
          limit = Infinity;
        } else if (transactionAmount < 600000000) {
          rate = 0.004;
          limit = Infinity;
        } else {
          rate = 0.008;
          limit = Infinity;
        }
        
        let comm = Math.floor(transactionAmount * rate);
        if (comm > limit) {
          comm = limit;
        }
        const vat = Math.floor(comm * 0.1);
        const total = comm + vat;
        const rateText = `${(rate * 100).toFixed(1)}%`;

        return (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
            onClick={() => setIsCommissionModalOpen(false)}
          >
            <div 
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-scale-up"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #FFF0EB 0%, #FFFFFF 100%)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <TrendingDown size={20} className="text-[#FF6B35]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900">중개수수료 0원 절약 가이드</h3>
                    <p className="text-xs text-gray-500">방방에서 절약 가능한 복비 계산기 및 수수료 0원의 혜택</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsCommissionModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-gray-100 bg-gray-50/50">
                <button 
                  onClick={() => setCommisTab('calc')}
                  className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${
                    commisTab === 'calc' ? 'border-[#FF6B35] text-[#FF6B35] bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  1. 복비 절약 계산기
                </button>
                <button 
                  onClick={() => setCommisTab('why')}
                  className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${
                    commisTab === 'why' ? 'border-[#FF6B35] text-[#FF6B35] bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  2. 수수료 0원 원리
                </button>
                <button 
                  onClick={() => setCommisTab('tips')}
                  className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${
                    commisTab === 'tips' ? 'border-[#FF6B35] text-[#FF6B35] bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  3. 주거비 추가 절약 팁
                </button>
              </div>

              {/* Content (Scrollable) */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                
                {/* TAB 1: 복비 절약 계산기 */}
                {commisTab === 'calc' && (
                  <div className="space-y-6">
                    <div className="flex gap-3 items-start p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                      <Zap size={18} className="text-[#FF6B35] flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-[#FF6B35] font-semibold leading-relaxed">
                        계약하려는 매물의 보증금과 월세를 입력해 보세요. 방방 직거래를 통해 아낄 수 있는 법정 최대 중개수수료를 즉시 산출해 드립니다.
                      </p>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">보증금 입력 (만원)</label>
                        <div className="relative flex items-center">
                          <input 
                            type="number" 
                            value={calcDeposit}
                            onChange={e => setCalcDeposit(e.target.value)}
                            placeholder="예: 5000"
                            className="input-field pr-12 font-extrabold text-sm"
                          />
                          <span className="absolute right-4 text-xs font-bold text-gray-400">만원</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">월세 입력 (만원)</label>
                        <div className="relative flex items-center">
                          <input 
                            type="number" 
                            value={calcMonthlyRent}
                            onChange={e => setCalcMonthlyRent(e.target.value)}
                            placeholder="예: 50"
                            className="input-field pr-12 font-extrabold text-sm"
                          />
                          <span className="absolute right-4 text-xs font-bold text-gray-400">만원</span>
                        </div>
                      </div>
                    </div>

                    {/* Result Widget */}
                    <div className="p-6 rounded-3xl text-center space-y-4 border border-orange-100 shadow-sm" style={{ background: 'linear-gradient(135deg, #FFF8F6 0%, #FFFFFF 100%)' }}>
                      <p className="text-xs font-bold text-gray-500">방방 직거래 시 절약되는 총 복비 (부가세 10% 포함)</p>
                      <div className="space-y-1">
                        <span className="text-3xl sm:text-4xl font-black text-[#FF6B35]">
                          {total.toLocaleString()}
                        </span>
                        <span className="text-lg font-black text-gray-800"> 원</span>
                      </div>
                      <div className="pt-3 border-t border-dashed border-orange-100/80 flex items-center justify-between text-xs text-gray-500">
                        <span>법정 요율 기준: {rateText} {limit !== Infinity ? `(한도액 ${limit.toLocaleString()}원 적용)` : ''}</span>
                        <span>중개보수 {comm.toLocaleString()}원 + 부가세 {vat.toLocaleString()}원</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: 수수료 0원 원리 */}
                {commisTab === 'why' && (
                  <div className="space-y-4">
                    <div className="flex gap-3 items-start p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                      <TrendingDown size={18} className="text-[#FF6B35] flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-[#FF6B35] font-semibold leading-relaxed">
                        방방 플랫폼은 집주인과 세입자를 다이렉트로 연결하여 유통 및 중개 과정에서 발생하는 수백만 원의 비용 부담을 제로로 만듭니다.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <h4 className="font-extrabold text-sm text-gray-900 mb-1">불필요한 중개 마진 생략</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          기존 부동산 중개소는 매도인과 매수인 양측 모두에게 최대 요율 수준의 중개수수료를 청구합니다. 방방은 직접 소통을 돕기 때문에 중간 수수료 마진이 발생하지 않습니다.
                        </p>
                      </div>

                      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <h4 className="font-extrabold text-sm text-gray-900 mb-1">직접 확인하는 안전한 매물</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          집주인이 직접 실시간으로 관리하는 매물이므로 미끼 매물과 허위 광고 확률이 대폭 낮아집니다. 직거래에 필요한 보증금 반환보증 등의 안전장치를 앱 내에서 원스톱으로 지원합니다.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: 주거비 추가 절약 팁 */}
                {commisTab === 'tips' && (
                  <div className="space-y-4">
                    <div className="flex gap-3 items-start p-4 bg-green-50/50 rounded-2xl border border-green-100/50">
                      <CheckCircle size={18} className="text-[#28A745] flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-[#28A745] font-semibold leading-relaxed">
                        복비 절약 외에도 청년 및 사회초년생이 추가로 챙길 수 있는 주거 지원 꿀혜택들을 놓치지 마세요.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <h4 className="font-extrabold text-sm text-gray-900 mb-1">청년 월세 지원 정책 활용</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          만 19세~34세 청년층을 대상으로 국토부 및 지자체에서 매월 최대 20만 원씩 최대 12개월 동안 월세를 현금으로 지원하는 청년월세 한시 특별지원 신청 조건을 체크해 보세요.
                        </p>
                      </div>

                      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <h4 className="font-extrabold text-sm text-gray-900 mb-1">중소기업 취업청년 전월세보증금 대출</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          연 1.2%의 고정 저금리로 보증금의 최대 1억 원까지 대출을 지원해 주는 버팀목 대출(중기청) 등 전세보증금 대출 제도를 활용하면 매달 나가는 월세 비용 대비 이자 비용을 약 80% 이상 획기적으로 줄일 수 있습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-medium">계산 수수료는 공인중개사법 시행규칙 주택 임대차 상한 요율을 기준으로 산출되었습니다.</span>
                <button 
                  onClick={() => setIsCommissionModalOpen(false)}
                  className="btn-primary text-xs py-2 px-5"
                >
                  가이드 확인 완료
                </button>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  )
}
