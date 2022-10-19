import React, { useEffect, useState } from "react";

export default function getBrowserWidth() {
	const [width, setWidth] = useState();

	useEffect(() => {
		setWidth(window.innerWidth);
		const handleResize = () => {
			setWidth(window.innerWidth);
		};
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const smBreakPoint = 640;
	const mdBreakPoint = 768;
	const lgBreakPoint = 1024;
	const xlBreakPoint = 1280;
	const xxlBreakPoint = 1536;

	return {
		xs: width < smBreakPoint,
		sm: width >= smBreakPoint,
		md: width >= mdBreakPoint,
		lg: width >= lgBreakPoint,
		xl: width >= xlBreakPoint,
		xxl: width >= xxlBreakPoint,
	};
}
