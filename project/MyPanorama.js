import { CGFobject } from '../../lib/CGF.js';
import { CGFappearance } from '../lib/CGF.js';
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

        // This prevents the lights on top of the building from changing the brightness of the texture that we apply to the Sphere.
        this.worldTexture = new CGFappearance(this.scene);
        this.worldTexture.setAmbient(0.9, 0.9, 0.9, 1);
        this.worldTexture.setDiffuse(0.9, 0.9, 0.9, 1);
        this.worldTexture.setSpecular(0.0, 0.0, 0.0, 1);
        this.worldTexture.setShininess(10.0);
        this.worldTexture.texture = texture
        this.worldTexture.setTextureWrap('REPEAT', 'REPEAT');
    }

    display() {
        this.scene.pushMatrix();
        this.worldTexture.apply();
        this.worldSphere.display();
        this.scene.popMatrix();
    }
}