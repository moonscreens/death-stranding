vec4 vWorldPosition = modelMatrix * vec4(position, 1.0) * 0.05;

transformed.x += snoise(vec3(vWorldPosition.x - u_time * 0.08, vWorldPosition.y, vWorldPosition.z * 5.0 + u_time * 0.04)) * 3.0;