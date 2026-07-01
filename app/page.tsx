'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search, Shield, Home, BookOpen, ChevronRight, MessageCircle,
  Users, FileText, Sparkles, PlusCircle, ArrowRight
} from 'lucide-react'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'전체' | '전세' | '월세'>('전체')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (searchType !== '전체') params.set('type', searchType)
    router.push(`/listings?${params.toString()}`)
  }

  // 당근마켓 스타일의 포털 메뉴 리스트
  const portalMenus = [
    {
      title: '방 찾기',
      desc: '다양한 직거래 매물을 지도와 목록으로 쉽고 빠르게 검색하세요.',
      icon: Search,
      href: '/listings',
      color: '#FF6B35', // 주황
      bg: 'rgba(255,107,53,0.08)'
    },
    {
      title: '방 내놓기',
      desc: '직접 우리 집 매물을 등록하고 중개보수 0원으로 거래를 진행하세요.',
      icon: PlusCircle,
      href: '/listings/new',
      color: '#28A745', // 녹색
      bg: 'rgba(40,167,69,0.08)'
    },
    {
      title: '1:1 채팅',
      desc: '집주인과 세입자가 실시간 대화로 조율하고 약속을 조율하세요.',
      icon: MessageCircle,
      href: '/chat',
      color: '#007BFF', // 파랑
      bg: 'rgba(0,123,255,0.08)'
    },
    {
      title: '동네 커뮤니티',
      desc: '사회초년생의 생생한 부동산 후기 및 동네 Q&A를 함께 나누세요.',
      icon: Users,
      href: '/community',
      color: '#6F42C1', // 보라
      bg: 'rgba(111,66,193,0.08)'
    },
    {
      title: '안전거래 가이드',
      desc: '계약서 작성 전 필수 체크리스트와 전세사기 예방 팁을 제공합니다.',
      icon: Shield,
      href: '/guide',
      color: '#17A2B8', // 청록
      bg: 'rgba(23,162,184,0.08)'
    },
    {
      title: '마이페이지',
      desc: '내가 찜한 매물 관리 및 내 소중한 프로필 정보를 편집하세요.',
      icon: FileText,
      href: '/mypage',
      color: '#6C757D', // 회색
      bg: 'rgba(108,117,125,0.08)'
    }
  ]

  return (
    <div style={{ background: '#FFFDFB', minHeight: '100vh' }} className="flex flex-col">

      {/* ══════════════ 1. HERO SECTION ══════════════ */}
      <section className="relative overflow-hidden py-16 md:py-24" style={{ background: 'linear-gradient(135deg, #FFF6F1 0%, #FFFFFF 100%)' }}>
        
        {/* Decorative background glow */}
        <div className="absolute top-[-10%] right-[-10%] w-[380px] h-[380px] rounded-full opacity-40 filter blur-[50px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FFE1D5 0%, transparent 70%)' }} />

        <div className="container-main relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side text and search */}
            <div className="lg:col-span-7 text-left flex flex-col items-start">
              
              <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full mb-6 text-xs font-black"
                style={{ background: '#FFEBE3', border: '1px solid #FFCFC0', color: '#FF6B35' }}>
                <Sparkles size={12} />
                복비 0원! 이웃과의 전·월세 직거래
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-[#2D2D2D] mb-6 leading-tight tracking-tight">
                집 구할 때,<br />
                수수료 없이 <span style={{ color: '#FF6B35' }}>안전하게 직거래</span>
              </h1>

              <p className="text-base md:text-lg mb-8 leading-relaxed text-gray-500">
                어려운 등기부등본 해독부터 계약서 체크리스트까지 방방이 도와드립니다.<br />
                원하는 조건의 방을 찾고 집주인과 1:1 실시간 대화로 조율해 보세요.
              </p>

              {/* Daangn-style Clean Search Bar */}
              <form onSubmit={handleSearch}
                className="w-full max-w-xl bg-white rounded-2xl shadow-[0_12px_24px_rgba(255,107,53,0.06)] border border-[#FFE3DA] overflow-hidden mb-6 transition-all focus-within:shadow-[0_16px_32px_rgba(255,107,53,0.12)]">
                
                {/* Search Type Selector */}
                <div className="flex bg-gray-50/50 border-b border-[#FCEFEA]">
                  {(['전체', '전세', '월세'] as const).map(t => (
                    <button key={t} type="button" onClick={() => setSearchType(t)}
                      className="flex-1 py-3 text-xs font-bold transition-all"
                      style={{
                        background: searchType === t ? '#FF6B35' : 'transparent',
                        color: searchType === t ? 'white' : '#6C757D',
                      }}>
                      {t}
                    </button>
                  ))}
                </div>

                {/* Input Area */}
                <div className="flex items-center gap-3 p-2.5">
                  <div className="flex-1 flex items-center gap-2.5 px-3">
                    <Search size={18} className="text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="지역 또는 동네 이름을 입력하세요 (예: 마포구 합정동)"
                      className="w-full bg-transparent outline-none text-sm text-gray-800 py-2 font-medium placeholder-gray-400"
                    />
                  </div>
                  <button type="submit"
                    className="px-6 py-3 rounded-xl font-bold text-xs text-white transition-all hover:bg-orange-600 active:scale-95 flex-shrink-0"
                    style={{ background: '#FF6B35' }}>
                    방 검색
                  </button>
                </div>
              </form>

              {/* Popular tags */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-gray-400">인기 키워드:</span>
                {['마포구', '성수동', '여의도동', '자양동', '신촌'].map(keyword => (
                  <button key={keyword} onClick={() => setSearchQuery(keyword)}
                    className="px-3 py-1.5 bg-white hover:bg-[#FFF5F2] text-gray-600 rounded-full border border-[#FFE6DE]/60 transition-all font-medium">
                    {keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* Right side Brand card */}
            <div className="lg:col-span-5 hidden lg:flex justify-center relative">
              <div className="relative w-[280px] h-[360px] bg-white p-3 pb-10 rounded-[2rem] shadow-[0_20px_45px_rgba(255,107,53,0.08)] border border-orange-50 rotate-[2deg] transition-all hover:rotate-0 hover:scale-[1.02]">
                <div className="w-full h-full rounded-2xl overflow-hidden bg-gray-50">
                  <img
                    src="/model.png"
                    alt="방방 공식 모델"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="pt-3 text-center">
                  <span className="text-[9px] font-black tracking-widest text-[#FF6B35]/80">BANGBANG × DIRECT DEAL</span>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute top-[10%] -left-12 bg-white text-gray-800 px-4 py-3 rounded-2xl shadow-lg border border-orange-100/50 flex flex-col items-start rotate-[-4deg] max-w-[180px]">
                <p className="text-[10px] font-bold text-gray-700 leading-normal">
                  "복비 0원으로 절약하고 내 맘에 드는 예쁜 방 구해요! 🧡"
                </p>
                <span className="text-[8px] text-[#FF6B35] font-black mt-1">방방 뮤즈 장원영</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════ 2. PORTAL MENU GRID ══════════════ */}
      <section className="py-20 flex-1">
        <div className="container-main">
          
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#FF6B35' }}>
              Service Portal
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-[#2D2D2D]">무엇을 도와드릴까요?</h2>
            <p className="mt-2 text-sm text-gray-400">원하시는 메뉴를 선택하시면 바로 이동하실 수 있습니다.</p>
          </div>

          {/* Menu Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portalMenus.map((menu, idx) => {
              const Icon = menu.icon
              return (
                <Link key={idx} href={menu.href}>
                  <div className="group card p-6 bg-white border border-[#F2ECE9]/55 hover:border-[#FFCFC0]/60 hover:shadow-[0_15px_30px_rgba(255,107,53,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col justify-between">
                    <div>
                      {/* Round Icon container */}
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                        style={{ background: menu.bg }}>
                        <Icon size={22} style={{ color: menu.color }} />
                      </div>
                      
                      {/* Text details */}
                      <h3 className="text-base font-extrabold text-[#2D2D2D] mb-2 group-hover:text-[#FF6B35] transition-colors">
                        {menu.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-gray-400">
                        {menu.desc}
                      </p>
                    </div>

                    {/* Arrow sign */}
                    <div className="mt-4 flex items-center gap-1 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: menu.color }}>
                      바로가기 <ArrowRight size={11} />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

        </div>
      </section>

      {/* ══════════════ 3. SIMPLE FOOTER ══════════════ */}
      <footer className="py-10 border-t border-[#FCEFEA]" style={{ background: '#FFFDFB' }}>
        <div className="container-main text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF6B35, #E85A24)' }}>
              <Home size={12} color="white" />
            </div>
            <span className="text-sm font-extrabold tracking-tight text-[#1A1A2E]">
              bang<span style={{ color: '#FF6B35' }}>bang</span>
            </span>
          </div>
          <p className="text-[11px] text-gray-400">
            &copy; {new Date().getFullYear()} bangbang. 이웃과 직접 거래하는 가장 똑똑하고 안전한 전·월세 직거래 포털.
          </p>
          <p className="text-[10px] text-gray-300 mt-1">
            본 서비스는 직거래 플랫폼이며, 안전거래의 최종 책임은 계약 당사자에게 있으니 직거래 가이드를 철저히 숙지해 주세요.
          </p>
        </div>
      </footer>

    </div>
  )
}
