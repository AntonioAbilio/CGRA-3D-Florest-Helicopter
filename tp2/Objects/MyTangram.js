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
}

