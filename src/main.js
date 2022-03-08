import * as THREE from 'three';
import TwitchChat from 'twitch-chat-emotes-threejs';
import Stats from 'stats-js';

import { scene, camera, renderer, farDistance, drawFunctions } from './scene';
import './main.css';
import './environment';

window.shaderPID = 100000;

/*
** connect to twitch chat
*/

// a default array of twitch channels to join
let channels = ['antimattertape'];

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

function lerp(a, b, t) {
	return (1 - t) * a + t * b;
}
let lastFrame = performance.now();
function draw() {
	if (stats) stats.begin();
	requestAnimationFrame(draw);
	const delta = Math.min(1, Math.max(0, (performance.now() - lastFrame) / 1000));
	lastFrame = performance.now();


	const d = Date.now();
	for (let index = sceneEmoteArray.length - 1; index >= 0; index--) {
		const element = sceneEmoteArray[index];
		if (element.timestamp + element.lifespan < d) {
			element.dead = true;
			sceneEmoteArray.splice(index, 1);
			scene.remove(element);
		} else if (!element.idle) {
			element.position.x += (element.targetDirection.x) * delta * 2;
			element.position.z += (element.targetDirection.z) * delta * 2;
			element.position.y = lerp(element.position.y, getNoise(element.position.x, element.position.z) + 0.5, 0.1);
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
import { getNoise } from './stuff/terrain';
const sceneEmoteArray = [];
ChatInstance.listen((emotes) => {
	const group = new THREE.Group();
	group.lifespan = 20000;
	group.timestamp = Date.now();

	group.targetPosition = new THREE.Vector3(0, 0, 0);
	group.idle = true;

	let i = 0;
	emotes.forEach((emote) => {
		const sprite = new THREE.Sprite(emote.material);
		sprite.position.x = i;
		group.add(sprite);
		i++;
	})

	group.position.set(rand(75), 0, rand(50));
	group.position.y = getNoise(group.position.x, group.position.z) + 0.5;
	group.scale.setScalar(1);

	think(group);

	scene.add(group);
	sceneEmoteArray.push(group);
});

function think(emote) {
	if (emote.dead) return;
	if (!emote.idle) {
		emote.idle = true;
		setTimeout(think, Math.random() * 5000, emote);
		return;
	}

	if (emote.idle) {
		emote.idle = false;
		emote.targetPosition.x = rand(75);
		emote.targetPosition.z = rand(50);

		emote.targetDirection = new THREE.Vector3().subVectors(emote.targetPosition, emote.position);
		emote.targetDirection.normalize();

		setTimeout(think, Math.random() * 15000, emote);
		return
	}
}