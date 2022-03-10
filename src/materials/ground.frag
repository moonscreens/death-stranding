vec3 fdx = vec3( dFdx( vWorldPosition.x ), dFdx( vWorldPosition.y ), dFdx( vWorldPosition.z ) );
vec3 fdy = vec3( dFdy( vWorldPosition.x ), dFdy( vWorldPosition.y ), dFdy( vWorldPosition.z ) );
vec3 normal = normalize( cross( fdx, fdy ) );
vec3 waterColor = vec3(0.0, 0.0, 0.0); // filled in by JS
vec3 grassColor = vec3(0.0, 0.0, 0.0); // filled in by JS

if (isWater > 0.0) {
	diffuseColor.xyz = mix(diffuseColor.xyz, waterColor, min(1.0, isWater));
	vec3 specularColor = vec3(1.0);
	diffuseColor.xyz = mix(diffuseColor.xyz, specularColor, max(0.0, min(1.0, normal.z  * 0.5)));
} else {
	diffuseColor.xyz = mix(grassColor, diffuseColor.xyz, min(1.0, max(0.0, (abs(normal.z) + abs(normal.x)) * 3.0)));
}