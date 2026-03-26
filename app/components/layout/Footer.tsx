export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-6 mt-auto">
      <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row justify-between gap-2 text-muted text-xs">
        <span>© 2026 LeaderShift · Tous droits réservés</span>
        <div className="flex gap-4">
          <a href="/legal" className="hover:text-primary transition-colors">Mentions légales</a>
          <a href="/legal" className="hover:text-primary transition-colors">Confidentialité</a>
        </div>
      </div>
    </footer>
  )
}
