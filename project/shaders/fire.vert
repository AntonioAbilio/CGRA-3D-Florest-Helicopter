// fire.vert
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float uTime;

varying vec2 vTextureCoord;

void main(void) {
    float sway = 0.0;

    if (aVertexPosition.y > 0.0) {
        sway = 0.2 * sin(uTime * 5.0 + aVertexPosition.y * 10.0);
    }

    vec3 displacedPosition = aVertexPosition + vec3(sway, 0.0, sway);

    gl_Position = uPMatrix * uMVMatrix * vec4(displacedPosition, 1.0);
    vTextureCoord = aTextureCoord;
}