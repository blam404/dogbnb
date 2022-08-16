import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { StarIcon } from "@heroicons/react/solid";

import clientPromise from "../lib/mongodb";
import Footer from "../components/footer";
import Header from "../components/header";
import Loading from "../components/ui/loading";
import titleCase from "../utilityFunctions/titleCase";

export default function Home({ dogCount, reviews }) {
	const [dogList, setDogList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [pageNumber, setPageNumber] = useState(1);
	const [hasMore, setHasMore] = useState();

	const observer = useRef();
	const loadMoreRef = useCallback(
		(node) => {
			if (loading) {
				return;
			}
			if (observer.current) {
				observer.current.disconnect();
			}
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					setPageNumber(pageNumber + 1);
				}
			});
			if (node) {
				observer.current.observe(node);
			}
		},
		[loading, hasMore]
	);

	const itemsPerPage = 8;
	const totalPages = Math.ceil(dogCount / itemsPerPage);

	useEffect(() => {
		getDogs();
		setHasMore(pageNumber !== totalPages);
	}, [pageNumber]);

	const getDogs = async () => {
		setLoading(true);
		await fetch("/api/getDogs", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ pageNumber, itemsPerPage }),
		}).then(async (res) => {
			const { dogs } = await res.json();
			setDogList([...dogList, ...dogs]);
			setLoading(false);
		});
	};

	useEffect(() => {}, [pageNumber]);
	return (
		<>
			<Header position="fixed" />
			<div className="flex justify-center mt-24">
				<div className="container flex flex-wrap justify-center mb-12">
					{dogList.map((dog, index) => {
						const ratings = reviews
							.filter((review) => {
								if (review.dogId === dog._id) {
									return review;
								}
							})
							.map((review) => {
								return review.rating;
							});

						const avgRating =
							ratings &&
							ratings.length > 0 &&
							(ratings.reduce((a, b) => a + b) / ratings.length)
								.toFixed(2)
								.replace(/[.,]00$/, "");

						return (
							<div className="mx-4 my-6" key={`dogCard-${index}`}>
								<Link href={`/dogs/${dog._id}`}>
									<div className="cursor-pointer w-64">
										<div className="w-64 h-64 relative">
											<Image
												src={dog.pics[0]}
												layout="fill"
												objectFit="cover"
												className="rounded-3xl"
												priority={index <= 6}
											/>
										</div>
										<div className="pt-2">
											<div className="flex justify-between">
												<div>
													<strong>
														{titleCase(dog.name)}
													</strong>
												</div>
												{avgRating && (
													<div className="flex">
														<StarIcon className="w-6" />
														{avgRating}
													</div>
												)}
											</div>
											<div className="text-slate-400">
												<em>
													{dog.city}, {dog.state}{" "}
													{dog.country ===
													"United States"
														? ""
														: dog.country}
												</em>
											</div>
											<div>
												<strong>${dog.price}</strong>
												/night
											</div>
										</div>
									</div>
								</Link>
							</div>
						);
					})}
					<div
						ref={loadMoreRef}
						className="flex justify-center items-center mx-4 my-6 w-64 h-64"
					>
						{loading && <Loading size="64" />}
					</div>
				</div>
			</div>
			<Footer position="fixed" />
		</>
	);
}

export async function getStaticProps(context) {
	try {
		const client = await clientPromise;
		const db = await client.db("dogbnb");
		const dogCount = await db.collection("dogs").countDocuments();
		const reviews = await db.collection("dogReviews").find({}).toArray();
		const convertedReviews = JSON.parse(JSON.stringify(reviews));

		return {
			props: { dogCount, reviews: convertedReviews },
		};
	} catch (e) {
		console.error(e);
		return {
			props: { dogCount: null },
		};
	}
}
