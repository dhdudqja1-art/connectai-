import json
from schemas import LetterSchema # 위에서 만든 스키마 참조

def process_user_story(user_story: str):
    """
    AI LLM을 호출하여 편지를 생성하고, 스키마에 맞는 JSON 객체를 반환하는 가상 함수.
    실제 환경에서는 OpenAI/Anthropic SDK가 사용됩니다.
    """
    print("--- API Gateway: Request received ---")
    # 실제로는 여기에 LLM 호출 로직이 들어갑니다.
    # LLM은 반드시 LetterSchema에 맞는 JSON을 반환하도록 프롬프트 엔지니어링 되어야 합니다.
    
    mock_response = {
        "generated_date": "2026-05-14",
        "greeting": "안녕하세요, 이렇게 용기 내어 마음의 이야기를 적어주셔서 고마워요.",
        "main_letter": f"({user_story}에 대한 공감 메시지가 들어갑니다...) 당신은 혼자가 아니에요. 충분히 지치고 힘든 건 당연해요. 지금 느끼는 감정들은 모두 소중한 신호랍니다...",
        "psychological_advice": {
            "theory": "자기연민(Self-Compassion)",
            "explanation": "스스로에게 친절하게 대하는 법을 배우는 것이 가장 중요합니다.",
            "action_plan": [
                {"step": 1, "title": "감정 명명하기", "instruction": "불안하다고 느낄 때 '아, 내가 지금 불안함을 느끼고 있구나'라고 감정에 이름을 붙여주세요."},
                {"step": 2, "title": "따뜻한 신체 접촉", "instruction": "스트레스가 클 때 손으로 가슴을 감싸 안으며 스스로에게 위로를 건네보세요."}
            ]
        }
    }
    return json.dumps(mock_response)

if __name__ == "__main__":
    # 테스트 실행 예시
    test_story = "최근에 너무 지쳐서 아무것도 하고 싶지 않아요."
    result_json = process_user_story(test_story)
    print("\n--- API Gateway: Success ---")
    print("생성된 JSON 데이터 (이것을 프론트에 렌더링합니다):\n", result_json)

# 이 파일은 백엔드 테스트용이며, 실제 서비스는 Next.js의 API Routes를 통해 배포되어야 합니다.