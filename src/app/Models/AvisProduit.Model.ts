export class AvisProduit {
    idAvis?: number;
    comment: string = '';
    dateAvis: String = '';
    produit?: {
        idProduit: number;
        nom: string;
      };

    }