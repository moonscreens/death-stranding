import * as THREE from "three";
import TwitchChat from "twitch-chat-emotes-threejs";
import Stats from "stats-js";

import { scene, camera, renderer, farDistance, drawFunctions } from "./scene";
import "./main.css";
import './environment'

window.shaderPID = 100000;

/*
** connect to twitch chat
*/

// a default array of twitch channels to join
let channels = ['moonmoon'];

// the following few lines of code will allow you to add ?channels=channel1,channel2,channel3 to the URL in order to override the default array of channels
const query_vars = {};
const query_parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
	query_vars[key] = value;
});

if (query_vars.channels) {
	channels = query_vars.channels.split(',');
}

let stats = false;
if (query_vars.stats) {
	stats = new Stats();
	stats.showPanel(1);
	document.body.appendChild(stats.dom);
}

const ChatInstance = new TwitchChat({
	THREE,

	// If using planes, consider using MeshBasicMaterial instead of SpriteMaterial
	materialType: THREE.SpriteMaterial,

	// Passed to material options
	materialOptions: {
		transparent: true,
	},

	channels,
	maximumEmoteLimit: 3,
})

/*
** Initiate ThreejS scene
*/
renderer.setSize(window.innerWidth, window.innerHeight);

function resize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('DOMContentLoaded', () => {
	window.addEventListener('resize', resize);
	if (stats) document.body.appendChild(stats.dom);
	document.body.appendChild(renderer.domElement);
	resize();
	draw();
})

/*
** Draw loop
*/
let lastFrame = performance.now();
function draw() {
	if (stats) stats.begin();
	requestAnimationFrame(draw);
	const delta = Math.min(1, Math.max(0, (performance.now() - lastFrame) / 1000));
	lastFrame = performance.now();


	for (let index = sceneEmoteArray.length - 1; index >= 0; index--) {
		const element = sceneEmoteArray[index];
		element.position.addScaledVector(element.velocity, delta);
		if (element.position.z > camera.position.z) {
			sceneEmoteArray.splice(index, 1);
			scene.remove(element);
		}
	}

	renderer.render(scene, camera);
	if (stats) stats.end();
};


function rand(scale) {
	return (Math.random() - 0.5) * scale * 2;
}

/*
** Handle Twitch Chat Emotes
*/
const sceneEmoteArray = [];
ChatInstance.listen((emotes) => {
	const group = new THREE.Group();
	group.lifespan = 30000;
	group.timestamp = Date.now();

	let i = 0;
	emotes.forEach((emote) => {
		const sprite = new THREE.Sprite(emote.material);
		sprite.position.x = i;
		group.add(sprite);
		i++;
	})

	group.position.set(0 + rand(10), 10 + rand(10), camera.position.z - farDistance);

	// Set velocity to a random normalized value
	group.velocity = new THREE.Vector3(
		(Math.random() - 0.5),
		(Math.random() - 0.5),
		10,
	);
	group.scale.setScalar(1);

	scene.add(group);
	sceneEmoteArray.push(group);
});