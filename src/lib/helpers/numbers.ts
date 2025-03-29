import { MathUtils } from 'three'

function toDecimals(value: number, decimals: number = 2): number {
	return parseFloat(value.toFixed(decimals))
}

function toInteger(value: number): number {
	return Math.round(value)
}

function percentageToRadians(percentage: number): number {
	const degrees = (percentage / 100) * 360
	return degrees * MathUtils.DEG2RAD
}

function radiansToPercentage(radians: number): number {
	const degrees = radians * MathUtils.RAD2DEG
	return (degrees / 360) * 100
}

function percentageToDegrees(percentage: number): number {
	percentage = percentage % 360
	if (percentage < 0) percentage += 360
	return (percentage * Math.PI) / 180
}

// 1 unit in the 3D space is 3 feet.
// sizeToScale(80) // would be 80% of 1 unit.
// 100% of 1 unit is 1 unit, which is 3 feet.
// 80% of 1 unit is 0.8 units, which is 2.4 feet.
// 42% of 1 unit is 0.42 units, which is 1.26 feet.
function sizeToScale(value: number): number {
	return value / 100
}

// unitToFeet(2.4) // would be 2.4 units, which is 7.2 feet.
// unitToFeet(0.42) // would be 0.42 units, which is 1.26 feet.
// unitToFeet(82) // would be 82 units, which is 246 feet.
function unitToFeet(units: number): number {
	return units * 3
}

function percentageToOpacity(percentage: number): number {
	return percentage / 100
}

function opacityToPercentage(opacity: number): number {
	return opacity * 100
}

function percentageToRange(percentage: number, min: number, max: number): number {
	return (percentage / 100) * (max - min) + min
}

function formatAsPercentage(value: number): string {
	return Math.round(value * 100) + '%'
}

function formatAsFeet(value: number): string {
	return value.toFixed(1) + ' ft'
}

export {
	percentageToRadians,
	radiansToPercentage,
	percentageToDegrees,
	sizeToScale,
	unitToFeet,
	percentageToOpacity,
	opacityToPercentage,
	percentageToRange,
	formatAsPercentage,
	formatAsFeet,
	toDecimals,
	toInteger
}
