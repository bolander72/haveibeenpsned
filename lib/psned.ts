export const isSuspiciousOutput = (value: number): boolean => {
	// Flag outputs < 546 sats (dust) or very small amounts likely used in attacks
	return value > 0 && value < 1000;
};

export const getSimilarityScore = (a: string, b: string): number => {
	// Normalize addresses by removing common prefixes
	const normalizeAddress = (addr: string): string => {
		if (addr.startsWith("bc1p") || addr.startsWith("bc1q")) {
			return addr.slice(4);
		}
		if (addr.startsWith("bc1")) {
			return addr.slice(3);
		}
		return addr;
	};

	const normalizedA = normalizeAddress(a);
	const normalizedB = normalizeAddress(b);

	// Find the longest common substring
	let maxLength = 0;
	let currentLength = 0;

	// Check for sequential matches from the start
	for (let i = 0; i < Math.min(normalizedA.length, normalizedB.length); i++) {
		if (normalizedA[i] === normalizedB[i]) {
			currentLength++;
			maxLength = Math.max(maxLength, currentLength);
		} else {
			currentLength = 0;
		}
	}

	// Check for sequential matches from the end
	currentLength = 0;
	for (let i = 1; i <= Math.min(normalizedA.length, normalizedB.length); i++) {
		if (
			normalizedA[normalizedA.length - i] ===
			normalizedB[normalizedB.length - i]
		) {
			currentLength++;
			maxLength = Math.max(maxLength, currentLength);
		} else {
			currentLength = 0;
		}
	}

	// Return the ratio of the longest sequential match to the maximum length
	return maxLength / Math.max(normalizedA.length, normalizedB.length);
};

export const highlightMatchingChars = (
	target: string,
	address: string,
): string => {
	// Normalize addresses by removing common prefixes
	const result: string[] = [];
	const prefix = target.slice(0, target.length - address.length);

	// Add the prefix (bc1, bc1q, etc.)
	result.push(prefix);

	// Compare normalized addresses character by character
	for (let i = 0; i < Math.max(address.length, target.length); i++) {
		const targetChar = target[i];
		const addressChar = address[i];

		if (targetChar && addressChar && targetChar === addressChar) {
			result.push(`<b>${targetChar}</b>`);
		} else if (targetChar) {
			result.push(targetChar);
		}
	}

	return result.join("");
};
