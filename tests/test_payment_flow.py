import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:5000" # 로컬 Staging 환경 URL 가정

def run_e2e_paypal_test():
    """
    PayPal Webhook 핸들러 엔드포인트를 대상으로 E2E 통합 테스트를 실행합니다.
    실제 결제 성공 페이로드(Payload)를 시뮬레이션합니다.
    """
    print("=============================================")
    print("🚀 Starting PayPal Webhook E2E Test Suite...")
    print("---------------------------------------------")

    # 1. Mock Payload 생성 (SUCCESSFUL CAPTURE 이벤트 기준)
    mock_payload = {
        "event_type": "PAYMENT.CAPTURE.COMPLETED", # 가장 중요한 성공 이벤트를 시뮬레이션
        "resource": {
            "id": f"txn_{int(datetime.now().timestamp())}",
            "status": "COMPLETED",
            "amount": {"value": "9900", "currency": "KRW"} # $99를 가정 (원화로 변환)
        },
        "links": [{"rel": "void", "href": "..."}]
    }

    # Webhook 요청 헤더 설정 (보안 검증을 위해 Signature가 필수라고 가정하고 더미 값 사용)
    headers = {
        'Content-Type': 'application/json',
        'PayPal-Signature': 'mock_signature_for_test_12345' # 실제로는 유효한 시그니처 필요
    }

    try:
        print(f"Attempting to POST mock payload to {BASE_URL}/api/webhook/paypal...")
        
        # 요청 실행 (POST)
        response = requests.post(
            f"{BASE_URL}/api/webhook/paypal", 
            data=json.dumps(mock_payload), 
            headers=headers, 
            timeout=10
        )

        print("\n[--- Test Results ---]")
        print(f"Status Code: {response.status_code}")
        print("Response Body:")
        print(response.json())

        if response.status_code == 200 and "success" in response.json().get("message", ""):
            print("\n✅ Test Passed: Webhook endpoint successfully received, parsed, and staged the mock payment.")
        else:
            print("\n❌ Test Failed: Webhook endpoint did not return expected success status or payload processing failed.")

    except requests.exceptions.ConnectionError as e:
        print(f"\n🛑 Connection Error: Could not connect to {BASE_URL}. Ensure the backend server is running on port 5000.")
    except Exception as e:
        print(f"\n💥 An unexpected error occurred during testing: {e}")

if __name__ == "__main__":
    # 테스트 실행 전, 백엔드 서버가 실행 중인지 확인하는 안내 메시지 추가
    print("="*60)
    print("⚠️ 경고: 이 스크립트를 실행하려면 먼저 backend/api_gateway.py를 별도의 터미널에서 실행해야 합니다.")
    print(f"   -> 'python {BASE_URL}의 서버 주소' 를 띄워 주세요. (예: python backend/api_gateway.py)")
    print("="*60)
    run_e2e_paypal_test()