import { CGFobject, CGFappearance } from '../../lib/CGF.js';
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

        this.headMaterial = new CGFappearance(scene);
        this.headMaterial.setAmbient(0.0, 0.0, 0.0, 1.0);
        this.headMaterial.setSpecular(241 / 255, 161 / 255, 208 / 255, 0);
        this.headMaterial.setDiffuse(0, 0, 0, 1.0);
        this.headMaterial.setShininess(10.0);

        this.neckMaterial = new CGFappearance(scene);
        this.neckMaterial.setAmbient(0.0, 0.0, 0.0, 1.0);
        this.neckMaterial.setSpecular(0, 1, 0, 0);
        this.neckMaterial.setDiffuse(0, 0, 0, 1.0);
        this.neckMaterial.setShininess(10.0);

        this.upperBodyMaterial = new CGFappearance(scene);
        this.upperBodyMaterial.setAmbient(0.0, 0.0, 0.0, 1.0);
        this.upperBodyMaterial.setSpecular(0, 0, 1, 0);
        this.upperBodyMaterial.setDiffuse(0, 0, 0, 1.0);
        this.upperBodyMaterial.setShininess(10.0);

        this.frontLegsMaterial = new CGFappearance(scene);
        this.frontLegsMaterial.setAmbient(0.0, 0.0, 0.0, 1.0);
        this.frontLegsMaterial.setSpecular(159 / 255, 84 / 255, 188 / 255, 0);
        this.frontLegsMaterial.setDiffuse(0, 0, 0, 1.0);
        this.frontLegsMaterial.setShininess(10.0);

        this.lowerBodyMaterial = new CGFappearance(scene);
        this.lowerBodyMaterial.setAmbient(0.0, 0.0, 0.0, 1.0);
        this.lowerBodyMaterial.setSpecular(241 / 255, 161 / 255, 57 / 255, 0);
        this.lowerBodyMaterial.setDiffuse(0, 0, 0, 1.0);
        this.lowerBodyMaterial.setShininess(10.0);

        this.backLegsMaterial = new CGFappearance(scene);
        this.backLegsMaterial.setAmbient(0.0, 0.0, 0.0, 1.0);
        this.backLegsMaterial.setSpecular(1, 0, 0, 0);
        this.backLegsMaterial.setDiffuse(0, 0, 0, 1.0);
        this.backLegsMaterial.setShininess(10.0);

        this.tailMaterial = new CGFappearance(scene);
        this.tailMaterial.setAmbient(0.0, 0.0, 0.0, 1.0);
        this.tailMaterial.setSpecular(1, 1, 0, 0);
        this.tailMaterial.setDiffuse(0, 0, 0, 1.0);
        this.tailMaterial.setShininess(10.0);

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
        this.headMaterial.apply();
        this.head.display();
        this.scene.popMatrix();

        // Diamond
        // Represents the neck of the horse.
        let rotMatrixZForDiamond = getZRotationMatrix(45);
        let translateForDiamond = getTranslationMatrix(0, 1, 0);

        this.scene.pushMatrix();
        this.scene.multMatrix(rotMatrixZForDiamond);
        this.scene.multMatrix(translateForDiamond);
        this.neckMaterial.apply();
        this.neck.display();
        this.scene.popMatrix();



        // Big Triangle
        // Represents the upper half of the horse's body
        let rotMatrixZForBigTriangle = getZRotationMatrix(-45);
        let translateForBigTriangle = getTranslationMatrix(0, -2, 0);

        this.scene.pushMatrix();
        this.scene.multMatrix(rotMatrixZForBigTriangle);
        this.scene.multMatrix(translateForBigTriangle);
        this.upperBodyMaterial.apply();
        this.upperBody.display();
        this.scene.popMatrix();



        // Small Triangle
        // this.scene triangle is already rotated. We only need to apply the translation.
        // Represents the front legs of the horse.
        let translateForSmallTriangle = getTranslationMatrix(-2 * Math.sqrt(2), -1, 0);

        this.scene.pushMatrix();
        this.scene.multMatrix(translateForSmallTriangle);
        this.frontLegsMaterial.apply();
        this.frontLegs.display();
        this.scene.popMatrix();



        // Big Triangle
        // Represents the lower half of the horse's body
        translateForBigTriangle = getTranslationMatrix(0, -2, 0);
        rotMatrixZForBigTriangle = getZRotationMatrix(-90);

        this.scene.pushMatrix();
        this.scene.multMatrix(translateForBigTriangle);
        this.scene.multMatrix(rotMatrixZForBigTriangle);
        this.lowerBodyMaterial.apply();
        this.lowerBody.display();
        this.scene.popMatrix();



        // Small Triangle
        // Represent the back legs of the horse
        translateForSmallTriangle = getTranslationMatrix(-Math.sqrt(2) / 2, -4, 0);
        let rotMatrixZForSmallTriangle = getZRotationMatrix(225);

        this.scene.pushMatrix();
        this.scene.multMatrix(translateForSmallTriangle);
        this.scene.multMatrix(rotMatrixZForSmallTriangle);
        this.backLegsMaterial.apply();
        this.backLegs.display();
        this.scene.popMatrix();



        // Parallelogram.
        // Represents the tail of the horse.
        let translateForParallelogram = getTranslationMatrix(2, -2, 0);
        let rotMatrixZForParallelogram = getZRotationMatrix(-120);

        this.scene.pushMatrix();
        this.scene.multMatrix(translateForParallelogram);
        this.scene.multMatrix(rotMatrixZForParallelogram);
        this.tailMaterial.apply();
        this.tail.display();
        this.scene.popMatrix();
    }

    enableNormalViz() {
        this.head.enableNormalViz();
        this.neck.enableNormalViz();
        this.upperBody.enableNormalViz();
        this.frontLegs.enableNormalViz();
        this.lowerBody.enableNormalViz();
        this.backLegs.enableNormalViz();
        this.tail.enableNormalViz();
    }
}

