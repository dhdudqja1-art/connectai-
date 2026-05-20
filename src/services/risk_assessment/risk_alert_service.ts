/**
 * @module RiskAlertService
 * @description Webhook으로 수신된 트랜잭션 데이터를 기반으로 3단계 구조의 규제 위험 경고를 생성하는 핵심 서비스 로직.
 *              단순 상태 코드 나열이 아닌, '위험(Problem) -> 원인(Cause) -> 해결책(Solution)'을 강제합니다.
 */

import { TransactionData } from '../types/transaction_data'; // 가상의 트랜잭션 타입 임포트

// --- API Response Schema 정의 (핵심!) ---
export interface RiskAlertOutput {
    alertId: string;       // 고유 경고 ID
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'; // 위험 심각도
    status: 'ALERT_GENERATED' | 'NO_RISK'; // 현재 시스템 상태
    riskAnalysis: {
        problemDefinition: string;   // [1] 문제 정의 (What went wrong?) - 사용자에게 직관적으로 전달될 문장
        causeAnalysis: string;       // [2] 원인 분석 (Why did it go wrong? Source/Time) - 기술적 근거 제시
        mitigationSuggestion: string;// [3] 해결책 제시 (How to fix it?) - 즉각적인 액션 플랜 제시
    };
    recommendationSteps: Array<{ step: number; action: string }>; // 추가 조치 단계 목록
}

/**
 * Webhook으로 수신된 트랜잭션을 분석하여 구조화된 위험 경고를 생성합니다.
 * @param transactionData - 외부에서 수신된 원본 트랜잭션 데이터 객체.
 * @returns Promise<RiskAlertOutput> - 3단계 구조가 포함된 위험 경고 JSON 객체.
 */
export const generateStructuredRiskAlert = async (transactionData: TransactionData): Promise<RiskAlertOutput> => {
    const now = new Date().toISOString();

    // 1. 데이터 무결성 및 필수 필드 검증 (Guard Clause)
    if (!transactionData || !transactionData.source || !transactionData.time || typeof transactionData.amount === 'undefined') {
        console.error("🚨 [ERROR] Required fields missing in transaction data.");
        return {
            alertId: `ERR-${Date.now()}`,
            severity: 'CRITICAL',
            status: 'ALERT_GENERATED',
            riskAnalysis: {
                problemDefinition: "처리할 트랜잭션 데이터가 누락되었거나 형식이 유효하지 않습니다.",
                causeAnalysis: `Source: ${transactionData?.source || 'UNKNOWN'}. Time: ${now}`,
                mitigationSuggestion: "시스템 관리자에게 문의하여 데이터를 재전송하거나, Payload 스키마를 확인해야 합니다."
            },
            recommendationSteps: [{ step: 1, action: "Payload 스키마 검토" }, { step: 2, action: "Source 시스템 로그 분석" }]
        };
    }

    // 2. 핵심 비즈니스 로직 (가정): 권한/위험 체크
    const isRiskDetected = await checkRegulatoryCompliance(transactionData);

    if (!isRiskDetected) {
        return {
            alertId: `SAFE-${Date.now()}`,
            severity: 'LOW',
            status: 'NO_RISK',
            riskAnalysis: {
                problemDefinition: "해당 트랜잭션은 현재 정의된 규제 위험 기준을 모두 충족합니다.",
                causeAnalysis: `Source: ${transactionData.source}. Time: ${now}. Amount: ${transactionData.amount}`,
                mitigationSuggestion: "정상적인 프로세스로 간주하고 다음 단계로 진행하십시오."
            },
            recommendationSteps: [{ step: 1, action: "데이터 기록 및 감사 로그 저장" }]
        };
    }

    // 3. 위험 경고 생성 (핵심 로직)
    const riskAlert: RiskAlertOutput = {
        alertId: `RISK-${Date.now()}`,
        severity: 'CRITICAL', // 일단 가장 심각한 것으로 가정하고 시작
        status: 'ALERT_GENERATED',
        riskAnalysis: {
            // [1] 문제 정의 (What went wrong?) - 비즈니스 관점의 언어 사용
            problemDefinition: `[규정 위반 위험 감지]: ${transactionData.source}에서 발생한 트랜잭션은 현재 규제 기준 $${(transactionData.amount * 0.9).toFixed(2)}를 초과하여 처리되었습니다. 이는 잠재적 법규 리스크를 야기합니다.`,
            // [2] 원인 분석 (Why did it go wrong? Source/Time) - 기술적 증거 제시
            causeAnalysis: `Source: ${transactionData.source}. Time: ${transactionData.time} (${now}). 문제점은 권한 레벨 '${transactionData.permissionLevel}'이 요구되는 최소 기준 '${getRequiredPermission(transactionData.source)}'에 미달했기 때문입니다.`,
            // [3] 해결책 제시 (How to fix it?) - 즉각적이고 구체적인 액션 플랜
            mitigationSuggestion: `[즉시 조치 필요]: 해당 트랜잭션을 임시 보류(Hold)하고, 최고 관리자 승인(Manual Review)을 거쳐 권한 레벨 상향 조정 후 재처리해야 합니다. (권장 절차 ID: PR-104).`
        },
        recommendationSteps: [
            { step: 1, action: "트랜잭션 일시 정지 및 경고 알림 발송" },
            { step: 2, action: "관련 부서 책임자에게 수동 검토 요청 (담당자 지정)" },
            { step: 3, action: "최종 승인 후 감사 기록(Immutable Record)에 원본과 변경 과정을 모두 기록합니다." }
        ]
    };

    return riskAlert;
};


// --- Private Helper Functions (시니어 엔지니어링 관점) ---

/**
 * 가상의 규정 준수 검사 로직. 실제로는 외부 API 호출이 필요함.
 */
const checkRegulatoryCompliance = async (data: TransactionData): Promise<boolean> => {
    // [실제 구현 시, 데이터가 너무 크거나, 권한이 부족하거나, Source의 신뢰도가 낮을 때 true 반환]
    if (data.amount > 1000 && data.permissionLevel !== 'ADMIN') return true;
    return false;
};

/**
 * 트랜잭션 출처에 따른 최소 요구 권한 레벨을 정의합니다.
 */
const getRequiredPermission = (source: string): string => {
    if (source === "API_GATEWAY") return "SUPER_ADMIN";
    if (source === "WEB_FRONTEND") return "USER";
    return "LIMITED";
};

// 가상의 트랜잭션 데이터 타입을 정의합니다. 실제 프로젝트에서는 별도 파일로 분리해야 합니다.
export type TransactionData = {
    source: string;       // 트랜잭션 발생 출처 (예: 'API_GATEWAY', 'WEB_FRONTEND')
    time: string;         // 트랜잭션 발생 시간
    amount: number;       // 금액 (USD)
    permissionLevel: string; // 현재 권한 레벨
};

export default {
    generateStructuredRiskAlert,
};