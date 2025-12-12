
import React, { useState, useEffect, useRef } from 'react';
import { FoodAnalysisResult, MatchResult, NgoRequest, Language } from '../types';
import { calculateLogisticsMatch } from '../services/geminiService';
import { Building2, MapPin, Scale, ArrowRight, CheckCircle2, XCircle, AlertCircle, Loader2, Truck, Users, Heart, ClipboardList, ShieldCheck, Ban } from 'lucide-react';
import L from 'leaflet';

interface Props {
  donation: FoodAnalysisResult;
  onStartDelivery?: (ngo: NgoRequest) => void;
  language?: Language;
}

const MOCK_NGO_REQUESTS: NgoRequest[] = [
  {
    id: '1',
    organization_name: 'City Harvest Shelter',
    required_diet: 'Any', // Universal acceptance
    required_quantity: 1, // Accepts anything
    distance_km: 1.5,
    contact_person: 'Sarah Jenkins',
    phone: '+91 98765 10001'
  },
  {
    id: '2',
    organization_name: 'Community Soup Kitchen',
    required_diet: 'Any',
    required_quantity: 5,
    distance_km: 1.2,
    contact_person: 'David Ross',
    phone: '+91 98765 10002'
  },
  {
    id: '3',
    organization_name: 'Youth Center Food Bank',
    required_diet: 'Vegan',
    required_quantity: 10,
    distance_km: 12.0,
    contact_person: 'Priya Mehta',
    phone: '+91 98765 10003'
  },
  {
    id: '4',
    organization_name: 'Shanti Orphanage',
    required_diet: 'Veg',
    required_quantity: 50,
    distance_km: 5.0,
    contact_person: 'Sister Mary',
    phone: '+91 98765 10004'
  }
];

