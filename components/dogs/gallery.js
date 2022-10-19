import React, { useCallback, useRef, useState } from "react";
import classNames from "classnames";
import { createPortal } from "react-dom";
import Image from "next/image";

import Button from "../ui/button";
import getBrowserWidth from "../../utils/getBrowserWidth";

import { HiChevronLeft } from "react-icons/hi";
import { HiChevronRight } from "react-icons/hi";
import { HiX } from "react-icons/hi";

const Gallery = ({ pictures }) => {
	const [currentImage, setCurrentImage] = useState(0);
	const [galleryIndex, setGalleryIndex] = useState(0);
	const [showLightbox, toggleLightbox] = useState(false);
	const { md } = getBrowserWidth();

	const observer = useRef([]);

	const pictureRef = useCallback((node) => {
		const index = node ? parseInt(node.getAttribute("index")) : 0;

		if (observer.current[index]) {
			observer.current[index].disconnect();
		}
		observer.current[index] = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setGalleryIndex(index + 1);
				}
			},
			{
				root: null,
				rootMargin: "0px",
				threshold: 0.5,
			}
		);
		if (node) {
			observer.current[index].observe(node);
		}
	}, []);

	const pictureWidth = () => {
		if (pictures.length === 1) {
			return "w-full";
		} else if (pictures.length === 2) {
			return "w-1/2";
		} else {
			return "w-1/3";
		}
	};

	const pictureClass = classNames(
		pictureWidth(),
		"relative border border-white"
	);

	const nextImage = () => {
		if (pictures.length !== currentImage + 1) {
			setCurrentImage(currentImage + 1);
		}
	};

	const previousImage = () => {
		if (currentImage !== 0) {
			setCurrentImage(currentImage - 1);
		}
	};

	const arrowClasses =
		"fixed top-0 bottom-0 flex items-center z-10 text-white hover:bg-slate-800 cursor-pointer";

	const nextArrowClass = classNames(
		currentImage + 1 === pictures.length && "disabled",
		arrowClasses,
		"right-0"
	);

	const prevArrowClass = classNames(
		currentImage === 0 && "disabled",
		arrowClasses,
		"left-0"
	);

	const Lightbox = () =>
		createPortal(
			<>
				<div
					className="fixed inset-0 bg-black opacity-90 z-10"
					onClick={() => {
						toggleLightbox(false);
						document.body.style.overflow = "auto";
					}}
				></div>
				<div className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 w-3/4 h-3/4">
					<Image
						src={pictures[currentImage]}
						layout="fill"
						objectFit="scale-down"
					/>
				</div>
				<div className={prevArrowClass} onClick={previousImage}>
					<HiChevronLeft className="w-16 px-2" />
				</div>
				<div className={nextArrowClass} onClick={nextImage}>
					<HiChevronRight className="w-16 px-2" />
				</div>
				<div
					className="fixed top-4 right-16 z-10 text-white hover:text-white cursor-pointer"
					onClick={() => {
						toggleLightbox(false);
						document.body.style.overflow = "auto";
					}}
				>
					<HiX className="w-8" />
				</div>
			</>,
			document.getElementById("modal-root")
		);

	if (md) {
		return (
			<>
				<div className="flex w-full h-96 my-4 relative rounded-xl overflow-hidden order-1 md:order-2">
					{pictures.map((picture, index) => {
						if (index <= 2) {
							return (
								<div
									className={pictureClass}
									key={`dogImage-${index}`}
								>
									<Image
										src={picture}
										layout="fill"
										objectFit="cover"
										className="cursor-pointer"
										onClick={() => {
											setCurrentImage(index);
											toggleLightbox(true);
											document.body.style.overflow =
												"hidden";
										}}
									/>
								</div>
							);
						}
					})}
					{pictures.length > 3 && (
						<div
							className="flex absolute bottom-4 right-4 text-sm cursor-pointer"
							onClick={() => {
								setCurrentImage(3);
								toggleLightbox(true);
								document.body.style.overflow = "hidden";
							}}
						>
							<Button outline>See more photos</Button>
						</div>
					)}
				</div>
				{showLightbox && <Lightbox />}
			</>
		);
	} else if (!md) {
		return (
			<div className="relative w-full h-72 sm:h-96">
				<div className="absolute -left-4 -right-4 sm:left-0 sm:right-0 h-72 sm:h-96 overflow-x-scroll overflow-y-hidden whitespace-nowrap snap-mandatory snap-x">
					{pictures.map((picture, index) => {
						return (
							<div
								className="relative w-full h-full inline-block snap-center"
								index={index}
								key={`dogImage-${index}`}
								ref={pictureRef}
							>
								<Image
									src={picture}
									layout="fill"
									objectFit="cover"
									className="cursor-pointer"
									onClick={() => {
										setCurrentImage(index);
										toggleLightbox(true);
										document.body.style.overflow = "hidden";
									}}
								/>
							</div>
						);
					})}
				</div>
				{pictures.length > 1 && (
					<div className="flex absolute right-0 bottom-2">
						<div className="bg-black/50 text-slate-200 text-sm p-1 rounded-md">
							{galleryIndex} of {pictures.length}
						</div>
					</div>
				)}
				{showLightbox && <Lightbox />}
			</div>
		);
	} else {
		return null;
	}
};

export default Gallery;
