import React, { useState } from 'react';
import { UserRole, Language, UserProfile } from '../types';
import { HeartHandshake, Building2, ShieldAlert, Globe, X } from 'lucide-react';
import Login from './Login';
import { createUserProfile, getUserProfile } from '../services/userService';
import { User } from 'firebase/auth';

interface Props {
  onLogin: (role: UserRole, customProfile?: Partial<UserProfile>) => void;
  language?: Language;
  setLanguage?: (lang: Language) => void;
}

const TEXTS = {
  en: {
    title: "Food Rescue",
    subtitle: "Zero Hunger Initiative Platform",
    selectRole: "Select Your Role",
    donor: "Food Donor",
    donorDesc: "Donate food & track history",
    ngo: "NGO / Volunteer",
    ngoDesc: "Verify food & earn Internship Cert",
    admin: "System Admin",
    adminDesc: "Monitor safety & violations",
    policy: "By logging in, you agree to our",
    policyLink: "Food Safety Policy",
    volunteerPortal: "Volunteer Portal",
    loginMethod: "Choose Login Method",
    phoneLogin: "Continue with Phone",
    googleLogin: "Sign in with Google",
    enterPhone: "Enter Mobile Number",
    sendOtp: "Send OTP",
    enterOtp: "Enter Verification Code",
    verify: "Verify & Login",
    resend: "Resend Code",
    back: "Back",
    invalidOtp: "Invalid OTP. Try 1234."
  },
  hi: {
    title: "खाद्य बचाव (Food Rescue)",
    subtitle: "शून्य भुखमरी पहल मंच",
    selectRole: "अपनी भूमिका चुनें",
    donor: "खाद्य दाता",
    donorDesc: "भोजन दान करें और इतिहास देखें",
    ngo: "एनजीओ / स्वयंसेवक",
    ngoDesc: "भोजन सत्यापित करें और प्रमाणपत्र प्राप्त करें",
    admin: "सिस्टम एडमिन",
    adminDesc: "सुरक्षा और उल्लंघनों की निगरानी करें",
    policy: "लॉग इन करके, आप हमारी",
    policyLink: "खाद्य सुरक्षा नीति से सहमत हैं",
    volunteerPortal: "स्वयंसेवक पोर्टल",
    loginMethod: "लॉगिन विधि चुनें",
    phoneLogin: "फ़ोन नंबर से जारी रखें",
    googleLogin: "Google के साथ साइन इन करें",
    enterPhone: "मोबाइल नंबर दर्ज करें",
    sendOtp: "ओटीपी भेजें",
    enterOtp: "सत्यापन कोड दर्ज करें",
    verify: "सत्यापित करें और लॉगिन करें",
    resend: "कोड पुनः भेजें",
    back: "वापस",
    invalidOtp: "अमान्य ओटीपी। 1234 का प्रयास करें।"
  },
  te: {
    title: "ఆహార రక్షణ (Food Rescue)",
    subtitle: "జీరో హంగర్ ఇనిషియేటివ్ ప్లాట్‌ఫారమ్",
    selectRole: "మీ పాత్రను ఎంచుకోండి",
    donor: "ఆహార దాత",
    donorDesc: "ఆహారాన్ని దానం చేయండి & చరిత్రను ట్రాక్ చేయండి",
    ngo: "NGO / వాలంటీర్",
    ngoDesc: "ఆహారాన్ని ధృవీకరించండి & సర్టిఫికేట్ పొందండి",
    admin: "సిస్టమ్ అడ్మిన్",
    adminDesc: "భద్రత & ఉల్లంఘనలను పర్యవేక్షించండి",
    policy: "లాగిన్ చేయడం ద్వారా, మీరు మా",
    policyLink: "ఆహార భద్రతా విధానానికి అంగీకరిస్తున్నారు",
    volunteerPortal: "వాలంటీర్ పోర్టల్",
    loginMethod: "లాగిన్ పద్ధతిని ఎంచుకోండి",
    phoneLogin: "ఫోన్ నంబర్‌తో కొనసాగించండి",
    googleLogin: "Googleతో సైన్ ఇన్ చేయండి",
    enterPhone: "మొబైల్ నంబర్ నమోదు చేయండి",
    sendOtp: "OTP పంపండి",
    enterOtp: "ధృవీకరణ కోడ్‌ను నమోదు చేయండి",
    verify: "ధృవీకరించండి & లాగిన్ చేయండి",
    resend: "కోడ్‌ని మళ్లీ పంపండి",
    back: "వెనుకకు",
    invalidOtp: "చెల్లని OTP. 1234 ప్రయత్నించండి."
  },
  es: {
    title: "Rescate de Alimentos",
    subtitle: "Plataforma Iniciativa Hambre Cero",
    selectRole: "Seleccione su Rol",
    donor: "Donante",
    donorDesc: "Donar comida y ver historial",
    ngo: "ONG / Voluntario",
    ngoDesc: "Verificar alimentos y ganar certificado",
    admin: "Administrador",
    adminDesc: "Monitorear seguridad y violaciones",
    policy: "Al iniciar sesión, aceptas nuestra",
    policyLink: "Política de Seguridad Alimentaria",
    volunteerPortal: "Portal de Voluntarios",
    loginMethod: "Elegir método de inicio",
    phoneLogin: "Continuar con Teléfono",
    googleLogin: "Iniciar con Google",
    enterPhone: "Ingresar Número Móvil",
    sendOtp: "Enviar OTP",
    enterOtp: "Ingresar Código",
    verify: "Verificar y Entrar",
    resend: "Reenviar",
    back: "Atrás",
    invalidOtp: "OTP inválido. Pruebe 1234."
  }
};

