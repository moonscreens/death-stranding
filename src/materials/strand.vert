vec4 vWorldPosition = modelMatrix * vec4(position, 1.0) * 0.05;

transformed.x += snoise(vec3(vWorldPosition.x, vWorldPosition.y + u_time * 0.08, vWorldPosition.z)) * 3.0;