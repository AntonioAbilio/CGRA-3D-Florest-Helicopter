import { CGFobject } from '../../lib/CGF.js';
import { MyHeliPrimitive } from './MyHeliPrimitive.js';
import { getTranslationMatrix, getXRotationMatrix, getZRotationMatrix } from '../utils/utils.js';
import { Cube } from './Cube.js'

/**
 * MyHeli
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyHeli extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.body = new MyHeliPrimitive(scene, 100, 100, 7);
        this.feet = new Cube(scene);
        this.initBuffers();
    }

    initBuffers() {

    }

    display() {
        // Main Helicopter Body
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(0, 24, 0))
        this.scene.scale(0.4, 0.4, 0.9);
        this.body.display();
        this.scene.popMatrix();

        // Small part that connects the helices to the body
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(0, 27, 0))
        this.scene.scale(0.05, 0.2, 0.05);
        this.body.display();
        this.scene.popMatrix();

        // Left feet
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(2.5, 20, 0))
        this.scene.scale(0.4, 0.4, 10);
        this.feet.display();
        this.scene.popMatrix();

        // Left Feet Connector
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(2, 20.5, 0))
        this.scene.multMatrix(getZRotationMatrix(45));
        this.scene.scale(0.3, 4, 0.3);
        this.feet.display();
        this.scene.popMatrix();

        // Right feet
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(-2.5, 20, 0))
        this.scene.scale(0.4, 0.4, 10);
        this.feet.display();
        this.scene.popMatrix();

        // Right Feet Connector
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(-2, 20.5, 0))
        this.scene.multMatrix(getZRotationMatrix(-45));
        this.scene.scale(0.3, 4, 0.3);
        this.feet.display();
        this.scene.popMatrix();
    }

}