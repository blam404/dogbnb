import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";
import { createPortal } from "react-dom";

const ModalCentered = forwardRef(({ children }, ref) => {
	const [showModal, setShowModal] = useState(false);
	const [opacity, setOpacity] = useState(0);

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
		}
	}, [showModal]);

	const openModal = () => {
		setShowModal(true);
		document.body.style.overflow = "hidden";
	};

	const closeModal = () => {
		setOpacity(0);
		setTimeout(() => {
			setShowModal(false);
		}, 300);
		document.body.style.overflow = "auto";
	};

	if (showModal) {
		return createPortal(
			<>
				<div
					className="fixed inset-0 bg-black/75 z-10 transition-all duration-250"
					style={{
						opacity: opacity,
					}}
					onClick={closeModal}
				></div>
				<div
					className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white z-10 rounded-lg p-6 overflow-y-auto transition-all duration-250"
					style={{ maxHeight: "75%", opacity: opacity }}
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
