vec3 grassColor = vec3(0.0, 0.0, 0.0);

diffuseColor.xyz = mix(grassColor, diffuseColor.xyz, (abs(vNormal.z) + abs(vNormal.x)) * 5.0);