#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;  // Water texture

void main() {
	
    vec4 color = texture2D(uSampler2, vTextureCoord);
    gl_FragColor = color;
}