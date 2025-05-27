#version 300 es
precision mediump float;

in vec3 aVertexPosition;
in vec2 aTextureCoord;

out vec2 vTexCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTexCoord = aTextureCoord;
}