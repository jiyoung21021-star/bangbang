'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Home, Search, MessageCircle, BookOpen, User, Menu, X, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return // Supabase 미설정 시 스킵

    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    if (supabase) await supabase.auth.signOut()
    setUser(null)
    setIsUserMenuOpen(false)
  }

  const navLinks = [
    { href: '/listings', label: '매물 보기', icon: Search },
    { href: '/community', label: '커뮤니티', icon: MessageCircle },
    { href: '/guide', label: '정보 가이드', icon: BookOpen },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-sm' : ''
      }`}
      style={{ background: 'white', borderBottom: '1px solid #E9ECEF' }}
    >
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF6B35, #E85A24)' }}>
              <Home size={16} color="white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight" style={{ color: '#1A1A2E' }}>
              bang<span style={{ color: '#FF6B35' }}>bang</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                style={{ color: '#6C757D' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#FF6B35'; (e.currentTarget as HTMLElement).style.background = '#FFF5F2'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#6C757D'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/listings/new" className="btn-primary text-sm px-4 py-2">
                  + 매물 등록
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                    style={{ background: 'linear-gradient(135deg, #FF6B35, #E85A24)' }}
                  >
                    <User size={16} color="white" />
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-12 w-48 card py-2 z-50">
                      <Link href="/mypage" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                        style={{ color: '#1A1A2E' }} onClick={() => setIsUserMenuOpen(false)}>
                        <User size={15} /> 마이페이지
                      </Link>
                      <Link href="/chat" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                        style={{ color: '#1A1A2E' }} onClick={() => setIsUserMenuOpen(false)}>
                        <MessageCircle size={15} /> 채팅
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm w-full text-left hover:bg-gray-50 transition-colors"
                        style={{ color: '#DC3545' }}>
                        <LogOut size={15} /> 로그아웃
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="btn-ghost text-sm px-4 py-2">로그인</Link>
                <Link href="/signup" className="btn-primary text-sm px-4 py-2">회원가입</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-xl transition-colors hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t" style={{ background: 'white', borderColor: '#E9ECEF' }}>
          <div className="container-main py-4 space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-orange-50 transition-colors"
                style={{ color: '#6C757D' }} onClick={() => setIsMenuOpen(false)}>
                <Icon size={18} /> {label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              {user ? (
                <>
                  <Link href="/listings/new" className="btn-primary text-center justify-center" onClick={() => setIsMenuOpen(false)}>
                    + 매물 등록
                  </Link>
                  <Link href="/mypage" className="btn-ghost text-center justify-center" onClick={() => setIsMenuOpen(false)}>
                    마이페이지
                  </Link>
                  <button onClick={handleLogout} className="btn-ghost text-center justify-center" style={{ color: '#DC3545' }}>
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-ghost text-center justify-center" onClick={() => setIsMenuOpen(false)}>
                    로그인
                  </Link>
                  <Link href="/signup" className="btn-primary text-center justify-center" onClick={() => setIsMenuOpen(false)}>
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
