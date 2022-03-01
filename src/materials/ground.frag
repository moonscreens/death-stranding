vec3 grassColor = vec3(0.0, 0.0, 0.0);

vec3 fdx = vec3( dFdx( vWorldPosition.x ), dFdx( vWorldPosition.y ), dFdx( vWorldPosition.z ) );
vec3 fdy = vec3( dFdy( vWorldPosition.x ), dFdy( vWorldPosition.y ), dFdy( vWorldPosition.z ) );
vec3 normal = normalize( cross( fdx, fdy ) );

diffuseColor.xyz = mix(grassColor, diffuseColor.xyz, min(1.0, max(0.0, (abs(normal.z) + abs(normal.x)) * 3.0)));