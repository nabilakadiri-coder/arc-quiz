import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { readFile } from 'fs/promises'
import path from 'path'

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbztmViBunA1AXzKkBnpb3DIhWmNH0CsbsYclMySRM_K2KLBmY_bWC7PcHriEbxOGCAovQ/exec'

const resend = new Resend(process.env.RESEND_API_KEY)

// 🔧 Nettoyage texte
function normalizeText(value: unknown) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

// 🎯 Choix du PDF
function getProfilePdf(profilFinal: string) {
  const value = normalizeText(profilFinal)

  if (value.includes('tete')) {
    return {
      fileName: 'tete.pdf',
      subject: 'Votre profil ARC — Tête',
      title: 'Votre profil ARC : Tête',
    }
  }

  if (value.includes('coeur')) {
    return {
      fileName: 'coeur.pdf',
      subject: 'Votre profil ARC — Cœur',
      title: 'Votre profil ARC : Cœur',
    }
  }

  return {
    fileName: 'corps.pdf',
    subject: 'Votre profil ARC — Corps',
    title: 'Votre profil ARC : Corps',
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('📥 Body reçu :', body)

    const prenom = body.prenom || ''
    const nom = body.nom || ''
    const email = body.email || ''
    const telephone = body.telephone || ''
    const profilFinal = body.profil_final || ''
    const eventName = body.event_name || 'ARC'

    if (!email || !profilFinal) {
      return NextResponse.json(
        { success: false, error: 'Email ou profil manquant' },
        { status: 400 }
      )
    }

    // =========================
    // 1) GOOGLE SHEETS
    // =========================
    const sheetsResponse = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        prenom,
        nom,
        email,
        telephone,
        profil_final: profilFinal,
        event_name: eventName,
      }),
    })

    console.log('📊 Google status :', sheetsResponse.status)
    const sheetsText = await sheetsResponse.text()
console.log('📊 Google response :', sheetsText)

    // =========================
    // 2) PDF
    // =========================
    const pdfConfig = getProfilePdf(profilFinal)

    const pdfPath = path.join(
      process.cwd(),
      'public',
      'pdfs',
      pdfConfig.fileName
    )

    console.log('📄 PDF utilisé :', pdfPath)

    const pdfBuffer = await readFile(pdfPath)
const pdfBase64 = pdfBuffer.toString('base64')

    // =========================
    // 3) DEBUG AVANT EMAIL
    // =========================
    console.log('📧 FROM utilisé :', 'contact@leadershiftmastery.com')
    console.log('📧 DESTINATAIRE :', email)

    // =========================
    // 4) ENVOI EMAIL
    // =========================
    const { data, error } = await resend.emails.send({
      from: 'contact@leadershiftmastery.com', // 🔥 forcé pour éviter toute erreur
      to: [email],
      subject: pdfConfig.subject,
      html: `
        <div style="font-family: Arial; line-height:1.6;">
          <p>Bonsoir ${prenom || ''},</p>

          <p><strong>${pdfConfig.title}</strong></p>

          <p>
            Voici votre décryptage personnalisé en pièce jointe.
          </p>

          <p>
            Prenez le temps de le lire à tête reposée.
          </p>

          <p>
            À très bientôt,<br/>
            <strong>Nabila Kadiri</strong>
          </p>
        </div>
      `,
      attachments: [
        {
          filename: pdfConfig.fileName,
          content: pdfBase64,
        },
      ],
    })

    // =========================
    // 5) ERREUR RESEND
    // =========================
    if (error) {
      console.error('❌ ERREUR RESEND :', error)

      return NextResponse.json(
        {
          success: false,
          error: 'Erreur email',
          resendError: error,
        },
        { status: 500 }
      )
    }

    console.log('✅ EMAIL ENVOYÉ :', data)

    // =========================
    // SUCCESS
    // =========================
    return NextResponse.json({
      success: true,
      resendId: data?.id,
    })
  } catch (error) {
    console.error('❌ ERREUR GLOBALE :', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur',
      },
      { status: 500 }
    )
  }
}