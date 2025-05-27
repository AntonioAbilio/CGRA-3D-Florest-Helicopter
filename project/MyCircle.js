import { CGFobject } from '../lib/CGF.js';
/**
* MyCone
* @constructor
 * @param scene - Reference to MyScene object
 * @param slices - number of divisions around the Y axis
 * @param stacks - number of divisions along the Y axis
*/
export class MyCircle extends CGFobject {
    constructor(scene) {
        super(scene);
        this.slices = 20;
        this.stacks = 20;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var ang = 0;
        var alphaAng = 2 * Math.PI / this.slices;

        for (var i = 0; i < this.slices; i++) {

            this.vertices.push(Math.cos(ang), 0, -Math.sin(ang));
            this.indices.push(i, (i + 1) % this.slices, this.slices);
            this.indices.push(this.slices, (i + 1) % this.slices, i);
            this.normals.push(0, -1, 0);

            // Texture coordinates for edge vertices
            // Map from circle position to texture space
            this.texCoords.push(0.5 + 0.5 * Math.cos(ang), 0.5 - 0.5 * Math.sin(ang));

            ang += alphaAng;
        }
        this.vertices.push(0, 0, 0);
        this.normals.push(0, -1, 0);

        // Texture coordinate for center (0.5, 0.5)
        this.texCoords.push(0.5, 0.5);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}