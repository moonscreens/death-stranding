import * as THREE from "three";
import { palette, farDistance, scene } from "./main";

import terrain from "./terrain";

setTimeout(() => {
	scene.background = palette.fog;

	scene.fog = new THREE.Fog(palette.fog, 0, farDistance);
	//scene.fog = new THREE.FogExp2(palette.fog, 0.025);

	scene.add(new THREE.AmbientLight(palette.black));

	const light = new THREE.DirectionalLight(palette.white, 1);
	light.color = light.color.clone().sub(palette.black);
	light.position.set(0, 1, 0);
	scene.add(light);

	scene.add(terrain);
}, 0)
