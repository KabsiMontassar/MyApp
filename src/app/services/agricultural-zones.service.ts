import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AgriculturalZone, AgriculturalProduct } from '../Models/AgriculturalZone.Model';

@Injectable({
  providedIn: 'root'
})
export class AgriculturalZonesService {

  // Mock data for Tunisia's agricultural zones
  private zones: AgriculturalZone[] = [
    {
      id: 1,
      name: 'Nabeul',
      region: 'Cap Bon',
      latitude: 36.4512,
      longitude: 10.7357,
      color: '#8BC34A',
      description: 'Région connue pour sa production fruitière, particulièrement les agrumes et les fraises.',
      products: [
        {
          id: 1,
          name: 'Fraises',
          description: 'Les fraises de Nabeul sont connues pour leur douceur et leur saveur intense.',
          imageUrl: '/assets/images/products/strawberry.jpg',
          season: 'Printemps'
        },
        {
          id: 2,
          name: 'Oranges',
          description: 'Les oranges de Cap Bon sont parmi les plus juteuses de Tunisie.',
          imageUrl: '/assets/images/products/orange.jpg',
          season: 'Hiver'
        }
      ]
    },
    {
      id: 2,
      name: 'Sfax',
      region: 'Centre-Est',
      latitude: 34.7398,
      longitude: 10.7600,
      color: '#AED581',
      description: 'La région de Sfax est célèbre pour sa production d\'olives et d\'huile d\'olive de qualité supérieure.',
      products: [
        {
          id: 3,
          name: 'Olives',
          description: 'Les olives de Sfax sont utilisées pour produire une huile d\'olive de renommée internationale.',
          imageUrl: '/assets/images/products/olives.jpg',
          season: 'Automne'
        },
        {
          id: 4,
          name: 'Amandes',
          description: 'Les amandiers prospèrent dans le climat semi-aride de la région.',
          imageUrl: '/assets/images/products/almonds.jpg',
          season: 'Été'
        }
      ]
    },
    {
      id: 3,
      name: 'Jendouba',
      region: 'Nord-Ouest',
      latitude: 36.5019,
      longitude: 8.7752,
      color: '#66BB6A',
      description: 'Jendouba est connue pour ses céréales et ses produits laitiers de montagne.',
      products: [
        {
          id: 5,
          name: 'Blé',
          description: 'Le blé dur cultivé dans cette région est utilisé pour la production de couscous et de pâtes.',
          imageUrl: '/assets/images/products/wheat.jpg',
          season: 'Été'
        },
        {
          id: 6,
          name: 'Fromage',
          description: 'Les fromages artisanaux de cette région sont produits à partir du lait des troupeaux locaux.',
          imageUrl: '/assets/images/products/cheese.jpg',
          season: 'Toute l\'année'
        }
      ]
    },
    {
      id: 4,
      name: 'Gabès',
      region: 'Sud-Est',
      latitude: 33.8814,
      longitude: 10.0982,
      color: '#CDDC39',
      description: 'Gabès est célèbre pour son système agricole unique d\'oasis à trois étages et ses dattes.',
      products: [
        {
          id: 7,
          name: 'Dattes',
          description: 'Les dattes Deglet Nour sont connues pour leur texture et leur goût exquis.',
          imageUrl: '/assets/images/products/dates.jpg',
          season: 'Automne'
        },
        {
          id: 8,
          name: 'Grenade',
          description: 'Les grenades de Gabès sont appréciées pour leur jus sucré et leurs graines tendres.',
          imageUrl: '/assets/images/products/pomegranate.jpg',
          season: 'Automne'
        }
      ]
    },
    {
      id: 5,
      name: 'Kairouan',
      region: 'Centre',
      latitude: 35.6784,
      longitude: 10.0957,
      color: '#9CCC65',
      description: 'Kairouan est réputée pour sa production d\'huile d\'olive et de légumes.',
      products: [
        {
          id: 9,
          name: 'Huile d\'olive',
          description: 'L\'huile d\'olive de Kairouan est reconnue pour ses qualités gustatives.',
          imageUrl: '/assets/images/products/olive-oil.jpg',
          season: 'Automne-Hiver'
        },
        {
          id: 10,
          name: 'Piments',
          description: 'Les piments de Kairouan sont utilisés dans la préparation du harissa traditionnel.',
          imageUrl: '/assets/images/products/peppers.jpg',
          season: 'Été'
        }
      ]
    }
  ];

