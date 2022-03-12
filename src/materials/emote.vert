vWorldPosition = modelMatrix * vec4(transformed.xyz, 1.0);
transformed.y += getTerrainNoise(vWorldPosition.x, vWorldPosition.z);
vWorldPosition.y += transformed.y;

if(vWorldPosition.y < 0.0) {
	transformed.y += snoise(vec3(vWorldPosition.x, vWorldPosition.z, u_time * 0.25)) - 1.0;
}
transformed.y -= 10.0;