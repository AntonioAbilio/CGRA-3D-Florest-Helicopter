// MyHeliLight.js
import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MySphere } from "./MySphere.js";

export class MyHeliLight extends CGFobject {
    constructor(scene, x, y, z) {
        super(scene);
        this.scene = scene;
        this.position = [x, y, z];
        this.appearance = new CGFappearance(scene);
        this.appearance.setShininess(10.0);
        this.appearance.loadTexture('textures/light_aluminium.jpg');
        this.appearance.setTextureWrap('REPEAT', 'REPEAT');
        this.lightsAreOff = false;
        this.radius = 0.3;

        this.sphere = new MySphere(scene, 16, 16, 1, false);
    }

    update(t) {
        if (this.scene.heli.shouldFlashLights) {
            const intensity = 0.1 + 1.9 * Math.sin(t / 300);
            this.appearance.setDiffuse(intensity, intensity, intensity, 1);
            this.appearance.setSpecular(intensity, intensity, intensity, 1);
            this.appearance.setAmbient(intensity, intensity, intensity, 1);
            this.appearance.setEmission(intensity, intensity, intensity, 1);
            this.lightsAreOff = false;
            return;
        }

        if (!this.lightsAreOff) {
            this.appearance.setDiffuse(0, 0, 0, 1);
            this.appearance.setSpecular(0, 0, 0, 1);
            this.appearance.setAmbient(0, 0, 0, 1);
            this.appearance.setEmission(0, 0, 0, 1);
            this.lightsAreOff = true;
        }
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(...this.position);
        this.scene.scale(this.radius, this.radius, this.radius);
        this.appearance.apply();
        this.sphere.display();
        this.scene.popMatrix();
    }
}