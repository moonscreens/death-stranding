


vWorldPosition = modelMatrix * vec4(transformed.xyz, 1.0);
transformed.y += getTerrainNoise(vWorldPosition.x, vWorldPosition.z);
vWorldPosition.y += transformed.y;
vNormal = normal;

isWater = getRiver(vWorldPosition.x, vWorldPosition.z, false);

if (isWater > 0.0) {
	transformed.y += snoise(vec3(vWorldPosition.x, vWorldPosition.z - u_time * 0.15, u_time * 0.15)) * 0.5 * pow(isWater, 2.0);
}
