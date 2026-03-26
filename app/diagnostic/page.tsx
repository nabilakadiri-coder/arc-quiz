'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../components/ui/Button'
import { Progress } from '../components/ui/Progress'

const QUESTIONS = [
  // Axe Clarté
  { id: 1,  axe: 'Clarté',     text: "Votre équipe comprend-elle clairement où vous voulez l'emmener ?" },
  { id: 2,  axe: 'Clarté',     text: 'Vos décisions sont-elles facilement expliquées et comprises ?' },
  { id: 3,  axe: 'Clarté',     text: 'Votre cap pour les 12 prochains mois est-il clair pour vous ?' },
  { id: 4,  axe: 'Clarté',     text: 'Vos messages sont-ils reçus tels que vous les avez formulés ?' },
  // Axe Magnétisme
  { id: 5,  axe: 'Magnétisme', text: 'Vos collaborateurs vous suivent-ils de leur propre initiative ?' },
  { id: 6,  axe: 'Magnétisme', text: 'Arrivez-vous à embarquer vos équipes dans vos projets ?' },
  { id: 7,  axe: 'Magnétisme', text: "Votre présence transforme-t-elle l'énergie d'une réunion ?" },
  { id: 8,  axe: 'Magnétisme', text: 'Les bons profils viennent-ils naturellement vers vous ?' },
  // Axe Légitimité
  { id: 9,  axe: 'Légitimité', text: 'Vous sentez-vous pleinement légitime dans votre rôle ?' },
  { id: 10, axe: 'Légitimité', text: "Votre autorité est-elle reconnue sans que vous ayez à l'imposer ?" },
  { id: 11, axe: 'Légitimité', text: 'Avez-vous parfois besoin de vous justifier de diriger ?' },
  { id: 12, axe: 'Légitimité', text: 'Votre posture de dirigeant vous semble-t-elle naturelle ?' },
]

const OPTIONS = ['Jamais', 'Rarement', 'Parfois', 'Souvent', 'Toujours']

export default function DiagnosticPage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})

  const question = QUESTIONS[current]
  const isLast = current === QUESTIONS.length - 1
  const answer = answers[question.id]

  const handleSelect = (option: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: option }))
  }

  const handleNext = () => {
    if (isLast) {
      router.push('/candidature')
    } else {
      setCurrent((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (current > 0) setCurrent((prev) => prev - 1)
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      {/* Progression */}
      <div className="mb-12">
        <div className="flex justify-between text-xs text-muted mb-3">
          <span className="font-medium tracking-widest uppercase">{question.axe}</span>
          <span>{current + 1} / {QUESTIONS.length}</span>
        </div>
        <Progress current={current + 1} total={QUESTIONS.length} />
      </div>

      {/* Question */}
      <h2 className="text-2xl font-semibold text-primary leading-snug mb-10">
        {question.text}
      </h2>

      {/* Options */}
      <div className="flex flex-col gap-3 mb-12">
        {OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={`w-full text-left px-5 py-4 border text-sm transition-colors cursor-pointer ${
              answer === option
                ? 'border-primary bg-primary text-surface'
                : 'border-gray-200 text-primary hover:border-primary'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrev}
          disabled={current === 0}
          className="text-muted text-sm hover:text-primary disabled:opacity-0 transition-colors cursor-pointer"
        >
          ← Précédent
        </button>
        <Button onClick={handleNext} disabled={!answer}>
          {isLast ? 'Voir mes résultats' : 'Suivant →'}
        </Button>
      </div>
    </main>
  )
}
