
import React from 'react';
import { Book, FileText, ChevronRight, Layout, Cpu, ShieldCheck } from 'lucide-react';

const SRSDocument: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
      
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Book className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-stone-800 dark:text-white tracking-tight mb-2">
          SRS Documentation
        </h1>
        <p className="text-stone-500 dark:text-slate-400 font-medium text-lg">
          Software Requirements Specification Structure
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-stone-200 dark:border-slate-800 overflow-hidden">
        <div className="bg-stone-50 dark:bg-slate-800/50 p-6 border-b border-stone-200 dark:border-slate-800">
           <h2 className="text-xl font-bold text-stone-800 dark:text-white flex items-center gap-2">
             <FileText className="w-5 h-5 text-emerald-500" />
             Table of Contents
           </h2>
        </div>

        <div className="p-6 md:p-10 space-y-10">
          
          {/* Section 1 */}
          <section>
            <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4 pb-2 border-b border-blue-100 dark:border-blue-900/30">
              1. Introduction
            </h3>
            <ul className="space-y-3 pl-2">
              <ListItem number="1.1" title="Purpose" />
              <ListItem number="1.2" title="Document Conventions" />
              <ListItem number="1.3" title="Intended Audience and Reading Suggestions" />
              <ListItem number="1.4" title="Project Scope" />
              <ListItem number="1.5" title="References" />
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4 pb-2 border-b border-blue-100 dark:border-blue-900/30">
              2. Overall Description
            </h3>
            <ul className="space-y-3 pl-2">
              <ListItem number="2.1" title="Product Perspective" />
              <ListItem number="2.2" title="Product Features" />
              <ListItem number="2.3" title="User Classes and Characteristics" />
              <ListItem number="2.4" title="Operating Environment" />
              <ListItem number="2.5" title="Design and Implementation Constraints" />
              <ListItem number="2.6" title="Assumptions and Dependencies" />
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4 pb-2 border-b border-blue-100 dark:border-blue-900/30 flex items-center gap-2">
              3. System Features
              <Layout className="w-5 h-5 opacity-50" />
            </h3>
            <ul className="space-y-3 pl-2">
              <ListItem number="3.1" title="Functional Requirements" />
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4 pb-2 border-b border-blue-100 dark:border-blue-900/30 flex items-center gap-2">
              4. External Interface Requirements
              <Cpu className="w-5 h-5 opacity-50" />
            </h3>
            <ul className="space-y-3 pl-2">
              <ListItem number="4.1" title="User Interfaces" />
              <ListItem number="4.2" title="Hardware Interfaces" />
              <ListItem number="4.3" title="Software Interfaces" />
              <ListItem number="4.4" title="Communications Interfaces" />
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4 pb-2 border-b border-blue-100 dark:border-blue-900/30 flex items-center gap-2">
              5. Nonfunctional Requirements
              <ShieldCheck className="w-5 h-5 opacity-50" />
            </h3>
            <ul className="space-y-3 pl-2">
              <ListItem number="5.1" title="Performance Requirements" />
              <ListItem number="5.2" title="Safety Requirements" />
              <ListItem number="5.3" title="Security Requirements" />
              <ListItem number="5.4" title="Software Quality Attributes" />
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
};

const ListItem = ({ number, title }: { number: string; title: string }) => (
  <li className="flex items-center group cursor-default">
    <span className="text-emerald-600 dark:text-emerald-400 font-bold w-12 shrink-0 group-hover:text-emerald-500 transition-colors">
      {number}
    </span>
    <span className="text-stone-700 dark:text-stone-300 font-medium group-hover:text-stone-900 dark:group-hover:text-white transition-colors">
      {title}
    </span>
    <ChevronRight className="w-4 h-4 ml-auto text-stone-300 dark:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity" />
  </li>
);

export default SRSDocument;
