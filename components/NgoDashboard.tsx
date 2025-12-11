
import React, { useState } from 'react';
import { UserProfile, Language } from '../types';
import { Bell, MapPin, Navigation, Clock, CheckCircle, Award, Calendar, ChevronRight } from 'lucide-react';
import CertificateCard from './CertificateCard';
import ShiftManager from './ShiftManager';
import EarningsWallet from './EarningsWallet';

interface Props {
  user: UserProfile;
  onTrackDonation: () => void;
  language?: Language;
}

const TEXTS = {
  en: {
    logCenter: "Dashboard & Logistics Center",
    alerts: "Live Donation Alerts",
    track: "Track Now",
    details: "View Details",
    pickups: "Scheduled Pickups",
    noPickups: "No other active pickups scheduled for today.",
    verified: "Verified",
    ago: "ago",
    away: "away",
    expires: "Expires",
    claimed: "Claimed",
    internship: "Internship Progress",
    month: "Month",
    complete: "Completed",
    claimCert: "Claim Certificate",
    joined: "Joined"
  },
  hi: {
    logCenter: "डैशबोर्ड और लॉजिस्टिक्स केंद्र",
    alerts: "लाइव दान अलर्ट",
    track: "ट्रैक करें",
    details: "विवरण देखें",
    pickups: "निर्धारित पिकअप",
    noPickups: "आज के लिए कोई अन्य सक्रिय पिकअप निर्धारित नहीं है।",
    verified: "सत्यापित",
    ago: "पहले",
    away: "दूर",
    expires: "समाप्त",
    claimed: "दावा किया गया",
    internship: "इंटर्नशिप प्रगति",
    month: "महीना",
    complete: "पूरा हुआ",
    claimCert: "प्रमाणपत्र प्राप्त करें",
    joined: "शामिल हुए"
  },
  te: {
    logCenter: "డ్యాష్‌బోర్డ్ & లాజిస్టిక్స్ సెంటర్",
    alerts: "లైవ్ విరాళం హెచ్చరికలు",
    track: "ట్రాక్ చేయండి",
    details: "వివరాలు చూడండి",
    pickups: "షెడ్యూల్ చేయబడిన పికప్‌లు",
    noPickups: "ఈ రోజుకు వేరే పికప్‌లు షెడ్యూల్ చేయబడలేదు.",
    verified: "ధృవీకరించబడింది",
    ago: "క్రితం",
    away: "దూరం",
    expires: "గడువు",
    claimed: "క్లెయిమ్ చేయబడింది",
    internship: "ఇంటర్న్‌షిప్ పురోగతి",
    month: "నెల",
    complete: "పూర్తయింది",
    claimCert: "సర్టిఫికేట్ క్లెయిమ్ చేయండి",
    joined: "చేరారు"
  },
  es: {
    logCenter: "Centro de Logística",
    alerts: "Alertas de Donación",
    track: "Rastrear",
    details: "Ver Detalles",
    pickups: "Recogidas Programadas",
    noPickups: "No hay más recogidas hoy.",
    verified: "Verificado",
    ago: "hace",
    away: "lejos",
    expires: "Expira",
    claimed: "Reclamado",
    internship: "Progreso Pasantía",
    month: "Mes",
    complete: "Completado",
    claimCert: "Reclamar Certificado",
    joined: "Unido"
  }
};

