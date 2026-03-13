"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = orderPlacedHandler;
async function orderPlacedHandler({ event, container, }) {
    console.log("========== ORDER PLACED SUBSCRIBER FIRED ==========");
    console.log("Order ID:", event.data.id);
    console.log("RESEND_API_KEY set:", !!process.env.RESEND_API_KEY);
    try {
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
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + process.env.RESEND_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
                to: order.email,
                subject: "Bestellbestätigung #" + order.display_id + " - The Girardi Oil",
                html: "<div style=\"font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #FAF8F3; padding: 40px;\"><h1 style=\"color: #275425;\">Vielen Dank für deine Bestellung!</h1><p>Bestellnummer: <strong>#" + order.display_id + "</strong></p><p>Gesamtbetrag: <strong>" + (Number(order.total) / 100).toFixed(2) + " EUR</strong></p><h2 style=\"color: #275425;\">Nächster Schritt</h2><p>Wir melden uns bei dir mit den Zahlungsinformationen.</p></div>",
            }),
        });
        const result = await res.json();
        console.log("Resend result:", JSON.stringify(result));
    }
    catch (error) {
        console.error("========== SUBSCRIBER ERROR ==========", error);
    }
}
exports.config = {
    event: "order.placed",
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXItcGxhY2VkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3N1YnNjcmliZXJzL29yZGVyLXBsYWNlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxxQ0FtREM7QUFuRGMsS0FBSyxVQUFVLGtCQUFrQixDQUFDLEVBQy9DLEtBQUssRUFDTCxTQUFTLEdBQ3NCO0lBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMscURBQXFELENBQUMsQ0FBQTtJQUNsRSxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUE7SUFFaEUsSUFBSSxDQUFDO1FBQ0gsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN4QyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDMUMsTUFBTSxFQUFFLE9BQU87WUFDZixNQUFNLEVBQUU7Z0JBQ04sSUFBSTtnQkFDSixZQUFZO2dCQUNaLE9BQU87Z0JBQ1AsT0FBTztnQkFDUCxlQUFlO2dCQUNmLFNBQVM7Z0JBQ1Qsb0JBQW9CO2FBQ3JCO1lBQ0QsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFO1NBQy9CLENBQUMsQ0FBQTtRQUVGLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFFekMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLENBQUE7WUFDaEQsT0FBTTtRQUNSLENBQUM7UUFFRCxNQUFNLEdBQUcsR0FBRyxNQUFNLEtBQUssQ0FBQywrQkFBK0IsRUFBRTtZQUN2RCxNQUFNLEVBQUUsTUFBTTtZQUNkLE9BQU8sRUFBRTtnQkFDUCxlQUFlLEVBQUUsU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYztnQkFDdkQsY0FBYyxFQUFFLGtCQUFrQjthQUNuQztZQUNELElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUNuQixJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsSUFBSSx1QkFBdUI7Z0JBQzlELEVBQUUsRUFBRSxLQUFLLENBQUMsS0FBSztnQkFDZixPQUFPLEVBQUUsc0JBQXNCLEdBQUcsS0FBSyxDQUFDLFVBQVUsR0FBRyxvQkFBb0I7Z0JBQ3pFLElBQUksRUFBRSwrTUFBK00sR0FBRyxLQUFLLENBQUMsVUFBVSxHQUFHLHdDQUF3QyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsd0lBQXdJO2FBQ3hjLENBQUM7U0FDSCxDQUFDLENBQUE7UUFFRixNQUFNLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtJQUN2RCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0NBQXdDLEVBQUUsS0FBSyxDQUFDLENBQUE7SUFDaEUsQ0FBQztBQUNILENBQUM7QUFFWSxRQUFBLE1BQU0sR0FBcUI7SUFDdEMsS0FBSyxFQUFFLGNBQWM7Q0FDdEIsQ0FBQSJ9