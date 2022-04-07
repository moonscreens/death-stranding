import * as THREE from 'three';
import { palette } from '../palette';

import vert from './cloud.vert';

import snoiseShader from './snoise.glsl';


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

const cloudMaterial = new THREE.MeshBasicMaterial({
	color: palette.cloud,
	side: THREE.BackSide,
	transparent: true,
	opacity: 0.125,
});
cloudMaterial.needsUpdate = true;
cloudMaterial.onBeforeCompile = function (shader) {
	shader.uniforms.u_time = { value: Math.random() * 1000 };
	uniforms = shader.uniforms;
	tick();

	cloudMaterial.userData.shader = shader;

	shader.vertexShader = shader.vertexShader.replace(
		'void main()',
		`
			uniform float u_time;
			${snoiseShader}
			void main()
		`);
	shader.vertexShader = shader.vertexShader.replace(
		'#include <begin_vertex>',
		`
		#include <begin_vertex>
		${vert}
	`);
};

// Make sure WebGLRenderer doesn't reuse a single program
cloudMaterial.customProgramCacheKey = function () {
	return parseInt(window.shaderPID++); // some random ish number
};


export default cloudMaterial