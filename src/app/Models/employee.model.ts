import { TypePost } from "./type-post.enum";
import { Tache } from "./tache.model";

export interface Employee {
  idEmployee: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateEmbauche: Date;
  typePoste: TypePost;
  salaire: number;
  plateforme?: any; // à remplacer si Plateforme est modélisée
  taches?: Tache[];
}
