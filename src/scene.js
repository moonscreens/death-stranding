import * as THREE from "three";
import { palette, farDistance, scene, renderer } from "./main";

import terrain from "./stuff/terrain";
import strands from "./stuff/strands";

setTimeout(() => {
	scene.background = palette.fog;

	scene.fog = new THREE.Fog(palette.fog, 0, farDistance);
	//scene.fog = new THREE.FogExp2(palette.fog, 0.025);

	scene.add(new THREE.AmbientLight(palette.black));

	const light = new THREE.DirectionalLight(palette.white, 1);
	light.color = light.color.clone().sub(palette.black);
	light.position.set(0, 1, -0.5);
	scene.add(light);

	scene.add(terrain);
	scene.add(strands);

	const backPlane = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(farDistance * 2, farDistance * 2),
		new THREE.MeshBasicMaterial({
			color: palette.fog,
		})
	);
	backPlane.position.z = -farDistance;
	scene.add(backPlane);

	const generator = new THREE.PMREMGenerator(renderer);
	scene.environment = generator.fromScene(scene).texture;
}, 0)
