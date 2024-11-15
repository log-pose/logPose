export function generateNames(): string {
	const adjectives = [
		"Brave", "Calm", "Delightful", "Eager", "Faithful",
		"Gentle", "Happy", "Jolly", "Kind", "Lively",
		"Mighty", "Noble", "Proud", "Quiet", "Radiant"
	];
	const nouns = [
		"Mountain", "River", "Forest", "Ocean", "Eagle",
		"Phoenix", "Lion", "Star", "Sun", "Moon",
		"Wolf", "Bear", "Falcon", "Tiger", "Storm"
	];
	const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
	const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
	return `${randomAdjective} ${randomNoun}`;
}