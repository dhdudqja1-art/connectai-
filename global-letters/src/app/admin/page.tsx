"use client";

import { useState } from "react";

export default function AdminDashboard() {
  const [knowledgeText, setKnowledgeText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Mock data for already accumulated knowledge
  const [accumulatedDocs, setAccumulatedDocs] = useState([
    { id: 1, title: "본 계정 글.txt", date: "2026-05-14", tokens: "12,450" },
  ]);

  const handleSaveKnowledge = async () => {
    if (knowledgeText.trim().length < 10) {
      alert("학습시킬 글을 조금 더 길게 작성해 주세요.");
      return;
    }

    setIsSaving(true);
    
    try {
      const response = await fetch("/api/upload-knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: knowledgeText }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        alert(data.error);
        setIsSaving(false);
        return;
      }
      
      alert(`✨ ${data.message}`);
      
      const newDoc = {
        id: accumulatedDocs.length + 1,
        title: `새로운 글 업데이트 (${new Date().toLocaleDateString()})`,
        date: new Date().toISOString().split("T")[0],
        tokens: Math.floor(knowledgeText.length * 1.5).toString()
      };
      
      setAccumulatedDocs([newDoc, ...accumulatedDocs]);
      setKnowledgeText("");
    } catch (error) {
      console.error(error);
      alert("업로드 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Knowledge Base</h1>
            <p className="text-sm text-slate-500 mt-2">
              대표님만의 글과 철학을 누적하여 AI 상담사를 진화시키는 비밀 관리소입니다.
            </p>
          </div>
          <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold border border-indigo-100 shadow-sm">
            Admin Mode
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Upload New Knowledge */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                새로운 글 추가하기
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                인스타그램이나 블로그에 작성하신 위로의 글, 심리학적 통찰이 담긴 글을 아래에 붙여넣어 주세요. 
                AI가 이 문체와 철학을 즉시 학습하여 다음 편지 작성부터 활용합니다.
              </p>
              
              <div className="relative">
                <textarea
                  rows={15}
                  value={knowledgeText}
                  onChange={(e) => setKnowledgeText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                  placeholder="여기에 학습시킬 새로운 글을 붙여넣으세요..."
                />
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSaveKnowledge}
                  disabled={isSaving}
                  className={`px-8 py-3 rounded-xl font-medium text-white shadow-sm transition-all flex items-center ${
                    isSaving ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-md"
                  }`}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      AI 학습시키는 중...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                      AI 지식 저장소에 업로드 (학습)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Accumulated Knowledge Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold mb-4 border-b border-slate-100 pb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                누적된 지식 데이터
              </h3>
              
              <ul className="space-y-4">
                {accumulatedDocs.map((doc) => (
                  <li key={doc.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-slate-800 text-sm truncate pr-2">{doc.title}</span>
                      <span className="text-xs text-slate-400 whitespace-nowrap">{doc.date}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        학습 완료
                      </span>
                      <span>{doc.tokens} 토큰</span>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400">
                  저장된 데이터는 사용자 분석 시 자동으로 RAG (검색 증강 생성)에 활용됩니다.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
