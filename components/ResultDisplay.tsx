import React from 'react';
import { SearchResult } from '../types';

interface ResultDisplayProps {
  result: SearchResult;
}

// Simple helper to format bold text
const FormatText: React.FC<{ text: string }> = ({ text }) => {
  // Split by double asterisks for bolding
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <div className="space-y-4 text-gray-700 leading-relaxed">
      {text.split('\n').map((line, i) => (
        <p key={i} className="min-h-[1rem]">
           {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
             if (part.startsWith('**') && part.endsWith('**')) {
               return <strong key={j} className="text-gray-900 font-bold">{part.slice(2, -2)}</strong>;
             }
             return part;
           })}
        </p>
      ))}
    </div>
  );
};

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Text Content Section */}
        <div className="flex-1 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 order-2 lg:order-1">
          <div className="flex items-center mb-6">
            <div className="bg-orange-100 p-3 rounded-full mr-4">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-orange-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">AI 美食指南</h2>
          </div>
          <div className="prose prose-orange max-w-none">
            <FormatText text={result.text} />
          </div>
        </div>

        {/* Map Cards Section */}
        {result.mapSources.length > 0 && (
          <div className="w-full lg:w-1/3 order-1 lg:order-2 flex flex-col gap-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              地圖導航
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {result.mapSources.map((source, index) => (
                <a
                  key={index}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-300 transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {source.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-2 flex items-center">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        Google Maps
                        </p>
                    </div>
                    <div className="ml-3 text-gray-400 group-hover:text-orange-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
