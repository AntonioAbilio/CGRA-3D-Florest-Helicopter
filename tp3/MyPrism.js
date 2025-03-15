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

        let ang = 0;

        // This variable will allow us do slice the circle.
        let alphaAng = 2 * Math.PI / this.slices;

        // We know that N0 (the normal that divides the angle in two of the same)
        let normalN0Angle = alphaAng / 2;

        // We're using the trigonometric circle to calculate the point where a vertex should be.
        // We know that coordinates can be defined using cos and sin where x = cos(angle) and y = sin(angle)
        for (let i = 0; i < this.slices; i++) {

            // The "lowest" point of the triangle is given by these coordinates.
            let sa = Math.sin(ang);
            let ca = Math.cos(ang);

            // The "highest" point is given by these.
            let saa = Math.sin(ang + alphaAng);
            let caa = Math.cos(ang + alphaAng);

            // Bottom Left
            this.vertices.push(ca, sa, 1)

            // Bottom Right
            this.vertices.push(ca, sa, 0)

            // Top Right
            this.vertices.push(caa, saa, 0)

            // Top Left
            this.vertices.push(caa, saa, 1)

            // Calculate the coordinates for x and y of the Normal Vector.
            let xCoords = Math.cos(normalN0Angle);
            let yCoords = Math.sin(normalN0Angle);

            // Creation of the normal vector.
            let normal = [
                xCoords,
                yCoords,
                0
            ];

            // Vector normalization.
            // This only ensures that we are dealing with normals that have unit size.
            let nsize = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
            normal[0] /= nsize;
            normal[1] /= nsize;
            normal[2] /= nsize;

            // Push normal once for each vertex
            this.normals.push(...normal);
            this.normals.push(...normal);
            this.normals.push(...normal);
            this.normals.push(...normal);

            let indexOffset = 3 * i

            // IndexOffset lets us access the new elements.
            this.indices.push(indexOffset + i, indexOffset + i + 1, indexOffset + i + 2);
            this.indices.push(indexOffset + i + 2, indexOffset + i + 3, indexOffset + i);

            // Paints the inside.
            this.indices.push(indexOffset + i + 2, indexOffset + i + 1, indexOffset + i);
            this.indices.push(indexOffset + i, indexOffset + i + 3, indexOffset + i + 2);


            ang += alphaAng;
            normalN0Angle += alphaAng
        }

        ang = 0;
        normalN0Angle = alphaAng / 2;

        for (let i = 0; i < this.slices; i++) {

            // This tells us how much we need to "walk" in the Z-axis at a time.
            // Creates the illusion of stacks.
            let increment = 0

            for (let j = 0; j < this.stacks; j++) {

                let sa = Math.sin(ang);
                let ca = Math.cos(ang);

                let saa = Math.sin(ang + alphaAng);
                let caa = Math.cos(ang + alphaAng);

                // Bottom Right
                this.vertices.push(ca, sa, increment)

                // Top Right
                this.vertices.push(caa, saa, increment)

                // Calculate the coordinates for x and y of the Normal Vector.
                let xCoords = Math.cos(normalN0Angle);
                let yCoords = Math.sin(normalN0Angle);

                // Creation of the normal vector.
                let normal = [xCoords, yCoords, 0];

                // Vector normalization.
                // This only ensures that we are dealing with normals that have unit size.
                let nsize = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
                normal[0] /= nsize;
                normal[1] /= nsize;
                normal[2] /= nsize;

                // Push normal once for each vertex
                this.normals.push(...normal);
                this.normals.push(...normal);
                increment += 1 / (this.stacks)
            }

            ang += alphaAng;
            normalN0Angle += alphaAng
        }

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

