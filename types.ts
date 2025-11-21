export interface District {
  name: string;
  zip: string;
}

export interface City {
  name: string;
  districts: District[];
}

export interface MapSource {
  title: string;
  uri: string;
  sourceId?: string;
}

export interface SearchResult {
  text: string;
  mapSources: MapSource[];
}

export interface SearchCriteria {
  cuisine: string; // e.g. "All", "Snacks", "Hot Pot"
  budget: string;  // e.g. "Any", "Cheap", "Expensive"
  minRating: string; // e.g. "Any", "3.5", "4.0", "4.5"
  keyword: string; // User typed input
}