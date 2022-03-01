import * as THREE from 'three';
import vert from './water.vert';
import snoise from './snoise.glsl';


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
const generateMaterial = (options, depthOnly = false) => {
	const matToUse = depthOnly ? THREE.MeshDepthMaterial : THREE.MeshPhongMaterial;
	const material = new matToUse({
		...options,
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
		uniform float u_time;
		${snoise}
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
	material.customProgramCacheKey = function () {
		return parseInt(window.shaderPID++); // some random ish number
	};
	return material;
}


export default generateMaterial