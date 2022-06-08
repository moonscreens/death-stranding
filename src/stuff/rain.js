import * as THREE from 'three';
import { drawFunctions, camera, farDistance } from '../scene';

const count = 1000;
const maxY = farDistance * 0.25;

const rainGeometry = new THREE.IcosahedronBufferGeometry(0.015, 1);
rainGeometry.scale(2, 20, 2);
const rainMaterial = new THREE.MeshBasicMaterial({
	color: 0x7794D8,
});

const RainMesh = new THREE.InstancedMesh(rainGeometry, rainMaterial, count);
RainMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

const dummyMatrix = new THREE.Matrix4();
const dummy = new THREE.Object3D();

function getX() {
	return (Math.random() * 2 - 1) * farDistance;
}
function getZ() {
	return (camera.position.z - farDistance * 0.075) - (farDistance * 1.25 * Math.random());
}

for (let index = 0; index < count; index++) {
	dummy.position.x = getX();
	dummy.position.y = (Math.random()) * maxY;
	dummy.position.z = getZ();
	dummy.updateMatrix();
	RainMesh.setMatrixAt(index, dummy.matrix);
};

drawFunctions.push(delta => {
	for (let index = 0; index < count; index++) {
		RainMesh.getMatrixAt(index, dummyMatrix)
		dummy.position.setFromMatrixPosition(dummyMatrix);

		dummy.position.y -= delta * 35;

		if (dummy.position.y < 0) {
			dummy.position.x = getX();
			dummy.position.y += maxY;
			dummy.position.z = getZ();
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