import React, { forwardRef, useEffect, useState } from "react";
import classNames from "classnames";

const Button = ({ children, className, onClick, outline, solid, type }) => {
	const classes = classNames(
		className,
		solid && "bg-red-400 border-red-400 text-white",
		outline && "bg-white border-red-400",
		"border-2 rounded-lg px-4 py-2 "
	);
	return (
		<button className={classes} type={type} onClick={onClick}>
			{children}
		</button>
	);
};

export default Button;
