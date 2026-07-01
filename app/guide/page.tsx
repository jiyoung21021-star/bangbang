import Link from 'next/link'
import {
  AlertTriangle, FileText, CheckCircle, Shield, BookOpen,
  ChevronRight, ExternalLink, Phone, Home, Lock, Search, ArrowRight
} from 'lucide-react'

const sections = [
  {
    id: 'newbie',
    icon: Home,
    color: '#FF6B35',
    bg: 'rgba(255,107,53,0.08)',
    title: '사회초년생 부동산 입문 가이드',
    desc: '처음 혼자 집을 구하는 분들을 위한 A to Z 가이드입니다.',
    items: [
      { step: 1, title: '집 구하기 전 예산 계획 세우기', content: '보증금 + 월세 + 관리비 + 생활비를 종합적으로 계산하세요. 월 소득의 30% 이내를 주거비로 잡는 것이 일반적입니다.' },
      { step: 2, title: '원하는 지역과 조건 정하기', content: '직장/학교까지 통근시간, 교통, 편의시설, 치안을 고려해 우선순위를 정하세요.' },
      { step: 3, title: '직거래 매물 찾기', content: '방방에서 직거래 매물을 검색하면 중개수수료 없이 집주인과 바로 연결됩니다.' },
      { step: 4, title: '집 직접 방문하여 확인', content: '수압, 누수 흔적, 결로, 채광, 방음을 직접 확인하세요. 낮과 밤 모두 방문하는 것을 권장합니다.' },
      { step: 5, title: '등기부등본 / 건축물대장 확인', content: '계약 전 등기부등본을 발급받아 압류, 가압류, 근저당 설정 여부를 반드시 확인하세요.' },
      { step: 6, title: '계약서 작성 및 계약금 지불', content: '특약사항을 꼼꼼히 확인하고, 계약서에 도장 찍기 전 다시 한번 읽어보세요.' },
      { step: 7, title: '잔금 지급 + 전입신고 + 확정일자', content: '잔금 지급 당일 즉시 전입신고하고 확정일자를 받으세요. 이 3가지가 임차인 권리 보호의 핵심입니다!' },
    ],
  },
  {
    id: 'fraud',
    icon: AlertTriangle,
    color: '#DC3545',
    bg: 'rgba(220,53,69,0.08)',
    title: '전세사기 예방 완전 가이드',
    desc: '전세사기 피해를 막는 핵심 체크포인트를 알아보세요.',
    items: [
      { step: 1, title: '깡통전세 확인법', content: '매매가 대비 전세가율이 80% 이상이면 위험합니다. 집값이 하락하면 보증금을 돌려받지 못할 수 있어요.' },
      { step: 2, title: '선순위 임차인 확인', content: '현재 거주중인 임차인이 있는지, 그들의 보증금이 얼마인지 확인하세요. 합산 금액이 집값 초과 시 위험합니다.' },
      { step: 3, title: '근저당 설정 금액 확인', content: '등기부등본 을구에서 근저당 채권최고액을 확인하세요. (채권최고액 + 보증금) < 집값이어야 안전합니다.' },
      { step: 4, title: '집주인 신원 확인', content: '계약 시 신분증과 등기부등본의 소유자가 일치하는지 반드시 확인하세요. 대리인일 경우 위임장과 인감증명서 요구.' },
      { step: 5, title: '전세보증보험 가입', content: 'HUG(주택도시보증공사) 또는 SGI서울보증의 전세보증보험에 가입하면 집주인이 보증금을 돌려주지 않아도 보상받을 수 있습니다.' },
    ],
  },
  {
    id: 'registry',
    icon: FileText,
    color: '#17A2B8',
    bg: 'rgba(23,162,184,0.08)',
    title: '등기부등본 완벽 해석',
    desc: '등기부등본의 표제부, 갑구, 을구를 한눈에 이해하세요.',
    items: [
      { step: 0, title: '표제부 - 부동산 기본 정보', content: '주소, 면적, 건물 구조, 용도 등 부동산의 기본 현황이 기재됩니다. 실제 계약 면적과 일치하는지 확인하세요.' },
      { step: 0, title: '갑구 - 소유권 관련 사항', content: '소유자가 누구인지, 소유권 이전 이력이 기재됩니다. 압류, 가압류, 경매 신청 등이 있으면 위험 신호입니다.' },
      { step: 0, title: '을구 - 소유권 외 권리 사항', content: '근저당권, 전세권이 기재됩니다. 채권최고액이 높을수록 임차인이 보증금을 돌려받기 어려울 수 있습니다.' },
      { step: 0, title: '발급 방법', content: '대법원 인터넷등기소(iros.go.kr)에서 700원에 발급 가능합니다. 계약 당일 최신 발급본을 확인하세요.' },
    ],
  },
  {
    id: 'checklist',
    icon: CheckCircle,
    color: '#28A745',
    bg: 'rgba(40,167,69,0.08)',
    title: '계약 전/후 체크리스트 20',
    desc: '이 체크리스트만 따라해도 사기 피해를 크게 줄일 수 있습니다.',
    items: [],
  },
]

