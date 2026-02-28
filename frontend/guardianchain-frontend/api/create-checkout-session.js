import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {

    const { hash } = req.body;

    if (!hash) {
      return res.status(400).json({ error: "Hash is required" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "GuardianChain Certificate Registration"
            },
            unit_amount: 1000 // $10.00 (em centavos)
          },
          quantity: 1
        }
      ],
      metadata: {
        hash
      },
      success_url: `${process.env.BASE_URL}/#/success`,
      cancel_url: `${process.env.BASE_URL}/#/`
    });

    return res.status(200).json({ url: session.url });

  } catch (error) {
    console.error("Stripe error:", error);
    return res.status(500).json({ error: "Stripe session creation failed" });
  }
}