const TEXTS = {
  en: {
    directDistribution: "Pickup Service Unavailable",
    logisticsSkipped: "Logistics Blocked (< 5kg)",
    protocolVerification: "Protocol Verification",
    logisticsRule: "NGO Logistics Rule (> 5.0 kg)",
    failed: "FAILED",
    passed: "PASSED",
    localProtocol: "Local Distribution Protocol",
    activated: "REQUIRED",
    quantityTooSmall: "Quantity is below 5kg. Pickup service is NOT available.",
    lowMatch: "No suitable NGO match found nearby.",
    localRules: "Strictly adhere to local rules. Distribute directly to nearby needy people yourself.",
    hotspots: "3 High Need Hotspots Nearby",
    markDistributed: "Confirm Local Distribution",
    thankYou: "Thank You!",
    successMsg: "You have successfully shared food with your local community.",
    logisticsMatching: "Logistics Matching",
    protocolsActive: "Protocols Active",
    selectNgo: "Select a nearby NGO request to calculate the donation match score based on diet, quantity, and distance rules.",
    need: "Need",
    away: "away",
    runMatch: "Run Logistics Match",
    matchScore: "Match Score",
    initiateDelivery: "Initiate Delivery & Track",
    lowScoreOption: "Match Score Low? Distribute Locally Instead",
    deliveryRejected: "Delivery Rejected"
  },
  hi: {
    directDistribution: "पिकअप सेवा अनुपलब्ध",
    logisticsSkipped: "लॉजिस्टिक्स अवरुद्ध (< 5 किग्रा)",
    protocolVerification: "प्रोटोकॉल सत्यापन",
    logisticsRule: "एनजीओ नियम (> 5.0 किग्रा)",
    failed: "विफल",
    passed: "सफल",
    localProtocol: "स्थानीय वितरण प्रोटोकॉल",
    activated: "आवश्यक",
    quantityTooSmall: "मात्रा 5 किग्रा से कम है। पिकअप सेवा उपलब्ध नहीं है।",
    lowMatch: "आस-पास कोई उपयुक्त एनजीओ नहीं मिला।",
    localRules: "स्थानीय नियमों का कड़ाई से पालन करें। सीधे जरूरतमंदों को स्वयं वितरित करें।",
    hotspots: "3 जरूरतमंद क्षेत्र मिले",
    markDistributed: "स्थानीय वितरण की पुष्टि करें",
    thankYou: "धन्यवाद!",
    successMsg: "आपने अपने स्थानीय समुदाय के साथ सफलतापूर्वक भोजन साझा किया है।",
    logisticsMatching: "लॉजिस्टिक्स मिलान",
    protocolsActive: "प्रोटोकॉल सक्रिय",
    selectNgo: "आहार, मात्रा और दूरी के नियमों के आधार पर मिलान स्कोर की गणना करने के लिए पास के एनजीओ का चयन करें।",
    need: "आवश्यकता",
    away: "दूर",
    runMatch: "लॉजिस्टिक्स मैच चलाएं",
    matchScore: "मैच स्कोर",
    initiateDelivery: "डिलीवरी शुरू करें और ट्रैक करें",
    lowScoreOption: "स्कोर कम है? स्थानीय रूप से वितरित करें",
    deliveryRejected: "डिलीवरी अस्वीकृत"
  },
  te: {
    directDistribution: "పికప్ సేవ అందుబాటులో లేదు",
    logisticsSkipped: "లాజిస్టిక్స్ నిరోధించబడింది (< 5kg)",
    protocolVerification: "ప్రోటోకాల్ ధృవీకరణ",
    logisticsRule: "NGO నియమం (> 5.0 kg)",
    failed: "విఫలమైంది",
    passed: "విజయవంతం",
    localProtocol: "స్థానిక పంపిణీ ప్రోటోకాల్",
    activated: "అవసరం",
    quantityTooSmall: "పరిమాణం 5kg కంటే తక్కువగా ఉంది. పికప్ సేవ అందుబాటులో లేదు.",
    lowMatch: "సమీపంలో తగిన NGO సరిపోలిక కనుగొనబడలేదు.",
    localRules: "స్థానిక నియమాలను కచ్చితంగా పాటించండి. మీరే స్వయంగా సమీపంలోని పేదలకు పంపిణీ చేయండి.",
    hotspots: "3 అధిక అవసరమున్న ప్రాంతాలు",
    markDistributed: "స్థానిక పంపిణీని నిర్ధారించండి",
    thankYou: "ధన్యవాదాలు!",
    successMsg: "మీరు మీ స్థానిక సంఘంతో ఆహారాన్ని విజయవంతంగా పంచుకున్నారు.",
    logisticsMatching: "లాజిస్టిక్స్ సరిపోలిక",
    protocolsActive: "ప్రోటోకాల్స్ యాక్టివ్",
    selectNgo: "విరాళం స్కోర్‌ను లెక్కించడానికి సమీపంలోని NGOని ఎంచుకోండి.",
    need: "అవసరం",
    away: "దూరం",
    runMatch: "లాజిస్టిక్స్ మ్యాచ్ రన్ చేయండి",
    matchScore: "మ్యాచ్ స్కోర్",
    initiateDelivery: "డెలివరీ & ట్రాకింగ్ ప్రారంభించండి",
    lowScoreOption: "తక్కువ స్కోర్? స్థానికంగా పంపిణీ చేయండి",
    deliveryRejected: "డెలివరీ తిరస్కరించబడింది"
  },
  es: {
    directDistribution: "Servicio de Recogida No Disponible",
    logisticsSkipped: "Logística Bloqueada (< 5kg)",
    protocolVerification: "Verificación de Protocolo",
    logisticsRule: "Regla ONG (> 5.0 kg)",
    failed: "FALLIDO",
    passed: "APROBADO",
    localProtocol: "Protocolo Local",
    activated: "REQUERIDO",
    quantityTooSmall: "Cantidad menor a 5kg. Servicio de recogida NO disponible.",
    lowMatch: "No se encontró ONG adecuada cerca.",
    localRules: "Cumpla estrictamente las reglas locales. Distribuya directamente usted mismo.",
    hotspots: "3 Puntos de Necesidad Detectados",
    markDistributed: "Confirmar Distribución Local",
    thankYou: "¡Gracias!",
    successMsg: "Has compartido comida exitosamente con tu comunidad.",
    logisticsMatching: "Coincidencia Logística",
    protocolsActive: "Protocolos Activos",
    selectNgo: "Seleccione una ONG cercana para calcular el puntaje.",
    need: "Necesita",
    away: "de distancia",
    runMatch: "Ejecutar Coincidencia",
    matchScore: "Puntaje",
    initiateDelivery: "Iniciar Entrega y Rastreo",
    lowScoreOption: "¿Puntaje bajo? Distribuir localmente",
    deliveryRejected: "Entrega Rechazada"
  }
};

