// =====================================================
// PRICING CALCULATOR for Custom Studio Prints
// =====================================================

export const MATERIALS = {
	'PETG Matte': {
		price: 0.15,
		density: 1.27,
		name: 'PETG Matte',
		desc: 'Durable & matte finish',
	},
	'PETG Glossy': {
		price: 0.18,
		density: 1.27,
		name: 'PETG Glossy',
		desc: 'Durable & glossy finish',
	},
	'PLA+': { price: 0.12, density: 1.24, name: 'PLA+', desc: 'Eco-friendly standard' },
	'Carbon Fiber': { price: 0.45, density: 1.6, name: 'Carbon Fiber', desc: 'Premium strength' },
	'TPU Flexible': {
		price: 0.28,
		density: 1.21,
		name: 'TPU Flexible',
		desc: 'Flexible & durable',
	},
	'Nylon PA12': { price: 0.35, density: 1.14, name: 'Nylon PA12', desc: 'Industrial grade' },
};

export const SLICING_PACKAGES = {
	standard: {
		label: 'Standard (0.2mm)',
		time_mult: 1,
		cost: 25,
		desc: 'Default quality, standard speed',
	},
	precision: {
		label: 'Precision (0.1mm)',
		time_mult: 1.5,
		cost: 45,
		desc: 'Higher detail, more time',
	},
	'high-precision': {
		label: 'High Precision (0.05mm)',
		time_mult: 2.2,
		cost: 75,
		desc: 'Maximum detail & accuracy',
	},
};

export const DELIVERY_OPTIONS = {
	express: { label: 'Express (1-2 days)', days: 2, cost: 50 },
	fast: { label: 'Fast (3-5 days)', days: 4, cost: 25 },
	standard: { label: 'Standard (5-7 days)', days: 6, cost: 0 },
};

export const FINISHING_OPTIONS = {
	basic: { label: 'Basic (None)', cost: 0 },
	sanded: { label: 'Sanded', cost: 30 },
	polished: { label: 'Hand-Polished', cost: 60 },
	painted: { label: 'Painted Custom', cost: 90 },
};

// Calculate print time based on volume (in cm³) and layer height
export const calculatePrintTime = (volumeCm3, layerHeight = 0.2) => {
	// Base print speed: ~5 cm³ per hour
	const baseTime = volumeCm3 / 5;
	// Adjust for layer height (smaller layers = longer print)
	const timeMultiplier = 0.2 / layerHeight;
	const hours = baseTime * timeMultiplier;
	return Math.max(2, Math.round(hours * 10) / 10); // Min 2 hours
};

// Calculate material weight based on volume and material density
export const calculateWeight = (volumeCm3, materialKey) => {
	const material = MATERIALS[materialKey];
	const grams = volumeCm3 * material.density;
	return Math.round(grams * 10) / 10;
};

// Main pricing calculation
export const calculatePrice = (params) => {
	const {
		volumeCm3,
		material = 'PETG Matte',
		slicing = 'standard',
		delivery = 'standard',
		finishing = 'basic',
	} = params;

	if (!volumeCm3 || volumeCm3 < 0.1) {
		return { error: 'Invalid model volume' };
	}

	const mat = MATERIALS[material];
	const slic = SLICING_PACKAGES[slicing];
	const deliv = DELIVERY_OPTIONS[delivery];
	const fin = FINISHING_OPTIONS[finishing];

	// Calculate weight and material cost
	const weight = calculateWeight(volumeCm3, material);
	const materialCost = weight * mat.price;

	// Calculate print time (in hours)
	const layerHeight = slicing === 'precision' ? 0.1 : slicing === 'high-precision' ? 0.05 : 0.2;
	const printHours = calculatePrintTime(volumeCm3, layerHeight);

	// Machine cost: $3 per hour
	const machineCost = printHours * 3;

	// Base labor cost: $5 per print
	const laborCost = 5;

	// Breakdown
	const subtotal = materialCost + machineCost + slic.cost + laborCost + fin.cost;

	// Add profit margin (35%)
	const withMargin = subtotal * 1.35;

	// Delivery & finishing
	const deliveryCost = deliv.cost;

	// Grand total
	const total = withMargin + deliveryCost;

	return {
		materialCost: Math.round(materialCost * 100) / 100,
		machineCost: Math.round(machineCost * 100) / 100,
		laborCost,
		slicingCost: slic.cost,
		finishingCost: fin.cost,
		deliveryCost,
		subtotal: Math.round(subtotal * 100) / 100,
		withMargin: Math.round(withMargin * 100) / 100,
		total: Math.round(total * 100) / 100,
		weight,
		printHours: Math.round(printHours * 10) / 10,
		totalDays: printHours / 8 + deliv.days, // Estimate delivery days
		breakdown: {
			weight: `${weight}g`,
			printTime: `${printHours}h`,
			material,
			slicing: slic.label,
			delivery: deliv.label,
			finishing: fin.label,
		},
	};
};
