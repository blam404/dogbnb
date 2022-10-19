import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

import { convertToUTC } from "../../utils/dateTime";

export default async function handler(req, res) {
	try {
		const client = await clientPromise;
		const db = await client.db("dogbnb");

		const { dogId, reviewerEmail, rating, reservationId, review } =
			req.body;

		const reviewDate = convertToUTC(new Date());

		const reviewResult = await db.collection("dogReviews").insertOne({
			dogId: ObjectId(dogId),
			rating,
			review,
			reviewerEmail,
			reviewDate,
		});

		const resFilter = {
			_id: ObjectId(reservationId),
		};

		const resItem = {
			$set: {
				reviewed: true,
			},
		};

		const reservationResult = await db
			.collection("reservations")
			.updateOne(resFilter, resItem);

		res.status(201);
		res.json({
			reservation: reservationResult,
			review: reviewResult,
			message: "Review has been created.",
		});
	} catch (e) {
		res.status(500);
		res.json({
			review: { acknowledged: false, error: true },
			reservation: { acknowledged: false, error: true },
		});
	}
}