const AuthScreen: React.FC<Props> = ({ onLogin, language = 'en', setLanguage }) => {
  const t = TEXTS[language];

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setShowLoginModal(true);
  };

  const handleAuthSuccess = async (firebaseUser: User) => {
    if (!selectedRole) return;

    try {
      // Check if profile exists
      let profile = await getUserProfile(firebaseUser.uid);

      if (!profile) {
        // Create new profile with selected role
        profile = await createUserProfile(firebaseUser.uid, selectedRole, {
          name: firebaseUser.displayName || 'User',
          // role is mandatory and passed separately
        });
      }

      // Login with profile
      onLogin(profile.role, profile);
      setShowLoginModal(false);
    } catch (error) {
      console.error("Profile creation/fetch failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors duration-300 relative">

      {/* Language Selector for Auth Screen */}
      {setLanguage && (
        <div className="absolute top-4 right-4 z-40">
          <div className="relative group">
            <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 px-4 py-2 rounded-full shadow-sm hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors">
              <Globe className="w-4 h-4 text-stone-500 dark:text-slate-400" />
              <span className="text-sm font-bold text-stone-700 dark:text-stone-300 uppercase">{language}</span>
            </button>
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-stone-200 dark:border-slate-700 overflow-hidden hidden group-hover:block animate-fade-in-up">
              <button onClick={() => setLanguage('en')} className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-stone-50 dark:hover:bg-slate-700 ${language === 'en' ? 'text-emerald-600' : 'text-stone-600 dark:text-slate-300'}`}>English</button>
              <button onClick={() => setLanguage('hi')} className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-stone-50 dark:hover:bg-slate-700 ${language === 'hi' ? 'text-emerald-600' : 'text-stone-600 dark:text-slate-300'}`}>Hindi (हिंदी)</button>
              <button onClick={() => setLanguage('te')} className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-stone-50 dark:hover:bg-slate-700 ${language === 'te' ? 'text-emerald-600' : 'text-stone-600 dark:text-slate-300'}`}>Telugu (తెలుగు)</button>
              <button onClick={() => setLanguage('es')} className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-stone-50 dark:hover:bg-slate-700 ${language === 'es' ? 'text-emerald-600' : 'text-stone-600 dark:text-slate-300'}`}>Español</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Role Selection Card */}
      <div className={`max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up ring-1 ring-stone-200 dark:ring-slate-800 transition-all ${showLoginModal ? 'blur-sm scale-95 pointer-events-none' : ''}`}>
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <div className="bg-white/20 p-3 rounded-2xl w-fit mx-auto mb-4 backdrop-blur-sm shadow-inner">
              <HeartHandshake className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold mb-1 tracking-tight">{t.title}</h1>
            <p className="text-emerald-100 font-medium">{t.subtitle}</p>
          </div>
        </div>

        <div className="p-8 bg-white dark:bg-slate-900 transition-colors duration-300">
          <h2 className="text-stone-500 dark:text-slate-400 font-bold mb-6 text-center text-xs uppercase tracking-widest">
            {t.selectRole}
          </h2>

          <div className="space-y-4">
            <button
              onClick={() => handleRoleSelect('DONOR')}
              className="w-full flex items-center p-4 border border-stone-200 dark:border-slate-700 rounded-2xl hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-all group shadow-sm hover:shadow-md bg-white dark:bg-slate-800"
            >
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center mr-4 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/60 group-hover:scale-110 transition-all">
                <HeartHandshake className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div className="text-left">
                <div className="font-bold text-stone-800 dark:text-white text-lg">{t.donor}</div>
                <div className="text-xs text-stone-500 dark:text-slate-400 font-medium">{t.donorDesc}</div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect('NGO')}
              className="w-full flex items-center p-4 border border-stone-200 dark:border-slate-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all group shadow-sm hover:shadow-md bg-white dark:bg-slate-800"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60 group-hover:scale-110 transition-all">
                <Building2 className="w-6 h-6 text-blue-700 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <div className="font-bold text-stone-800 dark:text-white text-lg">{t.ngo}</div>
                <div className="text-xs text-stone-500 dark:text-slate-400 font-medium">{t.ngoDesc}</div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect('ADMIN')}
              className="w-full flex items-center p-4 border border-stone-200 dark:border-slate-700 rounded-2xl hover:border-rose-500 dark:hover:border-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-900/20 transition-all group shadow-sm hover:shadow-md bg-white dark:bg-slate-800"
            >
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/40 rounded-xl flex items-center justify-center mr-4 group-hover:bg-rose-200 dark:group-hover:bg-rose-900/60 group-hover:scale-110 transition-all">
                <ShieldAlert className="w-6 h-6 text-rose-700 dark:text-rose-400" />
              </div>
              <div className="text-left">
                <div className="font-bold text-stone-800 dark:text-white text-lg">{t.admin}</div>
                <div className="text-xs text-stone-500 dark:text-slate-400 font-medium">{t.adminDesc}</div>
              </div>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-stone-400 dark:text-slate-500 font-medium">
              {t.policy} <span className="underline cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400">{t.policyLink}</span>.
            </p>
          </div>
        </div>
      </div>

      {showLoginModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 animate-scale-up backdrop-blur-sm bg-black/20">
          <Login
            onSuccess={handleAuthSuccess}
            onClose={() => setShowLoginModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default AuthScreen;