const checklist = {
  before: [
    '등기부등본 최신본 확인 (계약 당일 발급)',
    '매매가 대비 전세가율 80% 이하 확인',
    '근저당 설정 금액 확인',
    '선순위 임차인 보증금 합계 확인',
    '건축물대장으로 불법 건축물 여부 확인',
    '집주인 신분증 / 등기 소유자 일치 확인',
    '관리비 내역 (전기, 수도, 가스 포함 여부)',
    '하자 (누수, 결로, 곰팡이) 현장 확인',
    '전세보증보험 가입 가능 여부 확인',
    '주변 실거래가 확인 (국토부 실거래가 공개시스템)',
  ],
  contract: [
    '특약사항에 "전입신고 및 확정일자 허용" 명시',
    '계약금 영수증 수령',
    '집주인 계좌로 직접 계좌이체 (제3자 지급 금지)',
    '계약서에 집주인 서명 및 도장 확인',
  ],
  after: [
    '잔금 지급 당일 전입신고 완료',
    '전입신고 당일 확정일자 수령',
    '전세보증보험 가입 (잔금일 이후 1개월 내)',
    '관리비 이체 계좌 확인 및 연락처 저장',
    '하자 발생 시 집주인에게 서면으로 통보',
    '계약 만료 3개월 전 갱신/퇴거 의사 서면 통보',
  ],
}

const agencies = [
  { name: '전세피해지원센터', phone: '1670-1004', desc: '전세사기 피해 상담 및 지원', color: '#DC3545' },
  { name: '주택도시보증공사(HUG)', phone: '1566-9009', desc: '전세보증보험 및 피해 지원', color: '#FF6B35' },
  { name: '법률구조공단', phone: '132', desc: '법률 무료 상담', color: '#17A2B8' },
  { name: '국토교통부 콜센터', phone: '1599-0001', desc: '부동산 정책 및 민원', color: '#28A745' },
]

export default function GuidePage() {
  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E, #16213E)' }}>
        <div className="container-main py-14 text-center">
          <div className="badge mb-4 px-4 py-1.5 text-sm"
            style={{ background: 'rgba(255,107,53,0.2)', color: '#FF8C5A' }}>
            📚 사회초년생 필독 콘텐츠
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
            부동산 정보 가이드
          </h1>
          <p className="text-base max-w-lg mx-auto" style={{ color: '#9CA3AF' }}>
            처음 집을 구하는 분들을 위한<br />
            전세사기 예방부터 계약 완료까지 완벽 가이드
          </p>

          {/* Quick Nav */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {sections.map(s => (
              <a key={s.id} href={`#${s.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#E9ECEF' }}>
                <s.icon size={14} />
                {s.title.split(' ')[0]}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container-main py-10 space-y-10">
        {/* Guide Sections */}
        {sections.map(section => (
          <div key={section.id} id={section.id} className="card p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background: section.bg }}>
                <section.icon size={22} style={{ color: section.color }} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold" style={{ color: '#1A1A2E' }}>{section.title}</h2>
              </div>
            </div>
            <p className="text-sm mb-6" style={{ color: '#6C757D' }}>{section.desc}</p>

            {section.id !== 'checklist' ? (
              <div className="space-y-4">
                {section.items.map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl"
                    style={{ background: section.bg }}>
                    {item.step > 0 && (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                        style={{ background: section.color, color: 'white' }}>
                        {item.step}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-sm mb-1" style={{ color: '#1A1A2E' }}>{item.title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: '#6C757D' }}>{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Checklist */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: '계약 전', icon: Search, items: checklist.before, color: '#DC3545' },
                  { title: '계약 시', icon: FileText, items: checklist.contract, color: '#FF6B35' },
                  { title: '계약 후', icon: CheckCircle, items: checklist.after, color: '#28A745' },
                ].map(({ title, icon: Icon, items, color }) => (
                  <div key={title}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon size={16} style={{ color }} />
                      <h3 className="font-bold text-sm" style={{ color: '#1A1A2E' }}>{title}</h3>
                    </div>
                    <div className="space-y-2">
                      {items.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 rounded-xl"
                          style={{ background: '#F8F9FA' }}>
                          <CheckCircle size={14} className="mt-0.5 flex-shrink-0" style={{ color }} />
                          <p className="text-xs leading-relaxed" style={{ color: '#6C757D' }}>{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Emergency Contacts */}
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(220,53,69,0.08)' }}>
              <Phone size={22} style={{ color: '#DC3545' }} />
            </div>
            <h2 className="text-xl font-extrabold" style={{ color: '#1A1A2E' }}>
              긴급 연락처 & 공식 기관
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {agencies.map(({ name, phone, desc, color }) => (
              <div key={name} className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background: '#F8F9FA', border: `1px solid ${color}20` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}15` }}>
                  <Phone size={16} style={{ color }} />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: '#1A1A2E' }}>{name}</p>
                  <p className="text-lg font-extrabold" style={{ color }}>{phone}</p>
                  <p className="text-xs" style={{ color: '#ADB5BD' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* External Links */}
        <div className="card p-8">
          <h2 className="text-xl font-extrabold mb-4" style={{ color: '#1A1A2E' }}>
            유용한 공식 사이트
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: '대법원 인터넷등기소', url: 'https://www.iros.go.kr', desc: '등기부등본 발급 (700원)', color: '#1A1A2E' },
              { name: '국토부 실거래가 공개', url: 'https://rt.molit.go.kr', desc: '실제 거래 가격 조회', color: '#0F3460' },
              { name: '정부24 전입신고', url: 'https://www.gov.kr', desc: '온라인 전입신고 서비스', color: '#17A2B8' },
            ].map(({ name, url, desc, color }) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl transition-all hover:-translate-y-1"
                style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
                <div>
                  <p className="font-bold text-sm" style={{ color: '#1A1A2E' }}>{name}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6C757D' }}>{desc}</p>
                </div>
                <ExternalLink size={14} style={{ color: '#ADB5BD' }} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