  constructor() { }

  getAgriculturalZones(): Observable<AgriculturalZone[]> {
    return of(this.zones);
  }

  getZoneById(id: number): Observable<AgriculturalZone | undefined> {
    const zone = this.zones.find(z => z.id === id);
    return of(zone);
  }

  /**
   * Find zones by product name
   * @param productName Name of the product to search for
   * @returns Observable of agricultural zones that contain the product
   */
  getZonesByProductName(productName: string): Observable<AgriculturalZone[]> {
    if (!productName) {
      return of([]);
    }

    // Normalize search term
    const searchTerm = productName.trim().toLowerCase();
    
    // Map of keywords to specific regions
    const productKeywordMap: Record<string, string> = {
      // Nabeul (Cap Bon) - Fruits, agrumes
      'fraise': 'Nabeul',
      'fraises': 'Nabeul',
      'strawberry': 'Nabeul',
      'orange': 'Nabeul',
      'citron': 'Nabeul',
      'agrume': 'Nabeul',
      'mandarine': 'Nabeul',
      'fruit': 'Nabeul',
      
      // Sfax - Olives, amandes, huile
      'olive': 'Sfax',
      'olives': 'Sfax',
      'huile': 'Sfax',
      'amande': 'Sfax',
      'amandes': 'Sfax',
      
      // Jendouba - Céréales, produits laitiers
      'blé': 'Jendouba',
      'céréale': 'Jendouba',
      'cereal': 'Jendouba',
      'fromage': 'Jendouba',
      'lait': 'Jendouba',
      'milk': 'Jendouba',
      'cheese': 'Jendouba',
      
      // Gabès - Dattes, fruits d'oasis
      'datte': 'Gabès',
      'dattes': 'Gabès',
      'date': 'Gabès', 
      'grenade': 'Gabès',
      'pomegranate': 'Gabès',
      'palm': 'Gabès',
      'palmier': 'Gabès',
      
      // Kairouan - Épices, légumes, olivier
      'piment': 'Kairouan',
      'épice': 'Kairouan',
      'spice': 'Kairouan',
      'légume': 'Kairouan',
      'vegetable': 'Kairouan',
      'tomate': 'Kairouan'
      

    };
    
    // First try to find exact product match in the zones data
    const matchingZones = this.zones.filter(zone => {
      return zone.products.some(product => 
        product.name.toLowerCase() === searchTerm || 
        product.name.toLowerCase().includes(searchTerm)
      );
    });
    
    if (matchingZones.length > 0) {
      return of(matchingZones);
    }
    
    // If no exact match, try to match based on keywords in the product name
    for (const [keyword, region] of Object.entries(productKeywordMap)) {
      if (searchTerm.includes(keyword)) {
        const matchedZone = this.zones.find(z => z.name === region);
        if (matchedZone) {
          return of([matchedZone]);
        }
      }
    }
    
    // Try more complex matching based on product categories
    // Fruits and berries
    if (/pomme|poire|pêche|abricot|berry|baie|fruit|appl|pear|peach/i.test(searchTerm)) {
      return of([this.zones.find(z => z.name === 'Nabeul')!]);
    }
    
    // Nuts and oils
    if (/noix|pistach|nois|nut|oil|huile|seed|graine/i.test(searchTerm)) {
      return of([this.zones.find(z => z.name === 'Sfax')!]);
    }
    
    // Grains and dairy
    if (/grain|oat|avoine|corn|maïs|lait|milk|yaourt|yogurt|butter|beurre/i.test(searchTerm)) {
      return of([this.zones.find(z => z.name === 'Jendouba')!]);
    }
    
    // Desert fruits and products
    if (/figue|fig|oasis|exotic|exoti|palm|datte/i.test(searchTerm)) {
      return of([this.zones.find(z => z.name === 'Gabès')!]);
    }
    
    // Vegetables and spices
    if (/pepper|poivre|legume|vegetable|spice|épice|herb|herbe/i.test(searchTerm)) {
      return of([this.zones.find(z => z.name === 'Kairouan')!]);
    }

    // Default fallback with product name info in console for debugging
    console.log(`No match found for product: "${productName}" (normalized term: "${searchTerm}")`);
    
    // Use a distribution algorithm to avoid always returning the same default
    const randomZoneIndex = Math.floor(Math.abs(searchTerm.charCodeAt(0) % this.zones.length));
    return of([this.zones[randomZoneIndex]]);
  }
}
