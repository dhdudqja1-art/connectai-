# 📑 Architecture Expansion Roadmap: Scope 3 Emissions & Environmental Compliance (v1.0)

## 🎯 목표
기존의 트랜잭션 기반 리스크 경고 시스템을 확장하여, 공급망 전반에서 발생하는 **Scope 3 배출량** 관련 규제 위험(Compliance Risk)을 감지하고, 잠재적 재정 손실액($ Cost of Failure)을 예측하는 아키텍처를 구축한다.

## ⚠️ 핵심 기술 난관 (Challenges)
1.  **데이터 비표준성 및 통합:** 공급망 파트너사로부터 오는 데이터는 형식과 측정 기준이 제각각이며, 표준화를 위한 거버넌스 레이어가 필수적이다.
2.  **추정치 의존성 관리:** Scope 3 배출량은 최종 사용처에서 발생하는 것이기에 실시간 측정이 불가능하며, 모델링된 추정치의 오차 범위(Uncertainty Bound)를 반드시 출력에 포함해야 한다.
3.  **규칙의 동적 업데이트:** 환경 규제는 법률 개정에 따라 수시로 변하므로, 하드코딩된 로직이 아닌, Rule Engine 형태의 외부화가 필수적이다.

## 🔧 필요 모듈 및 API 정의 (System Blueprints)

### 1. DataNormalizationService (Data Ingestion Layer)
*   **역할:** 다양한 형식의 원시 데이터를 수집하고, 공통된 `normalized_emissions_record` 스키마로 변환한다.
*   **핵심 로직:** 데이터 정제(Cleaning), 단위 통일(Unit Conversion), 추정치 기반 보간법 적용(Imputation).

### 2. ComplianceRuleEngine (Core Logic Layer)
*   **역할:** 최신 규제 세트(`regulatory_rule_set`)를 입력받아, 정상 트랜잭션이 해당 규칙을 위반하는지 판단한다.
*   **구현 방식:** YAML/JSON 기반의 Rule Set 구조를 채택하여, 새로운 규제가 발생하면 코드 배포 없이 데이터베이스에 규칙만 추가할 수 있도록 한다.

### 3. RiskAlertService (v3) (Integration & Output Layer)
*   **역할:** 트랜잭션 리스크(V2)와 환경 컴플라이언스 위험을 결합하여, 최종 보고서(`IntegratedRiskReport`)를 생성한다.
*   **출력 구조 강제:** 모든 경고 메시지는 다음의 3단계 논리 흐름을 벗어날 수 없다:
    1.  **문제 정의 (Problem):** "규제 위반 발생" 또는 "배출량 임계치 초과".
    2.  **원인 분석 (Cause):** "공급망 A의 [활동 종류] 과정에서 측정 오류/법적 변경으로 인해."
    3.  **해결책 제시 (Solution):** "즉시 대체 공급처 B를 통해 트랜잭션을 처리하고, 감축 목표치를 상향 조정할 것을 권고함."

## 🚀 향후 개발 계획 (Next Milestones)
1. DataNormalizationService의 PoC 구축 및 초기 데이터셋 테스트.
2. ComplianceRuleEngine에 핵심 규제(e.g., EU CBAM)를 정의하고, 단위 테스트 환경에서 검증.
3. 최종적으로 RiskAlertService v3에서 두 위험 유형을 통합하는 API 게이트웨이 구현.

---
**작성자:** 💻 코다리 (Senior Fullstack Engineer)
**날짜:** 2026-05-16