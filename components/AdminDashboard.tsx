
import React from 'react';
import { ViolationRecord, Language } from '../types';
import { ShieldAlert, Users, TrendingUp, AlertTriangle, Ban } from 'lucide-react';

interface Props {
  language?: Language;
}

const TEXTS = {
  en: {
    title: "Admin Control Panel",
    totalUsers: "Total Users",
    meals: "Meals Rescued",
    incidents: "Safety Incidents",
    ngos: "Active NGOs",
    violations: "Safety Violations & Flags",
    monitor: "Monitor potential risks and user compliance",
    pending: "Pending",
    user: "User",
    type: "Violation Type",
    severity: "Severity",
    date: "Date",
    action: "Action",
    suspend: "Suspend User",
    review: "Requires Review",
    verified: "Verified"
  },
  hi: {
    title: "एडमिन कंट्रोल पैनल",
    totalUsers: "कुल उपयोगकर्ता",
    meals: "भोजन बचाया",
    incidents: "सुरक्षा घटनाएं",
    ngos: "सक्रिय एनजीओ",
    violations: "सुरक्षा उल्लंघन",
    monitor: "जोखिमों और अनुपालन की निगरानी करें",
    pending: "लंबित",
    user: "उपयोगकर्ता",
    type: "उल्लंघन का प्रकार",
    severity: "गंभीरता",
    date: "तारीख",
    action: "कार्रवाई",
    suspend: "उपयोगकर्ता को निलंबित करें",
    review: "समीक्षा आवश्यक",
    verified: "सत्यापित"
  },
  te: {
    title: "అడ్మిన్ కంట్రోల్ ప్యానెల్",
    totalUsers: "మొత్తం వినియోగదారులు",
    meals: "కాపాడిన భోజనాలు",
    incidents: "భద్రతా సంఘటనలు",
    ngos: "యాక్టివ్ NGOలు",
    violations: "భద్రతా ఉల్లంఘనలు",
    monitor: "ప్రమాదాలు మరియు సమ్మతిని పర్యవేక్షించండి",
    pending: "పెండింగ్‌లో ఉంది",
    user: "వినియోగదారు",
    type: "ఉల్లంఘన రకం",
    severity: "తీవ్రత",
    date: "తేదీ",
    action: "చర్య",
    suspend: "వినియోగదారుని సస్పెండ్ చేయండి",
    review: "సమీక్ష అవసరం",
    verified: "ధృవీకరించబడింది"
  },
  es: {
    title: "Panel de Control Admin",
    totalUsers: "Total Usuarios",
    meals: "Comidas Rescatadas",
    incidents: "Incidentes",
    ngos: "ONGs Activas",
    violations: "Violaciones de Seguridad",
    monitor: "Monitorear riesgos",
    pending: "Pendiente",
    user: "Usuario",
    type: "Tipo",
    severity: "Severidad",
    date: "Fecha",
    action: "Acción",
    suspend: "Suspender",
    review: "Requiere Revisión",
    verified: "Verificado"
  }
};

const MOCK_VIOLATIONS: ViolationRecord[] = [
  { id: 'v1', userId: 'u123', userName: 'John Doe (Donor)', violationType: 'Food Temp Mismatch', date: '2024-05-21', severity: 'MEDIUM' },
  { id: 'v2', userId: 'u456', userName: 'Catering Co.', violationType: 'Reported Spoiled by NGO', date: '2024-05-20', severity: 'CRITICAL' },
];

const AdminDashboard: React.FC<Props> = ({ language = 'en' }) => {
  const t = TEXTS[language];
  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-stone-800 dark:text-white mb-8 tracking-tight">{t.title}</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-slate-800 border-t-4 border-t-blue-500 transition-colors">
          <div className="text-stone-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">{t.totalUsers}</div>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">1,248</div>
          <div className="flex items-center text-xs text-emerald-500 mt-2 font-bold bg-emerald-50 dark:bg-emerald-900/20 w-fit px-2 py-1 rounded">
            <TrendingUp className="w-3 h-3 mr-1" /> +12%
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-slate-800 border-t-4 border-t-emerald-500 transition-colors">
          <div className="text-stone-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">{t.meals}</div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">15,400</div>
          <div className="flex items-center text-xs text-emerald-500 mt-2 font-bold bg-emerald-50 dark:bg-emerald-900/20 w-fit px-2 py-1 rounded">
            <TrendingUp className="w-3 h-3 mr-1" /> +5%
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-slate-800 border-t-4 border-t-rose-500 transition-colors">
          <div className="text-stone-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">{t.incidents}</div>
          <div className="text-3xl font-black text-rose-500 dark:text-rose-400 mt-2">3</div>
          <div className="text-xs text-rose-500 mt-2 font-bold bg-rose-50 dark:bg-rose-900/20 w-fit px-2 py-1 rounded">{t.review}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-slate-800 border-t-4 border-t-sky-500 transition-colors">
          <div className="text-stone-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">{t.ngos}</div>
          <div className="text-3xl font-black text-sky-600 dark:text-sky-400 mt-2">42</div>
          <div className="text-xs text-sky-500 mt-2 font-bold bg-sky-50 dark:bg-sky-900/20 w-fit px-2 py-1 rounded">{t.verified}</div>
        </div>
      </div>

      {/* Safety Violations */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-stone-200 dark:border-slate-800 overflow-hidden mb-8 transition-colors">
        <div className="p-6 bg-rose-50 dark:bg-rose-900/20 border-b border-rose-100 dark:border-rose-900/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-rose-100 dark:bg-rose-900/40 p-2 rounded-lg">
                <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
                <h2 className="font-bold text-rose-900 dark:text-rose-200 text-lg">{t.violations}</h2>
                <p className="text-rose-700 dark:text-rose-300 text-xs font-medium">{t.monitor}</p>
            </div>
          </div>
          <span className="bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 text-xs font-bold px-3 py-1 rounded-full border border-rose-200 dark:border-rose-900 shadow-sm">
            {MOCK_VIOLATIONS.length} {t.pending}
          </span>
        </div>
        
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 dark:bg-slate-800 text-stone-500 dark:text-slate-400">
            <tr>
              <th className="p-5 font-bold uppercase text-xs tracking-wider">{t.user}</th>
              <th className="p-5 font-bold uppercase text-xs tracking-wider">{t.type}</th>
              <th className="p-5 font-bold uppercase text-xs tracking-wider">{t.severity}</th>
              <th className="p-5 font-bold uppercase text-xs tracking-wider">{t.date}</th>
              <th className="p-5 font-bold uppercase text-xs tracking-wider text-right">{t.action}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
            {MOCK_VIOLATIONS.map((v) => (
              <tr key={v.id} className="hover:bg-stone-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-5 font-bold text-stone-800 dark:text-stone-200">{v.userName}</td>
                <td className="p-5 text-stone-600 dark:text-slate-400 font-medium">{v.violationType}</td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    v.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-900' : 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900'
                  }`}>
                    {v.severity}
                  </span>
                </td>
                <td className="p-5 text-stone-500 dark:text-slate-500 font-medium">{v.date}</td>
                <td className="p-5 text-right">
                  <button className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-800 dark:hover:text-rose-300 p-2 rounded-lg font-bold text-xs flex items-center gap-1 ml-auto transition-all border border-transparent hover:border-rose-200 dark:hover:border-rose-800">
                    <Ban className="w-3 h-3" /> {t.suspend}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
