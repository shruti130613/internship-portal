import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Clock, AlertTriangle, CheckCircle2, Bookmark, ArrowLeft, ArrowRight, Send, Layers, Award, Sparkles } from 'lucide-react';
import API from '../../api';

export default function ExamInterface() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [testInfo, setTestInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // qId -> 'A'/'B'/'C'/'D'
  const [markedForReview, setMarkedForReview] = useState({}); // qId -> boolean
  const [timeLeft, setTimeLeft] = useState(15 * 60); // seconds
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestPaper();
  }, [id]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchTestPaper = async () => {
    try {
      const res = await API.get(`/mock-tests/${id}`);
      setTestInfo(res.data.test);
      setQuestions(res.data.questions || []);
      setTimeLeft((res.data.test.duration_mins || 15) * 60);
    } catch (e) {
      // 15 Fallback Questions across 3 difficulty tiers
      const fallbackQuestions = [
        // Level 1: Basic (1-5)
        { id: 101, question_text: "Which of the following data structures in Python is immutable?", option_a: "List", option_b: "Dictionary", option_c: "Tuple", option_d: "Set", skill_tag: "Python", difficulty: "BASIC" },
        { id: 102, question_text: "What will bool([]) evaluate to in Python?", option_a: "True", option_b: "False", option_c: "None", option_d: "TypeError", skill_tag: "Python", difficulty: "BASIC" },
        { id: 103, question_text: "Which built-in Python function is used to check the length of a list or string?", option_a: "count()", option_b: "length()", option_c: "len()", option_d: "size()", skill_tag: "Python", difficulty: "BASIC" },
        { id: 104, question_text: "What is the correct keyword used to define a function in Python?", option_a: "def", option_b: "function", option_c: "func", option_d: "define", skill_tag: "Python", difficulty: "BASIC" },
        { id: 105, question_text: "Which operator is used for integer floor division in Python?", option_a: "/", option_b: "//", option_c: "%", option_d: "^", skill_tag: "Python", difficulty: "BASIC" },

        // Level 2: Logical & Medium (6-10)
        { id: 106, question_text: "What is the primary function of Django's select_related() method?", option_a: "Executes raw SQL directly", option_b: "Performs a SQL JOIN to fetch foreign key objects in a single query", option_c: "Creates a new database table", option_d: "Deletes duplicate rows", skill_tag: "Django", difficulty: "MEDIUM" },
        { id: 107, question_text: "In Python REST APIs, what HTTP method is idempotent and used to replace an entire resource?", option_a: "POST", option_b: "PUT", option_c: "PATCH", option_d: "DELETE", skill_tag: "REST API", difficulty: "MEDIUM" },
        { id: 108, question_text: "Which decorator in Python is used to convert a method into a read-only property?", option_a: "@classmethod", option_b: "@staticmethod", option_c: "@property", option_d: "@setter", skill_tag: "OOP", difficulty: "MEDIUM" },
        { id: 109, question_text: "What is the output of the list comprehension: [x*2 for x in range(4) if x % 2 == 0]?", option_a: "[0, 4]", option_b: "[0, 2, 4, 6]", option_c: "[2, 6]", option_d: "[0, 1, 2, 3]", skill_tag: "Python", difficulty: "MEDIUM" },
        { id: 110, question_text: "How does Python handle memory management for objects whose reference count drops to zero?", option_a: "Requires manual free() execution", option_b: "Reclaims memory automatically via Reference Counting & Garbage Collection", option_c: "Waits until application shutdown", option_d: "Moves memory to swap space", skill_tag: "Runtime", difficulty: "MEDIUM" },

        // Level 3: Advanced Industry Standard (11-15)
        { id: 111, question_text: "In async Python (FastAPI/ASGI), what happens if a blocking CPU-bound sync function is run directly inside an async def endpoint?", option_a: "FastAPI auto-spawns a thread", option_b: "It blocks the main asyncio event loop, stalling concurrent requests", option_c: "It raises an AsyncExecutionError", option_d: "It runs in parallel without issue", skill_tag: "Async Systems", difficulty: "ADVANCED" },
        { id: 112, question_text: "How does Django's @transaction.atomic decorator ensure database integrity in production payment systems?", option_a: "Encrypts SQL queries", option_b: "Encloses operations in a database transaction block and performs a rollback on any unhandled exception", option_c: "Locks entire database tables", option_d: "Caches responses in Redis", skill_tag: "Production DB", difficulty: "ADVANCED" },
        { id: 113, question_text: "When optimizing PostgreSQL query performance for a table with millions of rows, which database index structure is best for timestamp range queries?", option_a: "B-Tree Index", option_b: "GIN Index", option_c: "Hash Index", option_d: "BRIN Index", skill_tag: "Database Perf", difficulty: "ADVANCED" },
        { id: 114, question_text: "What is the key difference between Python's threading and multiprocessing modules under CPython regarding CPU-bound parallel workloads?", option_a: "Threading uses multi-core; multiprocessing uses single-core", option_b: "Threading is constrained by GIL; multiprocessing spawns separate OS processes bypassing GIL", option_c: "Multiprocessing shares memory automatically", option_d: "Threading is deprecated", skill_tag: "Concurrency", difficulty: "ADVANCED" },
        { id: 115, question_text: "In enterprise microservice architectures, what role does a Celery distributed task queue paired with Redis/RabbitMQ perform?", option_a: "Serves static HTML", option_b: "Offloads heavy background tasks asynchronously outside HTTP request-response cycles", option_c: "Acts as an API Gateway router", option_d: "Replaces PostgreSQL database", skill_tag: "Distributed Systems", difficulty: "ADVANCED" }
      ];

      setTestInfo({ id: id || 1, title: 'Python & Backend Assessment', duration_mins: 15 });
      setQuestions(fallbackQuestions);
      setTimeLeft(15 * 60);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId, optionKey) => {
    setUserAnswers({ ...userAnswers, [qId]: optionKey });
  };

  const toggleMarkReview = (qId) => {
    setMarkedForReview({ ...markedForReview, [qId]: !markedForReview[qId] });
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await API.post(`/mock-tests/${id}`, { answers: userAnswers });
      navigate(`/student/test-results/${res.data.id}`, { state: { attempt: res.data } });
    } catch (e) {
      // Mock result fallback navigation
      const mockAttempt = {
        score: 12,
        total_questions: questions.length,
        percentage: 80.0,
        status: 'PASSED',
        topic_breakdown: { 'Basic Fundamentals': 100.0, 'Logical & Medium': 80.0, 'Advanced Industry': 60.0 },
        ai_feedback: 'Outstanding performance (80.0%)! Strong technical mastery across Basic, Medium, and Advanced levels.'
      };
      navigate(`/student/test-results/demo`, { state: { attempt: mockAttempt } });
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionLevelInfo = (idx, q) => {
    if (idx < 5 || q.difficulty === 'BASIC') {
      return {
        level: 'Level 1: Basic Fundamentals',
        tagBg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
        badgeColor: 'text-cyan-700 bg-cyan-100',
        rangeText: 'Q1 - Q5 (Basic Syntax & Concepts)'
      };
    }
    if (idx < 10 || q.difficulty === 'MEDIUM') {
      return {
        level: 'Level 2: Logical & Medium Level',
        tagBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        badgeColor: 'text-indigo-700 bg-indigo-100',
        rangeText: 'Q6 - Q10 (Logical Reasoning & Algorithms)'
      };
    }
    return {
      level: 'Level 3: Advanced Industry Standard',
      tagBg: 'bg-purple-50 text-purple-900 border-purple-200',
      badgeColor: 'text-purple-700 bg-purple-100',
      rangeText: 'Q11 - Q15 (System Design & Real Interview Qs)'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 p-8 text-center text-xs text-slate-500">Loading CBT Exam Paper...</div>
        <Footer />
      </div>
    );
  }

  const currentQ = questions[currentIndex] || {};
  const isLastQuestion = currentIndex === questions.length - 1;
  const answeredCount = Object.keys(userAnswers).length;
  const isTimeWarning = timeLeft < 120; // < 2 mins
  const currentLevelInfo = getQuestionLevelInfo(currentIndex, currentQ);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      
      {/* Exam Top Header */}
      <header className="bg-slate-900 text-white px-6 py-3 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold truncate text-white flex items-center gap-2">
              {testInfo?.title}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-600 text-white">
                15 MCQs (3 Tiers)
              </span>
            </h2>
            <span className="text-[11px] text-slate-400">
              Question {currentIndex + 1} of {questions.length} • {currentLevelInfo.level}
            </span>
          </div>

          {/* Timer Display */}
          <div className={`px-4 py-1.5 rounded-lg border font-mono text-sm font-bold flex items-center gap-2 ${
            isTimeWarning
              ? 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse'
              : 'bg-slate-800 text-indigo-300 border-slate-700'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTimer(timeLeft)}</span>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="btn-primary text-xs py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700"
          >
            Submit Test
          </button>
        </div>
      </header>

      {/* Main Exam Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Question Area (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="portal-card bg-white p-6 border border-slate-200 rounded-xl space-y-6 min-h-[440px] flex flex-col justify-between">
            
            <div>
              {/* Question Header & 3-Tier Difficulty Indicator */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-4 gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${currentLevelInfo.tagBg}`}>
                    {currentLevelInfo.level}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Question {currentIndex + 1} ({currentQ.skill_tag || 'Technical'})
                  </span>
                </div>

                <button
                  onClick={() => toggleMarkReview(currentQ.id)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer w-fit ${
                    markedForReview[currentQ.id]
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  {markedForReview[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}
                </button>
              </div>

              <h3 className="text-sm md:text-base font-bold text-slate-900 leading-relaxed">
                {currentQ.question_text}
              </h3>

              {/* MCQ Options */}
              <div className="space-y-2.5 mt-6">
                {[
                  { key: 'A', text: currentQ.option_a },
                  { key: 'B', text: currentQ.option_b },
                  { key: 'C', text: currentQ.option_c },
                  { key: 'D', text: currentQ.option_d },
                ].map((opt) => {
                  const isSelected = userAnswers[currentQ.id] === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleSelectOption(currentQ.id, opt.key)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-2xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {opt.key}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Question Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="btn-secondary text-xs"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>

              {isLastQuestion ? (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="btn-primary text-xs bg-emerald-600 hover:bg-emerald-700"
                >
                  <Send className="w-4 h-4" /> Submit Exam
                </button>
              ) : (
                <button
                  onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                  className="btn-primary text-xs"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Question Palette Sidebar (1 col) divided into 3 Difficulty Levels */}
        <div className="lg:col-span-1 space-y-4">
          <div className="portal-card bg-white p-5 border border-slate-200 rounded-xl space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" /> Question Palette
            </h4>
            
            {/* Level 1 (Q1-5) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200 block">
                Level 1: Basic (Q1 - 5)
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {questions.slice(0, 5).map((q, idx) => renderPaletteButton(q, idx))}
              </div>
            </div>

            {/* Level 2 (Q6-10) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 block">
                Level 2: Logical (Q6 - 10)
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {questions.slice(5, 10).map((q, idx) => renderPaletteButton(q, idx + 5))}
              </div>
            </div>

            {/* Level 3 (Q11-15) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 block">
                Level 3: Advanced Industry (Q11 - 15)
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {questions.slice(10, 15).map((q, idx) => renderPaletteButton(q, idx + 10))}
              </div>
            </div>

            {/* Legend */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-600 inline-block" /> Answered ({answeredCount})
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-500 inline-block" /> Marked for Review ({Object.values(markedForReview).filter(Boolean).length})
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-200 inline-block" /> Unanswered ({questions.length - answeredCount})
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Confirmation Modal before submission */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Submit Mock Test?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              You have answered <strong>{answeredCount}</strong> out of <strong>{questions.length}</strong> questions across Basic, Medium, and Advanced levels. Are you sure you want to finish and submit your test now?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="btn-secondary text-xs"
              >
                Continue Test
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="btn-primary text-xs bg-emerald-600 hover:bg-emerald-700"
              >
                {submitting ? 'Evaluating...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );

  function renderPaletteButton(q, idx) {
    const isAns = !!userAnswers[q.id];
    const isMarked = !!markedForReview[q.id];
    const isCurr = idx === currentIndex;

    let bgStyle = "bg-slate-100 text-slate-700 border-slate-200";
    if (isAns) bgStyle = "bg-emerald-600 text-white border-emerald-700 font-bold";
    if (isMarked) bgStyle = "bg-amber-500 text-white border-amber-600 font-bold";
    if (isCurr) bgStyle += " ring-2 ring-indigo-600 ring-offset-1 font-bold";

    return (
      <button
        key={q.id || idx}
        onClick={() => setCurrentIndex(idx)}
        className={`h-8 rounded-lg border text-xs flex items-center justify-center transition-all cursor-pointer ${bgStyle}`}
      >
        {idx + 1}
      </button>
    );
  }
}
