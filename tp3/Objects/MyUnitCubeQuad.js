import { CGFobject } from '../../lib/CGF.js';
import { MyQuad } from './MyQuad.js';
import { getTranslationMatrix, getXRotationMatrix, getYRotationMatrix } from '../utils/utils.js';

/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends CGFobject {

    bottomFace
    backFace
    leftFace
    frontFace
    rightFace
    topFace


    constructor(scene) {
        super(scene);
        this.initBuffers();

        this.bottomFace = new MyQuad(scene);
        this.backFace = new MyQuad(scene);
        this.leftFace = new MyQuad(scene);
        this.frontFace = new MyQuad(scene);
        this.rightFace = new MyQuad(scene);
        this.topFace = new MyQuad(scene);

    }

    display() {
        // TP2
        // Exercice 4


        // Bottom face of the cube
        let rotation = getXRotationMatrix(-90);
        let translation = getTranslationMatrix(0, -0.5, 0);

        this.scene.pushMatrix();
        this.scene.multMatrix(translation);
        this.scene.multMatrix(rotation);
        this.bottomFace.display();
        this.scene.popMatrix();


        // Top face of the cube
        rotation = getXRotationMatrix(90);
        translation = getTranslationMatrix(0, 0.5, 0);

        this.scene.pushMatrix();
        this.scene.multMatrix(translation);
        this.scene.multMatrix(rotation);
        this.topFace.display();
        this.scene.popMatrix();


        // Back face of the cube
        translation = getTranslationMatrix(0, 0, -0.5);

        this.scene.pushMatrix();
        this.scene.multMatrix(translation);
        this.backFace.display();
        this.scene.popMatrix();



        // Left face of the cube
        rotation = getYRotationMatrix(90);
        translation = getTranslationMatrix(-0.5, 0, 0);

        this.scene.pushMatrix();
        this.scene.multMatrix(translation);
        this.scene.multMatrix(rotation);
        this.leftFace.display();
        this.scene.popMatrix();


        // Front face of the cube
        rotation = getYRotationMatrix(180);
        translation = getTranslationMatrix(0, 0, 0.5);

        this.scene.pushMatrix();
        this.scene.multMatrix(translation);
        this.scene.multMatrix(rotation);
        this.frontFace.display();
        this.scene.popMatrix();


        // Right face of the cube
        rotation = getYRotationMatrix(270);
        translation = getTranslationMatrix(0.5, 0, 0);

        this.scene.pushMatrix();
        this.scene.multMatrix(translation);
        this.scene.multMatrix(rotation);
        this.rightFace.display();
        this.scene.popMatrix();



    }
}

