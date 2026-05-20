"use client";

import { useState, useRef, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

type ProductType = "random" | "free" | "beta" | "deep" | "recovery";
type ViewState = "input" | "selection" | "loading" | "full";

const PRODUCTS = {
  beta: {
    id: "beta",
    name: "문장 처방전 Beta",
    price: "5,000",
    usd: "3.99",
    desc: "내 마음의 이름을 알고 싶은 분들을 위해",
    features: ["오늘 마음의 이름", "맞춤 편지 (1200자)", "나에게 묻는 질문 2개"],
    color: "amber"
  },
  deep: {
    id: "deep",
    name: "깊은 문장 처방전",
    price: "9,000",
    usd: "6.99",
    desc: "더 깊은 통찰과 실천적 지침이 필요한 분들을 위해",
    features: ["마음의 이름 + 사연 요약", "심층 분석 편지 (2000자+)", "질문 3개 + 아주 작은 행동 1개"],
    color: "emerald"
  },
  recovery: {
    id: "recovery",
    name: "7일 회복 편지",
    price: "29,000",
    usd: "21.99",
    desc: "일주일간 저와 함께 천천히 회복하고 싶은 분들을 위해",
    features: ["7일간의 회복 여정 설계", "매일의 짧은 편지 7개", "매일의 작은 행동 미션"],
    color: "indigo"
  }
};

export default function Home() {
  const [view, setView] = useState<ViewState>("input");
  const [userStory, setUserStory] = useState("");
  const [productType, setProductType] = useState<ProductType>("free");
  const [typedText, setTypedText] = useState("");
  const [actionStep, setActionStep] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const [drawCount, setDrawCount] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem("sentence_draw_data");
    if (saved) {
      const { date, count } = JSON.parse(saved);
      if (date === today) {
        setDrawCount(count);
      } else {
        localStorage.setItem("sentence_draw_data", JSON.stringify({ date: today, count: 0 }));
      }
    } else {
      localStorage.setItem("sentence_draw_data", JSON.stringify({ date: today, count: 0 }));
    }
  }, []);

  const typingRef = useRef<NodeJS.Timeout | null>(null);

  const handleStorySubmit = () => {
    if (userStory.trim().length < 10) {
      alert("마음을 조금 더 자세히 적어주시면 더 따뜻한 답장을 드릴 수 있어요. (10자 이상)");
      return;
    }
    setView("selection");
  };

  const handleDrawGreeting = async () => {
    if (drawCount >= 999) {
      alert("오늘의 문장 뽑기는 하루에 999번까지만 가능합니다. 내일 다시 새로운 문장을 만나보세요! ✨");
      return;
    }
    setView("loading");
    setProductType("random");
    const today = new Date().toDateString();
    const newCount = drawCount + 1;
    setDrawCount(newCount);
    localStorage.setItem("sentence_draw_data", JSON.stringify({ date: today, count: newCount }));
    await generateLetter("random");
  };

  const generateLetter = async (type: ProductType) => {
    setView("loading");
    try {
      const response = await fetch("/api/generate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story: userStory, productType: type }),
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
        setView(type === "random" ? "input" : "selection");
        return;
      }
      setView("full");
      startTyping(data.letter, data.action);
    } catch (error) {
      alert("편지 생성 중 오류가 발생했습니다.");
      setView("input");
    }
  };

  const startTyping = (text: string, action: string) => {
    setActionStep(action);
    setTypedText("");
    setIsTyping(true);
    setShowAction(false);
    let i = 0;
    const typeNextChar = () => {
      if (i < text.length) {
        setTypedText(text.substring(0, i + 1));
        i++;
        typingRef.current = setTimeout(typeNextChar, 30);
      } else {
        finishTyping();
      }
    };
    typingRef.current = setTimeout(typeNextChar, 30);
  };

  const finishTyping = () => {
    if (typingRef.current) clearTimeout(typingRef.current);
    setIsTyping(false);
    setShowAction(true);
  };

  const resetForm = () => {
    setUserStory("");
    setView("input");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test", currency: "USD" }}>
      <div className="min-h-screen flex flex-col items-center bg-[#fffdf7] relative selection:bg-amber-100 overflow-x-hidden">
        
        {/* Grain Overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999] grain-texture"></div>

        <div className="w-full max-w-4xl px-6 py-12 md:py-20 flex flex-col items-center">
          
        {view === "input" && (
          <header className="text-center mb-20 w-full max-w-2xl animate-fade-in no-print">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-slate-900 mb-10 tracking-[0.2em] leading-tight">
              마음을 묻다
            </h1>
            <div className="w-16 h-[1px] bg-amber-200 mx-auto mb-10"></div>
            <p className="text-slate-400 text-lg md:text-xl font-light leading-[1.8] tracking-wide">
              무거운 마음은 이 정원에 묻고,<br className="hidden md:block" /> 당신만의 선명한 빛을 찾아가세요.
            </p>
          </header>
        )}

          <main className="w-full relative">
            
            {/* 1. Input Form Area */}
            {view === "input" && (
              <div className="animate-fade-in flex flex-col items-center">
                
                {/* Clean Main Card with Integrated Header */}
                <div className="w-full bg-white rounded-[32px] shadow-layered border border-white relative z-10 transition-shadow hover:shadow-layered-hover overflow-hidden">
                  
                  {/* Card Header with Integrated Draw Button */}
                  <div className="bg-slate-50/50 border-b border-slate-50 px-8 py-4 flex items-center justify-between">
                    <button 
                      onClick={handleDrawGreeting}
                      className="group flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white transition-all active:scale-95 border border-transparent hover:border-slate-100"
                    >
                      <span className="text-[10px] font-bold text-amber-500 tracking-widest uppercase">
                        Today's Wisdom ({3 - drawCount}/3)
                      </span>
                      <svg className="w-3 h-3 text-slate-300 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                    
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                    </div>
                  </div>

                  <div className="p-10 md:p-16">
                    <textarea
                      rows={10}
                      value={userStory}
                      onChange={(e) => setUserStory(e.target.value)}
                      className="block w-full border-none bg-transparent p-0 text-slate-800 text-xl md:text-2xl font-serif leading-relaxed placeholder:text-slate-200 outline-none resize-none"
                      placeholder="요즘 어떤 마음이신가요? 누구에게도 하지 못한 말을 이곳에 편하게 적어주세요..."
                    />
                  
                  <div className="mt-12 flex flex-col sm:flex-row gap-8 items-center justify-between border-t border-slate-50 pt-10">
                    <p className="text-slate-400 text-xs italic font-light">"당신의 사연을 읽으며 참 많이 애쓰셨다는 생각이 들었습니다..."</p>
                    <button
                      onClick={handleStorySubmit}
                      className="group bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-3"
                    >
                      무료 안부 편지 받기
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

            {/* 2. Product Selection */}
            {view === "selection" && (
              <div className="animate-fade-in w-full max-w-5xl mx-auto">
                <div className="text-center mb-16">
                  <p className="text-slate-400 italic mb-4">"조금 더 깊은 처방이 필요하시다면 아래의 여정을 추천드려요."</p>
                  <button 
                    onClick={() => generateLetter("free")}
                    className="text-amber-600 font-bold border-b border-amber-200 hover:text-amber-700 pb-0.5 transition-colors"
                  >
                    그대로 무료 안부 편지만 받을래요 (600자 내외)
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {Object.values(PRODUCTS).map((p) => (
                    <div key={p.id} className="bg-white rounded-[32px] p-10 shadow-layered border border-white flex flex-col hover:-translate-y-2 transition-all duration-500">
                      <div className="mb-10">
                         <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-2">{p.name}</h3>
                         <p className="text-3xl font-serif text-slate-900">{p.price}원</p>
                      </div>
                      <p className="text-sm text-slate-500 mb-10 leading-relaxed h-12">{p.desc}</p>
                      <ul className="space-y-4 mb-12 flex-grow">
                        {p.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                            <span className="text-amber-200 mt-1">●</span> {f}
                          </li>
                        ))}
                      </ul>
                      <PayPalButtons
                        style={{ layout: "vertical", height: 48, shape: "rect", color: "black", label: "pay" }}
                        createOrder={(data, actions) => actions.order.create({ intent: "CAPTURE", purchase_units: [{ amount: { currency_code: "USD", value: p.usd } }] })}
                        onApprove={async (data, actions) => { if (actions.order) { await actions.order.capture(); generateLetter(p.id as ProductType); } }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Loading */}
            {view === "loading" && (
              <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
                <div className="relative w-16 h-16 mb-12">
                   <div className="absolute inset-0 border-2 border-amber-50 rounded-full"></div>
                   <div className="absolute inset-0 border-2 border-t-amber-400 rounded-full animate-spin"></div>
                </div>
                <p className="text-xl font-serif italic text-slate-400 animate-pulse tracking-wide">당신을 위한 문장을 지어드리고 있습니다...</p>
              </div>
            )}

            {view === "full" && (
              <div className="animate-fade-in w-full max-w-2xl mx-auto pb-24">
                <div className="bg-white rounded-[32px] shadow-layered-deep p-10 md:p-20 relative overflow-hidden border border-white">
                  <header className="mb-16 flex justify-between items-end border-b border-slate-50 pb-10">
                     <div>
                        <p className="text-[9px] font-bold tracking-[0.5em] text-slate-300 uppercase mb-3">Serial No.</p>
                        <p className="text-xs font-serif text-slate-400">OYB-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[9px] font-bold tracking-[0.5em] text-slate-300 uppercase mb-3">Issued On</p>
                        <p className="text-xs font-serif text-slate-400">{new Date().toLocaleDateString('ko-KR')}</p>
                     </div>
                  </header>

                  <div className={`font-serif leading-[2.2] text-slate-700 whitespace-pre-wrap ${productType === "random" ? "text-2xl md:text-3xl text-center py-8" : "text-xl md:text-2xl"}`}>
                    {typedText}
                    {isTyping && <span className="inline-block w-1.5 h-8 bg-amber-400 ml-2 animate-pulse"></span>}
                  </div>

                  <footer className="mt-20 pt-10 border-t border-slate-50 flex flex-col sm:flex-row gap-8 items-center justify-between no-print">
                    <button onClick={resetForm} className="text-slate-300 hover:text-slate-500 flex items-center gap-2 text-sm transition-colors group">
                      <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      처음으로 돌아가기
                    </button>
                    <button onClick={() => window.print()} className="bg-slate-900 text-white px-10 py-3.5 rounded-xl text-sm font-bold shadow-xl hover:bg-slate-800 transition-all active:scale-95">PDF 저장하기</button>
                  </footer>
                </div>
              </div>
            )}

          </main>
        </div>

        {view === "input" && (
          <footer className="w-full border-t border-amber-50/50 py-12 px-6 mt-auto no-print text-center">
            <p className="font-serif font-bold text-slate-800 text-lg mb-2">마음을 묻다</p>
            <p className="text-[10px] text-slate-400 tracking-[0.5em] uppercase">&copy; 2026 Master O.Y.B ALL RIGHTS RESERVED.</p>
          </footer>
        )}

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap');
          body { font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; background: #fffdf7; -webkit-font-smoothing: antialiased; }
          .font-serif { font-family: 'Noto Serif KR', serif; font-weight: 700; }
          .shadow-layered { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.02), 0 4px 6px -4px rgba(0, 0, 0, 0.01), 0 25px 50px -12px rgba(0, 0, 0, 0.03); }
          .shadow-layered-hover { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.02), 0 35px 60px -15px rgba(0, 0, 0, 0.05); }
          .shadow-layered-deep { box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.08), 0 18px 36px -18px rgba(0, 0, 0, 0.05); }
          .grain-texture { background-image: url("https://www.transparenttextures.com/patterns/pinstripe-dark.png"); }
          .paper-texture { background-image: url('https://www.transparenttextures.com/patterns/notebook.png'); }
          .animate-fade-in { animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(2deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
          @media print { .no-print { display: none !important; } body { background: white; } }
        `}</style>
      </div>
    </PayPalScriptProvider>
  );
}
