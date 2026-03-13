import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function orderPlacedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  console.log("========== ORDER PLACED SUBSCRIBER FIRED ==========")
  console.log("Order ID:", event.data.id)
  console.log("RESEND_API_KEY set:", !!process.env.RESEND_API_KEY)

  try {
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
      filters: { id: event.data.id },
    })

    console.log("Order found:", !!order)
    console.log("Order email:", order?.email)

    if (!order || !order.email) {
      console.log("No order or email found, skipping")
      return
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: order.email,
        subject: `Bestellbestätigung #${order.display_id} – The Girardi Oil`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #FAF8F3; padding: 40px;">
            <h1 style="color: #275425;">Vielen Dank für deine Bestellung!</h1>
            <p>Bestellnummer: <strong>#${order.display_id}</strong></p>
            <p>Gesamtbetrag: <strong>€${(Number(order.total) / 100).toFixed(2)}</strong></p>
            <h2 style="color: #275425;">Nächster Schritt</h2>
            <p>Wir melden uns bei dir mit den Zahlungsinformationen.</p>
          </div>
        `,
      }),
    })

    const result = await res.json()
    console.log("Resend result:", JSON.stringify(result))
  } catch (error) {
    console.error("========== SUBSCRIBER ERROR ==========", error)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
