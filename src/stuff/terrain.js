import SimplexNoise from 'simplex-noise';
import * as THREE from 'three';
import { palette } from '../palette';

const constantNoise = new SimplexNoise('abd');
const simplex = new SimplexNoise();
const simplex2 = new SimplexNoise(9876);
const size = 200;
const segments = 60;
const geometry = new THREE.PlaneGeometry(size, size, segments, segments);

geometry.rotateX(-Math.PI / 2);

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

const vertices = geometry.getAttribute('position');
for (let i = 0; i < vertices.count; i++) {
	const vertex = new THREE.Vector3();
	vertex.fromBufferAttribute(vertices, i);
	vertex.y = getNoise(vertex.x, vertex.z);
	vertices.setXYZ(i, vertex.x, vertex.y, vertex.z);
}

geometry.computeVertexNormals();
geometry.normalizeNormals();

import groundMaterial from '../materials/ground';
const mesh = new THREE.Mesh(geometry, groundMaterial);
mesh.getNoise = getNoise;

import waterMaterial from '../materials/water';
const waterWidth = 70;
const waterSegments = 50;
const waterGeometry = new THREE.PlaneGeometry(waterWidth, size, waterSegments, (size / waterWidth) * waterSegments);
waterGeometry.rotateX(-Math.PI / 2);
const water = new THREE.Mesh(waterGeometry, waterMaterial({
	color: palette.water,
	flatShading: true,
	specular: 0xFFFFFF,
	shininess: 70,
	transparent: true,
	opacity: 0.75,
}));
water.position.y = -2.25;
water.position.x = riverX * 1.5;
mesh.add(water);

water.customDepthMaterial = waterMaterial({
	depthPacking: THREE.RGBADepthPacking,
}, true);

export default mesh;