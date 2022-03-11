import * as THREE from "three";
import { farDistance, scene, drawFunctions, camera } from "./scene";

import { palette } from "./palette";

import terrain from "./stuff/terrain";
import strands from "./stuff/strands";

scene.background = palette.fog;

scene.fog = new THREE.Fog(palette.fog, -farDistance * 0.1, farDistance);
//scene.fog = new THREE.FogExp2(palette.fog, 0.025);

scene.add(new THREE.AmbientLight(palette.black));

const light = new THREE.DirectionalLight(palette.white, 1);
light.color = light.color.clone().sub(palette.black);
light.position.set(0, 1, -0.5);
scene.add(light);

scene.add(strands);

const groundMeshes = [];
for (let index = 0; index < farDistance * 2; index += terrain.geometry.parameters.height) {
	const mesh = terrain.clone();
	mesh.position.z = index + camera.position.z;
	groundMeshes.push(mesh);
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
