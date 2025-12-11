
import React, { useState } from 'react';
import { ClipboardCheck, Check, X, Thermometer, Eye, Wind, AlertTriangle } from 'lucide-react';
import { Language } from '../types';

interface Props {
  onAccept: () => void;
  onReject: (reason: string) => void;
  language?: Language;
}

const TEXTS = {
  en: {
    title: "NGO Verification",
    subtitle: "Please verify the food donation before accepting.",
    smellTitle: "Smell Check",
    smellDesc: "No foul or sour odors.",
    visualTitle: "Visual Check",
    visualDesc: "No mold, pests, or discoloration.",
    tempTitle: "Temperature Check",
    tempDesc: "Food is at safe temperature.",
    rejectTitle: "Rejection Reason",
    rejectSubtitle: "Why is this food unsafe?",
    reasonMold: "Visible Mold / Fungus",
    reasonSmell: "Foul Smell / Sour",
    reasonTexture: "Slimy Texture / Discoloration",
    cancel: "Cancel",
    reject: "Reject",
    accept: "Accept Food"
  },
  hi: {
    title: "एनजीओ सत्यापन",
    subtitle: "स्वीकार करने से पहले कृपया भोजन दान को सत्यापित करें।",
    smellTitle: "गंध जाँच",
    smellDesc: "कोई दुर्गंध या खट्टी गंध नहीं।",
    visualTitle: "दृश्य जाँच",
    visualDesc: "कोई फफूंद, कीट या मलिनकिरण नहीं।",
    tempTitle: "तापमान जाँच",
    tempDesc: "भोजन सुरक्षित तापमान पर है।",
    rejectTitle: "अस्वीकृति का कारण",
    rejectSubtitle: "यह भोजन असुरक्षित क्यों है?",
    reasonMold: "दिखाई देने वाली फफूंद",
    reasonSmell: "दुर्गंध / खट्टापन",
    reasonTexture: "चिपचिपा बनावट / मलिनकिरण",
    cancel: "रद्द करें",
    reject: "अस्वीकार करें",
    accept: "भोजन स्वीकार करें"
  },
  te: {
    title: "NGO ధృవీకరణ",
    subtitle: "దయచేసి స్వీకరించే ముందు ఆహార విరాళాన్ని ధృవీకరించండి.",
    smellTitle: "వాసన తనిఖీ",
    smellDesc: "దుర్వాసన లేదా పుల్లని వాసన లేదు.",
    visualTitle: "దృశ్య తనిఖీ",
    visualDesc: "బూజు లేదా రంగు మారడం లేదు.",
    tempTitle: "ఉష్ణోగ్రత తనిఖీ",
    tempDesc: "ఆహారం సురక్షిత ఉష్ణోగ్రత వద్ద ఉంది.",
    rejectTitle: "తిరస్కరణ కారణం",
    rejectSubtitle: "ఈ ఆహారం ఎందుకు సురక్షితం కాదు?",
    reasonMold: "కనిపించే బూజు / ఫంగస్",
    reasonSmell: "దుర్వాసన / పుల్లని",
    reasonTexture: "జిగట ఆకృతి / రంగు మారడం",
    cancel: "రద్దు చేయండి",
    reject: "తిరస్కరించండి",
    accept: "ఆహారాన్ని స్వీకరించండి"
  },
  es: {
    title: "Verificación ONG",
    subtitle: "Por favor verifique la donación.",
    smellTitle: "Chequeo de Olor",
    smellDesc: "Sin malos olores.",
    visualTitle: "Chequeo Visual",
    visualDesc: "Sin moho o plagas.",
    tempTitle: "Chequeo de Temp.",
    tempDesc: "Temperatura segura.",
    rejectTitle: "Razón de Rechazo",
    rejectSubtitle: "¿Por qué es inseguro?",
    reasonMold: "Moho Visible",
    reasonSmell: "Mal Olor",
    reasonTexture: "Textura Babosa",
    cancel: "Cancelar",
    reject: "Rechazar",
    accept: "Aceptar Comida"
  }
};

