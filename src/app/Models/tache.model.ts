export interface Tache {
  idTache: number;
  titre: string;
  description: string;
  dateDebut: Date;
  dateFin: Date;
  statutTache: string;
  position?: number;
  employee?: {
    idEmployee: number;
    nom?: string; 
  };
  parent?: Tache;
  sousTaches?: Tache[];
}
