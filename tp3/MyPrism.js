import { CGFobject } from '../../lib/CGF.js';
/**
 * MyPrism
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyPrism extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        var ang = 0;

        // This variable will allow us do slice the circle.
        var alphaAng = 2 * Math.PI / this.slices;

        // We know that N0 (the normal that divides the angle in two of the same)
        // TODO: (See picture in README)
        var normalN0Angle = alphaAng / 2;

        for (var i = 0; i < this.slices; i++) {
            // All vertices have to be declared for a given face
            // even if they are shared with others, as the normals 
            // in each face will be different

            var sa = Math.sin(ang);
            var ca = Math.cos(ang);

            var saa = Math.sin(ang + alphaAng);
            var caa = Math.cos(ang + alphaAng);

            // Bottom Left
            this.vertices.push(ca, sa, 1)

            // Bottom Right
            this.vertices.push(ca, sa, 0)

            // Top Right
            this.vertices.push(caa, saa, 0)

            // Top Left
            this.vertices.push(caa, saa, 1)

            // Calculate the coordinates for x and y of the Normal Vector.
            var xCoords = Math.cos(normalN0Angle);
            var yCoords = Math.sin(normalN0Angle);


            // Creation of the normal vector.
            var normal = [
                xCoords,
                yCoords,
                0
            ];

            // Vector normalization.
            // This only ensures that we are dealing with normals that have unit size.
            var nsize = Math.sqrt(
                normal[0] * normal[0] +
                normal[1] * normal[1] +
                normal[2] * normal[2]
            );
            normal[0] /= nsize;
            normal[1] /= nsize;
            normal[2] /= nsize;

            // Push normal once for each vertex

            this.normals.push(...normal);
            this.normals.push(...normal);
            this.normals.push(...normal);
            this.normals.push(...normal);

            var indexOffset = 3 * i


            /* 
                i = 1

                (Expected indexes)
                    4, 5, 6,
                    6, 7, 4
                
                (Actual indexes)
                    1, 2, 3,
                    3, 4, 1
            */

            this.indices.push(indexOffset + i, indexOffset + i + 1, indexOffset + i + 2);
            this.indices.push(indexOffset + i + 2, indexOffset + i + 3, indexOffset + i);

            // Paints the inside.
            this.indices.push(indexOffset + i + 2, indexOffset + i + 1, indexOffset + i);
            this.indices.push(indexOffset + i, indexOffset + i + 3, indexOffset + i + 2);


            ang += alphaAng;
            normalN0Angle += alphaAng
        }

        console.log(this.vertices)

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
      * Called when user interacts with GUI to change object's complexity.
      * @param {integer} complexity - changes number of slices
      */
    updateBuffers(complexity) {
        this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}

