import json
from typing import Dict, Any, Tuple

# 상수 정의: 모든 계산은 $M (백만 달러) 단위로 진행한다고 가정합니다.
UNIT_CONVERSION = 1_000_000 

def calculate_assurance_value(
    risk_frequency_per_year: float,  # 연간 위험 발생 빈도 (예: 5회)
    avg_loss_per_incident_usd: float, # 건당 평균 피해 규모 (USD)
    mitigation_effectiveness_rate: float # 솔루션 방지 성공률 (0.0 ~ 1.0)
) -> Tuple[float, Dict[str, Any]]:
    """
    핵심 위험 지표를 받아 잠재적 손실 감소액(Assurance Value)을 계산하고,
    3단계 스토리텔링 구조에 맞는 상세 결과를 반환합니다.

    Args:
        risk_frequency_per_year: 연간 예상되는 위험 발생 횟수.
        avg_loss_per_incident_usd: 건당 평균 손실액 (USD).
        mitigation_effectiveness_rate: 솔루션의 방지 성공률 (0.0 ~ 1.0).

    Returns:
        Tuple[float, Dict[str, Any]]: [최종 손실 감소액($M$), 상세 결과물]
    """
    if not (0.0 <= mitigation_effectiveness_rate <= 1.0):
        raise ValueError("Mitigation effectiveness rate는 0.0에서 1.0 사이여야 합니다.")

    # --- 1단계: Pain Point 정의 (위험 발생 시점의 총 손실 규모) ---
    total_potential_loss_usd = risk_frequency_per_year * avg_loss_per_incident_usd
    
    # --- 2단계: Problem/Intervention (우리의 개입이 필요한 지점) ---
    # 우리의 솔루션은 이 Potential Loss를 줄이는 역할을 합니다.
    potential_mitigated_loss_usd = total_potential_loss_usd * mitigation_effectiveness_rate

    # --- 3단계: Assurance Value 계산 (손실 감소액) ---
    assurance_value_usd = potential_mitigated_loss_usd
    
    # 최종 결과 정제 및 M 단위 변환
    final_assurance_m = round(assurance_value_usd / UNIT_CONVERSION, 2)

    # 상세 결과 구조화 (Pitch Deck에 바로 넣을 수 있는 형태)
    detailed_result = {
        "Pain_Stage": {
            "description": "규제 위험 발생 시나리오가 반복될 경우의 총 잠재적 손실액.",
            "metrics": f"{risk_frequency_per_year:.0f}회 * ${avg_loss_per_incident_usd:,.2f}/건",
            "calculated_value_usd": round(total_potential_loss_usd, 2),
        },
        "Problem_Stage": {
            "description": "기존의 수동/사후 대응 방식으로는 위험을 완벽히 통제할 수 없음. 즉각적인 시스템 개입 필요.",
            "metrics": f"{mitigation_effectiveness_rate * 100:.0f}% 수준의 방지 가능성을 지닌 문제 영역.",
        },
        "Assurance_Stage": {
            "description": "본 솔루션 도입을 통해 확보되는 '선제적 통제력'과 '손실 감소액'.",
            "metrics": f"잠재적 손실액 ${total_potential_loss_usd:,.2f} 중 {mitigation_effectiveness_rate * 100:.0f}% 회복.",
            "calculated_value_m": final_assurance_m, # 최종 M 단위 값
        },
        "Summary": {
            "Total Potential Loss (USD)": round(total_potential_loss_usd, 2),
            "Assured Loss Reduction (M$)": final_assurance_m,
        }
    }

    return final_assurance_m, detailed_result

def main():
    """
    모듈의 메인 실행 함수. 테스트 시나리오를 가정하여 실행합니다.
    """
    print("=" * 60)
    print("🚀 ROI 자동 계산 모듈 (Assurance Value Calculator) 시작")
    print("=" * 60)

    # [시뮬레이션 입력 변수 정의]
    # 가상의 시나리오: 'Scope 3 위반'으로 인한 규제 위험이 발생한다고 가정합니다.
    RISK_FREQUENCY = 7.5  # 연간 평균 7.5회 발생 예상
    AVG_LOSS_USD = 1200000   # 건당 평균 피해 규모 $1,200,000
    MITIGATION_RATE = 0.85 # 우리의 시스템이 85%의 손실을 방지 가능

    print(f"--- [입력 파라미터] ---")
    print(f"  - 연간 위험 발생 빈도: {RISK_FREQUENCY:.1f}회")
    print(f"  - 건당 평균 피해 규모: ${AVG_LOSS_USD:,.0f}")
    print(f"  - 시스템 방지 성공률 (Mitigation Rate): {MITIGATION_RATE * 100:.0f}%")

    try:
        final_assurance, results = calculate_assurance_value(
            RISK_FREQUENCY, AVG_LOSS_USD, MITIGATION_RATE
        )
        
        print("\n" + "=" * 60)
        print("✅ 계산 완료! 최종 확보된 통제력 가치 (Assurance Value):")
        print(f"   -> ${final_assurance:,.2f} Million ($ {final_assurance * 1_000_000:,.0f} USD)")
        print("=" * 60 + "\n")

        # Pitch Deck 출력을 위한 JSON 형식의 구조화된 결과 출력 (자동화 통합 목적)
        json_output = json.dumps(results, indent=4)
        print("\n[--- API/JSON Output for Automation ---]")
        print(json_output)
        print("[-----------------------------------\n")

    except ValueError as e:
        print(f"\n❌ 오류 발생: {e}")
    except Exception as e:
        print(f"\n⚠️ 예상치 못한 시스템 에러: {e}")


if __name__ == "__main__":
    # 이 모듈은 main() 함수를 통해 실행되어야 합니다.
    main()