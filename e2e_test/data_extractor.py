import json
from typing import Dict, Any

# 가상의 E2E 테스트 로그를 시뮬레이션합니다. 
# 실제 환경에서는 이 데이터를 test_harness.py의 결과물이나 DB에서 불러와야 합니다.
def load_mock_test_results() -> Dict[str, Any]:
    """
    가정된 E2E 통합 테스트 보고서 (Scope 3 위반 시나리오)를 로드합니다.
    이 구조는 과거 '위험 경고 모듈 v2'의 출력 형태를 반영했습니다.
    """
    return {
        "scenario_id": "scope3_violation_annual",
        "risk_category": "Scope 3 (Supply Chain) 온실가스 배출량 미추적",
        "alert_details": [
            {
                "step": 1,
                "problem": "특정 공급망 파트너 A의 전력 사용 데이터 누락.",
                "cause": {"source": "ERP 시스템 연동 실패", "time_window": "Q3 2025"},
                "mitigation": "수작업 보고서 입력 필요. 자동화 시스템 도입 시 $1M-$2M 비용 절감 예상."
            },
            {
                "step": 2,
                "problem": "원자재 운송 과정의 탄소 배출량 추적 실패.",
                "cause": {"source": "국가별 규제 데이터 불일치", "time_window": "지속적"},
                "mitigation": "표준화된 API 연동 및 통합 인증서 발급 필요. 예상 손실액: $8M."
            },
            {
                "step": 3,
                "problem": "제품 수명 주기 전반의 폐기물 처리 과정 기록 미비.",
                "cause": {"source": "법적 의무 보고 누락", "time_window": "매 분기"},
                "mitigation": "블록체인 기반 감사 추적 시스템 도입 필수. 예상 손실액: $3M."
            }
        ],
        "total_potential_loss_estimate": 12000000 # $12 Million
    }

def extract_key_metrics(test_results: Dict[str, Any]) -> str:
    """
    E2E 테스트 결과에서 비즈니스적 가치를 가지는 핵심 지표 3가지를 추출하여 JSON 문자열로 반환합니다.
    이 함수가 바로 CEO 보고서의 논리 엔진입니다.
    """
    alerts = test_results["alert_details"]
    total_loss = test_results["total_potential_loss_estimate"]

    # 1. 가장 시급하고, 원인과 해결책 제시가 명확한 지표 (Step 2)
    metric_1 = {
        "metric": "탄소 배출량 추적 불일치로 인한 규제 위험 노출",
        "quantitative_value": f"${alerts[1]['cause']['source']} 데이터 불일치에 따른 연간 $8M 잠재 손실.",
        "analysis": f"원인: {alerts[1]['cause']['source']}. 해결책의 가치: 표준화된 API 통합을 통해 위험 감소 규모를 확보함."
    }

    # 2. 시스템 도입으로 가장 큰 비용 절감/효율성을 가져올 지표 (Step 3)
    metric_2 = {
        "metric": "폐기물 처리 과정의 불투명성(Scope 3)으로 인한 감사 위험",
        "quantitative_value": f"${alerts[2]['cause']['source']} 기록 미비로 인해 발생하는 분기별 $3M 잠재 손실.",
        "analysis": f"원인: {alerts[2]['cause']['source']}. 해결책의 가치: 블록체인 기반 감사 추적 시스템 도입을 통해 '불변적 증명 가능성' 확보."
    }

    # 3. 가장 넓은 범위에서 파급력이 크고, 초기 시장 침투가 필요한 지표 (Step 1)
    metric_3 = {
        "metric": "공급망 데이터 연동 실패로 인한 전사적 컴플라이언스 위험",
        "quantitative_value": f"${alerts[0]['cause']['source']} 연동 오류로 인해 발생하는 잠재적 $2M 손실의 시작점.",
        "analysis": f"원인: {alerts[0]['cause']['source']}. 해결책의 가치: 데이터 파이프라인을 고도화하여, 전체 시스템의 '신뢰도(Assurance)'를 근본적으로 높임."
    }

    summary = {
        "title": "잠재적 손실 감소 규모 (Cost of Failure) 분석",
        "total_potential_loss_saved": f"${total_loss:,}",
        "metrics": [metric_1, metric_2, metric_3]
    }
    return json.dumps(summary, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    test_results = load_mock_test_results()
    json_output = extract_key_metrics(test_results)
    print("--- 📈 핵심 위험 지표 요약 데이터 (JSON 포맷) ---")
    print(json_output)