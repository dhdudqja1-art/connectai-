import time
import random
from typing import Optional, Dict, Any

class APIConnectionError(Exception):
    """API 연결 실패 시 발생하는 커스텀 예외."""
    pass

class LLMApiClient:
    """
    LLM API 호출을 위한 안정화된 클라이언트.
    지수 백오프 및 재시도 로직을 포함하여 외부 불안정성을 흡수합니다.
    """
    def __init__(self, api_key: str):
        # 실제 환경에서는 process.env에 저장되어야 합니다. 하드코딩 금지!
        if not api_key:
            raise ValueError("API Key가 필요합니다.")
        self.api_key = api_key

    def _call_llm(self, prompt: str) -> Dict[str, Any]:
        """실제 LLM API를 호출하는 내부 함수 (Mocking 대상)."""
        print(f"--- [DEBUG] Calling external LLM with prompt: '{prompt[:50]}...'")

        # 🚨 시뮬레이션: 일정 확률로 에러 발생을 가정하여 테스트합니다.
        if random.random() < 0.2: # 20% 확률로 실패
            raise APIConnectionError("LLM Rate Limit Exceeded or Network Timeout.")
        
        # 성공 응답 시뮬레이션
        return {
            "status": "success",
            "data_extracted": f"Successfully analyzed trend based on prompt: {prompt[:20]}...",
            "confidence_score": round(random.uniform(0.8, 1.0), 2)
        }

    def query_with_retry(self, prompt: str, max_retries: int = 5, initial_delay: float = 1.0) -> Optional[Dict[str, Any]]:
        """
        지수 백오프를 사용하여 API 호출을 재시도합니다.
        """
        for attempt in range(max_retries):
            try:
                # 실제 API 호출 대신 Mock 함수 사용
                result = self._call_llm(prompt)
                print(f"✅ Success on attempt {attempt + 1}.")
                return result

            except APIConnectionError as e:
                if attempt == max_retries - 1:
                    print(f"❌ Critical Failure: Max retries ({max_retries}) reached. Failed permanently.")
                    raise
                
                # 지수 백오프 계산 (2^attempt * initial_delay)
                wait_time = initial_delay * (2 ** attempt) + random.uniform(0, 1)
                print(f"⚠️ Connection failed: {e}. Retrying in {wait_time:.2f} seconds...")
                time.sleep(wait_time) # 실제 sleep 대신 시뮬레이션 출력

        return None
#