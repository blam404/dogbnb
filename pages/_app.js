import React from "react";

import "../styles/global.scss";

import Store from "../components/store";

export default function MyApp({ Component, pageProps }) {
	return (
		<Store>
			<Component {...pageProps} />
			<div id="modal-root" />
		</Store>
	);
}
