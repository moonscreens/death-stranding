import * as THREE from 'three';

const group = new THREE.Group();

import generateMaterial from '../materials/strand';
const mat = generateMaterial();
const strandHeight = 120;
const geometry = new THREE.PlaneGeometry(0.5, strandHeight, 3, 60);
geometry.translate(0, strandHeight / 2, 0);

const vertices = geometry.getAttribute('position');
for (let i = 0; i < vertices.count; i++) {
	const vertex = new THREE.Vector3();
	vertex.fromBufferAttribute(vertices, i);
	vertex.x = vertex.x * Math.max(0, (vertex.y / strandHeight));
	vertices.setXYZ(i, vertex.x, vertex.y, vertex.z);
}


const strandCount = 10;
for (let index = -strandCount / 2; index < strandCount / 2; index++) {
	const mesh = new THREE.Mesh(geometry, mat);
	mesh.position.x = index * 20;
	mesh.position.y = 4 + Math.random() * 50;
	mesh.position.z = (Math.pow(Math.random(), 3) - 0.5) * 50;

	group.add(mesh);

	const cloneCount = Math.floor(Math.random() * 2) + 1;
	for (let i = 0; i < cloneCount; i++) {

		const clone = mesh.clone();
		clone.position.x += 0.1;
		clone.position.z -= 0.5 * i;
		group.add(clone);
	}
}


export default group;