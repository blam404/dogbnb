import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import classNames from "classnames";

// position (top, right, bottom left) has be passed as className since tailwind cannot do dynamic classes

const DropdownWrapper = forwardRef(({ children, className }, ref) => {
	const [opacity, setOpacity] = useState(0);
	const [showMenu, setShowMenu] = useState(false);
	const dropdownRef = useRef();

	useImperativeHandle(ref, () => {
		return {
			openMenu: () => openMenu(),
			closeMenu: () => closeMenu(),
		};
	});

	useEffect(() => {
		if (showMenu) {
			setOpacity(1);
		}
	}, [showMenu]);

	const openMenu = () => {
		setShowMenu(true);
	};
	const closeMenu = () => {
		setOpacity(0);
		setTimeout(() => {
			setShowMenu(false);
		}, 500);
	};

	const handleClickOutsideProfile = (event) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.parentNode.parentNode.contains(event.target)
		) {
			closeMenu();
		}
	};

	useEffect(() => {
		if (showMenu) {
			document.addEventListener("click", handleClickOutsideProfile);
			return () => {
				document.removeEventListener(
					"click",
					handleClickOutsideProfile
				);
			};
		}
	}, [showMenu]);

	const wrapperClass = classNames(
		"absolute w-max transition-all duration-250",
		className
	);

	return showMenu ? (
		<div
			className={wrapperClass}
			onClick={closeMenu}
			ref={dropdownRef}
			style={{ opacity: opacity }}
		>
			<div className="dropdown-wrapper border bg-white shadow-md rounded-md">
				<ul className="list-none">{children}</ul>
			</div>
		</div>
	) : (
		<></>
	);
});

export default DropdownWrapper;
