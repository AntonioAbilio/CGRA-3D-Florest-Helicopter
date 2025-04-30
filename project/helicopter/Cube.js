import { CGFobject } from '../../lib/CGF.js';
import { MyQuad } from '../MyQuad.js';

/**
 * Cube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class Cube extends CGFobject {

    bottomFace
    backFace
    leftFace
    frontFace
    rightFace
    topFace


    constructor(scene) {
        super(scene);
        this.initBuffers();
        this.width = 1;
        this.height = 1;
        this.depth = 1;

        this.quad = new MyQuad(scene);

    }

    display() {
        // Top face of the building
        this.scene.pushMatrix();
        this.scene.translate(0, this.height / 2, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);

        this.quad.display();
        this.scene.popMatrix();

        // Front face of the building
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.depth / 2);

        this.quad.display();
        this.scene.popMatrix();

        // Back face of the building
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -this.depth / 2);
        this.scene.rotate(Math.PI, 0, 1, 0);

        this.quad.display();
        this.scene.popMatrix();

        // Right face of the building
        this.scene.pushMatrix();
        this.scene.translate(this.width / 2, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);

        this.quad.display();
        this.scene.popMatrix();

        // Left face of the building
        this.scene.pushMatrix();
        this.scene.translate(-this.width / 2, 0, 0);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);

        this.quad.display();
        this.scene.popMatrix();

        // Bottom face of the building
        this.scene.pushMatrix();
        this.scene.translate(0, -this.height / 2, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);

        this.quad.display();
        this.scene.popMatrix();

    }
}

