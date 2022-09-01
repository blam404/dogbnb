import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { StarIcon } from "@heroicons/react/solid";
import { XIcon } from "@heroicons/react/solid";

import Button from "../ui/button";
import ModalCentered from "../ui/modalCentered";

const Reviews = ({ reviews, owners, avgRating }) => {
	const allReviewsRef = useRef();

	const openAllReviewModal = () => {
		allReviewsRef.current.openModal();
	};

	const closeAllReviewModal = () => {
		allReviewsRef.current.closeModal();
	};

	const monthArray = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const limitedReviews = reviews.filter((review, index) => index <= 6);

	return (
		<div className="mb-4">
			<h2 className="flex my-8">
				<StarIcon className="w-6" /> {avgRating} &#x2022;{" "}
				{reviews.length} reviews
			</h2>
			<div className="md:flex md:flex-wrap overflow-x-scroll md:overflow-x-auto whitespace-nowrap md:whitespace-normal">
				{limitedReviews.map((review, index) => {
					const reviewer = owners.find(
						(owner) => owner._id === review.reviewerId
					);

					const reviewDate = new Date(review.reviewDate);
					const reviewMonth = monthArray[reviewDate.getMonth()];
					const reviewYear = reviewDate.getFullYear();

					return (
						<div
							key={review._id}
							className={`inline-block align-top w-11/12 md:w-1/2 border md:border-0 p-4 md:p-0 md:pr-8 rounded-xl md:rounded-none mx-1 md:mx-0 ${
								index === 0 ? "ml-0" : ""
							} ${
								index === limitedReviews.length - 1
									? "mr-0"
									: ""
							}`}
						>
							<div className="flex items-center">
								{reviewer.picMedium ? (
									<div className="w-16 h-16 mr-4 relative">
										<Image
											src={reviewer.picMedium}
											layout="fill"
											objectFit="cover"
											className="rounded-full"
										/>
									</div>
								) : (
									<div className="h-16 w-16 mr-4 text-3xl text-white bg-slate-600 rounded-full flex justify-center items-center">
										{reviewer.username
											.charAt(0)
											.toUpperCase()}
									</div>
								)}
								<div>
									<div className="text-lg">
										<strong>{reviewer.firstName}</strong>
									</div>
									<div className="text-base text-slate-400">{`${reviewMonth} ${reviewYear}`}</div>
								</div>
							</div>
							<div className="my-4 whitespace-normal">
								{review.review}
							</div>
						</div>
					);
				})}
			</div>

			{reviews.length > 6 && (
				<div className="flex mb-4">
					<Button
						outline
						onClick={openAllReviewModal}
						className="w-full md:w-auto"
					>
						Show all {reviews.length} reviews
					</Button>
				</div>
			)}
			<ModalCentered ref={allReviewsRef}>
				<div className="flex items-center justify-between">
					<h2 className="flex">
						<StarIcon className="w-6" /> {avgRating} &#x2022;{" "}
						{reviews.length} reviews
					</h2>
					<div
						className="w-4 h-4 cursor-pointer"
						onClick={closeAllReviewModal}
					>
						<XIcon />
					</div>
				</div>
				<hr className="my-4" />
				<div className="flex flex-wrap">
					{reviews.map((review) => {
						const reviewer = owners.find(
							(owner) => owner._id === review.reviewerId
						);

						const reviewDate = new Date(review.reviewDate);
						const reviewMonth = monthArray[reviewDate.getMonth()];
						const reviewYear = reviewDate.getFullYear();

						return (
							<div key={review._id} className="w-full mb-4">
								<div className="flex items-center">
									{reviewer.picMedium ? (
										<div className="w-16 h-16 mr-4 relative">
											<Image
												src={reviewer.picMedium}
												layout="fill"
												objectFit="cover"
												className="rounded-full"
											/>
										</div>
									) : (
										<div className="h-16 w-16 mr-4 text-white bg-slate-600 rounded-full flex justify-center items-center">
											{reviewer.username
												.charAt(0)
												.toUpperCase()}
										</div>
									)}
									<div>
										<div className="text-lg">
											<strong>
												{reviewer.firstName}
											</strong>
										</div>
										<div className="text-base text-slate-400">{`${reviewMonth} ${reviewYear}`}</div>
									</div>
								</div>
								<div className="my-4">{review.review}</div>
							</div>
						);
					})}
				</div>
			</ModalCentered>
		</div>
	);
};

export default Reviews;
