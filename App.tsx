import React, { useState, useEffect } from 'react';
import { FoodAnalysisResult, AppState, AppMode, NgoRequest, SafetyCheckData, UserRole, UserProfile, Language } from './types';
import { analyzeFoodImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import AnalysisResultCard from './components/AnalysisResultCard';
import SafetyCheckForm from './components/SafetyCheckForm';
import LogisticsMatchCard from './components/LogisticsMatchCard';
import DeliveryTracking from './components/DeliveryTracking';
import AuthScreen from './components/AuthScreen';
import DonorDashboard from './components/DonorDashboard';
import NgoDashboard from './components/NgoDashboard';
import AdminDashboard from './components/AdminDashboard';
import SRSDocument from './components/SRSDocument';
import { Loader2, RefreshCw, LogOut, ArrowLeft, HeartHandshake, WifiOff, Zap, ZapOff, Moon, Sun, Book, Globe } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { getUserProfile, addRewardPoints } from './services/userService';

// Simple Translation Dictionary (kept as is)
const TRANSLATIONS = {
  en: {
    appTitle: "Food Rescue",
    portal: "Portal",
    logout: "Logout",
    liteMode: "Lite Mode",
    liteModeOn: "Lite Mode ON",
    offline: "You are Offline. Please connect to the internet to analyze food.",
    newEntry: "New Donation Entry",
    logisticsTracking: "Logistics Tracking",
    monitorProgress: "Monitor delivery progress.",
    completeSteps: "Complete the steps below.",
    analyzing: "AI Validating...",
    uploadOptimized: "Uploading optimized image...",
    analysisFailed: "Analysis Failed",
    tryAgain: "Try Again"
  },
  hi: {
    appTitle: "खाद्य बचाव (Food Rescue)",
    portal: "पोर्टल",
    logout: "लॉग आउट",
    liteMode: "लाइट मोड",
    liteModeOn: "लाइट मोड चालू",
    offline: "आप ऑफ़लाइन हैं। कृपया इंटरनेट से कनेक्ट करें।",
    newEntry: "नया दान",
    logisticsTracking: "वितरण ट्रैकिंग",
    monitorProgress: "प्रगति की निगरानी करें",
    completeSteps: "नीचे दिए गए चरणों को पूरा करें",
    analyzing: "जाँच हो रही है...",
    uploadOptimized: "इमेज अपलोड हो रही है...",
    analysisFailed: "विश्लेषण विफल",
    tryAgain: "पुनः प्रयास करें"
  },
  te: {
    appTitle: "ఆహార రక్షణ (Food Rescue)",
    portal: "పోర్టల్",
    logout: "లాగ్ అవుట్",
    liteMode: "లైట్ మోడ్",
    liteModeOn: "లైట్ మోడ్ ఆన్",
    offline: "మీరు ఆఫ్‌లైన్‌లో ఉన్నారు. దయచేసి ఇంటర్నెట్‌కు కనెక్ట్ చేయండి.",
    newEntry: "కొత్త విరాళం",
    logisticsTracking: "డెలివరీ ట్రాకింగ్",
    monitorProgress: "డెలివరీ పురోగతిని పర్యవేక్షించండి",
    completeSteps: "దిగువ దశలను పూర్తి చేయండి",
    analyzing: "AI పరిశీలిస్తోంది...",
    uploadOptimized: "ఫోటో అప్‌లోడ్ అవుతోంది...",
    analysisFailed: "విశ్లేషణ విఫలమైంది",
    tryAgain: "మళ్ళీ ప్రయత్నించండి"
  },
  es: {
    appTitle: "Rescate de Alimentos",
    portal: "Portal",
    logout: "Cerrar Sesión",
    liteMode: "Modo Ligero",
    liteModeOn: "Modo Ligero ON",
    offline: "Estás desconectado. Por favor conéctate a internet.",
    newEntry: "Nueva Donación",
    logisticsTracking: "Rastreo Logístico",
    monitorProgress: "Monitorear progreso",
    completeSteps: "Completa los pasos abajo",
    analyzing: "Validando IA...",
    uploadOptimized: "Subiendo imagen...",
    analysisFailed: "Análisis Fallido",
    tryAgain: "Intentar de Nuevo"
  }
};

interface MainContentProps {
  view: 'DASHBOARD' | 'FLOW' | 'DOCS';
  setView: (view: 'DASHBOARD' | 'FLOW' | 'DOCS') => void;
  user: UserProfile;
  appState: AppState;
  appMode: AppMode;
  previewUrl: string | null;
  validationResult: FoodAnalysisResult | null;
  safetyCheckData: SafetyCheckData | null;
  trackingNgo: NgoRequest | null;
  error: string | null;
  isLiteMode: boolean;
  language: Language;
  handleImageSelected: (base64: string, preview: string) => void;
  loadDemoData: () => void;
  resetApp: () => void;
  setAppState: (state: AppState) => void;
  setAppMode: (mode: AppMode) => void;
  handleSafetyVerified: (data: SafetyCheckData) => void;
  setTrackingNgo: (ngo: NgoRequest | null) => void;
  onAwardPoints: (points: number) => void;
}

const MainContent: React.FC<MainContentProps> = (props) => {
  const { view, setView, user, appState, appMode, previewUrl, validationResult, safetyCheckData, trackingNgo, error, isLiteMode, language, handleImageSelected, resetApp, setAppMode, handleSafetyVerified, setTrackingNgo, loadDemoData, onAwardPoints } = props;

  const t = TRANSLATIONS[language];

  const startFlow = (mode: AppMode) => {
    setAppMode(mode);
    setView('FLOW');
    resetApp();
  };

  if (view === 'DOCS') {
    return <SRSDocument />;
  }

  if (view === 'DASHBOARD') {
    if (user.role === 'DONOR') {
      return <DonorDashboard user={user} onNewDonation={() => startFlow('VALIDATOR')} language={language} />;
    }
    if (user.role === 'NGO') {
      return <NgoDashboard user={user} onTrackDonation={() => { startFlow('VALIDATOR'); loadDemoData(); }} language={language} />;
    }
    if (user.role === 'ADMIN') {
      return <AdminDashboard language={language} />;
    }
    return null;
  }

  return (
    <div className={`w-full max-w-5xl mx-auto p-4 md:p-8 flex flex-col items-center ${!isLiteMode ? 'animate-fade-in' : ''}`}>
      {/* Task Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 tracking-tight">
          {trackingNgo ? t.logisticsTracking : t.newEntry}
        </h2>
        {!isLiteMode && <div className="h-1 w-20 bg-emerald-500 mx-auto mt-2 rounded-full"></div>}
        <p className="text-stone-500 dark:text-stone-400 mt-2 font-medium">
          {trackingNgo ? t.monitorProgress : t.completeSteps}
        </p>
      </div>

      {/* Upload Section */}
      {appState === AppState.IDLE && !trackingNgo && (
        <ImageUploader
          onImageSelected={handleImageSelected}
          isLoading={false}
          isLiteMode={isLiteMode}
          language={language}
        />
      )}

      {/* Processing State */}
      {appState === AppState.ANALYZING && (
        <div className="w-full flex flex-col items-center my-12">
          <div className={`relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-700 mb-6 ring-4 ring-emerald-100 dark:ring-emerald-900`}>
            <img
              src={previewUrl!}
              alt="Analyzing"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
              <Loader2 className="w-16 h-16 text-white animate-spin drop-shadow-lg" />
            </div>
            {!isLiteMode && (
              <div className={`absolute inset-0 border-b-4 animate-[scan_2s_ease-in-out_infinite] opacity-80 shadow-[0_0_20px_rgba(255,255,255,0.8)] border-emerald-400`}></div>
            )}
          </div>
          <h3 className="text-2xl font-bold text-stone-700 dark:text-stone-200">
            {t.analyzing}
          </h3>
          <p className="text-stone-400 dark:text-stone-500 mt-2">{t.uploadOptimized}</p>
        </div>
      )}

      {/* Results State */}
      {appState === AppState.SUCCESS && (
        <div className="w-full flex flex-col items-center">

          {/* Validator Flow */}
          {appMode === 'VALIDATOR' && validationResult && !trackingNgo && (
            <>
              <AnalysisResultCard result={validationResult} language={language} />

              {validationResult.safety_flag && !safetyCheckData && (
                <SafetyCheckForm onSafetyVerified={handleSafetyVerified} language={language} />
              )}

              {validationResult.safety_flag && safetyCheckData && (
                <LogisticsMatchCard
                  donation={validationResult}
                  onStartDelivery={(ngo) => {
                    setTrackingNgo(ngo);
                    if (user && user.role === 'DONOR') {
                      onAwardPoints(50);
                    }
                  }}
                  language={language}
                />
              )}
            </>
          )}

          {/* Tracking Flow */}
          {trackingNgo && validationResult && (
            <DeliveryTracking
              ngo={trackingNgo}
              donation={validationResult}
              onBack={() => { setTrackingNgo(null); setView('DASHBOARD'); }}
              language={language}
            />
          )}
        </div>
      )}

      {/* Error State */}
      {appState === AppState.ERROR && (
        <div className="w-full max-w-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center shadow-lg">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <RefreshCw className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">{t.analysisFailed}</h3>
          <p className="text-red-600 dark:text-red-400 mb-6 font-medium">{error}</p>
          <button
            onClick={resetApp}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
          >
            {t.tryAgain}
          </button>
        </div>
      )}
    </div>
  );
}

const AppContent: React.FC = () => {
  const { user: firebaseUser, logout: firebaseLogout, loading: authLoading } = useAuth();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<'DASHBOARD' | 'FLOW' | 'DOCS'>('DASHBOARD');

  // Network & Performance State
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLiteMode, setIsLiteMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  // App Workflow State
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [appMode, setAppMode] = useState<AppMode>('VALIDATOR');

  // Data State
  const [validationResult, setValidationResult] = useState<FoodAnalysisResult | null>(null);
  const [safetyCheckData, setSafetyCheckData] = useState<SafetyCheckData | null>(null);
  const [trackingNgo, setTrackingNgo] = useState<NgoRequest | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    // Check saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync Firebase User with Application User Profile
  useEffect(() => {
    const syncUser = async () => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        if (profile) {
          setCurrentUser(profile);
        }
      } else {
        setCurrentUser(null);
      }
    };
    syncUser();
  }, [firebaseUser]);

  const handleAwardPoints = async (points: number) => {
    if (currentUser) {
      await addRewardPoints(currentUser.id, points);
      setCurrentUser(prev => prev ? ({
        ...prev,
        rewardPoints: (prev.rewardPoints || 0) + points
      }) : null);
    }
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const handleLogin = (role: UserRole, customProfile?: Partial<UserProfile>) => {
    // This is called by AuthScreen after successful firebase login and profile creation
    // We construct the profile here to be safe and set it
    const mockUser: UserProfile = {
      id: firebaseUser?.uid || `u${Math.floor(Math.random() * 1000)}`,
      name: customProfile?.name || (role === 'DONOR' ? 'Alex Johnson' : role === 'NGO' ? 'Sarah Jenkins' : 'Admin User'),
      organization: role === 'NGO' ? customProfile?.organization || 'City Harvest Shelter' : undefined,
      internshipStartDate: role === 'NGO' ? new Date().toISOString() : undefined,
      ...customProfile,
      role: role, // Explicitly set role LAST to ensure button selection wins
    };
    setCurrentUser(mockUser);
    setView('DASHBOARD');
    resetApp();
  };

  const handleLogout = async () => {
    await firebaseLogout();
    setCurrentUser(null);
    resetApp();
  };

  const handleImageSelected = async (base64: string, preview: string) => {
    if (!isOnline) {
      setError(t.offline);
      setAppState(AppState.ERROR);
      return;
    }

    setPreviewUrl(preview);
    setAppState(AppState.ANALYZING);
    setError(null);
    setValidationResult(null);
    setSafetyCheckData(null);
    setTrackingNgo(null);

    try {
      const analysis = await analyzeFoodImage(base64);
      setValidationResult(analysis);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || "Failed to process image.";
      setError(errorMessage);
      setAppState(AppState.ERROR);
    }
  };

  const loadDemoData = () => {
    setPreviewUrl("https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=1000");
    setAppState(AppState.SUCCESS);
    setTrackingNgo(null);
    setSafetyCheckData(null);

    // ... existing demo logic ...
    if (currentUser?.role === 'NGO') {
      setValidationResult({
        food_name: "Chicken Biryani",
        category: "Non-Veg",
        quantity_estimate: "Feeds 50 people",
        weight_kg: 5.0, // Added for logistics check
        freshness_status: "Fresh",
        safety_flag: true,
        expiry_window: "Consume within 4 hours",
        allergens: ["Chicken", "Spices", "Dairy"],
        safety_reason: "Freshly cooked, steaming hot, with no signs of spoilage or contamination."
      });
      setTrackingNgo({
        id: '4',
        organization_name: 'Shanti Orphanage',
        required_diet: 'Veg',
        required_quantity: 50,
        distance_km: 5.0,
        contact_person: 'Sister Mary',
        phone: '+91 98765 10004'
      });
      return;
    }

    setValidationResult({
      food_name: "Chicken Biryani",
      category: "Non-Veg",
      quantity_estimate: "Feeds 50 people",
      weight_kg: 5.0, // Added for logistics check
      freshness_status: "Fresh",
      safety_flag: true,
      expiry_window: "Consume within 4 hours",
      allergens: ["Chicken", "Spices", "Dairy"],
      safety_reason: "Freshly cooked, steaming hot, with no signs of spoilage or contamination."
    });
    setError(null);
  };

  const resetApp = () => {
    setAppState(AppState.IDLE);
    setValidationResult(null);
    setSafetyCheckData(null);
    setTrackingNgo(null);
    setPreviewUrl(null);
    setError(null);
  };

  const handleSafetyVerified = (data: SafetyCheckData) => {
    setSafetyCheckData(data);
  };

  // If loading auth state, show a spinner or nothing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-stone-100' : 'bg-stone-50 text-stone-900'}`}>

        {/* Offline Banner */}
        {!isOnline && (
          <div className="bg-red-600 text-white text-center py-2 px-4 text-sm font-bold flex items-center justify-center gap-2 animate-pulse sticky top-0 z-50">
            <WifiOff className="w-4 h-4" />
            {t.offline}
          </div>
        )}

        {!currentUser ? (
          <AuthScreen
            onLogin={handleLogin}
            language={language}
            setLanguage={setLanguage}
          />
        ) : (
          <>
            <header className={`${isLiteMode ? 'bg-stone-100 dark:bg-slate-900 border-b-2 border-stone-300 dark:border-slate-800' : 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm'} border-b border-stone-200 dark:border-slate-800 sticky top-0 z-30 transition-colors duration-300`}>
              <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {view !== 'DASHBOARD' && (
                    <button onClick={() => { setView('DASHBOARD'); resetApp(); }} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-slate-800 mr-1 transition-colors">
                      <ArrowLeft className="w-5 h-5 text-stone-600 dark:text-stone-300" />
                    </button>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="bg-emerald-600 p-1.5 rounded-lg">
                      <HeartHandshake className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-stone-900 dark:text-white leading-none hidden sm:block">{t.appTitle}</h1>
                      <h1 className="text-xl font-bold text-stone-900 dark:text-white leading-none sm:hidden">Rescue</h1>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                        {currentUser.role} {t.portal}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Language Switcher */}
                  <div className="relative group">
                    <button className="p-2 rounded-full text-stone-500 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1">
                      <Globe className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase">{language}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-stone-200 dark:border-slate-700 overflow-hidden hidden group-hover:block animate-fade-in-up">
                      <button onClick={() => setLanguage('en')} className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-stone-50 dark:hover:bg-slate-700 ${language === 'en' ? 'text-emerald-600' : 'text-stone-600 dark:text-slate-300'}`}>English</button>
                      <button onClick={() => setLanguage('hi')} className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-stone-50 dark:hover:bg-slate-700 ${language === 'hi' ? 'text-emerald-600' : 'text-stone-600 dark:text-slate-300'}`}>Hindi (हिंदी)</button>
                      <button onClick={() => setLanguage('te')} className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-stone-50 dark:hover:bg-slate-700 ${language === 'te' ? 'text-emerald-600' : 'text-stone-600 dark:text-slate-300'}`}>Telugu (తెలుగు)</button>
                      <button onClick={() => setLanguage('es')} className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-stone-50 dark:hover:bg-slate-700 ${language === 'es' ? 'text-emerald-600' : 'text-stone-600 dark:text-slate-300'}`}>Español</button>
                    </div>
                  </div>

                  {/* Documentation Toggle */}
                  <button
                    onClick={() => setView(view === 'DOCS' ? 'DASHBOARD' : 'DOCS')}
                    className={`p-2 rounded-full transition-colors hidden sm:block ${view === 'DOCS' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' : 'text-stone-500 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'}`}
                    title="View Documentation"
                  >
                    <Book className="w-5 h-5" />
                  </button>

                  {/* Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-stone-500 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
                    title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>

                  {/* Lite Mode Toggle */}
                  <button
                    onClick={() => setIsLiteMode(!isLiteMode)}
                    className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${isLiteMode
                      ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-700'
                      : 'bg-stone-100 text-stone-500 hover:bg-stone-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                      }`}
                  >
                    {isLiteMode ? <Zap className="w-3 h-3 fill-current" /> : <ZapOff className="w-3 h-3" />}
                    <span className="hidden lg:inline">{isLiteMode ? t.liteModeOn : t.liteMode}</span>
                  </button>

                  <div className="hidden md:block text-right">
                    <div className="text-sm font-bold text-stone-800 dark:text-stone-200">{currentUser.name}</div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">{currentUser.organization || 'Verified User'}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                    title={t.logout}
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </header>


            <main className="flex-grow flex flex-col items-center w-full">
              <MainContent
                view={view}

                onAwardPoints={handleAwardPoints}
                setView={setView}
                user={currentUser}
                appState={appState}
                appMode={appMode}
                previewUrl={previewUrl}
                validationResult={validationResult}
                safetyCheckData={safetyCheckData}
                trackingNgo={trackingNgo}
                error={error}
                isLiteMode={isLiteMode}
                language={language}
                handleImageSelected={handleImageSelected}
                loadDemoData={loadDemoData}
                resetApp={resetApp}
                setAppState={setAppState}
                setAppMode={setAppMode}
                handleSafetyVerified={handleSafetyVerified}
                setTrackingNgo={setTrackingNgo}
              />
            </main>
          </>
        )}

        {/* CSS Styles included directly in App */}
        <style>{`
          @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
          @keyframes scale-up {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-scale-up { animation: scale-up 0.3s ease-out forwards; }
          .animate-fade-in { animation: fadeIn 0.5s ease-out; }
          .animate-fade-in-up { animation: fadeInUp 0.5s ease-out; }
          .animate-slide-in { animation: slideIn 0.4s ease-out; }
          
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        `}</style>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
