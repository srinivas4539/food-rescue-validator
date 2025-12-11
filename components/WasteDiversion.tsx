
import React from 'react';
import { Leaf, Recycle, MapPin, XCircle, ArrowRight } from 'lucide-react';
import { Language } from '../types';

interface Props {
  reason: string;
  onClose: () => void;
  language?: Language;
}

const TEXTS = {
  en: {
    rejected: "Donation Rejected",
    unsafe: "Food unsafe for human consumption.",
    dontWaste: "Don't Waste It! Alternative Use:",
    biogas: "Biogas Plant",
    biogasDesc: "Cooked food with high moisture is excellent for biogas energy generation.",
    compost: "Community Compost",
    compostDesc: "Organic decomposition helps create nutrient-rich soil for local parks.",
    nearby: "Nearby Drop-off Points",
    acknowledge: "Acknowledge & Close"
  },
  hi: {
    rejected: "दान अस्वीकार",
    unsafe: "भोजन मानव उपभोग के लिए असुरक्षित है।",
    dontWaste: "इसे बर्बाद न करें! वैकल्पिक उपयोग:",
    biogas: "बायोगैस संयंत्र",
    biogasDesc: "उच्च नमी वाला पकाया हुआ भोजन बायोगैस ऊर्जा उत्पादन के लिए उत्कृष्ट है।",
    compost: "सामुदायिक खाद",
    compostDesc: "जैविक अपघटन स्थानीय पार्कों के लिए पोषक तत्वों से भरपूर मिट्टी बनाने में मदद करता है।",
    nearby: "निकटतम ड्रॉप-ऑफ बिंदु",
    acknowledge: "स्वीकार करें और बंद करें"
  },
  te: {
    rejected: "విరాళం తిరస్కరించబడింది",
    unsafe: "మానవ వినియోగానికి ఆహారం సురక్షితం కాదు.",
    dontWaste: "దాన్ని వృథా చేయకండి! ప్రత్యామ్నాయ ఉపయోగం:",
    biogas: "బయోగ్యాస్ ప్లాంట్",
    biogasDesc: "అధిక తేమతో వండిన ఆహారం బయోగ్యాస్ శక్తి ఉత్పత్తికి అద్భుతమైనది.",
    compost: "కమ్యూనిటీ కంపోస్ట్",
    compostDesc: "సేంద్రీయ కుళ్ళిపోవడం స్థానిక పార్కుల కోసం పోషకమైన మట్టిని సృష్టించడంలో సహాయపడుతుంది.",
    nearby: "సమీప డ్రాప్-ఆఫ్ పాయింట్లు",
    acknowledge: "అంగీకరించి మూసివేయండి"
  },
  es: {
    rejected: "Donación Rechazada",
    unsafe: "Comida insegura.",
    dontWaste: "¡No lo desperdicies! Uso alternativo:",
    biogas: "Planta de Biogás",
    biogasDesc: "Comida excelente para generar energía.",
    compost: "Compost Comunitario",
    compostDesc: "Ayuda a crear suelo rico en nutrientes.",
    nearby: "Puntos de entrega cercanos",
    acknowledge: "Reconocer y Cerrar"
  }
};

const WasteDiversion: React.FC<Props> = ({ reason, onClose, language = 'en' }) => {
  const t = TEXTS[language];
  
  const getRecommendation = () => {
    if (reason === 'Mold/Fungus' || reason === 'Bad Odor') {
      return {
        title: t.biogas,
        desc: t.biogasDesc,
        icon: <Recycle className="w-12 h-12 text-blue-500" />,
        places: ['Green Energy Corp (5km)', 'City Biogas Unit 3 (8km)']
      };
    }
    return {
      title: t.compost,
      desc: t.compostDesc,
      icon: <Leaf className="w-12 h-12 text-green-500" />,
      places: ['City Park Compost Pit (2km)', 'Urban Garden Collective (4km)']
    };
  };

  const rec = getRecommendation();

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-stone-900/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up border border-stone-200 dark:border-slate-700">
        
        {/* Header */}
        <div className="bg-rose-50 dark:bg-rose-900/20 p-6 text-center border-b border-rose-100 dark:border-rose-900/30">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-800 rounded-full flex items-center justify-center mx-auto mb-3">
             <XCircle className="w-8 h-8 text-rose-600 dark:text-rose-300" />
          </div>
          <h2 className="text-2xl font-bold text-rose-800 dark:text-rose-200">{t.rejected}</h2>
          <p className="text-rose-600 dark:text-rose-300 font-medium mt-1">Reason: {reason}</p>
          <p className="text-stone-500 dark:text-slate-400 text-sm mt-2">{t.unsafe}</p>
        </div>

        {/* Alternative Solution */}
        <div className="p-8">
           <h3 className="text-stone-800 dark:text-white font-bold text-lg mb-4 text-center">{t.dontWaste}</h3>
           
           <div className="bg-stone-50 dark:bg-slate-800 rounded-2xl p-6 border border-stone-200 dark:border-slate-700 hover:border-emerald-500 transition-colors cursor-pointer group">
              <div className="flex items-start gap-4">
                 <div className="p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm border border-stone-100 dark:border-slate-600 group-hover:scale-110 transition-transform">
                   {rec.icon}
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-stone-800 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{rec.title}</h4>
                    <p className="text-stone-500 dark:text-slate-400 text-sm leading-relaxed mb-4">{rec.desc}</p>
                    
                    <div className="space-y-2">
                       <p className="text-xs font-bold text-stone-400 dark:text-slate-500 uppercase tracking-widest">{t.nearby}</p>
                       {rec.places.map((place, idx) => (
                         <div key={idx} className="flex items-center text-sm font-bold text-stone-700 dark:text-slate-300">
                            <MapPin className="w-3 h-3 mr-2 text-emerald-500" />
                            {place}
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <button 
             onClick={onClose}
             className="w-full mt-6 bg-stone-800 dark:bg-slate-700 hover:bg-stone-900 dark:hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
           >
             {t.acknowledge} <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default WasteDiversion;
