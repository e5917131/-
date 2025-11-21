import React from 'react';
import { TAIWAN_LOCATIONS } from '../constants';
import { City, District, SearchCriteria } from '../types';

interface LocationSelectorProps {
  selectedCity: City | null;
  selectedDistrict: District | null;
  searchCriteria: SearchCriteria;
  onCityChange: (city: City) => void;
  onDistrictChange: (district: District) => void;
  onCriteriaChange: (criteria: SearchCriteria) => void;
  disabled: boolean;
}

const CUISINE_OPTIONS = [
  { label: '不限種類', value: 'All' },
  { label: '在地小吃', value: 'Street Food/Snacks' },
  { label: '餐廳/聚餐', value: 'Restaurant' },
  { label: '早午餐', value: 'Brunch' },
  { label: '火鍋', value: 'Hot Pot' },
  { label: '日式料理', value: 'Japanese Food' },
  { label: '咖啡甜點', value: 'Cafe & Dessert' },
  { label: '宵夜', value: 'Late Night Food' },
  { label: '素食', value: 'Vegetarian' },
];

const BUDGET_OPTIONS = [
  { label: '不限預算', value: 'Any' },
  { label: '銅板美食 ($)', value: 'Cheap/Street Food' },
  { label: '中價位 ($$)', value: 'Moderate' },
  { label: '高級享受 ($$$)', value: 'High-end' },
];

const RATING_OPTIONS = [
  { label: '不限評分', value: 'Any' },
  { label: '3.5 顆星以上', value: '3.5' },
  { label: '4.0 顆星以上', value: '4.0' },
  { label: '4.5 顆星以上', value: '4.5' },
];

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedCity,
  selectedDistrict,
  searchCriteria,
  onCityChange,
  onDistrictChange,
  onCriteriaChange,
  disabled
}) => {
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    const city = TAIWAN_LOCATIONS.find(c => c.name === cityName);
    if (city) {
      onCityChange(city);
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtName = e.target.value;
    if (selectedCity) {
      const district = selectedCity.districts.find(d => d.name === districtName);
      if (district) {
        onDistrictChange(district);
      }
    }
  };

  const updateCriteria = (key: keyof SearchCriteria, value: string) => {
    onCriteriaChange({
      ...searchCriteria,
      [key]: value
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Location Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="city-select" className="mb-2 text-sm font-medium text-gray-700">
            選擇縣市 (City)
          </label>
          <div className="relative">
              <select
              id="city-select"
              value={selectedCity?.name || ''}
              onChange={handleCityChange}
              disabled={disabled}
              className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-orange-500 focus:border-orange-500 shadow-sm appearance-none transition ease-in-out duration-200 hover:border-orange-400 disabled:bg-gray-100 disabled:text-gray-400"
              >
              <option value="" disabled>請選擇縣市</option>
              {TAIWAN_LOCATIONS.map((city) => (
                  <option key={city.name} value={city.name}>
                  {city.name}
                  </option>
              ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="district-select" className="mb-2 text-sm font-medium text-gray-700">
            選擇區域 (District)
          </label>
           <div className="relative">
              <select
              id="district-select"
              value={selectedDistrict?.name || ''}
              onChange={handleDistrictChange}
              disabled={!selectedCity || disabled}
              className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-orange-500 focus:border-orange-500 shadow-sm appearance-none transition ease-in-out duration-200 hover:border-orange-400 disabled:bg-gray-100 disabled:text-gray-400"
              >
              <option value="" disabled>
                  {!selectedCity ? '請先選擇縣市' : '請選擇區域'}
              </option>
              {selectedCity?.districts.map((district) => (
                  <option key={district.name} value={district.name}>
                  {district.name} ({district.zip})
                  </option>
              ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 my-4"></div>

      {/* Filter Section */}
      <div className="space-y-4">
        {/* Cuisine Type */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">想吃什麼類型?</label>
          <div className="flex flex-wrap gap-2">
            {CUISINE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateCriteria('cuisine', opt.value)}
                disabled={disabled}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                  searchCriteria.cuisine === opt.value
                    ? 'bg-orange-500 text-white border-orange-600 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Budget */}
            <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">預算範圍?</label>
            <div className="flex flex-wrap gap-2">
                {BUDGET_OPTIONS.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => updateCriteria('budget', opt.value)}
                    disabled={disabled}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                    searchCriteria.budget === opt.value
                        ? 'bg-orange-500 text-white border-orange-600 shadow-md'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                    }`}
                >
                    {opt.label}
                </button>
                ))}
            </div>
            </div>

            {/* Rating */}
            <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Google 評分?</label>
            <div className="flex flex-wrap gap-2">
                {RATING_OPTIONS.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => updateCriteria('minRating', opt.value)}
                    disabled={disabled}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                    searchCriteria.minRating === opt.value
                        ? 'bg-orange-500 text-white border-orange-600 shadow-md'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                    }`}
                >
                    {opt.label}
                </button>
                ))}
            </div>
            </div>
        </div>

        {/* Keyword Input */}
        <div>
          <label htmlFor="keyword-input" className="block mb-2 text-sm font-medium text-gray-700">
            特別需求/關鍵字 (選填)
          </label>
          <input
            id="keyword-input"
            type="text"
            placeholder="例如：牛肉麵、有冷氣、寵物友善....."
            value={searchCriteria.keyword}
            onChange={(e) => updateCriteria('keyword', e.target.value)}
            disabled={disabled}
            className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-orange-500 focus:border-orange-500 shadow-sm transition ease-in-out duration-200 hover:border-orange-400 disabled:bg-gray-100 disabled:text-gray-400 placeholder-gray-400"
          />
        </div>
      </div>
    </div>
  );
};