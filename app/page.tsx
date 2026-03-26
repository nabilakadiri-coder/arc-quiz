import { Button } from './components/ui/Button'

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24 md:py-32">
      <p className="text-accent text-xs font-medium tracking-widest uppercase mb-8">
        Programme de transformation · 6 mois
      </p>

      <h1 className="text-4xl md:text-5xl font-semibold text-primary leading-tight mb-6">
        Votre expertise vous a mené ici.
        <br />
        Elle ne vous mènera pas plus loin.
      </h1>

      <p className="text-muted text-lg leading-relaxed mb-4 max-w-xl">
        Vous dirigez avec compétence. Mais quelque chose dans votre posture
        freine l'adhésion, la clarté ou la légitimité.
      </p>
      <p className="text-primary font-medium text-lg mb-12">
        LeaderShift opère cette transformation.
      </p>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Button href="/diagnostic">Où en suis-je vraiment ?</Button>
        <p className="text-muted text-sm">
          Bilan confidentiel · 10 minutes · Résultats personnalisés
        </p>
      </div>
    </main>
  )
}
