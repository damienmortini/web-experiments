precision mediump float;

uniform float time;
uniform vec2 u_textureSize;
varying vec2 v_texCoord;

void main() {

	vec2 startPoints[3];
	startPoints[0] = vec2(100,150);
	startPoints[1] = vec2(200,25);
	startPoints[2] = vec2(580,350);

	float colors[3];
	colors[0] = 0.0;
	colors[1] = 0.0;
	colors[2] = 0.0;

	bool isChanged = false;

	vec2 pixelCoord = vec2(v_texCoord.x * u_textureSize.x, v_texCoord.y * u_textureSize.y);

	for (int i = 0; i < 3; i++) {
		float distance = sqrt(
			(startPoints[i].x - pixelCoord.x) * (startPoints[i].x - pixelCoord.x) +
			(startPoints[i].y - pixelCoord.y) * (startPoints[i].y - pixelCoord.y)
		);
		if (distance < time * max(u_textureSize.x, u_textureSize.y) * 2.0) {
			isChanged = true;
			colors[i] = 1.0 * (1.0 - (distance / (time * max(u_textureSize.x, u_textureSize.y) * 2.0)));
		}
	}

	float r = colors[0];
	float g = colors[1];
	float b = colors[2];
	float a = 1.0;

	mat4 baseMat4 = mat4(
			.5 + r, .5 - r, .5 - r, 0.0,
			.5 - g, .5 + g, .5 - g, 0.0,
			.5 - b, .5 - b, .5 + b, 0.0,
			0.0, 0.0, 0.0, 1.0
		);

	mat4 multMat4 = mat4(
			r, 0.0, 0.0, 0.0,
			0.0, g, 0.0, 0.0,
			0.0, 0.0, b, 0.0,
			0.0, 0.0, 0.0, 1.0
		);

	css_ColorMatrix = baseMat4;
	// css_ColorMatrix = multMat4;
}