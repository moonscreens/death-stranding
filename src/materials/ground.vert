


vWorldPosition = modelMatrix * vec4(transformed.xyz, 1.0);
transformed.y += getTerrainNoise(vWorldPosition.x, vWorldPosition.z);
vWorldPosition.y += transformed.y;
vNormal = normal;

float offset = vWorldPosition.y;
if (vWorldPosition.y < 0.0) {
	isWater = -vWorldPosition.y;
	if (vWorldPosition.y < 0.0) {
		offset = snoise(vec3(vWorldPosition.x, vWorldPosition.z, u_time * 0.25)) - 1.0;
	} else {
		offset = 0.0;
	}
} else {
	isWater = 0.0;
}
transformed.y = offset;
vWorldPosition.y += offset;
