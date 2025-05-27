#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform sampler2D uSampler3;
uniform float timeFactor;

void main() {
    vec2 distortedCoords = vTextureCoord;
    
    // Distortion for waves
    float distortionX = sin(vTextureCoord.x * 10.0 + timeFactor) * 0.01;
    float distortionY = cos(vTextureCoord.y * 8.0 + timeFactor * 0.8) * 0.01;
    
    distortedCoords.x += distortionX;
    distortedCoords.y += distortionY;
    
    vec4 bottomLayer = texture2D(uSampler, vTextureCoord);
    vec4 middleLayer = texture2D(uSampler2, vTextureCoord);
    vec4 topLayer = texture2D(uSampler3, distortedCoords);
    
    if (middleLayer.r < 0.5) {
        gl_FragColor = topLayer;
    } else {
        gl_FragColor = bottomLayer;
    }
}