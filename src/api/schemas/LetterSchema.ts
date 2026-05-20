/**
 * @description 사연 분석 기반으로 생성되는 편지와 행동 가이드의 표준 JSON 스키마입니다.
 * 이 구조는 AI 엔진 출력의 신뢰성을 보장하는 핵심 계약서 역할을 합니다.
 */
export const LetterSchema = {
    type: "object",
    properties: {
        generated_date: { type: "string", description: "오늘 날짜 (YYYY-MM-DD)" },
        greeting: { type: "string", description: "사용자에게 전하는 다정하고 따뜻한 시작 인사말." },
        main_letter: { 
            type: "string", 
            description: "사용자의 사연에 공감하며 작성된 본문 편지입니다. 문체는 매우 부드럽고, 위로와 지지를 담아야 합니다. (최소 500자 이상)" 
        },
        psychological_advice: { 
            type: "object", 
            description: "사용자의 상태를 개선하기 위한 심리학 이론 기반의 구체적인 행동 가이드입니다.",
            properties: {
                theory: { type: "string", description: "적용된 핵심 심리 이론 이름 (예: 인지행동치료, 자기연민)." },
                explanation: { type: "string", description: "이 이론이 왜 필요한지에 대한 간결한 설명." },
                action_plan: { 
                    type: "array", 
                    items: { 
                        type: "object",
                        properties: {
                            step: { type: "integer" },
                            title: { type: "string", description: "구체적인 행동 목표 (예: '감정 일지 쓰기')." },
                            instruction: { type: "string", description: "따뜻하고 실천 가능한 구체적 지침." }
                        },
                        required: ["step", "title", "instruction"]
                    }
                }
            },
            required: ["theory", "action_plan"]
        }
    },
    required: ["generated_date", "greeting", "main_letter", "psychological_advice"]
};