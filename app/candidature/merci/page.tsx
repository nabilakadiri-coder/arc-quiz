import { Button } from '../../components/ui/Button'

// Remplacer par l'URL Calendly réelle avant le lancement
const CALENDLY_URL = 'https://calendly.com'

export default function MerciPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-24 md:py-32 text-center">
      <p className="text-accent text-xs font-medium tracking-widest uppercase mb-8">
        Candidature reçue
      </p>

      <h1 className="text-4xl font-semibold text-primary mb-6">
        Vous venez de faire le premier pas.
      </h1>

      <p className="text-muted text-lg leading-relaxed mb-4 max-w-md mx-auto">
        J'ai bien reçu votre dossier. Je le lirai avec attention et vous répondrai sous 48h.
      </p>
      <p className="text-muted text-lg leading-relaxed mb-12 max-w-md mx-auto">
        Si vous souhaitez avancer dès maintenant, réservez directement votre entretien.
      </p>

      <Button href={CALENDLY_URL} className="mb-4">
        Réserver mon entretien
      </Button>

      <p className="text-muted text-xs mt-4">
        Ou attendez ma prise de contact · Sous 48h
      </p>
    </main>
  )
}
