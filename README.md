# 🎨 BWR 3D Works

## Where Rebellion Meets Precision

A premium React e-commerce application for luxury 3D printed objects, featuring custom WebGL PBR shaders, procedural geometry, smooth animations, and a complete purchase flow.

**Website Inspiration**: Apple & Tesla — Premium design, clean flows, smooth animations

### ✨ Key Features

- **Advanced WebGL Engine**
    - Full Cook-Torrance PBR (Physically Based Rendering) lighting model
    - Procedural 3D geometry generation (vase, sphere, torus, helical, ring shapes)
    - Custom vertex & fragment shaders with tone mapping
    - Efficient memory management with WebGL buffer optimization

- **Premium E-Commerce Flow**
    - Collection browsing with category filtering
    - Product quick-view modals
    - Interactive 3D product viewer with drag rotation
    - Shopping cart with local storage persistence
    - Complete checkout process (shipping → payment → confirmation)

- **Design System** (Inspired by Apple & Tesla)
    - Custom cursor with hover states
    - Smooth scroll reveals with staggered animations
    - Responsive navbar with frosted glass effect
    - Parametric typography using CSS clamp()
    - Luxury color palette (black, white, grays)

- **Performance Optimized**
    - Vite for fast build & HMR
    - Canvas2D particle grid animations
    - Lazy-loaded WebGL scenes
    - LocalStorage for cart persistence

---

## 🚀 Quick Start

### Option A: Vite + React (Recommended)

```bash
# Navigate to project
cd "f:\BWR 3D Works\New Demo"

# Install dependencies
npm install

# Start development server (opens at http://localhost:3000)
npm run dev

# Build for production
npm run build
```

### Option B: Using Claude Artifact

Copy `src/App.jsx` content directly into a Claude.ai artifact for instant preview.

---

## 📁 Project Structure

```
BWR 3D Works/
├── package.json          # Dependencies & scripts
├── vite.config.js        # Vite configuration
├── index.html            # HTML entry point
├── src/
│   ├── main.jsx          # React entry point
│   └── App.jsx           # Main application (all components in one file)
├── README.md             # This file
└── .gitignore            # Git ignore rules
```

---

## ⚙️ WebGL PBR Engine

### Shaders

**Vertex Shader**
Transforms positions and normals with MVP matrix. Passes world position to fragment for view-dependent lighting.

**Fragment Shader — Cook-Torrance BRDF**

```glsl
// Three point lights with configurable intensity
// Fresnel-Schlick approximation
// GGX/Trowbridge-Reitz NDF
// Smith-Schlick geometry term
// Tone mapping: Reinhard + gamma correction
// Ambient occlusion via normal Y-component
// Rim lighting based on bg mode (dark/light)
```

### Procedural Geometry Generators

| Geometry  | Algorithm                                | Vertices |
| --------- | ---------------------------------------- | -------- |
| `vase`    | Lathe/revolution with sinusoidal profile | ~6,561   |
| `torus`   | Parametric UV surface                    | ~3,321   |
| `helical` | Twisted lathe with spiral displacement   | ~6,565   |
| `sphere`  | Icosphere with 5 subdivision passes      | ~10,242  |
| `ring`    | Torus variant (0.55R, 0.18r)             | ~2,145   |

### Memory Management

- Each `WebGLScene` instance allocates VBO + NBO + IBO
- `destroy()` stops the RAF loop immediately
- React `useEffect` cleanup calls `destroy()` on unmount
- Index buffer uses `Uint16Array` or `Uint32Array` depending on vertex count (auto-detects `OES_element_index_uint` extension)

### Performance

- `Math.min(devicePixelRatio, 2)` caps canvas resolution
- `gl.CULL_FACE` eliminates back-face fragments
- `gl.DEPTH_TEST` with optimized clear
- `will-change: transform` on cursor elements
- Passive scroll/touch event listeners throughout
- 60fps RAF loops, self-terminating on unmount

---

## 🛍️ E-Commerce Flow

```
Home → Products Grid → Quick View Modal
                   ↓
              Product Detail → Add to Cart → Cart Sidebar → Checkout
                   ↑                                           ↓
              Related Items                          Order Confirmation
```

### Cart Persistence

