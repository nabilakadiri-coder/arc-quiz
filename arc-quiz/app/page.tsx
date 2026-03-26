'use client'

import { useMemo, useState } from 'react'

type ProfileKey = 'A' | 'B' | 'C'

type Question = {
  id: number
  text: string
  options: {
    key: ProfileKey
    text: string
  }[]
}

type ResultContent = {
  emoji: string
  title: string
  subtitle: string
  description: string
  arc: string
}

const EVENT_NAME = process.env.NEXT_PUBLIC_EVENT_NAME || 'ARC - Conference 4 Avril'
const GOOGLE_SCRIPT_URL = '/api/submit'

const questions: Question[] = [
  {
    id: 1,
    text: 'Face à une décision importante, votre premier réflexe est de :',
    options: [
      { key: 'A', text: 'Analyser les options, peser le pour et le contre' },
      { key: 'B', text: 'Ressentir ce qui est juste pour vous' },
      { key: 'C', text: 'Passer à l’action pour tester' },
    ],
  },
  {
    id: 2,
    text: 'Quand tout s’accélère autour de vous, vous :',
    options: [
      { key: 'A', text: 'Cherchez à comprendre et à structurer la situation' },
      { key: 'B', text: 'Prenez soin de l’ambiance et de l’équipe avant tout' },
      { key: 'C', text: 'Foncez et ajustez en cours de route' },
    ],
  },
  {
    id: 3,
    text: 'Ce qui vous donne le plus d’énergie au travail, c’est :',
    options: [
      { key: 'A', text: 'Résoudre un problème complexe avec élégance' },
      { key: 'B', text: 'Sentir que ce que vous faites a du sens et de l’impact humain' },
      { key: 'C', text: 'Voir des résultats concrets avancer vite' },
    ],
  },
  {
    id: 4,
    text: 'Quand vous êtes sous pression, vous avez tendance à :',
    options: [
      { key: 'A', text: 'Sur-réfléchir et tourner en boucle' },
      { key: 'B', text: 'Absorber les émotions des autres et vous oublier' },
      { key: 'C', text: 'Agir trop vite sans prendre le temps d’écouter' },
    ],
  },
  {
    id: 5,
    text: 'Pour retrouver votre équilibre, vous avez besoin de :',
    options: [
      { key: 'A', text: 'Clarifier, structurer, comprendre' },
      { key: 'B', text: 'Vous reconnecter à ce qui a du sens pour vous' },
      { key: 'C', text: 'Bouger, agir, incarner physiquement' },
    ],
  },
  {
    id: 6,
    text: 'Dans votre manière de diriger, on vous reconnaît surtout pour :',
    options: [
      { key: 'A', text: 'Votre capacité à anticiper et à poser un cadre clair' },
      { key: 'B', text: 'Votre écoute et votre capacité à fédérer autour d’une vision' },
      { key: 'C', text: 'Votre énergie, votre présence et votre capacité à décider vite' },
    ],
  },
]

const results: Record<ProfileKey, ResultContent> = {
  A: {
    emoji: '🧠',
    title: 'TÊTE',
    subtitle: 'L’ARCHITECTE STRATÉGIQUE',
    description:
      'Vous êtes brillant, analytique et visionnaire. Vous anticipez, planifiez et voyez 10 coups d’avance. Votre force : la clarté intellectuelle. Votre défi : descendre de la tête au corps et oser agir avant d’avoir tout analysé.',
    arc:
      'Dans la méthode A.R.C., votre CIBLER passe par la tête. Apprenez à calibrer votre intensité intellectuelle pour qu’elle serve votre cible — sans vous épuiser.',
  },
  B: {
    emoji: '❤️',
    title: 'CŒUR',
    subtitle: 'LE PORTEUR DE SENS',
    description:
      'Vous êtes aligné, connecté et porteur de valeurs. Vous fédérez, inspirez et donnez du sens. Votre force : l’intelligence relationnelle. Votre défi : protéger votre énergie sans vous oublier dans le service aux autres.',
    arc:
      'Dans la méthode A.R.C., votre CIBLER passe par le cœur. Reconnecter vos actions à ce qui compte vraiment pour vous est votre levier le plus puissant.',
  },
  C: {
    emoji: '💪',
    title: 'CORPS',
    subtitle: 'L’ARCHITECTE DE L’ACTION',
    description:
      'Vous êtes efficace, incarné et dans l’élan. Vous testez, ajustez, livrez. Votre force : la capacité d’action et de décision rapide. Votre défi : reconnecter avec le pourquoi avant de foncer.',
    arc:
      'Dans la méthode A.R.C., votre CIBLER passe par le corps. Retrouver vos appuis avant chaque décision importante transforme votre efficacité en puissance durable.',
  },
}

