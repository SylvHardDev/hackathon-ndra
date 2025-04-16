import { useParams } from "react-router-dom";
import ProjectDetail from "./Projects/ProjectDetail";
import { Projet } from "./Projects/ProjectListView";

// Exemple de données simulées pour le développement
const dummyProject: Projet = {
  id: 1,
  titre: "Projet Alpha",
  statut: "open",
  collaborateur: "Alice",
  client: "Client A",
  type: "video",
  dateDebut: "16 janv. 2024",
};

export default function ProjectDetailPage() {
  const { id } = useParams();

  // TODO: Récupérer les données du projet depuis l'API en utilisant l'ID
  // Pour l'instant, on utilise des données simulées
  const project = dummyProject;

  return <ProjectDetail project={project} />;
}