const NgoVerificationCard: React.FC<Props> = ({ onAccept, onReject, language = 'en' }) => {
  const [checks, setChecks] = useState({
    smell: false,
    visual: false,
    temp: false
  });
  const [isRejecting, setIsRejecting] = useState(false);
  const t = TEXTS[language];

  const allChecked = checks.smell && checks.visual && checks.temp;

  const toggleCheck = (key: keyof typeof checks) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (isRejecting) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up ring-1 ring-stone-900/5">
          <div className="bg-rose-600 p-6 text-white text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-white" />
            <h2 className="text-2xl font-bold">{t.rejectTitle}</h2>
            <p className="text-rose-100 text-sm">{t.rejectSubtitle}</p>
          </div>
          <div className="p-6 space-y-3">
             <button onClick={() => onReject("Mold/Fungus")} className="w-full text-left p-4 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-bold text-stone-700 dark:text-stone-300 transition-colors">
               {t.reasonMold}
             </button>
             <button onClick={() => onReject("Bad Odor")} className="w-full text-left p-4 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-bold text-stone-700 dark:text-stone-300 transition-colors">
               {t.reasonSmell}
             </button>
             <button onClick={() => onReject("Texture/Soggy")} className="w-full text-left p-4 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-bold text-stone-700 dark:text-stone-300 transition-colors">
               {t.reasonTexture}
             </button>
             <button onClick={() => setIsRejecting(false)} className="w-full text-center text-stone-500 text-sm mt-2 hover:underline">
               {t.cancel}
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up ring-1 ring-stone-900/5">
        <div className="bg-slate-800 p-6 text-white text-center">
          <ClipboardCheck className="w-12 h-12 mx-auto mb-2 text-emerald-400" />
          <h2 className="text-2xl font-bold">{t.title}</h2>
          <p className="text-slate-300 text-sm">{t.subtitle}</p>
        </div>
        
        <div className="p-6 space-y-4">
          <div 
            onClick={() => toggleCheck('smell')}
            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${checks.smell ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-stone-200 dark:border-slate-700 hover:border-stone-300 dark:hover:border-slate-600'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${checks.smell ? 'bg-emerald-500 text-white' : 'bg-stone-200 dark:bg-slate-700 text-stone-400'}`}>
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-800 dark:text-white">{t.smellTitle}</h3>
              <p className="text-xs text-stone-500 dark:text-slate-400">{t.smellDesc}</p>
            </div>
            {checks.smell && <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 ml-auto" />}
          </div>

          <div 
            onClick={() => toggleCheck('visual')}
            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${checks.visual ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-stone-200 dark:border-slate-700 hover:border-stone-300 dark:hover:border-slate-600'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${checks.visual ? 'bg-emerald-500 text-white' : 'bg-stone-200 dark:bg-slate-700 text-stone-400'}`}>
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-800 dark:text-white">{t.visualTitle}</h3>
              <p className="text-xs text-stone-500 dark:text-slate-400">{t.visualDesc}</p>
            </div>
            {checks.visual && <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 ml-auto" />}
          </div>

          <div 
            onClick={() => toggleCheck('temp')}
            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${checks.temp ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-stone-200 dark:border-slate-700 hover:border-stone-300 dark:hover:border-slate-600'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${checks.temp ? 'bg-emerald-500 text-white' : 'bg-stone-200 dark:bg-slate-700 text-stone-400'}`}>
              <Thermometer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-800 dark:text-white">{t.tempTitle}</h3>
              <p className="text-xs text-stone-500 dark:text-slate-400">{t.tempDesc}</p>
            </div>
            {checks.temp && <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 ml-auto" />}
          </div>
        </div>

        <div className="p-6 bg-stone-50 dark:bg-slate-800 flex gap-4 border-t border-stone-100 dark:border-slate-700">
          <button 
            onClick={() => setIsRejecting(true)}
            className="flex-1 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <X className="w-4 h-4" /> {t.reject}
          </button>
          
          <button 
            onClick={onAccept}
            disabled={!allChecked}
            className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              allChecked 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 dark:shadow-none' 
                : 'bg-stone-300 dark:bg-slate-700 text-stone-500 dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" /> {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NgoVerificationCard;
