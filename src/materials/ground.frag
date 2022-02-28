vec3 grassColor = vec3(0.0, 0.0, 0.0);

diffuseColor.xyz = mix(grassColor, diffuseColor.xyz, min(1.0, max(0.0, (abs(vNormal.z) + abs(vNormal.x)) * 5.0)));