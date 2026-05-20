export interface RegulatoryData {
  indicator: string; // 예: KYC-V3-RiskScore
  value: number;
  source: string;     // 데이터 출처 (필수)
  verificationTime: string; // 검증 시점 (필수, ISO format 권장)
}

export interface RegulatoryAssessmentReport {
  assessmentResult: 'PASS' | 'FAIL';
  alertMessage: string;       // 사용자에게 보여줄 경고 메시지
  mitigationSuggestion: string; // 해결책 제시 (Actionable Item)
  regulatorySourceUsed: string; // 최종 보고서에 사용된 출처 기록
}

export interface TransactionPayload {
    transactionId: string;
    sku: string;
    // Webhook에서 추출 가능한 접근 권한/티어 레벨 정보 추가 필요 
    userTier: 'Basic' | 'Pro' | 'Enterprise'; 
}