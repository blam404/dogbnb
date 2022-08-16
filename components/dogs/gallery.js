import React, { useState } from "react";
import classNames from "classnames";
import { createPortal } from "react-dom";
import Image from "next/image";

import Button from "../ui/button";

import { ChevronLeftIcon } from "@heroicons/react/solid";
import { ChevronRightIcon } from "@heroicons/react/solid";
import { XIcon } from "@heroicons/react/solid";

const Gallery = ({ pictures }) => {
	const [showLightbox, toggleLightbox] = useState(false);
	const [currentImage, setCurrentImage] = useState(0);

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

	const nextArrowClass = classNames(
		currentImage + 1 === pictures.length && "disabled",
		"fixed top-0 bottom-0 right-0 flex items-center z-10 text-white hover:bg-slate-800 cursor-pointer"
	);

	const prevArrowClass = classNames(
		currentImage === 0 && "disabled",
		"fixed top-0 bottom-0 left-0 flex items-center z-10 text-white hover:bg-slate-800 cursor-pointer"
	);

	return (
		<>
			<div className="flex h-96 my-4 relative rounded-xl overflow-hidden">
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
										setCurrentImage(0);
										toggleLightbox(true);
										document.body.style.overflow = "hidden";
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
			{showLightbox &&
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
							<ChevronLeftIcon className="w-16 px-2" />
						</div>
						<div className={nextArrowClass} onClick={nextImage}>
							<ChevronRightIcon className="w-16 px-2" />
						</div>
						<div
							className="fixed top-4 right-16 z-10 text-white hover:text-white cursor-pointer"
							onClick={() => {
								toggleLightbox(false);
								document.body.style.overflow = "auto";
							}}
						>
							<XIcon className="w-8" />
						</div>
					</>,
					document.getElementById("modal-root")
				)}
		</>
	);
};

export default Gallery;