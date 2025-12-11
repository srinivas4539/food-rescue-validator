
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { NgoRequest, FoodAnalysisResult, Language } from '../types';
import { MapPin, Navigation, Phone, User, ArrowLeft, ExternalLink, Locate, Building2, MessageSquare, CheckCircle } from 'lucide-react';
import NgoVerificationCard from './NgoVerificationCard';
import WasteDiversion from './WasteDiversion';

interface Props {
  ngo: NgoRequest;
  donation: FoodAnalysisResult;
  onBack: () => void;
  language?: Language;
}

const TEXTS = {
  en: {
    back: "Back to Dashboard",
    findingDriver: "Finding Driver...",
    driverAssigned: "Driver Assigned",
    headingPickup: "Heading to Pickup",
    onWay: "On the Way to NGO",
    arrivingSoon: "Arriving Soon",
    arrived: "Arrived at NGO",
    eta: "mins",
    estimated: "estimated time",
    deliveryStatus: "Delivery Status",
    vehicle: "Vehicle",
    callNgo: "Call NGO",
    chat: "Chat",
    trackGoogle: "Track in Google Maps",
    missionComplete: "Mission Complete!",
    foodDelivered: "Food successfully delivered and verified.",
    done: "Done",
    liveGps: "LIVE GPS",
    accepted: "Donation Accepted",
    rejected: "Donation Rejected"
  },
  hi: {
    back: "डैशबोर्ड पर वापस जाएं",
    findingDriver: "ड्राइवर खोज रहा है...",
    driverAssigned: "ड्राइवर नियुक्त",
    headingPickup: "पिकअप के लिए जा रहा है",
    onWay: "एनजीओ के रास्ते में",
    arrivingSoon: "जल्द ही पहुंच रहा है",
    arrived: "एनजीओ पर पहुंच गया",
    eta: "मिनट",
    estimated: "अनुमानित समय",
    deliveryStatus: "डिलीवरी स्थिति",
    vehicle: "वाहन",
    callNgo: "एनजीओ को कॉल करें",
    chat: "चैट",
    trackGoogle: "गूगल मैप्स में ट्रैक करें",
    missionComplete: "मिशन पूरा हुआ!",
    foodDelivered: "भोजन सफलतापूर्वक वितरित और सत्यापित किया गया।",
    done: "हो गया",
    liveGps: "लाइव जीपीएस",
    accepted: "दान स्वीकार कर लिया गया",
    rejected: "दान अस्वीकार कर दिया गया"
  },
  te: {
    back: "డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్ళు",
    findingDriver: "డ్రైవర్ కోసం వెతుకుతోంది...",
    driverAssigned: "డ్రైవర్ కేటాయించబడ్డారు",
    headingPickup: "పికప్‌కు వెళ్తున్నారు",
    onWay: "NGOకి వెళ్లే దారిలో",
    arrivingSoon: "త్వరలో చేరుకుంటున్నారు",
    arrived: "NGO వద్దకు చేరుకున్నారు",
    eta: "నిమి",
    estimated: "అంచనా సమయం",
    deliveryStatus: "డెలివరీ స్థితి",
    vehicle: "వాహనం",
    callNgo: "NGOకి కాల్ చేయండి",
    chat: "చాట్",
    trackGoogle: "Google మ్యాప్స్‌లో ట్రాక్ చేయండి",
    missionComplete: "మిషన్ పూర్తయింది!",
    foodDelivered: "ఆహారం విజయవంతంగా పంపిణీ చేయబడింది మరియు ధృవీకరించబడింది.",
    done: "పూర్తయింది",
    liveGps: "లైవ్ GPS",
    accepted: "విరాళం స్వీకరించబడింది",
    rejected: "విరాళం తిరస్కరించబడింది"
  },
  es: {
    back: "Volver al Tablero",
    findingDriver: "Buscando Conductor...",
    driverAssigned: "Conductor Asignado",
    headingPickup: "Yendo a Recoger",
    onWay: "En camino a la ONG",
    arrivingSoon: "Llegando Pronto",
    arrived: "Llegó a la ONG",
    eta: "min",
    estimated: "tiempo estimado",
    deliveryStatus: "Estado del Envío",
    vehicle: "Vehículo",
    callNgo: "Llamar ONG",
    chat: "Chat",
    trackGoogle: "Rastrear en Google Maps",
    missionComplete: "¡Misión Cumplida!",
    foodDelivered: "Comida entregada y verificada con éxito.",
    done: "Hecho",
    liveGps: "GPS EN VIVO",
    accepted: "Donación Aceptada",
    rejected: "Donación Rechazada"
  }
};

// Fix for default Leaflet icon paths in some build environments
const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

