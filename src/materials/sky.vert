


vec4 vWorldPosition = modelMatrix * vec4(transformed.xyz, 1.0);
float worldScale = 0.005;
transformed.y -= snoise(vec3(
	vWorldPosition.x * worldScale, 
	vWorldPosition.z * worldScale * 10.0, 
	vWorldPosition.y * worldScale * 0.5
)) * 20.0;