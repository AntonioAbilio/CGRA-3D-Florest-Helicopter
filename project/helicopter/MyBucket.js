import { CGFobject } from '../../lib/CGF.js';

/**
 * MyBucket
 * @constructor
 * @param scene - Reference to MyScene object.
 */
export class MyBucket extends CGFobject {
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

        let ang = 0;

        let alphaAng = 2 * Math.PI / this.slices;

        let numberOfVertexes = this.stacks;

        let i = 0;
        for (; i < this.slices; i++) {

            let sa = Math.sin(ang);
            let ca = Math.cos(ang);

            let normal = [ca, sa, 0];

            let nsize = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
            normal[0] /= nsize;
            normal[1] /= nsize;
            normal[2] /= nsize;

            // Calculate texture coordinate s (horizontal)
            let s = i / this.slices;

            // Bottom Left
            this.vertices.push(ca, sa, 1)
            this.normals.push(...normal);
            this.texCoords.push(s, 0);

            let incrementForZAxis = 1 / (this.stacks)
            for (let j = 0; j < this.stacks; j++) {

                this.vertices.push(ca, sa, incrementForZAxis);
                this.normals.push(...normal);

                // Calculate texture coordinate t based on height
                let t = 1 - incrementForZAxis;
                this.texCoords.push(s, t);

                incrementForZAxis += 1 / (this.stacks)
            }

            // Bottom Right
            this.vertices.push(ca, sa, 0)
            this.normals.push(...normal);
            this.texCoords.push(s, 1);

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

}

