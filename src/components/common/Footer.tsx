export default function Footer() {
  return (
    <footer className="bg-gray-200 py-3 mt-auto">
      <div className="container mx-auto text-center text-sm text-gray-700">
        © {new Date().getFullYear()} MPA WorkBoard. Tous droits réservés.
      </div>
    </footer>
  );
}