const NgoDashboard: React.FC<Props> = ({ user, onTrackDonation, language = 'en' }) => {
  const [showCertificate, setShowCertificate] = useState(false);
  const [walletUpdateTrigger, setWalletUpdateTrigger] = useState(0);
  const t = TEXTS[language];

  // Calculate Internship Duration (Mock logic based on user.internshipStartDate)
  const startDate = user.internshipStartDate ? new Date(user.internshipStartDate) : new Date();
  const now = new Date();
  // Simple month difference calculation
  const monthsCompleted = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
  const progressPercent = Math.min((monthsCompleted / 6) * 100, 100);
  const isEligible = monthsCompleted >= 6;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 animate-fade-in relative">

      {showCertificate && (
        <CertificateCard user={user} onClose={() => setShowCertificate(false)} language={language} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-slate-800 transition-colors">
        <div>
          <h1 className="text-2xl font-bold text-stone-800 dark:text-white">{user.organization}</h1>
          <p className="text-stone-500 dark:text-slate-400 font-medium">{t.logCenter}</p>
        </div>
        <div className="relative">
          <div className="p-3 bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer group">
            <Bell className="w-6 h-6 text-stone-600 dark:text-slate-300 group-hover:text-blue-600 transition-colors" />
            <span className="absolute top-2 right-2 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

        {/* Main Alerts Section */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-stone-800 dark:text-white mb-4 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            {t.alerts}
          </h2>

          <div className="space-y-4">
            {/* Mock Incoming Alert */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border-l-8 border-amber-500 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-slide-in ring-1 ring-stone-100 dark:ring-slate-800 transition-colors">
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">Non-Veg</span>
                  <span className="text-xs text-stone-400 dark:text-slate-500 font-bold uppercase tracking-wider">{t.verified} 2m {t.ago}</span>
                </div>
                <h3 className="text-2xl font-bold text-stone-800 dark:text-white mb-1">Chicken Biryani (50 Servings)</h3>
                <p className="text-stone-500 dark:text-slate-400 text-sm font-medium flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-stone-400" />
                  Indiranagar Community Hall (3.5 km {t.away})
                </p>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="flex items-center text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900 px-3 py-1.5 rounded-lg">
                    <CheckCircle className="w-4 h-4 mr-1.5" /> Safety Score: 98
                  </span>
                  <span className="flex items-center text-amber-700 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900 px-3 py-1.5 rounded-lg">
                    <Clock className="w-4 h-4 mr-1.5" /> {t.expires}: 3h 45m
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 min-w-[160px]">
                <button
                  onClick={onTrackDonation}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" /> {t.track}
                </button>
                <button className="bg-white dark:bg-slate-800 border-2 border-stone-200 dark:border-slate-700 text-stone-600 dark:text-slate-300 hover:border-stone-300 hover:text-stone-800 dark:hover:text-white font-bold py-3 px-6 rounded-xl transition-colors">
                  {t.details}
                </button>
              </div>
            </div>

            {/* Second Mock Alert (Inactive/Past) */}
            <div className="bg-stone-50 dark:bg-slate-800 rounded-2xl shadow-sm border border-stone-200 dark:border-slate-700 p-6 opacity-60 grayscale transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-stone-600 dark:text-slate-400">Veg Sandwich Platter (20 units)</h3>
                  <p className="text-stone-400 dark:text-slate-500 text-sm font-medium">Claimed by Youth Center Food Bank</p>
                </div>
                <span className="bg-stone-200 dark:bg-slate-700 text-stone-500 dark:text-slate-400 text-xs font-bold px-2 py-1 rounded uppercase">{t.claimed}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Staff & Internship Widgets */}
        <div className="space-y-8">
          <ShiftManager user={user} onUpdate={() => setWalletUpdateTrigger(prev => prev + 1)} />
          <div className="h-96"><EarningsWallet user={user} lastUpdate={walletUpdateTrigger} /></div>
          <div>
            <h2 className="text-xl font-bold text-stone-800 dark:text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              {t.internship}
            </h2>
            <div className="bg-gradient-to-br from-stone-900 to-stone-800 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Award className="w-32 h-32" />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">{t.joined}</p>
                    <p className="font-medium text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-500" />
                      {startDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-amber-500">{monthsCompleted}</span>
                    <span className="text-stone-400 text-sm">/6 {t.month}</span>
                  </div>
                </div>

                <div className="w-full bg-stone-700 rounded-full h-3 mb-6 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                {isEligible ? (
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-amber-900/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 animate-pulse"
                  >
                    <Award className="w-5 h-5" /> {t.claimCert}
                  </button>
                ) : (
                  <div className="w-full bg-stone-700 text-stone-400 font-bold py-3 rounded-xl text-center text-sm">
                    {6 - monthsCompleted} months to go
                  </div>
                )}
              </div>
            </div>

            {/* Pickups Widget */}
            <h2 className="text-xl font-bold text-stone-800 dark:text-white mt-8 mb-4">{t.pickups}</h2>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border-2 border-dashed border-stone-200 dark:border-slate-800 text-center text-stone-400 dark:text-slate-600 transition-colors">
              <p className="font-medium text-sm">{t.noPickups}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NgoDashboard;
