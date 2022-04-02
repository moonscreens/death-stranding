import * as THREE from 'three';
import { drawFunctions, camera, farDistance } from '../scene';

const drops = new Array(0);

const rainGeometry = new THREE.PlaneBufferGeometry(0.05, 1);
const rainMaterial = new THREE.MeshBasicMaterial({
	color: 0x0066CC,
	transparent: true,
	opacity: 0.5,
	side: THREE.DoubleSide,
})
const RainGroup = new THREE.Group();
for (let index = 0; index < drops.length; index++) {
	drops[index] = new THREE.Mesh(rainGeometry, rainMaterial);
	RainGroup.add(drops[index]);
	drops[index].position.x = (Math.random() * 2 - 1) * farDistance * 2;
	drops[index].position.y = Math.random() * farDistance;
};

drawFunctions.push(delta => {
	for (let index = 0; index < drops.length; index++) {
		drops[index].position.y -= delta * 40;
		if (drops[index].position.y < 0) {
			drops[index].position.y = farDistance;
			drops[index].position.z = camera.position.z - farDistance * Math.random();
		}
	};
})


export default RainGroup;