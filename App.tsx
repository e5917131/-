import React, { useState, useCallback } from 'react';
import { LocationSelector } from './components/LocationSelector';
import { ResultDisplay } from './components/ResultDisplay';
import { searchFoodInDistrict } from './services/geminiService';
import { City, District, SearchResult, SearchCriteria } from './types';

const App: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  
  // New State for filters
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    cuisine: 'All',
    budget: 'Any',
    minRating: 'Any',
    keyword: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCityChange = useCallback((city: City) => {
    setSelectedCity(city);
    setSelectedDistrict(null); // Reset district when city changes
    setSearchResult(null);
    setError(null);
  }, []);

  const handleDistrictChange = useCallback((district: District) => {
    setSelectedDistrict(district);
    setSearchResult(null); // Clear previous results
    setError(null);
  }, []);

  const handleCriteriaChange = useCallback((criteria: SearchCriteria) => {
    setSearchCriteria(criteria);
    // Optional: Clear results if you want to force re-search on filter change, 
    // currently leaving result to allow user to just change filter and hit search again.
  }, []);

  const handleSearch = useCallback(async () => {
    if (!selectedCity || !selectedDistrict) return;

    setLoading(true);
    setError(null);
    
    try {
      const result = await searchFoodInDistrict(
        selectedCity.name, 
        selectedDistrict.name,
        searchCriteria
      );
      setSearchResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [selectedCity, selectedDistrict, searchCriteria]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Header */}
      <header className="bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-12 md:py-16 text-center">
          <div className="flex justify-center mb-4">
            <span className="text-6xl">🍜</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            台灣美食地圖 AI 搜查
          </h1>
          <p className="text-lg md:text-xl text-orange-100 max-w-2xl mx-auto">
            選擇地區與篩選條件，讓 AI 幫您找到最對味的在地美食。
          </p>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 -mt-8">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-orange-100 relative z-10">
          
          {/* Search Controls */}
          <div className="mb-8">
             <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              搜尋條件設定
             </h2>
             <LocationSelector 
                selectedCity={selectedCity}
                selectedDistrict={selectedDistrict}
                searchCriteria={searchCriteria}
                onCityChange={handleCityChange}
                onDistrictChange={handleDistrictChange}
                onCriteriaChange={handleCriteriaChange}
                disabled={loading}
             />

             <div className="mt-8 flex justify-center">
                <button
                  onClick={handleSearch}
                  disabled={!selectedCity || !selectedDistrict || loading}
                  className={`
                    group relative flex items-center justify-center px-12 py-4 text-lg font-bold rounded-full text-white shadow-md transition-all duration-300
                    ${(!selectedCity || !selectedDistrict || loading) 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg hover:scale-105 active:scale-95'
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      AI 精準搜查中...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">🔍</span> 尋找美食
                    </>
                  )}
                </button>
             </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-md animate-fade-in">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results Area */}
          {searchResult && (
             <div className="border-t border-gray-200 pt-8">
                <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-6 gap-2">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                          {selectedCity?.name} {selectedDistrict?.name}
                      </h3>
                      <p className="text-orange-600 text-sm mt-1 font-medium">
                        篩選: {searchCriteria.cuisine === 'All' ? '全種類' : searchCriteria.cuisine} 
                        {searchCriteria.budget !== 'Any' && ` · ${searchCriteria.budget}`}
                        {searchCriteria.minRating !== 'Any' && ` · ${searchCriteria.minRating}★+`}
                        {searchCriteria.keyword && ` · 關鍵字: "${searchCriteria.keyword}"`}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full self-start md:self-auto">
                        由 Gemini 2.5 Flash 提供
                    </span>
                </div>
                <ResultDisplay result={searchResult} />
             </div>
          )}

          {/* Empty State (Initial) */}
          {!searchResult && !loading && !error && (
            <div className="text-center py-12 opacity-50">
                <svg className="mx-auto h-24 w-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="text-gray-500 text-lg">設定條件後，美味地圖即將呈現</p>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 text-gray-400 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© 2024 Taiwan Gourmet Hunter. Powered by Google Gemini.</p>
          <p className="text-sm text-gray-600">地圖資訊僅供參考，請以實際營業狀況為主。</p>
        </div>
      </footer>
    </div>
  );
};

export default App;