attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform sampler2D uSamplerWaterMap;
uniform float timeFactor;
uniform float normScale;

void main() {
	vTextureCoord = aTextureCoord;

	vec2 waveMotion = vec2(timeFactor,timeFactor) * 0.005;
	float height = texture2D(uSamplerWaterMap, mod(aTextureCoord + waveMotion, 1.0)).r;
	height = (height - 0.5) * (normScale*0.005);

	vec3 newVertexPosition = aVertexPosition + aVertexNormal * height;

	gl_Position = uPMatrix * uMVMatrix * vec4(newVertexPosition, 1.0);
	
}

