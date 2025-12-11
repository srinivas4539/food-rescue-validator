
import React from 'react';
import { ChefAnalysisResult, Language } from '../types';
import { ChefHat, Clock, CheckCircle2, List } from 'lucide-react';

interface Props {
  result: ChefAnalysisResult;
  language?: Language;
}

const TEXTS = {
  en: {
    ingredients: "Detected Ingredients",
    noIngredients: "No specific ingredients detected, but here are some suggestions based on the context.",
    steps: "Preparation Steps"
  },
  hi: {
    ingredients: "पहचानी गई सामग्री",
    noIngredients: "कोई विशिष्ट सामग्री नहीं मिली, लेकिन संदर्भ के आधार पर यहाँ कुछ सुझाव दिए गए हैं।",
    steps: "बनाने की विधि"
  },
  te: {
    ingredients: "గుర్తించబడిన పదార్థాలు",
    noIngredients: "నిర్దిష్ట పదార్థాలు ఏవీ కనుగొనబడలేదు, కానీ ఇక్కడ కొన్ని సూచనలు ఉన్నాయి.",
    steps: "తయారీ విధానం"
  },
  es: {
    ingredients: "Ingredientes Detectados",
    noIngredients: "No se detectaron ingredientes específicos, aquí hay sugerencias.",
    steps: "Pasos de Preparación"
  }
};

const ChefModeResults: React.FC<Props> = ({ result, language = 'en' }) => {
  const t = TEXTS[language];
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-fade-in-up">
      {/* Ingredients Section */}
      <div className="bg-white rounded-3xl shadow-lg border border-orange-100 overflow-hidden mb-10">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-5 text-white flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
             <List className="w-6 h-6" />
          </div>
          <h2 className="font-bold text-lg">{t.ingredients}</h2>
        </div>
        <div className="p-8 bg-orange-50/30">
          <div className="flex flex-wrap gap-3">
            {result.ingredients_detected && result.ingredients_detected.length > 0 ? (
              result.ingredients_detected.map((ingredient, idx) => (
                <span key={idx} className="bg-white text-orange-800 border-2 border-orange-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
                  {ingredient}
                </span>
              ))
            ) : (
              <p className="text-stone-500 italic font-medium">{t.noIngredients}</p>
            )}
          </div>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {result.recipes.map((recipe, index) => (
          <div key={index} className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden flex flex-col h-full hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
            <div className="bg-stone-900 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <ChefHat className="w-24 h-24" />
              </div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                  <ChefHat className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold bg-amber-500 text-white px-3 py-1.5 rounded-lg shadow-lg shadow-amber-900/20">
                  <Clock className="w-3.5 h-3.5" />
                  {recipe.prep_time}
                </div>
              </div>
              <h3 className="text-2xl font-black leading-tight tracking-tight relative z-10">{recipe.recipe_name}</h3>
            </div>
            
            <div className="p-8 flex-grow bg-white">
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6 border-b border-stone-100 pb-3">{t.steps}</h4>
              <ul className="space-y-5">
                {recipe.steps.map((step, stepIdx) => (
                  <li key={stepIdx} className="flex gap-4 text-sm text-stone-700 font-medium leading-relaxed">
                    <span className="flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChefModeResults;
