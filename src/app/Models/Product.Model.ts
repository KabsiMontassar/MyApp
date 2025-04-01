export class Product {
    idProduit: number;
    nom: string;
    description: string;
    prix: number;
    quantiteDisponible: number;
    imageURL: string;
    status: string;
  
    constructor() {
      this.idProduit = 0;
      this.nom = '';
      this.description = '';
      this.prix = 0;
      this.quantiteDisponible = 0;
      this.imageURL = '';
      this.status = '';
    }
  }