const DeliveryTracking: React.FC<Props> = ({ ngo, donation, onBack, language = 'en' }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  
  const t = TEXTS[language];
  const [status, setStatus] = useState(t.findingDriver);
  const [eta, setEta] = useState(15);
  const [progress, setProgress] = useState(0);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState<'ACCEPTED' | 'REJECTED' | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  // Demo coordinates (simulating a route in Bangalore for the "Chicken Biryani" demo context)
  // Start: Indiranagar, End: Koramangala
  const START_COORDS: [number, number] = [12.9716, 77.5946];
  const END_COORDS: [number, number] = [12.9352, 77.6245];

  useEffect(() => {
    fixLeafletIcons();

    if (!mapContainerRef.current) return;

    // Initialize Map
    const map = L.map(mapContainerRef.current).setView(START_COORDS, 14);
    mapInstanceRef.current = map;

    // Add OpenStreetMap Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Custom Icons
    const startIcon = L.divIcon({
      className: 'bg-transparent',
      html: `<div class="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    const endIcon = L.divIcon({
      className: 'bg-transparent',
      html: `<div class="w-8 h-8 text-red-600 drop-shadow-md"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    const vehicleIcon = L.divIcon({
      className: 'bg-transparent',
      html: `<div class="w-8 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center shadow-lg border-2 border-white transform -rotate-45"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    // Add Static Markers
    L.marker(START_COORDS, { icon: startIcon }).addTo(map).bindPopup("Pickup Location").openPopup();
    L.marker(END_COORDS, { icon: endIcon }).addTo(map).bindPopup(`<b>${ngo.organization_name}</b><br>Drop-off Location`);

    // Create Route Polyline
    const routeLine = L.polyline([START_COORDS, END_COORDS], {
      color: '#2563eb', // Blue-600
      weight: 5,
      opacity: 0.8,
      dashArray: '10, 10'
    }).addTo(map);
    polylineRef.current = routeLine;

    // Fit bounds to show full route initially
    map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

    // Initialize Vehicle Marker
    const vehicle = L.marker(START_COORDS, { icon: vehicleIcon, zIndexOffset: 1000 }).addTo(map);
    vehicleMarkerRef.current = vehicle;

    // Simulation Loop
    let currentStep = 0;
    const totalSteps = 400; // Total animation frames (approx 15-20 seconds for demo)

    const animate = () => {
      currentStep++;
      const pct = currentStep / totalSteps;
      
      if (pct > 1) {
        setStatus(t.arrived);
        setEta(0);
        setProgress(100);
        // Show verification card when arrived
        setTimeout(() => setShowVerification(true), 1000);
        return;
      }

      // Interpolate position
      const lat = START_COORDS[0] + (END_COORDS[0] - START_COORDS[0]) * pct;
      const lng = START_COORDS[1] + (END_COORDS[1] - START_COORDS[1]) * pct;
      const newPos: [number, number] = [lat, lng];

      // Update Marker
      vehicle.setLatLng(newPos);
      
      // Update Stats
      setProgress(pct * 100);
      setEta(Math.ceil(15 * (1 - pct))); // 15 mins demo time
      
      // Update Status Text
      if (pct < 0.1) setStatus(t.driverAssigned);
      else if (pct < 0.2) setStatus(t.headingPickup);
      else if (pct < 0.8) setStatus(t.onWay);
      else setStatus(t.arrivingSoon);

      // Smooth Pan (only update view occasionally to avoid jitter, or use panTo)
      if (currentStep % 20 === 0) {
        map.panTo(newPos, { animate: true, duration: 1 });
      }

      requestAnimationFrame(animate);
    };

    // Start delay
    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 1000);

    return () => {
      clearTimeout(timer);
      map.remove();
    };
  }, [ngo, language]); // Added language to dependency to update text if lang changes

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ngo.organization_name)}&travelmode=driving`;

  return (
    <div className="w-full max-w-6xl mx-auto mt-6 animate-fade-in flex flex-col h-[85vh]">
      <div className="flex items-center justify-between mb-4 px-2">
        <button 
          onClick={onBack}
          className="flex items-center text-stone-600 dark:text-slate-400 hover:text-blue-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> {t.back}
        </button>
        <span className="text-sm font-semibold text-stone-500 dark:text-slate-500 bg-stone-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-stone-200 dark:border-slate-700">
          Tracking ID: #LOG-{Math.floor(Math.random() * 10000)}
        </span>
      </div>

      <div className="flex-grow flex flex-col md:flex-row bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-stone-200 dark:border-slate-800 overflow-hidden relative">
        
        {/* Verification Modal */}
        {showVerification && !verificationComplete && (
           <NgoVerificationCard 
             onAccept={() => {
               setVerificationComplete('ACCEPTED');
               setStatus(t.accepted);
               setShowVerification(false);
             }}
             onReject={(reason) => {
               setRejectionReason(reason);
               setVerificationComplete('REJECTED');
               setStatus(t.rejected);
               setShowVerification(false);
             }}
             language={language}
           />
        )}

        {/* Waste Diversion Modal (If Rejected) */}
        {verificationComplete === 'REJECTED' && rejectionReason && (
          <WasteDiversion 
            reason={rejectionReason} 
            onClose={onBack} 
            language={language}
          />
        )}

        {/* Success Overlay (If Accepted) */}
        {verificationComplete === 'ACCEPTED' && (
           <div className="absolute inset-0 z-50 flex items-center justify-center bg-emerald-50/90 dark:bg-emerald-900/90 backdrop-blur-sm">
             <div className="text-center animate-scale-up">
               <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200 dark:shadow-none">
                 <CheckCircle className="w-10 h-10 text-white" />
               </div>
               <h2 className="text-3xl font-bold text-stone-800 dark:text-white">{t.missionComplete}</h2>
               <p className="text-stone-600 dark:text-slate-300 mt-2">{t.foodDelivered}</p>
               <button onClick={onBack} className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-all">
                 {t.done}
               </button>
             </div>
           </div>
        )}
        
        {/* Left Panel: Real Interactive Map */}
        <div className="w-full md:w-2/3 relative h-[400px] md:h-full bg-stone-100 dark:bg-slate-950">
          <div ref={mapContainerRef} className="w-full h-full z-0 opacity-90" />
          
          {/* Map Overlay Controls */}
          <div className="absolute top-4 left-4 z-[400] bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-3 rounded-lg shadow-md border border-stone-100 dark:border-slate-700">
             <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-stone-700 dark:text-white">{t.liveGps}</span>
             </div>
          </div>
        </div>

        {/* Right Panel: Info & Status */}
        <div className="w-full md:w-1/3 p-6 flex flex-col bg-white dark:bg-slate-900 z-10 border-l border-stone-200 dark:border-slate-800 shadow-xl transition-colors">
          
          {/* Header Status */}
          <div className="mb-8">
            <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">{t.deliveryStatus}</h2>
            <h1 className="text-3xl font-black text-stone-800 dark:text-white leading-tight mb-2">{status}</h1>
            <div className="flex items-center gap-2 text-stone-500 dark:text-slate-400">
               <span className="font-semibold text-stone-900 dark:text-stone-200">{eta > 0 ? `${eta} ${t.eta}` : 'Arrived'}</span>
               <span>{t.estimated}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-stone-100 dark:bg-slate-800 rounded-full h-2 mt-4 overflow-hidden">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-linear shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Details Cards */}
          <div className="space-y-4 flex-grow overflow-y-auto">
            
            {/* Driver Card */}
            <div className="flex items-center p-3 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-100 dark:border-slate-700">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mr-3 shrink-0">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-grow">
                <div className="font-bold text-stone-800 dark:text-white text-sm">Raju Kumar</div>
                <div className="text-xs text-stone-500 dark:text-slate-400">{t.vehicle}: KA-01-EQ-5432</div>
              </div>
              <button className="p-2 bg-white dark:bg-slate-700 rounded-full text-blue-600 dark:text-blue-400 shadow-sm border border-stone-100 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-600">
                <Phone className="w-4 h-4" />
              </button>
            </div>

            {/* Recipient/NGO Card with Connection Actions */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/40">
               <div className="flex items-start gap-3 mb-3">
                 <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                    <Building2 className="w-5 h-5" />
                 </div>
                 <div>
                   <h3 className="font-bold text-blue-900 dark:text-blue-200 text-sm">{ngo.organization_name}</h3>
                   <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">{ngo.contact_person}</p>
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-2">
                 <button className="flex items-center justify-center gap-2 py-2 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
                   <Phone className="w-3 h-3" /> {t.callNgo}
                 </button>
                 <button className="flex items-center justify-center gap-2 py-2 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
                   <MessageSquare className="w-3 h-3" /> {t.chat}
                 </button>
               </div>
            </div>

            {/* Google Maps Link */}
            <a 
              href={googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full py-3 bg-white dark:bg-slate-800 border-2 border-stone-100 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-stone-500 dark:text-slate-400 font-bold rounded-xl transition-all group"
            >
              <Navigation className="w-5 h-5 mr-2 group-hover:fill-blue-600 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              {t.trackGoogle}
              <ExternalLink className="w-4 h-4 ml-2 opacity-50" />
            </a>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracking;
