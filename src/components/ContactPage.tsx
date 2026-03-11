import { motion } from 'framer-motion';
import { info } from '../data';
import seonghunImage from '../IMG/seonghun.jpg';

interface ContactPageProps {
  /** 비밀번호별로 노출할 경력 개수 (없으면 전부) */
  maxExperienceItems?: number;
  /** 건너뛸 처음 경력 개수 (해당 항목들 숨김) */
  experienceStartIndex?: number;
}

const ContactPage = ({ maxExperienceItems, experienceStartIndex = 0 }: ContactPageProps) => {
  const experience = [
    {
      company: '리브라텀 파트너스',
      role: '크리에이티브 디렉터',
      period: '2025.03 – 현재',
      items: [
        '글로벌 IR 콘텐츠의 시각 시스템 설계 및 통합 운영',
        '데이터 기반 시각 구조 표준화 및 제작 프로세스 최적화',
        '투자자 대상 커뮤니케이션 영상 구조 재설계',
      ],
    },
    {
      company: '오픈익스체인지',
      role: '아트 디렉터',
      period: '2023.09 – 2025.01',
      items: [
        '실시간 IR 스트리밍 환경에서 시각 디자인 시스템 운영',
        '발표자 중심 포맷의 한계 분석 및 제작 구조 개선',
        '글로벌 금융 이벤트 시각 커뮤니케이션 총괄',
      ],
    },
    {
      company: '미디어파사드 프로젝트',
      role: '프리랜서',
      period: '2022 – 현재',
      items: [
        '아라온 테마파크 2025 / 다중 픽셀 피치 LED 패널 기반 공간 영상 시각 구조 최적화',
        '김해 가야테마파크 2024 / 입체 조형물 대상 프로젝션 매핑 콘텐츠 제작',
        '빛의 공간 2022·2023 / 대형 곡면 구조물 대상 관람 거리 기반 영상 설계 및 왜곡 보정',
      ],
    },
    {
      company: '콘센트릭스 카탈리스트',
      role: '모션 콘텐츠 팀 리더',
      period: '2020.02 – 2023.08',
      items: [
        '글로벌 IT/가전 기업의 USP 영상 및 B2C 콘텐츠 기획·제작',
        '디자인 팀 매니징 및 다국적 프로젝트 품질 일관성 유지',
        '69개국 글로벌 웹사이트 운영을 위한 webm/mp4/JSON 포맷 영상 소재 제작 총괄',
      ],
    },
    {
      company: '키스톤 플레이',
      role: '2D 테크니컬 디렉터',
      period: '2015.09 – 2019.11',
      items: [
        '포스트 프로덕션 단계 2D 시각 효과 및 합성 솔루션 제공',
        'TVCF, 뮤직비디오, 공익광고 등 영상 프로젝트 테크니컬 디렉팅',
        '클라이언트 요구사항 기반 촬영 현장 감독 및 포스트 파이프라인 설계',
      ],
    },
    {
      company: '포스트포엠',
      role: '선임 2D 아티스트',
      period: '2014.10 – 2015.09',
      items: [
        '대규모 미디어 캠페인용 고해상도 영상 소스 제작 및 브랜드 모션 그래픽 연출',
        '광고 영상 합성 작업의 품질 기준 수립 및 주니어 아티스트 업무 조율',
        '다양한 포맷의 납품 소재 관리 및 후반 제작 공정 효율화',
      ],
    },
    {
      company: '빅슨 스튜디오',
      role: '2D 아티스트',
      period: '2012.07 – 2014.10',
      items: [
        '매트 페인팅 및 이미지 합성을 통한 TV 광고 공간 연출 및 후반 작업',
        'After Effects·Photoshop 기반 키잉·리터칭·색보정 등 광고 후반 전 공정 참여',
        '복수 프로젝트 동시 진행 환경에서 납기 준수 및 수정 대응 체계 구축',
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-white pt-16"
    >
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* 왼쪽 빈 영역 (사이드바와 동일 너비) */}
        <div className="w-80 flex-shrink-0 border-r border-gray-200 hidden md:block" />

        {/* 오른쪽 고정 패널 (GeneralInfoPanel과 동일 위치·스타일) */}
        <div className="hidden md:block fixed top-16 right-0 w-96 h-[calc(100vh-4rem)] border-l border-gray-200 bg-white z-30 overflow-y-auto p-6 md:p-8" style={{ scrollbarWidth: 'none' }}>
          <h2 className="text-xl font-medium mb-6">Contact</h2>
          <div className="space-y-6 text-sm font-light leading-relaxed">
            <div>
              <p className="font-normal mb-2">전화</p>
              <p className="text-gray-700">+82-10-3890-7954</p>
            </div>
            <div>
              <p className="font-normal mb-2">이메일</p>
              <a href="mailto:huuuuun@kakao.com" className="text-base hover:opacity-70 transition-opacity">
                huuuuun@kakao.com
              </a>
            </div>
            {(info.socials?.linkedin || info.socials?.website) && (
              <div className="flex gap-2 text-sm">
                {info.socials?.linkedin && (
                  <a href={info.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:opacity-70 transition-opacity underline">
                    LinkedIn
                  </a>
                )}
                {info.socials?.linkedin && info.socials?.website && <span className="text-gray-400">|</span>}
                {info.socials?.website && (
                  <a href={info.socials.website} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:opacity-70 transition-opacity underline">
                    TVCF-Site
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden md:mr-96" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="max-w-[850px] mx-auto px-5 py-10 md:px-10 md:py-10">

            {/* 프로필 사진: 모바일·PC 모두 3:4 프레임 유지 */}
            <div className="mb-10 flex justify-center md:justify-start relative left-1/2 -translate-x-1/2 w-screen max-w-[100vw] md:left-0 md:translate-x-0 md:w-auto overflow-visible">
              <div className="w-[60%] max-w-[12rem] aspect-[3/4] md:w-48 md:h-60 rounded-none md:rounded overflow-hidden bg-black">
                <img
                  src={seonghunImage}
                  alt="이성훈 프로필 사진"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* CV 본문 */}
            <div className="contact-cv text-gray-800 leading-relaxed">

              {/* ── HEADER ── */}
              <header className="border-b-2 border-black pb-5 mb-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-1">이성훈</h1>
                <p className="text-base md:text-lg text-gray-600 mb-3">Creative Director / Media Artist</p>
              </header>

              {/* ── PROFESSIONAL PROFILE ── */}
              <section className="mb-8">
                <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-4 uppercase tracking-wide">지원자 프로필</h2>
                <p className="text-[14.5px] text-gray-700 leading-[1.75]">
                  13년간 영상 제작 및 IR 콘텐츠 현장에서 활동하며, 기업 커뮤니케이션 구조와 제작 시스템의 한계를 경험해왔습니다.
                  AI 기술 발전 속에서도 전통적 촬영 중심에 머무는 IR 구조를 재설계하고자 하며,
                  데이터 기반 영상 자동화 파이프라인과 인터랙티브 IR 시스템 구축을 연구하고자 합니다.
                </p>
              </section>

              {/* ── RESEARCH INTERESTS ── */}
              <section className="mb-8">
                <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-4 uppercase tracking-wide">연구 관심 분야</h2>
                <ul className="list-disc pl-5 space-y-1 text-[14.5px] text-gray-700">
                  <li>기업 IR 영상의 시각 커뮤니케이션 구조 분석</li>
                  <li>AI 기반 영상 제작 파이프라인 자동화 설계</li>
                  <li>실시간 스트리밍 환경에서의 디자인 시스템화</li>
                  <li>발표자 의존도를 낮춘 데이터 기반 인터랙티브 IR 모델</li>
                  <li>공간 기반 미디어 시스템의 산업적 확장 가능성</li>
                </ul>
              </section>

              {/* ── EXPERIENCE ── */}
              <section className="mb-8">
                <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-4 uppercase tracking-wide">경력</h2>
                {experience
                .slice(experienceStartIndex, experienceStartIndex + (maxExperienceItems ?? experience.length - experienceStartIndex))
                .map((job, i) => (
                  <div key={i} className="mb-6">
                    {/* 모바일: 회사/직책 → 다음 줄 기간. PC: 한 줄에 회사/직책(왼쪽) + 기간(오른쪽) */}
                    <div className="leading-tight mb-1 md:flex md:flex-wrap md:justify-between md:items-baseline md:gap-2">
                      <div className="font-semibold text-gray-900">{job.company} / {job.role}</div>
                      <span className="text-sm text-gray-600 font-normal mt-0.5 block md:mt-0 md:flex-shrink-0 md:whitespace-nowrap">{job.period}</span>
                    </div>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-[14.5px]">
                      {job.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>

              {/* ── EDUCATION ── */}
              <section className="mb-8">
                <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-4 uppercase tracking-wide">학력</h2>
                <ul className="space-y-5">
                  {[
                    { school: '숭실대학교 글로벌미래교육원 (학점은행제) / 시각디자인학 학사', date: '2026. 02', gpa: '3.91' },
                    { school: '한국폴리텍5대학 / 멀티미디어학과', date: '2009. 02', gpa: '3.95' },
                  ].map(({ school, date, gpa }, i) => (
                    <li key={i} className="block border-b border-gray-100 pb-5 last:border-0 last:pb-0 last:mb-0">
                      <div className="flex flex-wrap justify-between gap-x-3 gap-y-0.5 items-baseline">
                        <span className="font-semibold text-gray-900">{school}</span>
                        <span className="text-sm text-gray-600 font-normal flex-shrink-0 whitespace-nowrap">{date}</span>
                      </div>
                      <p className="text-sm text-gray-600 font-normal mt-1">평점평균: {gpa} / 4.5</p>
                    </li>
                  ))}
                </ul>
              </section>

              {/* ── CERTIFICATIONS & TECHNICAL SKILLS ── */}
              <section>
                <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-4 uppercase tracking-wide">자격증 및 기술</h2>
                <div className="grid grid-cols-[140px_1fr] gap-x-3 gap-y-3 text-[14.5px]">
                  <strong className="text-gray-900">자격증</strong>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>컬러리스트기사 (2025)</li>
                    <li>컬러리스트산업기사 (2025)</li>
                    <li>멀티미디어콘텐츠제작전문가 (2025)</li>
                    <li>ICA DaVinci{'\u00A0'}Resolve 201 (2024)</li>
                  </ul>
                  <strong className="text-gray-900">영상 후반 작업</strong>
                  <span>After Effects, DaVinci{'\u00A0'}Resolve, Flame, Premiere{'\u00A0'}Pro</span>
                  <strong className="text-gray-900">3D·생성형</strong>
                  <span>Blender, ComfyUI, TouchDesigner</span>
                  <strong className="text-gray-900">라이브 스트리밍</strong>
                  <span>vMix, Tricaster, OBS를 통한 라이브 송출 경험</span>
                  <strong className="text-gray-900">AI 파이프라인</strong>
                  <span>AI 기반 영상 디자인 파이프라인 개발</span>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactPage;
