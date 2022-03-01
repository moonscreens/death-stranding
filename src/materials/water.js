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

const material = new THREE.MeshPhongMaterial({
	color: 0x79AFE5,
	flatShading: true,
	specular: 0xFFFFFF,
	shininess: 70,
	transparent: true,
	opacity: 0.75,
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


export default material