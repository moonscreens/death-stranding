import * as THREE from 'three';

const group = new THREE.Group();

import generateMaterial from '../materials/strand';
const mat = generateMaterial();
const strandHeight = 100;
const geometry = new THREE.PlaneGeometry(1, strandHeight, 3, 60);
geometry.translate(0, strandHeight / 2, 0);

const vertices = geometry.getAttribute('position');
for (let i = 0; i < vertices.count; i++) {
	const vertex = new THREE.Vector3();
	vertex.fromBufferAttribute(vertices, i);
	vertex.x = vertex.x * Math.max(0.1, (vertex.y / strandHeight));
	vertices.setXYZ(i, vertex.x, vertex.y, vertex.z);
}


const strandCount = 20;
for (let index = -strandCount/2; index < strandCount/2; index++) {
	const mesh = new THREE.Mesh(geometry, mat);
	mesh.position.x = index * 15;
	mesh.position.y = 4 + Math.random() * 50;
	mesh.position.z = (Math.random() - 0.5) * 50;

	group.add(mesh);
}


export default group;