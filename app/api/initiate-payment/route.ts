import Razorpay from "razorpay";

export async function POST(request: Request) {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_TEST_KEY,
            key_secret: process.env.RAZORPAY_TEST_SECRET,
        });
        const options = {
            amount : 999 * 100, // Razorpay expects amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };
        const payment = await razorpay.orders.create(options);

        return new Response(JSON.stringify(payment), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to initiate payment" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}