import { TypePlanning } from "./type-planning.enum";

export interface Planning {
  idPlanning: number;
  dateDebut: Date;
  dateFin: Date;
  typePlanning: TypePlanning;
  tache?: any;
  employee?: any;
}
