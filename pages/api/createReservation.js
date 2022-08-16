import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
	try {
		const client = await clientPromise;
		const db = await client.db("dogbnb");

		const { userId, startDate, endDate, dogId, ownerId, totalCost } =
			req.body;

		const result = await db.collection("reservations").insertOne({
			userId,
			startDate: startDate,
			endDate: endDate,
			dogId,
			ownerId,
			totalCost,
		});

		res.status(201);
		res.json({
			reservation: result,
			message: "Reservation has been created.",
		});
	} catch (e) {
		res.status(500);
		res.json({
			reservation: { acknowledged: false, error: true },
		});
	}
}
