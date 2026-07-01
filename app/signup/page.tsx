'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, Eye, EyeOff, Mail, Lock, User, Building2, UserCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [role, setRole] = useState<'tenant' | 'landlord'>('tenant')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      if (!supabase) {
        setError('Supabase가 설정되지 않았습니다. .env.local을 확인해주세요.')
        setLoading(false)
        return
      }

      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nickname, role },
        },
      })

      if (signupError) {
        console.error("Supabase signUp error:", signupError)
        setError(signupError.message || '회원가입에 실패했습니다.')
      } else {
        setSuccess(true)
      }
    } catch (err: any) {
      console.error("Unexpected signup exception:", err)
      setError(err?.message || '알 수 없는 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 리다이렉션 핸들러를 가입 완료 시점에 즉시 실행하기 위해 useEffect 연동
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/login')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [success, router])

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4"
        style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)' }}>
        <div className="card p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(40,167,69,0.1)' }}>
            <UserCheck size={32} style={{ color: '#28A745' }} />
          </div>
          <h2 className="text-xl font-extrabold mb-2" style={{ color: '#1A1A2E' }}>회원가입 완료!</h2>
          <p className="text-sm mb-6" style={{ color: '#6C757D' }}>
            가입이 정상적으로 완료되었습니다.<br />
            잠시 후 로그인 페이지로 이동합니다... (2초)
          </p>
          <Link href="/login" className="btn-primary justify-center w-full">지금 로그인하기</Link>
        </div>
      </div>
    )
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
          <h1 className="text-xl font-bold text-white">회원가입</h1>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
            방방과 함께 중개수수료 0원으로 시작하세요
          </p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm"
              style={{ background: 'rgba(220,53,69,0.1)', color: '#DC3545', border: '1px solid rgba(220,53,69,0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1A1A2E' }}>
                회원 유형 *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setRole('tenant')}
                  className="p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all"
                  style={{
                    background: role === 'tenant' ? 'rgba(255,107,53,0.08)' : '#F8F9FA',
                    border: `2px solid ${role === 'tenant' ? '#FF6B35' : 'transparent'}`,
                  }}>
                  <User size={20} style={{ color: role === 'tenant' ? '#FF6B35' : '#ADB5BD' }} />
                  <span className="text-xs font-semibold"
                    style={{ color: role === 'tenant' ? '#FF6B35' : '#6C757D' }}>
                    세입자
                  </span>
                  <span className="text-xs" style={{ color: '#ADB5BD' }}>집 구하는 분</span>
                </button>
                <button type="button" onClick={() => setRole('landlord')}
                  className="p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all"
                  style={{
                    background: role === 'landlord' ? 'rgba(255,107,53,0.08)' : '#F8F9FA',
                    border: `2px solid ${role === 'landlord' ? '#FF6B35' : 'transparent'}`,
                  }}>
                  <Building2 size={20} style={{ color: role === 'landlord' ? '#FF6B35' : '#ADB5BD' }} />
                  <span className="text-xs font-semibold"
                    style={{ color: role === 'landlord' ? '#FF6B35' : '#6C757D' }}>
                    집주인
                  </span>
                  <span className="text-xs" style={{ color: '#ADB5BD' }}>매물 올리는 분</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>닉네임</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#ADB5BD' }} />
                <input type="text" className="input-field pl-10" placeholder="닉네임 입력"
                  value={nickname} onChange={e => setNickname(e.target.value)} required />
              </div>
            </div>

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
                  placeholder="8자 이상 입력"
                  value={password} onChange={e => setPassword(e.target.value)}
                  minLength={8} required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPw ? <EyeOff size={16} style={{ color: '#ADB5BD' }} /> : <Eye size={16} style={{ color: '#ADB5BD' }} />}
                </button>
              </div>
            </div>

            <p className="text-xs" style={{ color: '#ADB5BD' }}>
              가입하면 방방의{' '}
              <Link href="/terms" style={{ color: '#FF6B35' }}>이용약관</Link> 및{' '}
              <Link href="/privacy" style={{ color: '#FF6B35' }}>개인정보처리방침</Link>에 동의하게 됩니다.
            </p>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2"
              style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? '처리 중...' : '가입하기'}
            </button>
          </form>

          <div className="text-center mt-5 text-sm">
            <span style={{ color: '#ADB5BD' }}>이미 계정이 있으신가요? </span>
            <Link href="/login" style={{ color: '#FF6B35' }} className="font-semibold">로그인</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