const LogisticsMatchCard: React.FC<Props> = ({ donation, onStartDelivery, language = 'en' }) => {
  const [selectedNgo, setSelectedNgo] = useState<NgoRequest>(MOCK_NGO_REQUESTS[0]);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDirectDistribution, setIsDirectDistribution] = useState(false);
  const [distributionComplete, setDistributionComplete] = useState(false);

  // Map refs for Direct Distribution
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const t = TEXTS[language];
  const MIN_WEIGHT_KG = 5; // STRICT THRESHOLD

  // Auto-detect small quantities (< 5KG)
  useEffect(() => {
    if (donation.weight_kg && donation.weight_kg < MIN_WEIGHT_KG) {
      setIsDirectDistribution(true);
    }
  }, [donation]);

  // Initialize Map for Direct Distribution
  useEffect(() => {
    if (isDirectDistribution && mapContainerRef.current && !mapInstanceRef.current) {
      // Center on a generic location (e.g. Bangalore) for demo purposes
      const center: [number, number] = [12.9716, 77.5946];

      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
        dragging: false, // Keep it relatively static for the "picture" feel
        scrollWheelZoom: false,
        doubleClickZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Add "Hotspot" markers
      const hotspotLocations = [
        [12.973, 77.596],
        [12.970, 77.593],
        [12.971, 77.598]
      ];

      hotspotLocations.forEach((loc) => {
        const icon = L.divIcon({
          className: 'bg-transparent',
          html: `<div class="relative flex items-center justify-center">
                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <div class="relative bg-rose-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white">
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                          </div>
                        </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
        L.marker(loc as [number, number], { icon }).addTo(map);
      });

      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup map instance if component unmounts or state changes
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isDirectDistribution]);

  const handleMatch = async () => {
    setIsLoading(true);
    setMatchResult(null);
    try {
      const result = await calculateLogisticsMatch(donation, selectedNgo);
      setMatchResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Approve': return 'text-emerald-700 bg-emerald-100 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'Reject': return 'text-red-700 bg-red-100 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800';
      default: return 'text-amber-700 bg-amber-100 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800';
    }
  };

  // Direct Distribution View (For small quantity or low match score)
  if (isDirectDistribution) {
    return (
      <div className="w-full max-w-xl mx-auto mt-6 mb-12 animate-fade-in-up">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-red-200 dark:border-red-900/50 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-rose-600 p-5 text-white flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Ban className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-none">{t.deliveryRejected}</h2>
              <p className="text-xs text-rose-100 font-medium opacity-90">{t.logisticsSkipped}</p>
            </div>
          </div>

          <div className="p-8">
            {!distributionComplete ? (
              <>
                {/* Protocol Verification Checklist */}
                <div className="mb-6 bg-stone-50 dark:bg-slate-800 rounded-xl p-5 border border-stone-100 dark:border-slate-700">
                  <h3 className="text-xs font-bold text-stone-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4" /> {t.protocolVerification}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-stone-600 dark:text-slate-300 font-medium">{t.logisticsRule}</span>
                      {donation.weight_kg && donation.weight_kg < MIN_WEIGHT_KG ? (
                        <span className="flex items-center text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded text-xs border border-rose-100 dark:border-rose-900">
                          <XCircle className="w-3.5 h-3.5 mr-1.5" /> {t.failed} ({donation.weight_kg} kg)
                        </span>
                      ) : (
                        <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded text-xs border border-emerald-100 dark:border-emerald-900">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> {t.passed}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-stone-600 dark:text-slate-300 font-medium">{t.localProtocol}</span>
                      <span className="flex items-center text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded text-xs border border-blue-100 dark:border-blue-900">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> {t.activated}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-900/40 mb-6 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-stone-700 dark:text-stone-300 font-medium">
                    <p className="mb-1 font-bold">
                      {donation.weight_kg && donation.weight_kg < MIN_WEIGHT_KG
                        ? t.quantityTooSmall
                        : t.lowMatch}
                    </p>
                    <p className="text-stone-500 dark:text-slate-400 text-xs">
                      {t.localRules}
                    </p>
                  </div>
                </div>

                <div className="h-64 bg-stone-100 dark:bg-slate-800 rounded-2xl mb-6 relative overflow-hidden border border-stone-200 dark:border-slate-700 shadow-inner">
                  {/* Live Leaflet Map Container */}
                  <div ref={mapContainerRef} className="absolute inset-0 z-0" />

                  <div className="absolute bottom-2 left-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 border border-rose-200 shadow-sm z-10 flex items-center gap-2">
                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                    {t.hotspots}
                  </div>
                </div>

                <button
                  onClick={() => setDistributionComplete(true)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-amber-200/50 dark:shadow-none transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5 fill-current" />
                  {t.markDistributed}
                </button>
              </>
            ) : (
              <div className="text-center py-8 animate-scale-up">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-stone-800 dark:text-white mb-2">{t.thankYou}</h3>
                <p className="text-stone-500 dark:text-slate-400">{t.successMsg}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto mt-6 mb-12 animate-fade-in-up delay-100">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="bg-gradient-to-r from-slate-700 to-blue-800 dark:from-slate-800 dark:to-blue-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/10">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-lg tracking-wide">{t.logisticsMatching}</h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium bg-black/20 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/10">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> {t.protocolsActive}
          </div>
        </div>

        <div className="p-8">
          <p className="text-stone-500 dark:text-slate-400 font-medium text-sm mb-6">
            {t.selectNgo}
          </p>

          {/* NGO Selector */}
          <div className="space-y-4 mb-8">
            {MOCK_NGO_REQUESTS.map((ngo) => (
              <div
                key={ngo.id}
                onClick={() => { setSelectedNgo(ngo); setMatchResult(null); }}
                className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${selectedNgo.id === ngo.id
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-md scale-[1.01]'
                    : 'border-stone-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-slate-600 bg-stone-50 dark:bg-slate-800'
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-stone-800 dark:text-stone-200">{ngo.organization_name}</h3>
                    <div className="flex gap-4 mt-2 text-xs font-medium text-stone-500 dark:text-slate-500">
                      <span className="flex items-center gap-1"><Scale className="w-3 h-3" /> {t.need}: {ngo.required_quantity}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {ngo.distance_km}km {t.away}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${ngo.required_diet === 'Veg' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      ngo.required_diet === 'Vegan' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' :
                        'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                    }`}>
                    {ngo.required_diet} Preferred
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Active Rules Footer */}
          <div className="mb-6 flex flex-wrap gap-2 justify-center">
            <span className="text-[10px] font-bold uppercase text-stone-400 dark:text-slate-500 px-2 py-1 bg-stone-100 dark:bg-slate-800 rounded border border-stone-200 dark:border-slate-700">Universal Diet Acceptance</span>
            <span className="text-[10px] font-bold uppercase text-stone-400 dark:text-slate-500 px-2 py-1 bg-stone-100 dark:bg-slate-800 rounded border border-stone-200 dark:border-slate-700">Distance Optimization</span>
            <span className="text-[10px] font-bold uppercase text-stone-400 dark:text-slate-500 px-2 py-1 bg-stone-100 dark:bg-slate-800 rounded border border-stone-200 dark:border-slate-700">Quantity {'>'} 5kg</span>
          </div>

          {/* Action Button */}
          <button
            onClick={handleMatch}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-blue-200/50 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-70 disabled:shadow-none hover:-translate-y-0.5"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {t.runMatch} <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Results Area */}
          {matchResult && (
            <div className="mt-8 pt-8 border-t border-stone-100 dark:border-slate-800 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs text-stone-400 dark:text-slate-500 uppercase font-bold tracking-widest mb-1">{t.matchScore}</div>
                  <div className={`text-5xl font-black ${matchResult.match_score > 70 ? 'text-emerald-600 dark:text-emerald-400' :
                      matchResult.match_score > 40 ? 'text-amber-500 dark:text-amber-400' : 'text-red-500 dark:text-red-400'
                    }`}>
                    {matchResult.match_score}<span className="text-2xl text-stone-300 dark:text-slate-600">/100</span>
                  </div>
                </div>
                <div className={`px-5 py-2 rounded-xl border-2 font-bold text-sm flex items-center gap-2 ${getActionColor(matchResult.recommended_action)}`}>
                  {matchResult.recommended_action === 'Approve' && <CheckCircle2 className="w-5 h-5" />}
                  {matchResult.recommended_action === 'Reject' && <XCircle className="w-5 h-5" />}
                  {matchResult.recommended_action === 'Manual Review' && <AlertCircle className="w-5 h-5" />}
                  {matchResult.recommended_action}
                </div>
              </div>

              <div className="bg-stone-50 dark:bg-slate-800 rounded-2xl p-5 text-stone-600 dark:text-slate-300 text-sm leading-relaxed border border-stone-200 dark:border-slate-700 mb-6 font-medium">
                <span className="font-bold text-stone-800 dark:text-white block mb-1">Analysis Report: </span>
                {matchResult.reason}
              </div>

              {/* Start Delivery Button - Only if Approved */}
              {matchResult.recommended_action === 'Approve' && onStartDelivery && (
                <button
                  onClick={() => onStartDelivery(selectedNgo)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-emerald-200/50 dark:shadow-none transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
                >
                  <Truck className="w-6 h-6" />
                  {t.initiateDelivery}
                </button>
              )}

              {/* Low Match Score Option */}
              {matchResult.match_score < 50 && (
                <button
                  onClick={() => setIsDirectDistribution(true)}
                  className="w-full mt-4 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold py-3 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 border border-amber-200 dark:border-amber-800"
                >
                  <Users className="w-5 h-5" />
                  {t.lowScoreOption}
                </button>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogisticsMatchCard;
