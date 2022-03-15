import SimplexNoise from 'simplex-noise';
import * as THREE from 'three';

const constantNoise = new SimplexNoise('abd');
const simplex = new SimplexNoise();
const simplex2 = new SimplexNoise(9876);
const geometry = new THREE.PlaneGeometry(200, 10, Math.round(110 * 1.25), Math.round(4 * 1.25));
geometry.rotateX(-Math.PI / 2);
geometry.translate(0, 0, geometry.parameters.height / 2);

const difference = (a, b) => {
	return Math.abs(a - b);
}
const riverX = 20;
const riverDeep = 0.35;
const riverWidth = 15;
export const getNoise = (x, y) => {
	let riverDip = difference(x, riverX + Math.sin(y / riverWidth + 1) * riverWidth);
	let riverAmount = 1;
	if (riverDip > riverWidth) riverDip = 0;
	else {
		riverAmount -= riverDip / riverWidth;
		riverDip = riverWidth - riverDip;
		riverDip = riverDip * riverDeep;
	}

	return (
		(
			constantNoise.noise2D(x * 0.005, y * 0.005) * Math.max(0, Math.min(100, -y + 3))
			+
			simplex.noise2D(x * 0.1, y * 0.1) * 2 * (simplex2.noise2D(x * 0.01, y * 0.01) * 0.5 + 0.5)
			+
			(simplex.noise2D(x * 0.01, y * 0.01) + 1) * (1 - Math.pow(1 - riverAmount, 4))
		) - riverDip
	);
}

import groundMaterial from '../materials/ground';
const mesh = new THREE.Mesh(geometry, groundMaterial);
mesh.getNoise = getNoise;

export default mesh;