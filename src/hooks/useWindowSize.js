import { useLayoutEffect, useState, useDebugValue } from "react";

/**
 * @returns {[ number , number ]} Window dimensions
 * @description returns the window dimensions and updates when window size is changed
 */
const useWindowSize = () => {
	const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
	useLayoutEffect(() => {
		const updateSize = () => {
			setSize([window.innerWidth, window.innerHeight]);
		};
		window.addEventListener("resize", updateSize);
		return () => window.removeEventListener("resize", updateSize);
	}, []);
	useDebugValue(size);
	return size;
};

export default useWindowSize;