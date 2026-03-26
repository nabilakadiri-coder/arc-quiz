'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../components/ui/Button'

type FormState = {
  nom: string
  poste: string
  tension: string
  essaye: string
  pourquoi: string
  email: string
}

export default function CandidaturePage() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>({
    nom: '',
    poste: '',
    tension: '',
    essaye: '',
    pourquoi: '',
    email: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/candidature/merci')
  }

  const isValid = Object.values(form).every((v) => v.trim().length > 0)

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-accent text-xs font-medium tracking-widest uppercase mb-4">
        Candidature
      </p>
      <h1 className="text-3xl font-semibold text-primary mb-3">Votre dossier</h1>
      <p className="text-muted mb-12 leading-relaxed">
        Ces questions me permettent de comprendre votre situation avant notre échange.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <Field
          label="Prénom et nom"
          name="nom"
          value={form.nom}
          onChange={handleChange}
        />
        <Field
          label="Poste et entreprise"
          name="poste"
          value={form.poste}
          onChange={handleChange}
        />
        <TextareaField
          label="Quelle est la tension principale que vous vivez en ce moment ?"
          name="tension"
          value={form.tension}
          onChange={handleChange}
        />
        <TextareaField
          label="Qu'avez-vous déjà essayé pour y remédier ?"
          name="essaye"
          value={form.essaye}
          onChange={handleChange}
        />
        <TextareaField
          label="Pourquoi maintenant, et pas dans 6 mois ?"
          name="pourquoi"
          value={form.pourquoi}
          onChange={handleChange}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />

        <div className="pt-4 border-t border-gray-200">
          <Button type="submit" disabled={!isValid}>
            Envoyer ma candidature
          </Button>
          <p className="text-muted text-xs mt-3">
            Réponse sous 48h · Traitement confidentiel
          </p>
        </div>
      </form>
    </main>
  )
}

/* ── Composants locaux ──────────────────────────────────────── */

function Field({
  label,
  name,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-primary mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        className="w-full border border-gray-200 px-4 py-3 text-sm text-primary bg-surface focus:border-primary focus:outline-none"
      />
    </div>
  )
}

function TextareaField({
  label,
  name,
  value,
  onChange,
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-primary mb-2">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required
        rows={4}
        className="w-full border border-gray-200 px-4 py-3 text-sm text-primary bg-surface focus:border-primary focus:outline-none resize-none"
      />
    </div>
  )
}
