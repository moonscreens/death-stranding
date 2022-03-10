import * as THREE from 'three';

import vert from './emote.vert';
import snoiseShader from './snoise.glsl';
import terrainShader from './terrain.glsl';

const initEmoteMaterial = (material) => {
	material.onBeforeCompile = function (shader) {
		shader.uniforms.u_time = { value: Math.random() * 1000 };
		const uniforms = shader.uniforms;
		let lastFrame = -1;
		const tick = () => {
			lastFrame = Date.now();
			if (uniforms) {
				uniforms.u_time.value = performance.now() / 1000;
			}
			window.requestAnimationFrame(tick);
		}
		tick();

		shader.vertexShader = shader.vertexShader.replace(
			'void main()',
			`
				varying vec4 vWorldPosition;
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
	};

	// Make sure WebGLRenderer doesn't reuse a single program
	material.customProgramCacheKey = function () {
		return parseInt(window.shaderPID++); // some random ish number
	};
};


export default initEmoteMaterial;