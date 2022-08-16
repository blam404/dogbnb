import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
	try {
		const client = await clientPromise;
		const db = await client.db("dogbnb");

		const { dog } = req.body;

		const reservations = await db
			.collection("reservations")
			.find({ dogId: dog._id })
			.toArray();

		res.status(201);
		res.json({
			reservations: reservations,
		});
	} catch (e) {
		res.status(500);
		res.json({
			reservation: [],
		});
	}
}
