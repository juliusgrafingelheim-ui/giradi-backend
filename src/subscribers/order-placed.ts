import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function orderPlacedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderId = event.data.id

  const query = container.resolve("query")
  const { data: [order] } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "email",
      "total",
      "currency_code",
      "items.*",
      "shipping_address.*",
    ],
    filters: { id: orderId },
  })

  if (!order) return

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
    to: order.email,
    subject: `Bestellbestätigung #${order.display_id} – The Girardi Oil`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #FAF8F3; padding: 40px;">
        <h1 style="color: #275425;">Vielen Dank für deine Bestellung!</h1>
        <p>Bestellnummer: <strong>#${order.display_id}</strong></p>
        <p>Gesamtbetrag: <strong>€${order.total}</strong></p>
        
        <h2 style="color: #275425;">Zahlungsinformationen (Vorkasse)</h2>
        <p>Bitte überweise den Betrag an:</p>
        <table style="background: white; padding: 16px; border-radius: 8px; width: 100%;">
          <tr><td>Empfänger:</td><td><strong>The Girardi Oil</strong></td></tr>
          <tr><td>IBAN:</td><td><strong>DEIN_IBAN_HIER</strong></td></tr>
          <tr><td>BIC:</td><td><strong>DEIN_BIC_HIER</strong></td></tr>
          <tr><td>Verwendungszweck:</td><td><strong>Bestellung #${order.display_id}</strong></td></tr>
        </table>

        <h2 style="color: #275425; margin-top: 24px;">Deine Artikel</h2>
        ${order.items.map((item: any) => `
          <div style="padding: 8px 0; border-bottom: 1px solid #eee;">
            ${item.title} × ${item.quantity} — €${item.total}
          </div>
        `).join("")}

        <p style="margin-top: 24px; color: #666;">
          Bei Fragen antworte einfach auf diese E-Mail.
        </p>
      </div>
    `,
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
