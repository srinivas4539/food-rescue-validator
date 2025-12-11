
import React from 'react';
import { FoodAnalysisResult, Language } from '../types';
import { CheckCircle, AlertTriangle, XCircle, Clock, Users, Utensils, Leaf, AlertCircle } from 'lucide-react';

interface Props {
  result: FoodAnalysisResult;
  language?: Language;
}

const TEXTS = {
  en: {
    approved: 'Approved for Donation',
    unsafe: 'Not Safe for Donation',
    quantity: 'Quantity',
    consumeWithin: 'Consume Within',
    allergens: 'Potential Allergens',
    noAllergens: 'No common allergens detected',
    safetyHazard: 'Safety Hazard Detected',
    ready: 'Ready for Distribution'
  },
  hi: {
    approved: 'दान के लिए स्वीकृत',
    unsafe: 'दान के लिए सुरक्षित नहीं',
    quantity: 'मात्रा',
    consumeWithin: 'इतने समय में खाएं',
    allergens: 'एलर्जी कारक',
    noAllergens: 'कोई एलर्जी कारक नहीं मिला',
    safetyHazard: 'सुरक्षा खतरा',
    ready: 'वितरण के लिए तैयार'
  },
  te: {
    approved: 'దానానికి ఆమోదించబడింది',
    unsafe: 'దానానికి సురక్షితం కాదు',
    quantity: 'పరిమాణం',
    consumeWithin: 'ఈ సమయంలోగా తినాలి',
    allergens: 'అలెర్జీ కారకాలు',
    noAllergens: 'అలెర్జీ కారకాలు కనుగొనబడలేదు',
    safetyHazard: 'భద్రతా ప్రమాదం',
    ready: 'పంపిణీకి సిద్ధంగా ఉంది'
  },
  es: {
    approved: 'Aprobado para Donación',
    unsafe: 'No Seguro para Donación',
    quantity: 'Cantidad',
    consumeWithin: 'Consumir Dentro de',
    allergens: 'Alérgenos Potenciales',
    noAllergens: 'Sin alérgenos detectados',
    safetyHazard: 'Peligro de Seguridad',
    ready: 'Listo para Distribución'
  }
};

const AnalysisResultCard: React.FC<Props> = ({ result, language = 'en' }) => {
  const isSafe = result.safety_flag;
  const allergens = result.allergens || [];
  const t = TEXTS[language];
  
  // Determine color scheme based on safety
  const statusColor = isSafe ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400';
  const bgColor = isSafe ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20';
  const borderColor = isSafe ? 'border-emerald-200 dark:border-emerald-800' : 'border-red-200 dark:border-red-800';
  const StatusIcon = isSafe ? CheckCircle : XCircle;

  return (
    <div className="w-full max-w-xl mx-auto mt-8 animate-fade-in-up">
      <div className={`bg-white dark:bg-slate-900 rounded-3xl shadow-xl border overflow-hidden transition-colors ${borderColor}`}>
        
        {/* Header Status Bar */}
        <div className={`${bgColor} p-5 flex items-center justify-between border-b ${borderColor}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-white dark:bg-slate-800 shadow-sm ${statusColor}`}>
               <StatusIcon className="w-6 h-6" />
            </div>
            <span className={`font-bold text-xl ${statusColor}`}>
              {isSafe ? t.approved : t.unsafe}
            </span>
          </div>
          <div className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase border ${isSafe ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800' : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800'}`}>
            {result.freshness_status}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-6">
          
          {/* Main Dish Name */}
          <div>
            <h2 className="text-3xl font-black text-stone-800 dark:text-white mb-2 leading-tight">{result.food_name}</h2>
            <div className="flex items-center text-stone-500 dark:text-slate-400 text-sm font-bold bg-stone-100 dark:bg-slate-800 w-fit px-3 py-1 rounded-full">
               <Leaf className="w-4 h-4 mr-1.5 text-emerald-500 dark:text-emerald-400" />
               {result.category}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quantity Estimate */}
            <div className="bg-stone-50 dark:bg-slate-800 p-5 rounded-2xl border border-stone-100 dark:border-slate-700">
              <div className="flex items-center gap-2 text-stone-400 dark:text-slate-500 mb-2">
                <Users className="w-4 h-4" />
                <span className="text-xs uppercase font-bold tracking-wider">{t.quantity}</span>
              </div>
              <p className="font-bold text-stone-800 dark:text-stone-200 text-lg">{result.quantity_estimate}</p>
            </div>

            {/* Expiry Window */}
            <div className="bg-stone-50 dark:bg-slate-800 p-5 rounded-2xl border border-stone-100 dark:border-slate-700">
              <div className="flex items-center gap-2 text-stone-400 dark:text-slate-500 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-xs uppercase font-bold tracking-wider">{t.consumeWithin}</span>
              </div>
              <p className="font-bold text-stone-800 dark:text-stone-200 text-lg">{result.expiry_window}</p>
            </div>

            {/* Allergens */}
            <div className="bg-stone-50 dark:bg-slate-800 p-5 rounded-2xl border border-stone-100 dark:border-slate-700 md:col-span-2">
              <div className="flex items-center gap-2 text-stone-400 dark:text-slate-500 mb-3">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs uppercase font-bold tracking-wider">{t.allergens}</span>
              </div>
              {allergens.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {allergens.map((allergen, idx) => (
                    <span key={idx} className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-sm font-bold px-3 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                      {allergen}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="font-bold text-stone-600 dark:text-slate-400 text-sm italic">{t.noAllergens}</p>
              )}
            </div>
          </div>

          {/* Safety Notice if unsafe */}
          {!isSafe && (
             <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 rounded-2xl p-5 flex items-start gap-4">
               <div className="bg-red-100 dark:bg-red-900/40 p-2 rounded-full text-red-500 dark:text-red-400 shrink-0">
                 <AlertTriangle className="w-5 h-5" />
               </div>
               <div>
                 <h4 className="font-bold text-red-800 dark:text-red-300 text-sm uppercase mb-1">{t.safetyHazard}</h4>
                 <p className="text-red-700 dark:text-red-300 text-sm font-medium leading-relaxed">
                   {result.safety_reason || "Visual cues indicate potential spoilage or safety risks. Please discard responsibly."}
                 </p>
               </div>
             </div>
          )}

          {/* Safe Notice if safe */}
          {isSafe && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900 rounded-2xl p-5 flex items-start gap-4">
               <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-full text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Utensils className="w-5 h-5" />
               </div>
               <div>
                 <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm uppercase mb-1">{t.ready}</h4>
                 <p className="text-emerald-700 dark:text-emerald-300 text-sm font-medium leading-relaxed">
                   {result.safety_reason || "This food item meets the visual safety criteria. Ensure safe packaging and transport."}
                 </p>
               </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AnalysisResultCard;
