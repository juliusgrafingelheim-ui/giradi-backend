"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = orderPlacedHandler;
const resend_1 = require("resend");
async function orderPlacedHandler({ event, container, }) {
    console.log("========== ORDER PLACED SUBSCRIBER FIRED ==========");
    console.log("Order ID:", event.data.id);
    console.log("RESEND_API_KEY set:", !!process.env.RESEND_API_KEY);
    try {
        const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
        const query = container.resolve("query");
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
        });
        console.log("Order found:", !!order);
        console.log("Order email:", order?.email);
        if (!order || !order.email) {
            console.log("No order or email found, skipping");
            return;
        }
        const result = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
            to: order.email,
            subject: `Bestellbestätigung #${order.display_id} – The Girardi Oil`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #FAF8F3; padding: 40px;">
          <h1 style="color: #275425;">Vielen Dank für deine Bestellung!</h1>
          <p>Bestellnummer: <strong>#${order.display_id}</strong></p>
          <p>Gesamtbetrag: <strong>€${order.total}</strong></p>
          <h2 style="color: #275425;">Nächster Schritt</h2>
          <p>Wir melden uns bei dir mit den Zahlungsinformationen.</p>
        </div>
      `,
        });
        console.log("Resend result:", JSON.stringify(result));
    }
    catch (error) {
        console.error("========== SUBSCRIBER ERROR ==========", error);
    }
}
exports.config = {
    event: "order.placed",
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXItcGxhY2VkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3N1YnNjcmliZXJzL29yZGVyLXBsYWNlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSxxQ0FrREM7QUFwREQsbUNBQStCO0FBRWhCLEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxFQUMvQyxLQUFLLEVBQ0wsU0FBUyxHQUNzQjtJQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLHFEQUFxRCxDQUFDLENBQUE7SUFDbEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBRWhFLElBQUksQ0FBQztRQUNILE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUE7UUFFckQsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN4QyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDMUMsTUFBTSxFQUFFLE9BQU87WUFDZixNQUFNLEVBQUU7Z0JBQ04sSUFBSTtnQkFDSixZQUFZO2dCQUNaLE9BQU87Z0JBQ1AsT0FBTztnQkFDUCxlQUFlO2dCQUNmLFNBQVM7Z0JBQ1Qsb0JBQW9CO2FBQ3JCO1lBQ0QsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFO1NBQy9CLENBQUMsQ0FBQTtRQUVGLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFFekMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQztZQUFDLE9BQU87UUFBQyxDQUFDO1FBRXpGLE1BQU0sTUFBTSxHQUFHLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDdEMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLElBQUksdUJBQXVCO1lBQzlELEVBQUUsRUFBRSxLQUFLLENBQUMsS0FBZTtZQUN6QixPQUFPLEVBQUUsdUJBQXVCLEtBQUssQ0FBQyxVQUFVLG9CQUFvQjtZQUNwRSxJQUFJLEVBQUU7Ozt1Q0FHMkIsS0FBSyxDQUFDLFVBQVU7c0NBQ2pCLEtBQUssQ0FBQyxLQUFLOzs7O09BSTFDO1NBQ0YsQ0FBQyxDQUFBO1FBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7SUFDdkQsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLENBQUMsS0FBSyxDQUFDLHdDQUF3QyxFQUFFLEtBQUssQ0FBQyxDQUFBO0lBQ2hFLENBQUM7QUFDSCxDQUFDO0FBRVksUUFBQSxNQUFNLEdBQXFCO0lBQ3RDLEtBQUssRUFBRSxjQUFjO0NBQ3RCLENBQUEifQ==