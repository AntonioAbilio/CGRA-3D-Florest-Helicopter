#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main() {

	vec4 color = texture2D(uSampler, vTextureCoord);

	vec4 colorSepia = color;
	colorSepia.r = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
	colorSepia.g = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
	colorSepia.b = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;

	gl_FragColor = colorSepia;
}