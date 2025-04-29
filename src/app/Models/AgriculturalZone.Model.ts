export interface AgriculturalZone {
  id: number;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  products: AgriculturalProduct[];
  color?: string;
  description?: string;
}

export interface AgriculturalProduct {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  season?: string;
}
