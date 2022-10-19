import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";
import { createPortal } from "react-dom";

import getBrowserWidth from "../../utils/getBrowserWidth";

const ModalCentered = forwardRef(({ children }, ref) => {
	const [showModal, setShowModal] = useState(false);
	const [opacity, setOpacity] = useState(0);
	const [translate, setTranslate] = useState("translateY(0)");
	const { md } = getBrowserWidth();

	useImperativeHandle(
		ref,
		() => {
			return {
				openModal: () => openModal(),
				closeModal: () => closeModal(),
			};
		},
		[]
	);

	useEffect(() => {
		if (showModal) {
			setOpacity(1);
			setTranslate("translateY(-100%)");
		}
	}, [showModal]);

	const openModal = () => {
		setShowModal(true);
		document.body.style.overflow = "hidden";
	};

	const closeModal = () => {
		setOpacity(0);
		setTranslate("translateY(0)");
		setTimeout(() => {
			setShowModal(false);
		}, 300);
		document.body.style.overflow = "auto";
	};

	if (showModal) {
		return createPortal(
			<>
				{md && (
					<div
						className="fixed inset-0 bg-black/75 z-10 transition-all duration-250"
						style={{
							opacity: opacity,
						}}
						onClick={closeModal}
					></div>
				)}
				<div
					className="fixed h-full md:h-fit top-full bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 bg-white z-10 md:rounded-lg p-6 overflow-y-auto transition-all duration-250"
					style={{
						maxHeight: md && "75%",
						opacity: md && opacity,
						transform: !md && translate,
					}}
				>
					{children}
				</div>
			</>,
			document.getElementById("modal-root")
		);
	} else {
		return null;
	}
});

export default ModalCentered;
