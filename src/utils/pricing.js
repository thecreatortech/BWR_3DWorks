// =====================================================
// PRICING CALCULATOR for Custom Studio Prints (INR ₹)
// =====================================================

export const MATERIALS = {
	'PETG Matte': { price: 12, density: 1.27, name: 'PETG Matte', desc: 'Durable & matte finish' },
	'PETG Glossy': { price: 15, density: 1.27, name: 'PETG Glossy', desc: 'Durable & glossy finish' },
	'PLA+': { price: 10, density: 1.24, name: 'PLA+', desc: 'Eco-friendly standard' },
	'Carbon Fiber': { price: 38, density: 1.6, name: 'Carbon Fiber', desc: 'Premium strength' },
	'TPU Flexible': { price: 23, density: 1.21, name: 'TPU Flexible', desc: 'Flexible & durable' },
	'Nylon PA12': { price: 30, density: 1.14, name: 'Nylon PA12', desc: 'Industrial grade' },
};

export const SLICING_PACKAGES = {
	standard: { label: 'Standard (0.2mm)', time_mult: 1, cost: 200, desc: 'Default quality, standard speed' },
	precision: { label: 'Precision (0.1mm)', time_mult: 1.5, cost: 400, desc: 'Higher detail, more time' },
	'high-precision': { label: 'High Precision (0.05mm)', time_mult: 2.2, cost: 650, desc: 'Maximum detail & accuracy' },
};

export const DELIVERY_OPTIONS = {
	express: { label: 'Express (1-2 days)', days: 2, cost: 500 },
	fast: { label: 'Fast (3-5 days)', days: 4, cost: 200 },
	standard: { label: 'Standard (5-7 days)', days: 6, cost: 0 },
};

export const FINISHING_OPTIONS = {
	basic: { label: 'Basic (None)', cost: 0 },
	sanded: { label: 'Sanded', cost: 250 },
	polished: { label: 'Hand-Polished', cost: 500 },
	painted: { label: 'Painted Custom', cost: 750 },
};

// Calculate print time based on volume (in cm³) and layer height
export const calculatePrintTime = (volumeCm3, layerHeight = 0.2) => {
	const baseTime = volumeCm3 / 5;
	const timeMultiplier = 0.2 / layerHeight;
	const hours = baseTime * timeMultiplier;
	return Math.max(2, Math.round(hours * 10) / 10);
};

// Calculate material weight based on volume and material density
export const calculateWeight = (volumeCm3, materialKey) => {
	const material = MATERIALS[materialKey];
	const grams = volumeCm3 * material.density;
	return Math.round(grams * 10) / 10;
};

// Main pricing calculation (all in ₹)
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

	const weight = calculateWeight(volumeCm3, material);
	const materialCost = weight * mat.price;

	const layerHeight = slicing === 'precision' ? 0.1 : slicing === 'high-precision' ? 0.05 : 0.2;
	const printHours = calculatePrintTime(volumeCm3, layerHeight);

	// Machine cost: ₹250 per hour
	const machineCost = printHours * 250;

	// Base labor cost: ₹400 per print
	const laborCost = 400;

	const subtotal = materialCost + machineCost + slic.cost + laborCost + fin.cost;

	// Add profit margin (35%)
	const withMargin = subtotal * 1.35;

	const deliveryCost = deliv.cost;
	const total = withMargin + deliveryCost;

	return {
		materialCost: Math.round(materialCost),
		machineCost: Math.round(machineCost),
		laborCost,
		slicingCost: slic.cost,
		finishingCost: fin.cost,
		deliveryCost,
		subtotal: Math.round(subtotal),
		withMargin: Math.round(withMargin),
		total: Math.round(total),
		weight,
		printHours: Math.round(printHours * 10) / 10,
		totalDays: printHours / 8 + deliv.days,
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

/**
 * Format price in Indian Rupees
 */
export const formatINR = (amount) => `₹${Math.round(amount).toLocaleString('en-IN')}`;
