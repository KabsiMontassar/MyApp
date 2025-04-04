export class Product {
  idProduit?: number;
  nom: string = '';
  description: string = '';
  prix: number = 0;
  quantiteDisponible: number = 0;
  dateAjout?: string;
  imageURL: string = '';
  status: string = '';
  idStock: number = 0;
  idCategorie: number = 0;
  idUser?: number;
  stock?: any;
  categorie?: any;
}