import * as THREE from 'three';

const group = new THREE.Group();

import generateMaterial from '../materials/strand';
const mat = generateMaterial();
const strandHeight = 120;
const geometry = new THREE.PlaneGeometry(0.5, strandHeight, 3, 128);
geometry.translate(0, strandHeight / 2, 0);

const vertices = geometry.getAttribute('position');
for (let i = 0; i < vertices.count; i++) {
	const vertex = new THREE.Vector3();
	vertex.fromBufferAttribute(vertices, i);
	vertex.x = vertex.x * Math.max(0, (vertex.y / strandHeight));
	vertices.setXYZ(i, vertex.x, vertex.y, vertex.z);
}


const strandCount = 8;
const standoutIndex = 1;
for (let index = -strandCount / 2; index < strandCount / 2; index++) {
	const mesh = new THREE.Mesh(geometry, mat);
	mesh.position.x = index * 25;
	mesh.position.y = 4 + Math.random() * 50;
	mesh.position.z = (Math.pow(Math.random(), 3) - 0.5) * 30;

	if (index === standoutIndex) {
		mesh.position.z = 15;
		mesh.position.y = 4;
	}

	group.add(mesh);

	const cloneCount = index === standoutIndex ? 3 : Math.floor(Math.random() * 2) + 2;
	for (let i = 0; i < cloneCount; i++) {

		const clone = mesh.clone();
		clone.position.x += 0.2 * Math.random();
		clone.position.z -= 0.1 * i;
		group.add(clone);
	}
}


export default group;