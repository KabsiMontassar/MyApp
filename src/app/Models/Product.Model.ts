export class Product {
  idProduit?: number;
  nom: string = '';
  description: string = '';
  prix: number = 0;
  quantiteDisponible: number = 0;
  dateAjout?: string;
  imageURL: string = '';
  status: string = '';
  conseilsCulture: string = '';
  idStock?: number;
  idCategorie?: number;
  stock?: any;
  categorie?: {
    idCategorie: number;
    nomCategorie: string;
  };
  avis?: { comment: string; dateAvis: string }[]; // Optional 'avis' property

}