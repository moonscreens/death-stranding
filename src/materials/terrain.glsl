float noise1 (float x, float y) {
	return snoise(vec3(x, y, 0.0));
}
float noise2 (float x, float y) {
	return snoise(vec3(x, y, 100.0));
}
float noise3 (float x, float y) {
	return snoise(vec3(x, y, -100.0));
}

float difference (float a, float b) {
	return abs(a - b);
}

float riverX = 20.0;
float riverDeep = 0.35;
float riverWidth = 15.0;

float getTerrainNoise (float x, float y) {

	float riverDip = difference(x, riverX + sin(y / riverWidth + 1.0) * riverWidth);
	float riverAmount = 1.0;
	if (riverDip > riverWidth) riverDip = 0.0;
	else {
		riverAmount -= riverDip / riverWidth;
		riverDip = riverWidth - riverDip;
		riverDip = riverDip * riverDeep;
	}

	return (
		(
			// mountains
			((noise1(x * 0.01, y * 0.01) + 1.0) * pow((difference(x, 0.0) / 20.0), 2.0))
			+
			// usual ground noise
			noise2(x * 0.1, y * 0.1) * 2.0 * (noise3(x * 0.01, y * 0.01) * 0.5 + 0.5)
			+
			// finer ground noise
			(noise2(x * 0.01, y * 0.01) + 1.0)
		) - riverDip
	);
}