# 🧬 1인 기업 OS — 자가 매뉴얼

## 이 폴더는 무엇인가요?
당신의 1인 기업의 두뇌입니다. 5명의 AI 에이전트가 여기서 일합니다.

## 폴더 구조
- `_shared/` — 모든 에이전트가 매번 읽는 공동 메모리
  - `identity.md` — 회사 정체성 (이름, 톤, 가치)
  - `goals.md` — 목표
  - `decisions.md` — 의사결정 로그 (자가학습이 자동 누적)
  - `_system.md` — 이 파일
- `_agents/<id>/` — 각 에이전트 개인 공간
  - `memory.md` — 자가학습 (자동, append-only)
  - `prompt.md` — 페르소나 디테일 (사용자가 편집)
  - `config.md` — API 키·시크릿 (`.gitignore`로 보호)
- `sessions/<ts>/` — 세션별 산출물 (자동)
- `_cache/` — API 응답 캐시 (sync 제외)

## 메모리 위계 (충돌 시 우선순위)
1. `decisions.md` — 가장 강한 신뢰
2. `identity.md`
3. `goals.md`
4. 개인 메모리
5. 지식 베이스 (`10_Wiki/`)

## 다른 PC로 옮길 때
1. 새 PC에 Connect AI 설치
2. 👔 모드 ON → "📥 다른 PC에서 가져오기" 선택
3. GitHub URL 입력 → 자동 clone
4. 끝.

## 동기화 정책
- `_shared/`, `_agents/*/memory.md`, `_agents/*/prompt.md`, `sessions/` → git sync ✅
- `_agents/*/config.md`, `_cache/` → git sync ❌ (시크릿·캐시)

## 5명의 에이전트 팀 (그리스 신화 에이전트)
- 🧭 **CEO** (Chief Executive Agent): 오케스트레이션, 작업 분해, 종합 판단, 다음 액션 결정
- 🔥 **프로메테우스 (Prometheus)**: 비서 & 기획자. 일정·할 일 관리, 데일리 브리핑, 다른 에이전트 작업 요약 및 텔레그램 보고, 작업 일정 기획
- 🪨 **시시포스 (Sisyphus)**: 메인 감성 콘텐츠 작가. 사랑·신앙·성찰 감성 글쓰기, 인스타그램 피드/스레드 텍스트 카피라이팅, 문장 처방전 편지 기획 및 작성, 에세이 초안
- 🌍 **아틀라스 (Atlas)**: 트렌드 & 자료 분석가. 독자 피드백 조사 및 분석, 에세이 및 심리학 관련 자료 조사, 인스타그램/스레드 트렌드 분석, 정보 요약
- 🔨 **헤파이스토스 (Hephaestus)**: 시니어 자동화 엔지니어. 웹사이트 및 자동화 스크립트 작성, API 연동, 봇 개발, 시스템 검증 및 디버깅, git 워크플로

