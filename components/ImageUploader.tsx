
import React, { useRef, useState } from 'react';
import { Camera, Upload, Image as ImageIcon, Zap } from 'lucide-react';
import { Language } from '../types';

interface ImageUploaderProps {
  onImageSelected: (base64: string, previewUrl: string) => void;
  isLoading: boolean;
  isLiteMode?: boolean;
  language?: Language;
}

const TEXTS = {
  en: {
    optimizing: 'Optimizing for slow internet...',
    uploadTitle: 'Upload Food Image',
    tapToCapture: 'Tap to capture or drag & drop here',
    dataSaver: 'Data Saver Active: Images auto-compressed'
  },
  hi: {
    optimizing: 'धीमे इंटरनेट के लिए अनुकूलित किया जा रहा है...',
    uploadTitle: 'भोजन की फोटो अपलोड करें',
    tapToCapture: 'फोटो लेने के लिए टैप करें',
    dataSaver: 'डेटा सेवर सक्रिय: कम एमबी'
  },
  te: {
    optimizing: 'నెమ్మదైన ఇంటర్నెట్ కోసం ఆప్టిమైజ్ చేస్తోంది...',
    uploadTitle: 'ఆహార ఫోటోను అప్‌లోడ్ చేయండి',
    tapToCapture: 'ఫోటో తీయడానికి ఇక్కడ నొక్కండి',
    dataSaver: 'డేటా సేవర్ ఆక్టివ్: తక్కువ MB'
  },
  es: {
    optimizing: 'Optimizando para internet lento...',
    uploadTitle: 'Subir Imagen',
    tapToCapture: 'Toca para capturar',
    dataSaver: 'Ahorro de Datos: Imágenes comprimidas'
  }
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isLoading, isLiteMode = false, language = 'en' }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = TEXTS[language];

  const compressImage = (file: File): Promise<{ base64: string; preview: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          // Resize logic: Max dimension 800px for "Village/Lite" usage
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.6 quality (High compression for low bandwidth)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          const base64 = dataUrl.split(',')[1];
          resolve({ base64, preview: dataUrl });
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFile = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      try {
        setIsCompressing(true);
        // Always compress to save bandwidth for rural users
        const { base64, preview } = await compressImage(file);
        onImageSelected(base64, preview);
      } catch (error) {
        console.error("Compression failed", error);
        // Fallback to original if compression fails
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          const base64Data = result.split(',')[1];
          onImageSelected(base64Data, result);
        };
        reader.readAsDataURL(file);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className={`relative group border-2 border-dashed rounded-3xl p-8 transition-all duration-300 ease-in-out text-center cursor-pointer
          ${dragActive 
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 scale-[1.02] shadow-xl' 
            : 'border-stone-300 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-white dark:hover:bg-slate-900 hover:shadow-lg bg-stone-50 dark:bg-slate-900'
          }
          ${isLoading || isCompressing ? 'opacity-50 pointer-events-none' : ''}
          ${isLiteMode ? 'shadow-none bg-white dark:bg-slate-900 border-stone-400' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
          disabled={isLoading || isCompressing}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-2xl shadow-md text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:text-emerald-500 transition-all duration-300 ring-1 ring-emerald-100 dark:ring-emerald-900 ${isLiteMode ? 'bg-stone-100 dark:bg-slate-800 shadow-none' : 'bg-white dark:bg-slate-800'}`}>
            {isCompressing ? <Zap className="w-10 h-10 animate-pulse" /> : <Camera className="w-10 h-10" />}
          </div>
          <div>
            <p className="text-xl font-bold text-stone-700 dark:text-stone-200">
              {isCompressing ? t.optimizing : t.uploadTitle}
            </p>
            <p className="text-sm text-stone-500 dark:text-slate-400 mt-1 font-medium">
              {t.tapToCapture}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2 flex items-center justify-center gap-1">
               <Zap className="w-3 h-3" /> {t.dataSaver}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
