import { CGFobject } from '../../lib/CGF.js';
/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {

        // Vertices are seen as if a person was standing on a place at y = +infinity and looking down
        this.vertices = [
            -0.5, -0.5, -0.5, // Bottom Plane - Top Left (0)
            -0.5, -0.5, 0.5,  // Bottom Plane - Bottom Left (1)
            0.5, -0.5, 0.5,   // Bottom Plane - Bottom Right (2)
            0.5, -0.5, -0.5,  // Bottom Plane - Top Right (3)

            -0.5, 0.5, -0.5,  // Top Plane - Top Left (4)
            -0.5, 0.5, 0.5,   // Top Plane - Bottom Left (5)
            0.5, 0.5, 0.5,    // Top Plane - Bottom Right (6)
            0.5, 0.5, -0.5,    // Top Plane - Top Right (7)

            -0.5, -0.5, -0.5, // EXTRA - Vertive in Bottom Plane - Top Left
            -0.5, -0.5, 0.5,  // EXTRA - Vertive in Bottom Plane - Bottom Left
            0.5, -0.5, 0.5,   // EXTRA - Vertive in Bottom Plane - Bottom Right
            0.5, -0.5, -0.5,  // EXTRA - Vertive in Bottom Plane - Top Right

            -0.5, -0.5, 0.5,  // EXTRA - Vertive in Bottom Plane - Bottom Left
            0.5, -0.5, 0.5,   // EXTRA - Vertive in Bottom Plane - Bottom Right
            0.5, 0.5, 0.5,    // EXTRA - Vertive in Top Plane - Bottom Right
            -0.5, 0.5, 0.5,   // EXTRA - Vertive in Top Plane - Bottom Left

            -0.5, -0.5, -0.5, // EXTRA - Vertive in Bottom Plane - Top Left
            0.5, -0.5, -0.5,  // EXTRA - Vertive in Bottom Plane - Top Right
            0.5, 0.5, -0.5,   // EXTRA - Vertive in Top Plane - Top Right
            -0.5, 0.5, -0.5,  // EXTRA - Vertive in Top Plane - Top Left

            0.5, 0.5, 0.5,    // EXTRA - Vertive in Top Plane - Bottom Right
            -0.5, 0.5, 0.5,   // EXTRA - Vertive in Top Plane - Bottom Left
            -0.5, 0.5, -0.5,  // EXTRA - Vertive in Top Plane - Top Left
            -0.5, 0.5, 0.5,   // EXTRA - Vertive in Top Plane - Bottom Left


        ];

        //Counter-clockwise reference of vertices
        this.indices = [

            // Bottom face of the cube
            0, 1, 2,
            2, 3, 0,
            2, 1, 0, // Draw the opposite face (Both sides)
            0, 3, 2,

            // Back face of the cube
            0, 3, 7,
            7, 4, 0,
            7, 3, 0, // Draw the opposite face (Both sides)
            0, 4, 7,

            // Left face of the cube
            // Counter-clockwise seen from x = +infinity
            0, 4, 5,
            5, 1, 0,
            5, 4, 0, // Draw the opposite face (Both sides)
            0, 1, 5,

            // Front face of the cube
            1, 2, 6,
            6, 5, 1,
            6, 2, 1, // Draw the opposite face (Both sides)
            1, 5, 6,

            // Right face of the cube
            2, 3, 7,
            7, 6, 2,
            7, 3, 2, // Draw the opposite face (Both sides)
            2, 6, 7,

            // Top face of the cube
            4, 5, 6,
            6, 7, 4,
            6, 5, 4, // Draw the opposite face (Both sides)
            4, 7, 6

        ];


        // Note: Normals are drawn starting at the extra corresponding vertex.
        this.normals = [
            0, -1, 0, // Bottom Face Normal
            0, -1, 0, // Bottom Face Normal
            0, -1, 0, // Bottom Face Normal
            0, -1, 0, // Bottom Face Normal

            0, 1, 0, // Top Face Normal
            0, 1, 0, // Top Face Normal
            0, 1, 0, // Top Face Normal
            0, 1, 0, // Top Face Normal

            -1, 0, 0, // Left Face Normal
            -1, 0, 0, // Left Face Normal
            1, 0, 0,  // Right Face Normal
            1, 0, 0,  // Right Face Normal

            0, 0, 1,  // Front Face Normal
            0, 0, 1,  // Front Face Normal
            0, 0, 1,  // Front Face Normal
            0, 0, 1,  // Front Face Normal

            0, 0, -1,  // Back Face Normal
            0, 0, -1,  // Back Face Normal
            0, 0, -1,  // Back Face Normal
            0, 0, -1,  // Back Face Normal

            1, 0, 0,  // Right Face Normal
            -1, 0, 0, // Left Face Normal
            -1, 0, 0,  // Left Face Normal
            1, 0, 0,  // Right Fave Normal
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

