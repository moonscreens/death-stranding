


vec4 vWorldPosition = modelMatrix * vec4(transformed.xyz, 1.0);
float worldScale = 0.01;
transformed.y -= snoise(vec3(vWorldPosition.x * worldScale, vWorldPosition.z * worldScale, vWorldPosition.y * 0.02)) * 20.0;