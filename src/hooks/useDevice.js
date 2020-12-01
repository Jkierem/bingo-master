import { useDebugValue } from "react";
import { EnumType } from 'jazzi'
import useWindowSize from "./useWindowSize";

/**
 * @typedef {("Mobile"|"Tablet"|"Laptop")} Device
 * @param {number} width
 * @returns {Device} Device
 * @description Based on the received width, returns the type of device
 */
export const getDevice = width => {
	if (width < 430) {
		return Devices.Mobile;
	} else if (width >= 431 && width < 1024) {
		return Devices.Tablet;
	} else {
		return Devices.Laptop;
	}
};

export const Devices = EnumType("Device",["Mobile","Tablet","Laptop"])

/**
 * @param {string} device
 * @returns {boolean} is string equal to Mobile
 * @description verifies if received string is equal to "Mobile"
 */
export const isMobile = device => Devices.Mobile === device;
/**
 * @param {string} device
 * @returns {boolean} is string equal to Tablet
 * @description verifies if received string is equal to "Tablet"
 */
export const isTablet = device => Devices.Tablet === device;
/**
 * @param {string} device
 * @returns {boolean} is string equal to Laptop
 * @description verifies if received string is equal to "Laptop"
 */
export const isLaptop = device => Devices.Laptop === device;

/**
 * @typedef {("Mobile"|"Tablet"|"Laptop")} Device
 * @returns {Device} Device
 * @description returns the device based on window size. Updates on window resize
 */
const useDevice = () => {
	const [width] = useWindowSize();
	const dev = getDevice(width);
	useDebugValue(dev);
	return dev;
};

export default useDevice;