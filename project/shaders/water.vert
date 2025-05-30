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

    if (distanceToCenter <= 0.075) {
        // The really dark parts should have a very big oscilation
        if (mapColor.r <= 0.2) {
            position.z += sin(position.z + timeFactor * 2.0);
            gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);
            return;
        } 

        if (mapColor.r <= 0.5) {
            position.z += cos(position.z + timeFactor * 3.0);
            gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);
            return;
        } 

        if (mapColor.r <= 0.9) {
            position.z += sin(position.z * 0.5 + timeFactor) * 0.8 + cos(position.z * 0.4 + timeFactor * 0.7) * 0.8;
            gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);
            return;
        } 
    }
    
    gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);
}