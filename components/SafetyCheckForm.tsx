
import React, { useState, useEffect } from 'react';
import { SafetyCheckData, Language } from '../types';
import { ShieldCheck, AlertTriangle, Clock, Thermometer, Box, FileCheck, CheckCircle2, Ban } from 'lucide-react';

interface Props {
  onSafetyVerified: (data: SafetyCheckData) => void;
  language?: Language;
}

const TEXTS = {
  en: {
    title: "Safety Protocol Check",
    verified: "Safety Verified",
    prepTime: "Preparation Time",
    temp: "Temperature",
    roomTempWarn: "Warning: High risk at Room Temp.",
    safeHours: "Safe Hours Left",
    mandatory: "Mandatory Checks",
    covered: "Food has been kept covered and hygienic.",
    packed: "I confirm food is packed in clean, sealed containers.",
    agree: "I agree to local food distribution laws.",
    confirm: "Confirm Safety & Proceed",
    complete: "Complete Protocols to Proceed",
    tooOld: "Food older than 4 hours cannot be donated for safety reasons."
  },
  hi: {
    title: "सुरक्षा प्रोटोकॉल जाँच",
    verified: "सुरक्षित सत्यापित",
    prepTime: "तैयारी का समय",
    temp: "तापमान",
    roomTempWarn: "चेतावनी: कमरे के तापमान पर उच्च जोखिम।",
    safeHours: "सुरक्षित घंटे बचे हैं",
    mandatory: "अनिवार्य जाँच",
    covered: "भोजन को ढका हुआ और स्वच्छ रखा गया है।",
    packed: "मैं पुष्टि करता हूँ कि भोजन साफ, सील बंद डिब्बों में पैक है।",
    agree: "मैं स्थानीय खाद्य वितरण कानूनों से सहमत हूँ।",
    confirm: "सुरक्षा की पुष्टि करें और आगे बढ़ें",
    complete: "आगे बढ़ने के लिए प्रोटोकॉल पूरा करें",
    tooOld: "सुरक्षा कारणों से 4 घंटे से पुराने भोजन का दान नहीं किया जा सकता।"
  },
  te: {
    title: "భద్రతా ప్రోటోకాల్ తనిఖీ",
    verified: "భద్రత ధృవీకరించబడింది",
    prepTime: "తయారీ సమయం",
    temp: "ఉష్ణోగ్రత",
    roomTempWarn: "హెచ్చరిక: గది ఉష్ణోగ్రత వద్ద అధిక ప్రమాదం.",
    safeHours: "సురక్షిత గంటలు మిగిలి ఉన్నాయి",
    mandatory: "తప్పనిసరి తనిఖీలు",
    covered: "ఆహారం మూతపెట్టి మరియు పరిశుభ్రంగా ఉంచబడింది.",
    packed: "ఆహారం శుభ్రమైన, సీల్ చేసిన డబ్బాల్లో ప్యాక్ చేయబడిందని నేను ధృవీకరిస్తున్నాను.",
    agree: "నేను స్థానిక ఆహార పంపిణీ చట్టాలకు అంగీకరిస్తున్నాను.",
    confirm: "భద్రతను నిర్ధారించి కొనసాగించండి",
    complete: "కొనసాగడానికి ప్రోటోకాల్‌లను పూర్తి చేయండి",
    tooOld: "భద్రతా కారణాల దృష్ట్యా 4 గంటల కంటే పాత ఆహారాన్ని దానం చేయలేము."
  },
  es: {
    title: "Verificación de Protocolo",
    verified: "Seguridad Verificada",
    prepTime: "Hora de Preparación",
    temp: "Temperatura",
    roomTempWarn: "Advertencia: Alto riesgo a temperatura ambiente.",
    safeHours: "Horas Seguras Restantes",
    mandatory: "Chequeos Mandatorios",
    covered: "La comida se ha mantenido cubierta e higiénica.",
    packed: "Confirmo que la comida está en recipientes limpios y sellados.",
    agree: "Acepto las leyes locales de distribución de alimentos.",
    confirm: "Confirmar Seguridad y Proceder",
    complete: "Completar Protocolos",
    tooOld: "La comida de más de 4 horas no se puede donar."
  }
};

