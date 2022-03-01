vec3 grassColor = vec3(0.0, 0.0, 0.0);

vec3 fdx = vec3( dFdx( vViewPosition.x ), dFdx( vViewPosition.y ), dFdx( vViewPosition.z ) );
vec3 fdy = vec3( dFdy( vViewPosition.x ), dFdy( vViewPosition.y ), dFdy( vViewPosition.z ) );
vec3 normal = normalize( cross( fdx, fdy ) );

diffuseColor.xyz = mix(grassColor, diffuseColor.xyz, min(1.0, max(0.0, (abs(normal.z) + abs(normal.x)) * 2.0)));