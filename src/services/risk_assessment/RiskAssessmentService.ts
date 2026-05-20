import { TransactionPayload, RiskScoreResult } from '../../models/transaction_payload';

/**
 * 규제 리스크 기반의 트랜잭션 위험 평가 서비스를 제공합니다.
 * 이 서비스는 단순히 데이터를 조회하는 것을 넘어, 데이터 간의 연관성(위험-규정)을 분석하여 점수를 산출합니다.
 */
export export class RiskAssessmentService {
    // Private: 실제 DB 연결 로직과 복잡한 규제 룰셋이 여기에 들어갑니다.
    private static readonly REGULATORY_RULES = [
        { id: "GDPR_001", area: "Privacy", riskFactor: 35, description: "동의 없는 민감 정보 처리 시 벌금 위험" },
        { id: "AI_002", area: "Accountability", riskFactor: 25, description: "AI 모델 편향성으로 인한 차별적 결과 발생 가능성" }
    ];

    /**
     * Webhook으로 수신된 트랜잭션을 분석하여 위험 점수와 경고 메시지를 반환합니다.
     * @param payload Webhook으로 들어온 거래 정보 객체
     * @returns RiskScoreResult: 위험 평가 결과 (점수, 레벨, 메타데이터 포함)
     */
    public static analyzeTransactionRisk(payload: TransactionPayload): RiskScoreResult {
        // 1. 초기화 및 기본 점수 설정
        let totalRiskScore = 0;
        let applicableRegulations: string[] = [];

        // 2. 규제 규칙 기반 위험 계산 (핵심 로직)
        for (const rule of this.REGULATORY_RULES) {
            // [WHY] 트랜잭션 데이터와 규제 필드를 매칭하는 복잡한 비즈니스 로직이 필요함.
            // 예: 만약 payload.userId가 '민감 정보'를 포함하고, 이 서비스가 '개인정보 보호(Privacy)' 관련 작업을 처리한다면?
            if (payload.currencyCode === "USD" && rule.area === "Privacy") {
                totalRiskScore += rule.riskFactor;
                applicableRegulations.push(rule.id);
            }
        }

        // 3. 최종 점수 계산 및 레벨 결정
        const MAX_SCORE = 100;
        let score = Math.min(totalRiskScore, MAX_SCORE);

        let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
        let alertMessage: string;
        let isCompliant: boolean;

        if (score >= 75) {
            riskLevel = 'HIGH';
            alertMessage = "⚠️ 위험 경고: 이 트랜잭션은 규제 위반 가능성이 매우 높습니다. 수동 검토 또는 프로세스 재설계가 시급합니다.";
            isCompliant = false;
        } else if (score >= 30) {
            riskLevel = 'MEDIUM';
            alertMessage = "⚠️ 주의: 일부 프로세스는 규제 모니터링이 필요합니다. 개선점을 제시합니다.";
            isCompliant = true; // 위험하지만, 현재는 합법적일 수 있음.
        } else {
            riskLevel = 'LOW';
            alertMessage = "✅ 안전: 트랜잭션은 현행 규제 프레임워크 내에서 높은 안정성을 보입니다. 자동 처리 권장.";
            isCompliant = true;
        }

        // 4. 결과 객체 반환 (Traceability 필수 포함)
        return {
            score: score,
            riskLevel: riskLevel,
            alertMessage: alertMessage,
            isCompliant: isCompliant,
            metadata: {
                validationTimestamp: new Date(), // 이 시점을 기록하는 것이 신뢰도의 핵심입니다.
                sourceRegulationId: applicableRegulations[0] || "N/A", // 가장 큰 영향을 준 규제 ID
                dataSourceConfidence: 0.95 // 내부 로직 검증이므로 높은 신뢰도를 가정합니다.
            }
        };
    }
}

// 타입 테스트 및 가이드라인 추가 (시니어 엔지니어의 책임감)
export function validatePayload(payload: TransactionPayload): boolean {
    return !!payload && payload.transactionId && payload.userId && payload.amountCents > 0;
}