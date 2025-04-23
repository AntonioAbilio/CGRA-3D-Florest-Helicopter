import { CGFobject } from '../../lib/CGF.js';
/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices - Number of slices around the sphere
 * @param stacks - Number of stacks of the sphere
 * @param radius - Radius of the sphere (default: 1)
 */
export class MySphere extends CGFobject {
    constructor(scene, slices, stacks, radius = 1) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.radius = radius;
        this.center = [0, 0, 0]
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        // Generate vertices, normals, and texture coordinates
        for (let latNumber = 0; latNumber <= this.stacks; latNumber++) {
            let theta = latNumber * Math.PI / this.stacks;
            let sinTheta = Math.sin(theta);
            let cosTheta = Math.cos(theta);

            for (let longNumber = 0; longNumber <= this.slices; longNumber++) {
                let phi = longNumber * 2 * Math.PI / this.slices;
                let sinPhi = Math.sin(phi);
                let cosPhi = Math.cos(phi);

                // Calculate unit vector for position and normal
                let x = cosPhi * sinTheta;
                let y = cosTheta;
                let z = sinPhi * sinTheta;

                // Add vertex position (scaled by radius)
                this.vertices.push(x * this.radius, y * this.radius, z * this.radius);

                // Normal vector (unit vector, not scaled)
                this.normals.push(-x, -y, -z);

                // Texture coordinates
                this.texCoords.push(longNumber / this.slices, latNumber / this.stacks);
            }
        }

        // Generate indices
        for (let latNumber = 0; latNumber < this.stacks; latNumber++) {
            for (let longNumber = 0; longNumber < this.slices; longNumber++) {
                let first = (latNumber * (this.slices + 1)) + longNumber;
                let second = first + this.slices + 1;

                // Create two triangles for each quad
                this.indices.push(first, second, first + 1);
                this.indices.push(second, second + 1, first + 1);

            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
     * Updates the sphere with a new radius
     * @param {number} radius - New radius for the sphere
     */
    updateRadius(radius) {
        this.radius = radius;
        this.initBuffers();
        this.initNormalVizBuffers();
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