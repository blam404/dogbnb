import React, { forwardRef, useImperativeHandle, useState } from "react";
import { createPortal } from "react-dom";

const ModalCentered = forwardRef(({ children }, ref) => {
	const [showModal, setShowModal] = useState(false);

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

	const openModal = () => {
		setShowModal(true);
		document.body.style.overflow = "hidden";
	};

	const closeModal = () => {
		setShowModal(false);
		document.body.style.overflow = "auto";
	};

	if (showModal) {
		return createPortal(
			<>
				<div
					className="fixed inset-0 bg-black opacity-70 z-10"
					onClick={closeModal}
				></div>
				<div
					className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white z-10 rounded-lg p-6 overflow-y-auto"
					style={{ maxHeight: "75%" }}
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
