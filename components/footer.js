import React from "react";

const Footer = ({ position }) => {
	return (
		<footer
			className={`${position} bottom-0 w-full h-8 shadow-md flex justify-center items-center border-t border-slate-200 bg-white z-10`}
		>
			<div className="text-sm text-slate-400">
				&copy; Copyright 2022 DogBnB
			</div>
		</footer>
	);
};

export default Footer;
