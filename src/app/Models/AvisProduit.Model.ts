export interface AvisProduit {
  idAvis?: number;
  comment: string;
  dateAvis: string;
  produit?: {
    idProduit: number;
    nom?: string;
  };
}
