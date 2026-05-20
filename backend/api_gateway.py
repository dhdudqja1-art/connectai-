from flask import Flask, request, jsonify
import logging
import json
import os
from datetime import datetime

# 로깅 설정 (모든 트랜잭션은 로그로 남겨야 합니다.)
logging.basicConfig(level=logging.INFO)
app = Flask(__name__)

# 임시 DB 저장소 역할의 메모리 구조체 (실제로는 Redis/Kafka Queue를 거쳐야 함)
STAGING_PAYMENTS = [] 

@app.route('/api/webhook/paypal', methods=['POST'])
def paypal_webhook():
    """
    PayPal에서 전송하는 Webhook Payload를 수신하고 비동기 처리 준비를 합니다.
    이 엔드포인트는 PayPal에 등록되어야 하며, 보안 검증(Signature Check)이 필수입니다.
    """
    payload = request.get_data()
    # 실제 환경에서는 Signature Header를 받아 유효성을 반드시 검사해야 함 (보안 취약점 방지!)
    signature = request.headers.get('PayPal-Signature') 

    if not signature:
        logging.error("Webhook Failure: Missing PayPal Signature.")
        return jsonify({"status": "failed", "message": "Invalid signature"}), 401

    try:
        # Payload는 보통 JSON 문자열 형태로 들어옵니다.
        data = json.loads(payload.decode('utf-8'))
        
        transaction_id = data.get("resource", {}).get("id")
        status = data.get("event_type")

        if status == "PAYMENT.CAPTURE.COMPLETED":
            payment_details = {
                "transaction_id": transaction_id,
                "timestamp": datetime.now().isoformat(),
                "amount": data['resource']['amount'],
                "status": "SUCCESS",
                "raw_payload": payload.decode('utf-8')[:200] + "..." # 로그용 일부만 저장
            }
            STAGING_PAYMENTS.append(payment_details)
            logging.info(f"✅ Webhook Success: Transaction {transaction_id} captured and staged.")
            return jsonify({"status": "success", "message": "Webhook received and queued for processing."}), 200
        else:
             # 결제 실패 또는 다른 이벤트 처리
            return jsonify({"status": "received", "message": f"Event type {status} handled, no action taken."}), 200

    except Exception as e:
        logging.error(f"Webhook Processing Error: {e}")
        return jsonify({"status": "failed", "message": str(e)}), 500

# 간단한 테스트용 API Gateway 루트
@app.route('/api/gateway/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "service": "API Gateway operational."}), 200

# ==========================================
# [추가] 통계 및 리뷰 수집 파이프라인
# ==========================================

TRAFFIC_FILE = 'traffic_log.json'
REVIEWS_FILE = 'reviews.json'

def load_json(filepath, default_val):
    if not os.path.exists(filepath):
        return default_val
    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except:
            return default_val

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

@app.route('/api/track/visit', methods=['POST', 'OPTIONS'])
def track_visit():
    """웹사이트 방문 시 트래픽 카운트를 증가시킵니다."""
    if request.method == 'OPTIONS':
        return '', 204
    
    today = datetime.now().strftime('%Y-%m-%d')
    traffic_data = load_json(TRAFFIC_FILE, {})
    
    if today not in traffic_data:
        traffic_data[today] = 0
    traffic_data[today] += 1
    
    save_json(TRAFFIC_FILE, traffic_data)
    logging.info(f"📈 방문자 카운트 증가: 오늘 누적 {traffic_data[today]}명")
    return jsonify({"status": "success", "today_visits": traffic_data[today]}), 200

@app.route('/api/track/review', methods=['POST', 'OPTIONS'])
def track_review():
    """사용자가 남긴 리뷰를 수집합니다."""
    if request.method == 'OPTIONS':
        return '', 204
    
    review_data = request.json
    if not review_data:
        return jsonify({"status": "failed", "message": "No payload"}), 400
    
    reviews = load_json(REVIEWS_FILE, [])
    review_entry = {
        "timestamp": datetime.now().isoformat(),
        "rating": review_data.get('rating', 5),
        "content": review_data.get('content', '')
    }
    reviews.append(review_entry)
    save_json(REVIEWS_FILE, reviews)
    logging.info(f"⭐ 새로운 리뷰 접수: 별점 {review_entry['rating']}점")
    return jsonify({"status": "success", "message": "Review saved successfully."}), 200

# 프론트엔드(HTML) 파일에서 직접 접근할 때 발생하는 CORS 에러 방지용 설정
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

if __name__ == '__main__':
    print("--- Webhook Handler API Gateway Started ---")
    # 테스트 목적으로 로컬에서 실행합니다. 실제 배포 시에는 Gunicorn/uWSGI 사용 권장.
    app.run(port=5000, debug=True)