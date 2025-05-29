import { CGFobject } from '../../lib/CGF.js';
import { MySphere } from './MySphere.js';
import { getScalingMatrix, getTranslationMatrix } from './utils/utils.js';
/**
 * MyPanorama
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyPanorama extends CGFobject {
    constructor(scene, texture) {
        super(scene)
        this.scene = scene;
        this.worldSphere = new MySphere(scene, 30, 30, 200, true);
        this.worldTexture = texture;
    }

    display() {
        this.scene.pushMatrix();
        this.worldTexture.bind();
        this.worldSphere.display();
        this.scene.popMatrix();
    }
}