/**
 * @typedef {object} TransactionPayload
 * @description 외부 결제 게이트웨이(PayPal, Stripe 등)에서 오는 표준화된 웹훅 데이터 형식.
 */
export interface TransactionPayload {
    transactionId: string; // Unique ID for traceability
    userId: string;        // The customer who made the transaction
    amountCents: number;   // 결제 금액 (가장 작은 단위로 받음)
    currencyCode: string;  // USD, EUR 등
    timestamp: Date;       // 트랜잭션 발생 시점 (검증 시점을 잡는 핵심)
    gatewayReferenceId: string; // 게이트웨이 자체의 참조 ID
}

/**
 * @typedef {object} RiskScoreResult
 * @description 위험 평가 결과 객체. 신뢰성 증명을 위해 필수 메타데이터를 포함합니다.
 */
export interface RiskScoreResult {
    score: number;             // 0 (안전) ~ 100 (심각한 위협)
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'; // 직관적 위험 레벨
    alertMessage: string;      // 고객에게 제시할 안도감/경고 문구
    isCompliant: boolean;      // 규제 준수 여부 (Boolean로 명확히 구분)
    metadata: {                // 트레이서빌리티 핵심 영역
        validationTimestamp: Date; // 이 API가 검증한 시점
        sourceRegulationId: string; // 사용된 규제 데이터 ID (ex: GDPR_001)
        dataSourceConfidence: number; // 데이터 출처 신뢰도 점수 (0.0 ~ 1.0)
    };
}