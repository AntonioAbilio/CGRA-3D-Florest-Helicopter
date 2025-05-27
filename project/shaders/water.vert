attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float timeFactor;
uniform sampler2D uSampler2;

varying vec2 vTextureCoord;

void main() {
    vTextureCoord = aTextureCoord;
    
    vec3 position = aVertexPosition;
    
    // Sample the map texture to determine if this is water
    vec4 mapColor = texture2D(uSampler2, aTextureCoord);

	vec2 lakeCenter = vec2(0.21, -0.1);

	float distanceToCenter = distance(vec2(position.x, position.y), lakeCenter);
    
    // If the red channel is below 0.5, it's water so we need to apply the height difference
    if (mapColor.r <= 0.5 && distanceToCenter <= 0.075) {
        position.z += sin(position.x * 0.5 + timeFactor) * 0.8 + cos(position.z * 0.4 + timeFactor * 0.7) * 0.8;
        position.x += sin(position.x * 0.5 + timeFactor) * 0.001 + cos(position.y * 0.4 + timeFactor * 0.7) * 0.001;
	}
    
    gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);
}