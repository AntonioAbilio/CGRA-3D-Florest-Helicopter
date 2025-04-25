import { CGFobject } from '../../lib/CGF.js';
/**
 * MyTrunk
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTrunk extends CGFobject {
    constructor(scene, slices, stacks, trunk_radius) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.trunk_radius = trunk_radius;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        let ang = 0;

        // This variable will allow us do slice the circle.
        let alphaAng = 2 * Math.PI / this.slices;

        // TODO: implement stacks...
        let numberOfVertexes = this.stacks;

        // We're using the trigonometric circle to calculate the point where a vertex should be.
        // We know that coordinates can be defined using cos and sin where x = cos(angle) and y = sin(angle)
        let i = 0;
        for (; i < this.slices; i++) {

            let sa = Math.sin(ang) * this.trunk_radius;
            let ca = Math.cos(ang) * this.trunk_radius;

            // Creation of the normal vector.
            let normal = [ca, sa, 0];

            // Vector normalization.
            // This only ensures that we are dealing with normals that have unit size.
            let nsize = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
            normal[0] /= nsize;
            normal[1] /= nsize;
            normal[2] /= nsize;

            // Bottom Left
            this.vertices.push(ca, sa, 1)
            this.normals.push(...normal);

            let incrementForZAxis = 1 / (this.stacks)
            for (let j = 0; j < this.stacks; j++) {

                this.vertices.push(ca, sa, incrementForZAxis);

                // Push normal once for each vertex
                this.normals.push(...normal);

                incrementForZAxis += 1 / (this.stacks)
            }

            // Bottom Right
            this.vertices.push(ca, sa, 0)
            this.normals.push(...normal);

            // This is an example... (This example only considers 3 faces and 1 stack)
            // We want 3 faces
            // Total of 6 vertices.

            // When can we build a single square ?

            // i = 0, 2 vertices => (We kinda need 4 vertices to build a square...) Don't add vertices in the first iteration.

            // i = 1, 4 vertices
            // We would be constructing using the following vertexes (counting in the drawing):
            // 0, 1, 2, 3
            // But we are only at
            // bottomLeft  = i - 1 ===> 0 (needed to be 0)
            // bottomRight = i     ===> 1 (needed to be 1)
            // topLeft     = i + 1 ===> 2 (needed to be 2)
            // topRight    = i + 2 ===> 3 (needed to be 3)
            //
            // So we need to add an indexOffset: (3 - 3 = 0)


            // i = 2, 6 vertices
            // We would be constructing using the following vertexes (counting in the drawing):
            // 2, 3, 4, 5
            // But we are only at
            // bottomLeft  = i - 1 ===> 1 (needed to be 2)
            // bottomRight = i     ===> 2 (needed to be 3)
            // topLeft     = i + 1 ===> 3 (needed to be 4)
            // topRight    = i + 2 ===> 4 (needed to be 5)
            //
            // So we need to add an indexOffset: (5 - 4 = 1)

            // i = 3, 8 vertices
            // We would be constructing using the following vertexes (counting in the drawing):
            // 4, 5, 6, 7
            // But we are only at
            // bottomLeft  = i - 1 ===> 2 (needed to be 4)
            // bottomRight = i     ===> 3 (needed to be 5)
            // topLeft     = i + 1 ===> 4 (needed to be 6)
            // topRight    = i + 2 ===> 5 (needed to be 7)
            //
            // So we need to add an indexOffset: (7 - 5 = 2)

            // i = 4, 10 vertices
            // We would be constructing using the following vertexes (counting in the drawing):
            // 6, 7, 8, 9
            // But we are only at
            // bottomLeft  = i - 1 ===> 3 (needed to be 6)
            // bottomRight = i     ===> 4 (needed to be 7)
            // topLeft     = i + 1 ===> 5 (needed to be 8)
            // topRight    = i + 2 ===> 6 (needed to be 9)
            //
            // So we need to add an indexOffset: (9 - 6 = 3)

            // From an iteration to another we see that the index offset is +1 => indexOffset = i - 1

            if (i != 0) {

                let indexOffset = (numberOfVertexes * i) + i - 1;

                let bottomLeft = indexOffset + i - 1
                let bottomRight = indexOffset + i
                let topLeft = numberOfVertexes + indexOffset + i + 1
                let topRight = numberOfVertexes + indexOffset + i + 2

                this.indices.push(bottomLeft, bottomRight, topRight);
                this.indices.push(topRight, topLeft, bottomLeft);
                this.indices.push(topRight, bottomRight, bottomLeft);
                this.indices.push(bottomLeft, topLeft, topRight);
            }

            ang += alphaAng;
        }

        // For loop increments i first and only after checks the condition to determine whether to loop or not
        // So i will be equal to number of slices at the end of the for loop
        // If we want to keep the logic like the one inside the for loop we need to decrement the value of i by 1
        i--;

        let indexOffset = (numberOfVertexes * i) + i - 1;

        let bottomLeft = numberOfVertexes + indexOffset + i + 1

        let bottomRight = numberOfVertexes + indexOffset + i + 2

        let topRight = numberOfVertexes + 1

        let topLeft = 0

        this.indices.push(bottomLeft, bottomRight, topRight);
        this.indices.push(topRight, topLeft, bottomLeft);
        this.indices.push(topRight, bottomRight, bottomLeft);
        this.indices.push(bottomLeft, topLeft, topRight);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
      * Called when user interacts with GUI to change trunk's radius.
      * @param {trunkRadius} complexity - changes the trunk radius.
      */
    updateRadius(trunkRadius) {
        this.trunk_radius = trunkRadius;
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}

