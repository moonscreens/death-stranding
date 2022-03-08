//scaled position of vertex
vec3 sPos = (modelMatrix * vec4(position, 1.0)).xyz * 0.05;

// smaller noise
float offset = 0.0;
float rotation = snoise(vec3(sPos.x - u_time * 0.08 + offset, sPos.y + offset, sPos.z * 30.0 + u_time * 0.04 + offset)) * PI * 0.5;
offset = 0.5;
float distance = snoise(vec3(sPos.x - u_time * 0.08 + offset, sPos.y + offset, sPos.z * 30.0 + u_time * 0.04 + offset)) * 2.0;

transformed.xy += vec2(cos(rotation) * distance, sin(rotation) * distance);

//larger noise
sPos *= 0.25;
offset = 10.0;
transformed.xyz += vec3(snoise(vec3(sPos.x - u_time * 0.02 + offset, sPos.y + offset, sPos.z + u_time * 0.015 + offset)) * 5.0, 0.0, 0.0);