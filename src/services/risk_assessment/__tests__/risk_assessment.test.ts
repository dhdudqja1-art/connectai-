import { analyzeTransactionRiskV2 } from '../RiskAssessmentService';
import { TransactionPayload, RegulatoryReport } from '../../models/regulatory_report';

describe('Regulatory Risk Assessment Module v2 Simulation', () => {
    // 가상의 Webhook 페이로드 정의: 접근권한 문제 시나리오 가정
    const mockWebhookPayload: TransactionPayload = {
        transactionId: 'TX123456',
        sourceSystem: 'ExternalPaymentGateway', // 외부 시스템에서 발생
        timestamp: new Date().toISOString(),
        accessScope: ['READ_MINIMAL'], // 위험도가 높은 낮은 권한 요청
        dataPayload: { /* 실제 결제 데이터 */ }
    };

    it('should successfully generate a RegulatoryReport following the [Problem -> Cause -> Solution] 3-step structure', async () => {
        // @ts-ignore (실제 환경에서는 임포트 경로가 정확해야 함)
        const report: RegulatoryReport = await analyzeTransactionRiskV2(mockWebhookPayload);

        // 1. 구조적 검증 (Structural Validation): 필수 필드가 존재하는지 확인
        expect(report).toHaveProperty('problemDefinition');
        expect(report).toHaveProperty('causeAnalysis');
        expect(report).toHaveProperty('mitigationSuggestion');

        // 2. 내용적 검증 (Content Validation): 각 단계가 비어있지 않고, 의미 있는 내용을 포함하는지 확인
        expect(typeof report.problemDefinition).toBe('string');
        expect(report.problemDefinition.length).toBeGreaterThan(50); // 충분한 설명 길이 요구

        expect(typeof report.causeAnalysis).toBe('string');
        expect(report.causeAnalysis).toContain('Source:'); // 원인에 출처가 명시되어야 함
        expect(report.causeAnalysis).toContain('Time:');  // 원인에 시간이 명시되어야 함

        expect(typeof report.mitigationSuggestion).toBe('string');
        expect(report.mitigationSuggestion).toContain('다음 조치사항'); // 해결책이 행동 지침이어야 함
    });

    it('should handle low-risk transactions gracefully', async () => {
        // 정상적인 트랜잭션 시나리오 테스트 (성공적으로 비위험 보고서를 생성하는지 확인)
        const safePayload: TransactionPayload = {
            transactionId: 'TX999999',
            sourceSystem: 'InternalCMS',
            timestamp: new Date().toISOString(),
            accessScope: ['READ_FULL'], // 정상적인 높은 권한 요청
            dataPayload: {}
        };

        const report: RegulatoryReport = await analyzeTransactionRiskV2(safePayload);
        // 위험 경고가 아니므로, '위험성 없음' 메시지가 포함되어야 함.
        expect(report.problemDefinition).toContain('특이 사항 없음'); 
    });
});