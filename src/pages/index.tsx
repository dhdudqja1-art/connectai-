import React from 'react';
import Head from 'next/head';
// landing-kit에서 가져온 컴포넌트 구조를 가정합니다.
const LetterGeneratorPage = () => {
  return (
    <>
      <Head>
        <title>하루 편지: 당신의 마음을 위한 공간</title>
      </Head>
      <div className="container max-w-4xl mx-auto p-8">
        {/* Hero Section: 서비스 소개 */}
        <section id="hero" className="text-center py-16 bg-light rounded-lg mb-12">
          <h1 className="text-5xl font-bold mb-4">당신만을 위한 오늘의 편지 💌</h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            가장 깊은 고민과 감정을 적어주세요. 따뜻한 시선으로 위로와 행동 가이드를 전해드립니다.
          </p>
        </section>

        {/* Input/Generation Section: 핵심 기능 */}
        <section id="generator" className="bg-white p-8 shadow-xl rounded-lg mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-center">🕊️ 당신의 사연을 들려주세요</h2>
          <label htmlFor="user_story" className="block text-sm font-medium text-gray-700 mb-2">
            오늘 가장 고민하는 감정이나 경험을 적어주세요. (최대 2,000자)
          </label>
          <textarea
            id="user_story"
            rows={15}
            maxLength={2000}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none transition duration-150"
            placeholder="예시) 최근 업무와 인간관계에서 너무 지쳐서, 내가 나를 사랑하는 방법을 모르겠어요. 하루 종일 우울하고 무기력한 기분이에요."
          ></textarea>

          <div className="flex justify-center mt-6 space-x-4">
            {/* 결제 버튼: PayPal 연동 필수 */}
            <button 
                onClick={() => console.log("Attempting payment...")}
                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
            >
                PayPal로 편지 받기 (결제 처리 예정) 💰
            </button>
          </div>

          {/* 결과 표시 영역 */}
          <div id="result_area" className="mt-12 p-6 border-t pt-8 hidden">
             <h3 className="text-2xl font-bold mb-4 text-indigo-700">✨ 당신을 위한 맞춤 편지</h3>
             {/* 여기에 AI가 생성한 결과(HTML/Markdown)가 렌더링됩니다. */}
          </div>
        </section>

      </div>
    </>
  );
};

export default LetterGeneratorPage;