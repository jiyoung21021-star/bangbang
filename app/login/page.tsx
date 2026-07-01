'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    if (!supabase) {
      setError('Supabase가 설정되지 않았습니다. .env.local을 확인해주세요.')
      setLoading(false)
      return
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } else {
      router.push('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF6B35, #E85A24)' }}>
              <Home size={20} color="white" />
            </div>
            <span className="text-2xl font-extrabold text-white">
              bang<span style={{ color: '#FF6B35' }}>bang</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-white">로그인</h1>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
            직거래 부동산 플랫폼에 오신 것을 환영합니다
          </p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm"
              style={{ background: 'rgba(220,53,69,0.1)', color: '#DC3545', border: '1px solid rgba(220,53,69,0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>이메일</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#ADB5BD' }} />
                <input type="email" className="input-field pl-10" placeholder="example@email.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>비밀번호</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#ADB5BD' }} />
                <input type={showPw ? 'text' : 'password'} className="input-field pl-10 pr-10"
                  placeholder="비밀번호 입력"
                  value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPw ? <EyeOff size={16} style={{ color: '#ADB5BD' }} /> : <Eye size={16} style={{ color: '#ADB5BD' }} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2"
              style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <hr className="flex-1" style={{ borderColor: '#E9ECEF' }} />
            <span className="text-xs" style={{ color: '#ADB5BD' }}>또는</span>
            <hr className="flex-1" style={{ borderColor: '#E9ECEF' }} />
          </div>

          <button className="btn-ghost w-full justify-center" style={{ borderColor: '#E9ECEF' }}>
            🇰 카카오로 로그인 <span className="text-xs ml-1 text-gray-400">(준비중)</span>
          </button>

          <div className="flex justify-between items-center mt-6 text-sm">
            <Link href="/signup" style={{ color: '#FF6B35' }} className="font-semibold">
              회원가입
            </Link>
            <button style={{ color: '#ADB5BD' }}>비밀번호 찾기</button>
          </div>
        </div>
      </div>
    </div>
  )
}
