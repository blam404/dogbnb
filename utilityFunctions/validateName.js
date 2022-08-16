export const validateUsername = (username) => {
	return (
		username.length >= 4 &&
		username.length < 12 &&
		username.match(/^[A-Za-z0-9]*$/g)
	);
};

export const validateName = (name) => {
	return name.match(/^[A-Za-z]*$/g) && name.length > 0;
};
