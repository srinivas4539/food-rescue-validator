
import React, { useRef } from 'react';
import { UserProfile, Language } from '../types';
import { Award, Download, Printer, X } from 'lucide-react';

interface Props {
  user: UserProfile;
  onClose: () => void;
  language?: Language;
}

const TEXTS = {
  en: {
    title: "Certificate of Internship",
    subtitle: "This is to certify that",
    hasCompleted: "has successfully completed the 6-month Food Rescue Logistics Internship program.",
    org: "Organization",
    date: "Date Issued",
    download: "Download",
    print: "Print",
    id: "Certificate ID",
    role: "Logistics Coordinator"
  },
  hi: {
    title: "इंटर्नशिप प्रमाणपत्र",
    subtitle: "यह प्रमाणित किया जाता है कि",
    hasCompleted: "ने 6 महीने के खाद्य बचाव लॉजिस्टिक्स इंटर्नशिप कार्यक्रम को सफलतापूर्वक पूरा कर लिया है।",
    org: "संस्था",
    date: "जारी तिथि",
    download: "डाउनलोड",
    print: "प्रिंट",
    id: "प्रमाणपत्र आईडी",
    role: "लॉजिस्टिक्स समन्वयक"
  },
  te: {
    title: "ఇంటర్న్‌షిప్ సర్టిఫికేట్",
    subtitle: "దీనిని ధృవీకరిస్తున్నాము",
    hasCompleted: "6 నెలల ఫుడ్ రెస్క్యూ లాజిస్టిక్స్ ఇంటర్న్‌షిప్ ప్రోగ్రామ్‌ను విజయవంతంగా పూర్తి చేశారు.",
    org: "సంస్థ",
    date: "జారీ చేసిన తేదీ",
    download: "డౌన్‌లోడ్",
    print: "ప్రింట్",
    id: "సర్టిఫికేట్ ID",
    role: "లాజిస్టిక్స్ కోఆర్డినేటర్"
  },
  es: {
    title: "Certificado de Pasantía",
    subtitle: "Se certifica que",
    hasCompleted: "ha completado con éxito el programa de pasantías de 6 meses.",
    org: "Organización",
    date: "Fecha de Emisión",
    download: "Descargar",
    print: "Imprimir",
    id: "ID Certificado",
    role: "Coordinador Logístico"
  }
};

const CertificateCard: React.FC<Props> = ({ user, onClose, language = 'en' }) => {
  const t = TEXTS[language];
  const today = new Date().toLocaleDateString();
  const certId = `FR-INT-${Math.floor(Math.random() * 100000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/80 p-4 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl mx-auto">
        
        {/* Actions Bar */}
        <div className="absolute -top-12 right-0 flex gap-2">
            <button onClick={handlePrint} className="bg-white text-stone-800 p-2 rounded-full shadow-lg hover:bg-stone-100 transition-colors">
                <Printer className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="bg-white text-stone-800 p-2 rounded-full shadow-lg hover:bg-stone-100 transition-colors">
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Certificate Layout */}
        <div className="bg-[#fffbf0] text-stone-900 p-2 rounded-lg shadow-2xl animate-scale-up">
            <div className="border-8 border-double border-stone-800 p-8 md:p-12 relative overflow-hidden">
                
                {/* Decorative Corners */}
                <div className="absolute top-0 left-0 w-24 h-24 border-t-8 border-l-8 border-amber-500 rounded-tl-sm"></div>
                <div className="absolute top-0 right-0 w-24 h-24 border-t-8 border-r-8 border-amber-500 rounded-tr-sm"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 border-b-8 border-l-8 border-amber-500 rounded-bl-sm"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 border-b-8 border-r-8 border-amber-500 rounded-br-sm"></div>

                {/* Content */}
                <div className="text-center relative z-10">
                    <div className="flex justify-center mb-6">
                        <Award className="w-20 h-20 text-amber-500 drop-shadow-md" />
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-4 uppercase tracking-widest border-b-2 border-stone-300 pb-4 inline-block">
                        {t.title}
                    </h1>
                    
                    <p className="text-xl text-stone-500 font-serif italic mt-6 mb-2">
                        {t.subtitle}
                    </p>
                    
                    <h2 className="text-3xl md:text-5xl font-black text-emerald-700 font-serif my-6 capitalize">
                        {user.name}
                    </h2>
                    
                    <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
                        {t.hasCompleted}
                    </p>
                    
                    <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
                        <div className="border-b border-stone-400 pb-2">
                            <span className="block text-xs uppercase font-bold text-stone-400">{t.role}</span>
                            <span className="text-lg font-serif font-bold">Volunteer Intern</span>
                        </div>
                        <div className="border-b border-stone-400 pb-2">
                            <span className="block text-xs uppercase font-bold text-stone-400">{t.org}</span>
                            <span className="text-lg font-serif font-bold">{user.organization || 'Food Rescue Initiative'}</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-end mt-16 px-8">
                        <div className="text-center mb-6 md:mb-0">
                            <div className="w-48 border-b-2 border-stone-800 mb-2"></div>
                            <p className="text-sm font-bold uppercase">Program Director</p>
                        </div>
                        
                        <div className="bg-amber-100 p-4 rounded-lg border border-amber-200 text-center shadow-inner transform rotate-[-2deg]">
                            <p className="text-xs text-stone-500 uppercase font-bold mb-1">{t.id}</p>
                            <p className="font-mono font-bold text-amber-800">{certId}</p>
                            <p className="text-xs text-stone-500 mt-1">{t.date}: {today}</p>
                        </div>

                        <div className="text-center">
                            <div className="w-48 border-b-2 border-stone-800 mb-2"></div>
                            <p className="text-sm font-bold uppercase">Authorized Signatory</p>
                        </div>
                    </div>
                </div>

                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <Award className="w-[500px] h-[500px]" />
                </div>
            </div>
        </div>

        <button onClick={handlePrint} className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 print:hidden">
            <Download className="w-5 h-5" /> {t.download}
        </button>
      </div>
    </div>
  );
};

export default CertificateCard;
