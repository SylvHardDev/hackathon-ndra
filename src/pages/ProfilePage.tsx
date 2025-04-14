import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow h-screen">
      <h2 className="text-2xl font-bold mb-4">Mon Profil</h2>
      <p className="mb-2">
        <strong>Nom :</strong>
      </p>
      <p className="mb-2">
        <strong>Email :</strong>
      </p>
      <p className="mb-4">
        <strong>Rôle :</strong>
      </p>
      <Button>Déconnexion</Button>
    </div>
  );
}