Cart state is stored in `localStorage` under `bwr3d_cart` and rehydrated on mount. Order completion clears the cart.

### Checkout Steps

1. **Shipping Details** — name, email, address, city, zip, country
2. **Payment** — card number, name, expiry, CVV (UI only — connect your payment processor)
3. **Confirmation** — animated success state, auto-redirect to home

---

## 🎨 Design System

### Typography

- **Display**: `Cormorant Garamond` — elegant serif for headings/prices
- **Body**: `DM Sans` — geometric sans for UI text

### Color Palette

```css
--white: #ffffff --off-white: #f7f7f7 --near-white: #f0f0f0 --gray-100: #ebebeb --gray-200: #d6d6d6
	--gray-400: #888 --gray-800: #1a1a1a --black: #000000;
```

### Motion

All animations use `cubic-bezier(0.22, 1, 0.36, 1)` — the "ease-out" curve that gives Apple/Tesla's characteristic feel.

Key animations:

- `aUp` — hero text entrance (translateY + opacity)
- `slideUp` — product card entrance (staggered)
- `marquee` — infinite ticker scroll
- `scanLine` — hero scroll hint line sweep
- `pulse-dot` — live 3D indicator pulsing
- `float` — drag hint bobbing

### Scroll Reveal

`.reveal` class + IntersectionObserver pattern. Elements start invisible + translated 50px down, animate `in` when entering viewport with staggered delays (`.d1`, `.d2`, `.d3`, `.d4`).

---

## 🏷️ Sample Products

All 9 products have Sketchfab IDs embedded for future embed integration:

| #   | Product           | Category      | Price |
| --- | ----------------- | ------------- | ----- |
| 1   | Orbital Vase No.7 | Home          | $348  |
| 2   | Helical Tower     | Architectural | $520  |
| 3   | Void Sphere       | Home          | $289  |
| 4   | Lattice Cuff      | Wearables     | $195  |
| 5   | Arc Plinth        | Architectural | $720  |
| 6   | Moiré Pendant     | Wearables     | $168  |
| 7   | Fractal Bowl      | Home          | $312  |
| 8   | Column Series I   | Architectural | $890  |
| 9   | Mesh Ring         | Wearables     | $145  |

---

## 🔌 Payment Integration

Connect your payment processor by replacing the `handleOrder` function in `CheckoutPage`:

```js
// Stripe example
const handleOrder = async () => {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    body: JSON.stringify({ amount: total * 100, currency: 'usd' }),
  });
  const { clientSecret } = await response.json();
  // Use Stripe.js to confirm payment
  const result = await stripe.confirmCardPayment(clientSecret, { ... });
  if (result.error) { /* handle */ } else { setStep(3); }
};
```

---

## 📱 Responsive Breakpoints

| Breakpoint   | Changes                                                    |
| ------------ | ---------------------------------------------------------- |
| `> 1100px`   | Full 2-col featured, 3-col products, 4-col footer          |
| `768–1100px` | 1-col featured, 2-col products, 2-col footer               |
| `< 768px`    | 1-col everything, cursor disabled, hero 3D reduced opacity |

---

## 🛠️ Customization

### Add a new product

```js
// In the PRODUCTS array:
{
  id: 10,
  name: 'Your Product Name',
  cat: 'home', // home | architectural | wearables
  price: 299,
  desc: 'Product description.',
  badge: 'New', // or ''
  geom: 'vase', // vase | torus | helical | sphere | ring
  sketchfabId: 'your-sketchfab-id',
  specs: [['Material', 'PETG Matte'], ['Resolution', '0.05mm']]
}
```

### Change the 3D geometry color

```js
// In GLCanvas opts:
opts={{ geom: 'sphere', color: [0.9, 0.85, 0.8], bg: 0.97 }}
// color = [R, G, B] in 0–1 range
// bg = background brightness (0=black, 1=white)
```

### Add a new geometry

```js
// In WebGLScene class, add a method:
mkCustom() {
  const v = [], n = [], idx = [];
  // ... generate vertices, normals, indices
  return this.build(v, n, idx);
}
// Then add to geomFns:
const geomFns = { ..., custom: () => this.mkCustom() };
```

---

## 📄 License

BWR 3D Works — All rights reserved.  
Design system and WebGL engine may be adapted for commercial use.
