attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform sampler2D uSampler3;  // Water height map
uniform float timeFactor;     // Animation speed
uniform float scaleFactor;    // Wave intensity

varying vec2 vTextureCoord;

void main() {

    vec2 waveMotion = vec2(timeFactor * 2., timeFactor * 2.) * 0.005;
    float height = texture2D(uSampler3, mod(aTextureCoord + waveMotion, 1.)).r;
    height = (height - 0.5) * scaleFactor * 0.05;

    vec3 displacedPosition = aVertexPosition + aVertexNormal * height;
    gl_Position = uPMatrix * uMVMatrix * vec4(displacedPosition, 1.0);

    vTextureCoord = aTextureCoord;
}