// MyHeliLight.js
import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MySphere } from "./MySphere.js";

export class MyHeliLight extends CGFobject {
    constructor(scene, x, y, z) {
        super(scene);
        this.position = [x, y, z];
        this.appearance = new CGFappearance(scene);
        this.radius = 0.3;

        this.sphere = new MySphere(scene, 16, 16, 1, false); // substitua com sua classe
    }

    update(t) {
        const intensity = 0.5 + 0.5 * Math.sin(t / 300);
        this.appearance.setEmission(intensity, intensity, intensity, 1.0);
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