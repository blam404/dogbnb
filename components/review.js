import React, {
	forwardRef,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

import { Context } from "./store";
import ModalCentered from "./ui/modalCentered";
import { XIcon } from "@heroicons/react/solid";

const Review = forwardRef(
	({ dogId, reservationId, rating, setRating, review, setReview }, ref) => {
		const [hover, setHover] = useState(0);
		const { login } = useContext(Context);
		const [reviewConfirmed, setReviewConfirmed] = useState();

		useEffect(() => {
			if (rating === 0) {
				setHover(0);
			}
		}, [rating]);

		const closeModal = () => {
			ref.current.closeModal();
		};

		const handleReview = (e) => {
			setReview(e.target.value);
		};

		const submitReview = async (e) => {
			e.preventDefault();
			if (review && rating) {
				const response = await fetch("/api/createReview", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						dogId,
						reviewerId: login.userId,
						rating,
						reservationId,
						review,
					}),
				});
				const data = await response.json();
				if (data.review.acknowledged) {
					setReviewConfirmed(true);

					setTimeout(() => {
						closeModal();
						setReviewConfirmed(false);
						location.reload();
					}, 1500);
				}
			} else {
				console.log("fill out he shit");
			}
		};
		return (
			<ModalCentered ref={ref}>
				<div className="flex items-center justify-between">
					<h1 className="text-base">
						<strong>Write a Review</strong>
					</h1>
					<div
						className="w-4 h-4 cursor-pointer"
						onClick={closeModal}
					>
						<XIcon />
					</div>
				</div>
				<hr className="my-4" />
				{!reviewConfirmed && (
					<div className="w-80 md:w-96">
						<div className="mb-2 flex items-center">
							<strong>Rating</strong>:&nbsp;
							{[...Array(5)].map((star, index) => {
								index++;
								return (
									<button
										key={index}
										onClick={() => setRating(index)}
										onMouseEnter={() => setHover(index)}
										onMouseLeave={() => setHover(rating)}
										className={
											index <= (hover || rating)
												? "text-slate-800"
												: "text-slate-300"
										}
									>
										&#9733;
									</button>
								);
							})}
						</div>
						<div className="mb-2">
							<strong>Review</strong>:
							<br />
							<textarea
								rows="6"
								wrap="soft"
								className="w-full"
								value={review}
								onChange={handleReview}
							></textarea>
						</div>
						<div className="flex justify-center">
							<input
								type="submit"
								className={`bg-slate-800 border-slate-800 text-white border-2 rounded-lg px-4 py-2 cursor-pointer ${
									(!rating || !review) && "disabled"
								}`}
								onClick={submitReview}
							/>
						</div>
					</div>
				)}
				{reviewConfirmed && (
					<div className="w-80 md:w-96">
						<p>Review submitted.</p>
					</div>
				)}
			</ModalCentered>
		);
	}
);

export default Review;
