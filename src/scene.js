import * as THREE from "three";

/*
** Initiate ThreejS scene
*/

export const farDistance = 200;

export const camera = new THREE.PerspectiveCamera(
	70,
	window.innerWidth / window.innerHeight,
	0.1,
	farDistance,
);
camera.rotation.x = Math.PI * 0.1;
camera.position.y = 5;
camera.position.z = Math.random() * 10000;

export const scene = new THREE.Scene();
export const renderer = new THREE.WebGLRenderer({ antialias: true });

export const drawFunctions = [];