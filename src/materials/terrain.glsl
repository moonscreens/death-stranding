float noise1(float x, float y) {
	return snoise(vec3(x, y, 0.0)) * 0.5 + 0.5;
}
float noise2(float x, float y) {
	return snoise(vec3(x, y, 100.0)) * 0.5 + 0.5;
}
float noise3(float x, float y) {
	return snoise(vec3(x, y, -100.0)) * 0.5 + 0.5;
}

float difference(float a, float b) {
	return abs(a - b);
}

float riverX = 5.0;
float riverWidth = 10.0;
float riverBedWidth = 40.0;
float riverWiggle = 30.0;

float getRiver(float x, float y, bool isBed) {
	float width = isBed ? riverBedWidth : riverWidth * (snoise(vec3(x, y, 0.0) * 0.05) * 0.5 + 0.5);
	float riverIntensity = 1.0 - difference(x, riverX + snoise(vec3(0.0, y, 0.0) * 0.005) * riverWiggle) / width;
	riverIntensity = max(min(riverIntensity, 1.0), 0.0);
	riverIntensity = 1.0 - pow(1.0 - riverIntensity, 3.0);
	return riverIntensity;
}

float getTerrainNoise(float x, float y) {
	float bedIntensity = getRiver(x, y, true);
	float riverIntensity = getRiver(x, y, false);
	return (// mountains
	((noise1(x * 0.01, y * 0.01)) * 15.0 * max(0.0, min(1.0, pow((difference(x, 0.0) / 30.0), 2.0)))) * (1.0 - bedIntensity) +
			// usual ground noise
		noise2(x * 0.1, y * 0.1) * 2.0 * (noise3(x * 0.01, y * 0.01) * 0.5 + 0.5) +
			// finer ground noise
		(noise2(x * 0.01, y * 0.01)))
		// apply river noise
	* (1.0 - pow(riverIntensity, 2.0)) + (riverIntensity * snoise(vec3(x, y, u_time * 0.5)) * .0);
}