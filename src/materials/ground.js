import * as THREE from 'three';
import { palette } from '../main';

import frag from './ground.frag';


let lastFrame = Date.now();
const tick = () => {
	const delta = (Date.now() - lastFrame) / 1000;
	lastFrame = Date.now();
	if (uniforms) {
		uniforms.u_time.value += delta;
	}
	window.requestAnimationFrame(tick);
}
let uniforms = null;

const material = new THREE.MeshLambertMaterial({
	color: 0x505168,
	side: THREE.FrontSide,
});
material.needsUpdate = true;
material.onBeforeCompile = function (shader) {
	shader.uniforms.u_time = { value: Math.random() * 1000 };
	uniforms = shader.uniforms;
	tick();

	material.userData.shader = shader;

	shader.vertexShader = shader.vertexShader.replace(
		'void main()',
		`
			varying vec4 vWorldPosition;
			varying vec3 vNormal;
			void main()
		`);
	shader.vertexShader = shader.vertexShader.replace(
		'#include <begin_vertex>',
		`
			#include <begin_vertex>
			vWorldPosition = modelMatrix * vec4(position, 1.0);

			vNormal = normal;
		`);

	let fragment = frag.replace(
		'vec3 grassColor = vec3(0.0, 0.0, 0.0);',
		`vec3 grassColor = vec3(${palette.grass.r}, ${palette.grass.g}, ${palette.grass.b});`);

	shader.fragmentShader = `
	varying vec4 vWorldPosition;
	varying vec3 vNormal;
	uniform float u_time;
	${shader.fragmentShader.replace('#include <map_fragment>', `
		#include <map_fragment>
		${fragment}
	`)}`;
};

// Make sure WebGLRenderer doesn't reuse a single program
material.customProgramCacheKey = function () {
	return parseInt(window.shaderPID++); // some random ish number
};


export default material