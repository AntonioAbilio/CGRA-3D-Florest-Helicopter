import { CGFobject } from '../../lib/CGF.js';
import { MySphere } from './MySphere.js';
/**
 * MyPanorama
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyPanorama extends CGFobject {
    constructor(scene, texture) {
        super(scene)
        this.scene = scene;
        this.worldSphere = new MySphere(scene, 100, 100, 80);
        this.worldTexture = texture;
    }

    updateCenter(x, y, z) {
        this.worldSphere.updateCenter(x, y, z)
    }

    display() {
        this.scene.pushMatrix();
        this.worldTexture.bind();

        this.worldSphere.updateRadius(200);
        this.worldSphere.display();

        this.scene.popMatrix();
    }
}