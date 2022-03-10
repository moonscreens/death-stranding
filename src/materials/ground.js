import * as THREE from 'three';
import { palette } from '../palette';

import frag from './ground.frag';
import vert from './ground.vert';

import snoiseShader from './snoise.glsl';
import terrainShader from './terrain.glsl';


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
			varying float isWater;
			uniform float u_time;
			${snoiseShader}
			${terrainShader}
			void main()
		`);
	shader.vertexShader = shader.vertexShader.replace(
		'#include <begin_vertex>',
		`
			#include <begin_vertex>
		`);
	shader.vertexShader = shader.vertexShader.replace(
		'#include <begin_vertex>',
		`
		#include <begin_vertex>
		${vert}
	`);

	let fragment = frag.replace(
		'vec3 grassColor = vec3(0.0, 0.0, 0.0);',
		`vec3 grassColor = vec3(${palette.grass.r}, ${palette.grass.g}, ${palette.grass.b});`);
	fragment = fragment.replace(
		'vec3 waterColor = vec3(0.0, 0.0, 0.0);',
		`vec3 waterColor = vec3(${palette.water.r}, ${palette.water.g}, ${palette.water.b});`);

	shader.fragmentShader = `
	varying float isWater;
	varying vec4 vWorldPosition;
	varying vec3 vNormal;
	uniform float u_time;
	${shader.fragmentShader.replace('#include <color_fragment>', `
		#include <color_fragment>
		${fragment}
	`)}`;
};

// Make sure WebGLRenderer doesn't reuse a single program
material.customProgramCacheKey = function () {
	return parseInt(window.shaderPID++); // some random ish number
};


export default material