const SafetyCheckForm: React.FC<Props> = ({ onSafetyVerified, language = 'en' }) => {
  const [formData, setFormData] = useState<SafetyCheckData>({
    prepTime: '',
    temperature: 'Room Temp',
    isCovered: false,
    shelfLife: 0,
    isPacked: false,
    agreesToCompliance: false
  });

  const [timeError, setTimeError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const t = TEXTS[language];

  // Validate Time (Must be within last 4 hours)
  useEffect(() => {
    if (!formData.prepTime) return;

    const now = new Date();
    const [hours, minutes] = formData.prepTime.split(':').map(Number);
    const prepDate = new Date();
    prepDate.setHours(hours, minutes, 0, 0);

    // Handle case where user inputs a time from "yesterday" (e.g. now is 01:00, input is 23:00)
    if (prepDate > now) {
      prepDate.setDate(prepDate.getDate() - 1);
    }

    const diffInMs = now.getTime() - prepDate.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours > 4) {
      setTimeError(t.tooOld);
    } else {
      setTimeError(null);
    }
  }, [formData.prepTime, t.tooOld]);

  // Check overall form validity
  useEffect(() => {
    const isValid = 
      !timeError &&
      formData.prepTime !== '' &&
      formData.isCovered &&
      formData.isPacked &&
      formData.agreesToCompliance &&
      formData.shelfLife > 0;
    
    setIsFormValid(isValid);
  }, [formData, timeError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSafetyVerified(formData);
    }
  };

  const handleChange = (field: keyof SafetyCheckData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-6 animate-fade-in-up">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-teal-100 dark:border-teal-900/30 overflow-hidden transition-colors">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
               <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-lg">{t.title}</h2>
          </div>
          {isFormValid && (
            <div className="bg-white text-teal-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-teal-600" /> {t.verified}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* 1. Prep Time */}
          <div>
            <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-500" /> {t.prepTime}
            </label>
            <input 
              type="time" 
              className={`w-full p-3 rounded-xl border-2 focus:ring-0 focus:outline-none transition-all font-medium ${timeError ? 'border-red-300 bg-red-50 text-red-900 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' : 'border-stone-200 dark:border-slate-700 focus:border-teal-500 bg-stone-50 dark:bg-slate-800 dark:text-white'}`}
              value={formData.prepTime}
              onChange={(e) => handleChange('prepTime', e.target.value)}
              required
            />
            {timeError && (
              <div className="mt-2 text-red-600 dark:text-red-400 text-sm flex items-center gap-2 font-bold bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                <Ban className="w-4 h-4" /> {timeError}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 2. Temperature */}
            <div>
              <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-teal-500" /> {t.temp}
              </label>
              <select 
                className="w-full p-3 rounded-xl border-2 border-stone-200 dark:border-slate-700 focus:border-teal-500 focus:outline-none bg-stone-50 dark:bg-slate-800 dark:text-white font-medium"
                value={formData.temperature}
                onChange={(e) => handleChange('temperature', e.target.value)}
              >
                <option value="Hot (>60°C)">Hot ({'>'}60°C)</option>
                <option value="Cold (<5°C)">Cold ({'<'}5°C)</option>
                <option value="Room Temp">Room Temp</option>
              </select>
              {formData.temperature === 'Room Temp' && (
                <div className="mt-2 text-amber-600 dark:text-amber-400 text-xs flex items-start gap-1 font-bold">
                  <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                  {t.roomTempWarn}
                </div>
              )}
            </div>

            {/* 4. Shelf Life */}
            <div>
               <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-500" /> {t.safeHours}
              </label>
              <input 
                type="number" 
                min="0"
                max="24"
                className="w-full p-3 rounded-xl border-2 border-stone-200 dark:border-slate-700 focus:border-teal-500 focus:outline-none bg-stone-50 dark:bg-slate-800 dark:text-white font-medium"
                value={formData.shelfLife || ''}
                onChange={(e) => handleChange('shelfLife', parseInt(e.target.value))}
                placeholder="e.g. 4"
                required
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4 bg-stone-50 dark:bg-slate-800 p-6 rounded-2xl border border-stone-100 dark:border-slate-700">
            <h3 className="text-xs font-bold text-stone-400 dark:text-slate-500 uppercase tracking-widest mb-2">{t.mandatory}</h3>
            
            <label className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors">
              <input 
                type="checkbox" 
                className="w-5 h-5 text-teal-600 rounded border-stone-300 focus:ring-teal-500"
                checked={formData.isCovered}
                onChange={(e) => handleChange('isCovered', e.target.checked)}
              />
              <span className="text-stone-700 dark:text-stone-300 font-medium group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">{t.covered}</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors">
              <input 
                type="checkbox" 
                className="w-5 h-5 text-teal-600 rounded border-stone-300 focus:ring-teal-500"
                checked={formData.isPacked}
                onChange={(e) => handleChange('isPacked', e.target.checked)}
              />
              <span className="text-stone-700 dark:text-stone-300 font-medium group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">{t.packed}</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors">
              <input 
                type="checkbox" 
                className="w-5 h-5 text-teal-600 rounded border-stone-300 focus:ring-teal-500"
                checked={formData.agreesToCompliance}
                onChange={(e) => handleChange('agreesToCompliance', e.target.checked)}
              />
              <span className="text-stone-700 dark:text-stone-300 font-medium group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">{t.agree}</span>
            </label>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg ${
              isFormValid 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-200/50 dark:shadow-none' 
                : 'bg-stone-200 dark:bg-slate-700 text-stone-400 dark:text-slate-500 cursor-not-allowed shadow-none'
            }`}
          >
            {isFormValid ? (
              <>
                <FileCheck className="w-5 h-5" /> {t.confirm}
              </>
            ) : (
              <>
                {t.complete}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SafetyCheckForm;
