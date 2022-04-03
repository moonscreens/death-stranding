import * as THREE from 'three';
import { drawFunctions, camera, farDistance } from '../scene';

const count = 7500;
const maxY = farDistance * 0.25;

const rainGeometry = new THREE.BoxBufferGeometry(0.03, 0.2, 0.03);
const rainMaterial = new THREE.MeshBasicMaterial({
	color: 0x0066CC,
	transparent: true,
	opacity: 0.5,
});

const RainMesh = new THREE.InstancedMesh(rainGeometry, rainMaterial, count);
RainMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

const dummyMatrix = new THREE.Matrix4();
const dummy = new THREE.Object3D();


for (let index = 0; index < count; index++) {
	dummy.position.x = (Math.random() * 2 - 1) * farDistance * 2;
	dummy.position.y = (Math.random() * 2 - 1) * maxY;
	dummy.updateMatrix();
	RainMesh.setMatrixAt(index, dummy.matrix);
};

drawFunctions.push(delta => {
	for (let index = 0; index < count; index++) {
		RainMesh.getMatrixAt(index, dummyMatrix)
		dummy.position.setFromMatrixPosition(dummyMatrix);

		dummy.position.y -= delta * 40;

		if (dummy.position.y < 0) {
			dummy.position.y += maxY;
			dummy.position.z = (camera.position.z - farDistance * 0.1) - (farDistance * Math.random());
		}
		dummy.updateMatrix();
		RainMesh.setMatrixAt(index, dummy.matrix);
	};
	RainMesh.instanceMatrix.needsUpdate = true;

	RainMesh.getMatrixAt(0, dummyMatrix)
	dummy.applyMatrix4(dummyMatrix);
	dummy.updateMatrix();
});


export default RainMesh;