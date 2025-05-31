import { CGFobject, CGFappearance } from '../../../lib/CGF.js';
/**
 * MyTrunk
 * @constructor
 * @param scene - Reference to MyScene object.
 * @param slices - Number of divisions around the trunk circumference.
 * @param stacks - Number of divisions along the trunk height.
 * @param trunk_radius - Radius of the tree trunk.
 * @param max_size_for_trunk - Maximum height of the tree trunk.
 */
export class MyTrunk extends CGFobject {
    constructor(scene, slices, stacks, trunk_radius, max_size_for_trunk) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.trunk_radius = trunk_radius;
        this.max_size_for_trunk = max_size_for_trunk;

        // Texture for trunk.
        this.trunk = new CGFappearance(this.scene);
        this.trunk.setAmbient(0.1, 0.1, 0.1, 1);
        this.trunk.setDiffuse(0.9, 0.9, 0.9, 1);
        this.trunk.setSpecular(0.1, 0.1, 0.1, 1);
        this.trunk.setShininess(10.0);
        this.trunk.loadTexture('textures/trunk.jpg');
        this.trunk.setTextureWrap('REPEAT', 'REPEAT');

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

            this.vertices.push(Math.cos(ang) * this.trunk_radius, 0, -Math.sin(ang) * this.trunk_radius);
            this.indices.push(i, (i + 1) % this.slices, this.slices);
            this.normals.push(Math.cos(ang), Math.cos(Math.PI / 4.0), -Math.sin(ang));
            this.texCoords.push(i / this.slices, 1.0);
            ang += alphaAng;
        }
        this.vertices.push(0, this.max_size_for_trunk, 0);
        this.normals.push(0, 1, 0);

        // Add texture coordinate for the top vertex
        this.texCoords.push(0.5, 0.0);


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        if (this.trunk.texture) {
            this.trunk.apply();
        }
        super.display();
    }

    updateSize(max_size_for_trunk) {
        this.max_size_for_trunk = max_size_for_trunk + 1;
        this.initBuffers();
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

