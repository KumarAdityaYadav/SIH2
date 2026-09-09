import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Layers,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { EducationalContent, LanguageCode, User } from '../types';
import { SEED_EDUCATIONAL_CONTENT } from '../data/seedData';
import { speakText, stopSpeaking } from '../services/voiceService';

interface KnowledgeHubViewProps {
  currentUser: User | null;
  currentLanguage: LanguageCode;
  onOpen3DModal: () => void;
  onStartScreening: () => void;
}

export const KnowledgeHubView: React.FC<KnowledgeHubViewProps> = ({
  currentUser,
  currentLanguage,
  onOpen3DModal,
  onStartScreening,
}) => {
  const [articles] = useState<EducationalContent[]>(SEED_EDUCATIONAL_CONTENT);
  const [selectedArticle, setSelectedArticle] = useState<EducationalContent | null>(articles[0] || null);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const [activeTab, setActiveTab] = useState<'articles' | 'myths' | 'nutrition'>('articles');

  const mythsList = [
    {
      myth: 'Myth 1: PCOS always means you will never be able to conceive.',
      fact: 'Fact: PCOS causes irregular ovulation, but with timely lifestyle care, ovulation tracking, or standard fertility support, most women conceive naturally and carry healthy pregnancies.',
      category: 'Fertility',
    },
    {
      myth: 'Myth 2: The cysts in polycystic ovaries are dangerous tumors.',
      fact: 'Fact: No! They are simply harmless, immature egg follicles that paused in their natural cycle. They are completely benign and do not turn into cancer or require surgery.',
      category: 'Biology',
    },
    {
      myth: 'Myth 3: You must be overweight to have PCOS.',
      fact: 'Fact: Lean PCOS affects approximately 20-30% of women with PCOS who have normal or low BMI. Metabolic and androgen variations occur across all body shapes.',
      category: 'Body Types',
    },
    {
      myth: 'Myth 4: Birth control pills are the only way to treat PCOS.',
      fact: 'Fact: PCOS care is individualized. Lifestyle, medicines, and other options may be considered based on symptoms, goals, risks, and clinician assessment.',
      category: 'Management',
    },
  ];

  const nutritionTips = [
    {
      title: 'Low Glycemic Index (GI) Carbohydrates',
      desc: 'Swap refined white flour (maida) and white rice with millets (ragi, jowar, bajra), whole wheat, and lentils (dal) to prevent steep insulin spikes.',
    },
    {
      title: 'Adequate Protein with Every Meal',
      desc: 'Incorporate paneer, eggs, sprouts, chana, and curd into daily meals to promote satiety and stabilize blood glucose curves.',
    },
    {
      title: 'Anti-inflammatory Micronutrients',
      desc: 'Add turmeric, ginger, flaxseeds, walnuts, and dark leafy vegetables (methi, palak) to alleviate oxidative inflammation.',
    },
    {
      title: 'Inositol & Vitamin D3',
      desc: 'Inositol and vitamin D are discussed in PCOS research, but supplements are not a universal treatment. Discuss whether they are appropriate with a qualified healthcare professional.',
    },
  ];

  const handleToggleReadArticle = (article: EducationalContent) => {
    if (isReadingAloud) {
      stopSpeaking();
      setIsReadingAloud(false);
    } else {
      const textToRead = `${article.title}. By ${article.doctorAuthor}. ${article.bodyParagraphs.join('. ')}`;
      speakText(textToRead, currentLanguage, () => setIsReadingAloud(false));
      setIsReadingAloud(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-rose-100 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Doctor-Reviewed Clinical Education</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            StreeSure Knowledge & Myth-Busting Hub
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-xl">
            Evidence-based guides, myth clarifications, and nutrition insights written in simple language with native voice audio readback.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpen3DModal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold shadow-md transition shrink-0"
        >
          <Layers className="w-4 h-4" />
          <span>Interactive 3D Pelvic Visualizer</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'articles', label: 'Doctor-Reviewed Articles' },
          { id: 'myths', label: 'Myths vs. Clinical Facts' },
          { id: 'nutrition', label: 'Lifestyle & Nutritional Guides' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === tab.id
                ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. ARTICLES TAB */}
      {activeTab === 'articles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Article List */}
          <div className="lg:col-span-4 space-y-3">
            {articles.map((art) => (
              <button
                key={art.id}
                type="button"
                onClick={() => {
                  setSelectedArticle(art);
                  stopSpeaking();
                  setIsReadingAloud(false);
                }}
                className={`w-full p-4 rounded-2xl border text-left transition ${
                  selectedArticle?.id === art.id
                    ? 'bg-rose-50 border-rose-500 shadow-sm ring-1 ring-rose-500'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-rose-600 block mb-1">
                  {art.category} • {art.readTimeMinutes} Min Read
                </span>
                <h3 className="text-xs font-bold text-slate-900 leading-snug mb-1">{art.title}</h3>
                <p className="text-[11px] text-slate-500">By {art.doctorAuthor}</p>
              </button>
            ))}
          </div>

          {/* Right Article Reader */}
          <div className="lg:col-span-8">
            {selectedArticle && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                      {selectedArticle.category}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                      {selectedArticle.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Reviewed by {selectedArticle.doctorAuthor}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleReadArticle(selectedArticle)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition shrink-0"
                  >
                    {isReadingAloud ? (
                      <>
                        <VolumeX className="w-4 h-4 text-rose-600" />
                        <span>Stop Audio</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-rose-600" />
                        <span>Listen in Mother Tongue</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {(selectedArticle.bodyParagraphs || []).map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Want to check your individual pattern?
                  </span>
                  <button
                    type="button"
                    onClick={onStartScreening}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
                  >
                    Start Free Screening
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. MYTHS TAB */}
      {activeTab === 'myths' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mythsList.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3"
            >
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 uppercase">
                {item.category}
              </span>
              <h3 className="text-sm font-bold text-rose-700">{item.myth}</h3>
              <p className="text-xs text-slate-700 leading-relaxed">{item.fact}</p>
            </div>
          ))}
        </div>
      )}

      {/* 3. NUTRITION TAB */}
      {activeTab === 'nutrition' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {nutritionTips.map((tip, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                {idx + 1}
              </div>
              <h3 className="text-sm font-bold text-slate-900">{tip.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
