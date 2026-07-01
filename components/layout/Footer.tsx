import Link from 'next/link'
import { Home, MessageCircle, BookOpen, Search, Shield, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: '#1A1A2E', color: 'white' }}>
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #FF6B35, #E85A24)' }}>
                <Home size={16} color="white" />
              </div>
              <span className="text-xl font-extrabold">
                bang<span style={{ color: '#FF6B35' }}>bang</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>
              공인중개사 없이 집주인과<br />
              직접 거래하는 부동산 플랫폼.<br />
              중개수수료 0원!
            </p>
          </div>

          {/* 서비스 */}
          <div>
            <h4 className="font-bold mb-4" style={{ color: '#FF6B35' }}>서비스</h4>
            <ul className="space-y-2">
              {[
                { href: '/listings', label: '매물 보기' },
                { href: '/listings/new', label: '매물 등록' },
                { href: '/community', label: '커뮤니티' },
                { href: '/guide', label: '정보 가이드' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-colors hover:text-white"
                    style={{ color: '#9CA3AF' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 정보 */}
          <div>
            <h4 className="font-bold mb-4" style={{ color: '#FF6B35' }}>안전거래</h4>
            <ul className="space-y-2">
              {[
                { href: '/guide#checklist', label: '계약 체크리스트' },
                { href: '/guide#fraud', label: '전세사기 예방법' },
                { href: '/guide#registry', label: '등기부등본 보는법' },
                { href: '/guide#newbie', label: '사회초년생 가이드' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-colors hover:text-white"
                    style={{ color: '#9CA3AF' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 고객지원 */}
          <div>
            <h4 className="font-bold mb-4" style={{ color: '#FF6B35' }}>고객지원</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm" style={{ color: '#9CA3AF' }}>
                <Shield size={14} />
                <span>허위 매물 신고센터</span>
              </li>
              <li className="flex items-center gap-2 text-sm" style={{ color: '#9CA3AF' }}>
                <Phone size={14} />
                <span>전세피해지원센터 1670-1004</span>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-xs font-semibold mb-2" style={{ color: '#6B7280' }}>공식 기관 바로가기</p>
              <div className="flex flex-wrap gap-2">
                {['국토교통부', '대법원 등기소', '전세사기피해지원위원회'].map(label => (
                  <span key={label} className="text-xs px-2 py-1 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.08)', color: '#9CA3AF' }}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <hr className="my-8" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: '#6B7280' }}>
            © 2025 bangbang. All rights reserved. · 이 플랫폼은 중개업자가 아닌 개인 간 거래를 지원합니다.
          </p>
          <div className="flex gap-4 text-xs" style={{ color: '#6B7280' }}>
            <Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link>
            <Link href="/terms" className="hover:text-white transition-colors">이용약관</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
