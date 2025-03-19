import { CGFobject } from '../../lib/CGF.js';
import { MyDiamond } from './MyDiamond.js';
import { MyParallelogram } from './MyParallelogram.js';
import { MyTriangle } from './MyTriangle.js';
import { MyTriangleBig } from './MyTriangleBig.js';
import { MyTriangleSmall } from './MyTriangleSmall.js';
import { getTranslationMatrix, getZRotationMatrix } from '../utils/utils.js';

/**
 * MyTangram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTangram extends CGFobject {

    head
    neck
    upperBody
    frontLegs
    lowerBody
    backLegs
    tail

    constructor(scene) {
        super(scene);
        this.initBuffers();

        this.head = new MyTriangle(scene)
        this.neck = new MyDiamond(scene)
        this.upperBody = new MyTriangleBig(scene)
        this.frontLegs = new MyTriangleSmall(scene)
        this.lowerBody = new MyTriangleBig(scene)
        this.backLegs = new MyTriangleSmall(scene)
        this.tail = new MyParallelogram(scene)

        // Textures for body parts
        this.head.updateTexCoords([0, 0.5, 0, 1, 0.5, 1,]);
        this.neck.updateTexCoords([0.25, 0.25, 0, 0.5, 0.5, 0.5, 0.25, 0.75,]);
        this.upperBody.updateTexCoords([1, 0, 0, 0, 0.5, 0.5]);
        this.frontLegs.updateTexCoords([0, 0, 0, 0.5, 0.25, 0.25,]);
        this.lowerBody.updateTexCoords([1, 1, 1, 0, 0.5, 0.5,]);

        this.backLegs.updateTexCoords([
            0.25, 0.75,
            0.75, 0.75,
            0.5, 0.5,
        ]);

        this.tail.updateTexCoords([1, 1, 0.5, 1, 0.25, 0.75, 0.75, 0.75,]);

    }

    display() {
        // TP2
        // Exercice 1

        // Medium Triangle
        // Represent the horse's head
        let translateForMediumTriangle = getTranslationMatrix(-Math.sqrt(2), Math.sqrt(2), 0);
        let rotMatrixZForMediumTriangle = getZRotationMatrix(-135);

        this.scene.pushMatrix();
        this.scene.multMatrix(translateForMediumTriangle);
        this.scene.multMatrix(rotMatrixZForMediumTriangle);
        this.head.display();
        this.scene.popMatrix();

        // Diamond
        // Represents the neck of the horse.
        let rotMatrixZForDiamond = getZRotationMatrix(45);
        let translateForDiamond = getTranslationMatrix(0, 1, 0);

        this.scene.pushMatrix();
        this.scene.multMatrix(rotMatrixZForDiamond);
        this.scene.multMatrix(translateForDiamond);
        this.neck.display();
        this.scene.popMatrix();



        // Big Triangle
        // Represents the upper half of the horse's body
        let rotMatrixZForBigTriangle = getZRotationMatrix(-45);
        let translateForBigTriangle = getTranslationMatrix(0, -2, 0);

        this.scene.pushMatrix();
        this.scene.multMatrix(rotMatrixZForBigTriangle);
        this.scene.multMatrix(translateForBigTriangle);



        this.upperBody.display();
        this.scene.popMatrix();



        // Small Triangle
        // this.scene triangle is already rotated. We only need to apply the translation.
        // Represents the front legs of the horse.
        let translateForSmallTriangle = getTranslationMatrix(-2 * Math.sqrt(2), -1, 0);

        this.scene.pushMatrix();
        this.scene.multMatrix(translateForSmallTriangle);
        this.frontLegs.display();
        this.scene.popMatrix();



        // Big Triangle
        // Represents the lower half of the horse's body
        translateForBigTriangle = getTranslationMatrix(0, -2, 0);
        rotMatrixZForBigTriangle = getZRotationMatrix(-90);

        this.scene.pushMatrix();
        this.scene.multMatrix(translateForBigTriangle);
        this.scene.multMatrix(rotMatrixZForBigTriangle);
        this.lowerBody.display();
        this.scene.popMatrix();



        // Small Triangle
        // Represent the back legs of the horse
        translateForSmallTriangle = getTranslationMatrix(-Math.sqrt(2) / 2, -4, 0);
        let rotMatrixZForSmallTriangle = getZRotationMatrix(225);

        this.scene.pushMatrix();
        this.scene.multMatrix(translateForSmallTriangle);
        this.scene.multMatrix(rotMatrixZForSmallTriangle);
        this.backLegs.display();
        this.scene.popMatrix();



        // Parallelogram.
        // Represents the tail of the horse.
        let translateForParallelogram = getTranslationMatrix(2, -2, 0);
        let rotMatrixZForParallelogram = getZRotationMatrix(-120);

        this.scene.pushMatrix();
        this.scene.multMatrix(translateForParallelogram);
        this.scene.multMatrix(rotMatrixZForParallelogram);
        this.tail.display();
        this.scene.popMatrix();
    }

    /**
     * @method updateTexCoords
     * Updates the list of texture coordinates of the quad
     * @param {Array} coords - Array of texture coordinates
     */
    updateTexCoords(coords) {
        this.head.updateTexCoords(coords);
        this.neck.updateTexCoords(coords);
        this.upperBody.updateTexCoords(coords);
        this.frontLegs.updateTexCoords(coords);
        this.lowerBody.updateTexCoords(coords);
        this.updateTexCoordsGLBuffers();
    }

}

