#version 300 es
precision mediump float;

in vec2 vTexCoord;
out vec4 fragColor;

uniform sampler2D uTex0;
uniform sampler2D uTex1;
uniform sampler2D uTex2;
uniform vec4 uColor;
uniform int uTexSelector;

void main() {
    vec4 texColor;

    if (uTexSelector == 0) {
        texColor = texture(uTex0, vTexCoord);
    } else if (uTexSelector == 1) {
        texColor = texture(uTex1, vTexCoord);
    } else {
        texColor = texture(uTex2, vTexCoord);
    }

    fragColor = texColor * uColor;
}