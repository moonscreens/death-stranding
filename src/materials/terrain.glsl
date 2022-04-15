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
float riverWiggle = 60.0;
float cameraFlattenDistance = 80.0;

float getRiver(float x, float y, float width) {
	float riverIntensity = 1.0 - difference(x, riverX + snoise(vec3(0.0, y, 0.0) * 0.005) * riverWiggle) / (riverWidth * width);
	riverIntensity = max(min(riverIntensity, 1.0), 0.0);
	riverIntensity = 1.0 - pow(1.0 - riverIntensity, 3.0);
	return riverIntensity;
}

float getTerrainNoise(float x, float y) {
	float riverIntensity = getRiver(x, y, 1.0);
	return (// mountains
	(noise1(x * 0.0014, y * 0.0014) * 20.0 * (1.0 - getRiver(x, y, 7.0))) * min(abs(x / cameraFlattenDistance), 1.0) +
		((noise1(x * 0.01, y * 0.01)) * 15.0 * max(0.0, min(1.0, pow((difference(x, 0.0) / 30.0), 2.0)))) * (1.0 - getRiver(x, y, 4.0)) +
			// usual ground noise
		noise2(x * 0.1, y * 0.1) * 2.0 * (noise3(x * 0.01, y * 0.01) * 0.5 + 0.5) +
			// finer ground noise
		(noise2(x * 0.01, y * 0.01)))
		// apply river noise
	* (1.0 - pow(riverIntensity, 2.0)) + (riverIntensity * snoise(vec3(x, y, u_time * 0.5)) * .0);
}