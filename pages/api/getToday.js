export default async function handler(req, res) {
	try {
		const today = new Date();
		const nextYearNumber = today.getFullYear() + 1;
		const nextYear = new Date(today.setFullYear(nextYearNumber));

		res.status(200);
		res.json({
			nextYear: nextYear,
		});
	} catch (e) {
		res.status(500);
		res.json({
			error: "For some reason this api isn't working correctly",
		});
	}
}