function getFinalProfile(answers: Record<number, ProfileKey>): ProfileKey | null {
  if (Object.keys(answers).length !== questions.length) return null

  const counts = { A: 0, B: 0, C: 0 }

  for (const answer of Object.values(answers)) {
    counts[answer] += 1
  }

  const max = Math.max(counts.A, counts.B, counts.C)
  const winners = (Object.entries(counts) as [ProfileKey, number][])
    .filter(([, count]) => count === max)
    .map(([key]) => key)

  if (winners.length === 1) return winners[0]

  return answers[4] || null
}

export default function ArcQuizV1() {
  const [started, setStarted] = useState(false)
  const [answers, setAnswers] = useState<Record<number, ProfileKey>>({})
  const [step, setStep] = useState<'quiz' | 'capture' | 'result'>('quiz')
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const progress = useMemo(() => {
    return (Object.keys(answers).length / questions.length) * 100
  }, [answers])

  const finalProfile = useMemo(() => getFinalProfile(answers), [answers])
  const result = finalProfile ? results[finalProfile] : null

  const allAnswered = Object.keys(answers).length === questions.length

  function selectAnswer(questionId: number, key: ProfileKey) {
    setAnswers((prev) => ({ ...prev, [questionId]: key }))
  }

  async function handleSubmitLead() {
    if (!prenom.trim() || !nom.trim() || !email.trim() || !finalProfile) return

    setIsSubmitting(true)

    try {
      if (GOOGLE_SCRIPT_URL) {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event_name: EVENT_NAME,
            prenom,
            nom,
            email,
            telephone,
            profil_final: result?.title || '',
          }),
        })
      }
    } catch (error) {
      console.error('Erreur Google Sheet', error)
    } finally {
      setIsSubmitting(false)
      setStep('result')
    }
  }

  return (
    <main className="min-h-screen bg-[#0c0f14] text-white">
      <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
        <div className="mb-10 text-center">
  <div className="text-5xl font-semibold tracking-[0.08em] text-[#f4f1e8] md:text-6xl">
    NLD
  </div>
  <div className="mt-2 text-lg tracking-[0.18em] text-[#c8a74e] md:text-xl">
    NO LIMIT DEVELOPMENT
  </div>
  <div className="mt-3 text-base italic text-white/70">
    Activateur d’excellence
  </div>
</div>

        {!started ? (
          <section className="rounded-3xl border border-[#6f5a24] bg-[#11151c] px-6 py-12 text-center shadow-2xl shadow-[#00000060] md:px-10 md:py-16">
            <p className="text-sm uppercase tracking-[0.4em] text-[#c8a74e]">Atelier A.R.C.</p>
            <h1 className="mt-6 text-5xl font-bold uppercase leading-none tracking-tight md:text-7xl">
              <span className="block text-white">Quel archer</span>
              <span className="mt-2 block text-[#c8a74e]">êtes-vous ?</span>
            </h1>
            <p className="mt-8 text-xl text-white/70">6 questions · 3 minutes</p>
            <p className="mx-auto mt-3 max-w-xl text-lg text-white/65">
              Un éclairage sur votre manière de décider et d’avancer.
            </p>
            <button
              onClick={() => {
                setStarted(true)
                setStep('quiz')
              }}
              className="mt-10 rounded-2xl bg-[#c8a74e] px-10 py-5 text-xl font-semibold uppercase tracking-[0.25em] text-[#11151c] shadow-[0_0_30px_rgba(200,167,78,0.25)] transition hover:scale-[1.01]"
            >
              Commencer →
            </button>
          </section>
        ) : step === 'quiz' ? (
          <section className="space-y-6">
            <div className="overflow-hidden rounded-full bg-white/10">
              <div className="h-2 bg-[#c8a74e] transition-all" style={{ width: `${progress}%` }} />
            </div>

            {questions.map((question) => {
              const selected = answers[question.id]
              return (
                <article
                  key={question.id}
                  className="rounded-3xl border border-[#6f5a24] bg-[#11151c] p-6 shadow-xl shadow-black/20"
                >
                  <p className="text-sm uppercase tracking-[0.3em] text-[#c8a74e]">
                    Question {question.id}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold leading-snug text-[#f4f1e8]">
                    {question.text}
                  </h2>

                  <div className="mt-6 space-y-3">
                    {question.options.map((option) => {
                      const isActive = selected === option.key
                      return (
                        <button
                          key={option.key}
                          onClick={() => selectAnswer(question.id, option.key)}
                          className={`flex w-full items-start gap-4 rounded-2xl border px-4 py-4 text-left transition ${
                            isActive
                              ? 'border-[#c8a74e] bg-[#c8a74e]/15'
                              : 'border-white/10 bg-white/5 hover:border-[#c8a74e]/50 hover:bg-white/10'
                          }`}
                        >
                          <span
                            className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-lg font-bold ${
                              isActive ? 'bg-[#c8a74e] text-[#11151c]' : 'bg-white/10 text-white/75'
                            }`}
                          >
                            {option.key}
                          </span>
                          <span className="text-lg text-white/90">{option.text}</span>
                        </button>
                      )
                    })}
                  </div>
                </article>
              )
            })}

            <div className="flex justify-end">
              <button
                disabled={!allAnswered}
                onClick={() => setStep('capture')}
                className="rounded-2xl bg-[#c8a74e] px-8 py-4 text-lg font-semibold text-[#11151c] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Découvrir mon profil
              </button>
            </div>
          </section>
        ) : step === 'capture' ? (
          <section className="rounded-3xl border border-[#6f5a24] bg-[#11151c] p-6 shadow-xl shadow-black/20 md:p-10">
            <p className="text-sm uppercase tracking-[0.35em] text-[#c8a74e]">Dernière étape</p>
            <h2 className="mt-4 text-4xl font-bold text-white">Votre profil est prêt.</h2>
            <p className="mt-3 max-w-2xl text-lg text-white/70">
              Renseignez vos coordonnées pour afficher votre résultat et recevoir votre décryptage
              complet.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <input
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Prénom *"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white placeholder:text-white/40 focus:border-[#c8a74e] focus:outline-none"
              />
              <input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom *"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white placeholder:text-white/40 focus:border-[#c8a74e] focus:outline-none"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email *"
                type="email"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white placeholder:text-white/40 focus:border-[#c8a74e] focus:outline-none md:col-span-2"
              />
              <input
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="Téléphone (facultatif)"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white placeholder:text-white/40 focus:border-[#c8a74e] focus:outline-none md:col-span-2"
              />
            </div>

            <button
              disabled={isSubmitting || !prenom.trim() || !nom.trim() || !email.trim()}
              onClick={handleSubmitLead}
              className="mt-8 rounded-2xl bg-[#c8a74e] px-8 py-4 text-lg font-semibold text-[#11151c] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting ? 'Envoi...' : 'Afficher mon résultat'}
            </button>
          </section>
        ) : result ? (
          <section className="space-y-6">
            <article className="rounded-3xl border border-[#6f5a24] bg-[#11151c] p-6 text-center shadow-xl shadow-black/20 md:p-10">
              <p className="text-sm uppercase tracking-[0.4em] text-[#c8a74e]">
                Votre profil de leader
              </p>
              <div className="mt-8 text-6xl">{result.emoji}</div>
              <h2 className="mt-6 text-6xl font-bold tracking-[0.2em] text-[#c8a74e]">
                {result.title}
              </h2>
              <p className="mt-4 text-2xl uppercase tracking-[0.18em] text-white/70">
                {result.subtitle}
              </p>
              <div className="mx-auto mt-6 h-px w-24 bg-[#c8a74e]/60" />
              <p className="mx-auto mt-8 max-w-2xl text-left text-xl leading-10 text-white/75 md:text-center">
                {result.description}
              </p>
            </article>

            <article className="rounded-3xl border border-white/10 bg-[#161b22] p-6 shadow-xl shadow-black/20 md:p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-[#c8a74e]">Méthode A.R.C.</p>
              <p className="mt-5 text-2xl leading-10 text-white/75">{result.arc}</p>
            </article>

            <article className="rounded-3xl border border-[#6f5a24] bg-[#18150f] p-6 text-center shadow-xl shadow-black/20 md:p-8">
              <p className="text-xl text-white/75">
                ✨ Vos résultats complets vous seront envoyés par email.
              </p>
              <p className="mx-auto mt-6 max-w-2xl text-2xl leading-10 text-white/80">
                <span className="font-semibold text-[#c8a74e]">
                  Retrouvez Nabila à la fin de la session
                </span>{' '}
                pour en savoir plus sur le programme A.R.C.
              </p>
            </article>
          </section>
        ) : null}
      </div>
    </main>
  )
}