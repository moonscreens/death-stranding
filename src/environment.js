import * as THREE from "three";
import { farDistance, scene, drawFunctions, camera } from "./scene";

import { palette } from "./palette";

import terrain from "./stuff/terrain";
import strands from "./stuff/strands";
import cloudMaterial from "./materials/cloud";
import RainMesh from './stuff/rain';

scene.background = palette.fog;

scene.fog = new THREE.Fog(palette.fog, -farDistance * 0.05, farDistance);
//scene.fog = new THREE.FogExp2(palette.fog, 0.025);

scene.add(new THREE.AmbientLight(palette.black));

const light = new THREE.DirectionalLight(palette.white, 1);
light.color = light.color.clone().sub(palette.black);
light.position.set(0, 1, -0.5);
scene.add(light);

scene.add(strands);
scene.add(RainMesh);

const groundMeshes = [];
const cloudGeometry = new THREE.PlaneBufferGeometry(
	terrain.geometry.parameters.width * 1.5,
	terrain.geometry.parameters.height,
	Math.round(terrain.geometry.parameters.widthSegments / 5),
	Math.max(2, Math.round(terrain.geometry.parameters.heightSegments / 2))
);
cloudGeometry.rotateX(-Math.PI / 2);
cloudGeometry.translate(0, 0, cloudGeometry.parameters.height / 2);

for (let index = 0; index < farDistance * 2; index += terrain.geometry.parameters.height) {
	const mesh = terrain.clone();
	mesh.position.z = index + camera.position.z;
	groundMeshes.push(mesh);

	for (let index = 0; index < 10; index++) {
		const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
		cloudMesh.position.y = 35 + index * 0.5;
		mesh.add(cloudMesh);
	}

	scene.add(mesh);
}
drawFunctions.push((delta) => {
	for (let index = 0; index < groundMeshes.length; index++) {
		const element = groundMeshes[index];
		while (element.position.z > camera.position.z) {
			element.position.z -= farDistance * 2;
		}
	}

	for (let index = 0; index < strands.children.length; index++) {
		const element = strands.children[index];
		while (element.position.z > camera.position.z) {
			element.position.z -= farDistance;
			element.position.y = Math.random() * 50;
			element.position.x = (Math.random() * 2 - 1) * 100;
		}
	}
})
