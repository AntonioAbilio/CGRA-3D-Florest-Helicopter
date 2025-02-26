import { CGFobject } from '../lib/CGF.js';
/**
 * MyParallelogram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyParallelogram extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            0, 0, 0, // Bottom Left
            2, 0, 0, // Bottom Right
            3, 1, 0, // Top Right
            1, 1, 0, // Top Left
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2, // Front side (bottom triangle) (Counter-clockwise 0->1->2)
            2, 1, 0, // Back side (bottom triangle)
            2, 3, 0, // Front side (top triangle) (Counter-clockwise 2->3->0)
            0, 3, 2, // Back side (top triangle)
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

