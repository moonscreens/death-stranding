import SimplexNoise from 'simplex-noise';
import * as THREE from 'three';

const constantNoise = new SimplexNoise('abd');
const simplex = new SimplexNoise();
const size = 200;
const segments = 40;
const geometry = new THREE.PlaneGeometry(size, size, segments, segments);

geometry.rotateX(-Math.PI / 2);

const getNoise = (x, y) => {
	return (
		constantNoise.noise2D(x * 0.005, y * 0.005) * Math.max(0, Math.min(100, -y + 3))
		+
		simplex.noise2D(x * 0.1, y * 0.1) * 0.5
		+
		simplex.noise2D(x * 0.01, y * 0.01) * 1
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

import groundMaterial from './materials/ground';
const mesh = new THREE.Mesh(geometry, groundMaterial);
mesh.getNoise = getNoise;

setInterval(() => {
	mesh.rotation.y += 0.01;
}, 16);

export default mesh;