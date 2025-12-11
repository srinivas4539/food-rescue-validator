
import React from 'react';
import { UserProfile, DonationRecord, Language } from '../types';
import { PlusCircle, History, Star, AlertTriangle, ArrowUpRight } from 'lucide-react';
import RewardsCard from './RewardsCard';

interface Props {
  user: UserProfile;
  onNewDonation: () => void;
  language?: Language;
}

const TEXTS = {
  en: {
    hello: "Hello",
    impact: "You have helped feed over",
    people: "85 people",
    month: "this month.",
    safetyScore: "Safety Score",
    excellent: "Excellent",
    review: "Review Needed",
    donate: "Donate Food",
    startValid: "Start validation & matching",
    recent: "Recent Activity",
    viewAll: "View All",
    to: "To"
  },
  hi: {
    hello: "नमस्ते",
    impact: "आपने इस महीने",
    people: "85 लोगों",
    month: "को खाना खिलाने में मदद की है।",
    safetyScore: "सुरक्षा स्कोर",
    excellent: "उत्कृष्ट",
    review: "समीक्षा की आवश्यकता",
    donate: "भोजन दान करें",
    startValid: "सत्यापन और मिलान शुरू करें",
    recent: "हाल की गतिविधि",
    viewAll: "सभी देखें",
    to: "को"
  },
  te: {
    hello: "నమస్తే",
    impact: "మీరు ఈ నెలలో",
    people: "85 మందికి",
    month: "ఆహారం అందించడంలో సహాయపడ్డారు.",
    safetyScore: "భద్రతా స్కోర్",
    excellent: "అద్భుతం",
    review: "సమీక్ష అవసరం",
    donate: "ఆహారాన్ని దానం చేయండి",
    startValid: "ధృవీకరణ & సరిపోలికను ప్రారంభించండి",
    recent: "ఇటీవలి కార్యాచరణ",
    viewAll: "అన్నీ చూడండి",
    to: "కు"
  },
  es: {
    hello: "Hola",
    impact: "Has ayudado a alimentar a",
    people: "85 personas",
    month: "este mes.",
    safetyScore: "Puntaje de Seguridad",
    excellent: "Excelente",
    review: "Revisión Necesaria",
    donate: "Donar Comida",
    startValid: "Iniciar validación",
    recent: "Actividad Reciente",
    viewAll: "Ver Todo",
    to: "A"
  }
};

const MOCK_HISTORY: DonationRecord[] = [
  { id: '1', foodName: 'Rice & Curry', date: '2024-05-20', status: 'DELIVERED', quantity: '50 servings', ngoName: 'City Harvest' },
  { id: '2', foodName: 'Bread Loaves', date: '2024-05-18', status: 'REJECTED', quantity: '20 units' },
  { id: '3', foodName: 'Pasta Tray', date: '2024-05-15', status: 'DELIVERED', quantity: '15 servings', ngoName: 'Youth Center' },
];

const DonorDashboard: React.FC<Props> = ({ user, onNewDonation, language = 'en' }) => {
  const t = TEXTS[language];
  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 animate-fade-in">
      {/* Welcome & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-emerald-800 dark:to-teal-900 p-8 rounded-3xl shadow-lg col-span-1 md:col-span-2 flex flex-col justify-center text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <HeartHandshakeIcon className="w-32 h-32" />
          </div>
          <h1 className="text-3xl font-bold mb-2 relative z-10">{t.hello}, {user.name}!</h1>
          <p className="text-emerald-100 relative z-10 text-lg">{t.impact} <span className="font-bold text-white bg-white/20 px-2 rounded">{t.people}</span> {t.month}</p>
        </div>

        <div className="col-span-1">
          <RewardsCard points={user.rewardPoints || 0} badges={user.badges || []} />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`p-6 rounded-3xl shadow-lg border-0 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 transition-colors`}>
          <div className="text-xs font-bold text-stone-400 dark:text-slate-400 uppercase tracking-widest mb-2">{t.safetyScore}</div>
          <div className={`text-5xl font-black mb-2 ${(user.safetyScore || 0) > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
            {user.safetyScore}
          </div>
          <div className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-full ${(user.safetyScore || 0) > 90 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
            {(user.safetyScore || 0) > 90 ? <Star className="w-4 h-4 fill-current" /> : <AlertTriangle className="w-4 h-4" />}
            {(user.safetyScore || 0) > 90 ? t.excellent : t.review}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 gap-6 mb-10">
        <button
          onClick={onNewDonation}
          className="group relative p-8 bg-gradient-to-br from-emerald-500 to-emerald-700 hover:to-emerald-600 text-white rounded-3xl shadow-xl shadow-emerald-200 dark:shadow-none transition-all hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <PlusCircle className="w-32 h-32" />
          </div>
          <div className="relative z-10 flex items-center justify-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl">
              <PlusCircle className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-2xl mb-1">{t.donate}</div>
              <div className="text-emerald-100 font-medium">{t.startValid}</div>
            </div>
          </div>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-stone-100 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="p-6 border-b border-stone-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-stone-100 dark:bg-slate-800 p-2 rounded-lg">
              <History className="w-5 h-5 text-stone-500 dark:text-slate-400" />
            </div>
            <h2 className="font-bold text-stone-800 dark:text-white text-lg">{t.recent}</h2>
          </div>
          <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-bold text-sm flex items-center gap-1">
            {t.viewAll} <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="divide-y divide-stone-50 dark:divide-slate-800">
          {MOCK_HISTORY.map((item) => (
            <div key={item.id} className="p-5 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-slate-800/50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                    ${item.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    item.status === 'REJECTED' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                  {item.foodName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-stone-800 dark:text-stone-200 text-base">{item.foodName}</h3>
                  <p className="text-sm text-stone-500 dark:text-slate-500 font-medium">{item.quantity} • {item.date}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${item.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900' :
                  item.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900' :
                    'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900'
                  }`}>
                  {item.status}
                </span>
                {item.ngoName && <div className="text-xs text-stone-400 mt-1 font-medium group-hover:text-emerald-600 transition-colors">{t.to}: {item.ngoName}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper for icon
const HeartHandshakeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.15-.26c2.15 1.35 2 3.9.55 5.86l-2.43 2.85a1 1 0 0 1-1.28.23l-2.36-1.39a2 2 0 0 0-2.46.28l-2.23 2.23a2 2 0 0 0 0 2.83l.25.25" />
  </svg>
);

export default DonorDashboard;
