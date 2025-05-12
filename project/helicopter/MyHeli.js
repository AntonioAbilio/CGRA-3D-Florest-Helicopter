import { CGFobject, CGFappearance } from '../../lib/CGF.js';
import { MyHeliPrimitive } from './MyHeliPrimitive.js';
import { getRad, getTranslationMatrix, getXRotationMatrix, getYRotationMatrix, getZRotationMatrix } from '../utils/utils.js';
import { Cube } from './Cube.js'

/**
 * MyHeli
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyHeli extends CGFobject {
    constructor(scene, posX, posY, posZ, orientation = 0, velocity_vec3 = [0, 0, 0]) {
        super(scene);
        this.scene = scene;
        this.body = new MyHeliPrimitive(scene, 100, 100, 7);
        this.feet = new Cube(scene);
        this.orientation = orientation;
        this.inclination = 0;
        this.last_velocity_vec3 = [0, 0, 0];
        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;
        this.velocity_vec3 = velocity_vec3;
        this.initBuffers();
    }

    initBuffers() {
        this.bodyTexture = new CGFappearance(this.scene);
        this.bodyTexture.setAmbient(0.9, 0.9, 0.9, 1);
        this.bodyTexture.setDiffuse(0.9, 0.9, 0.9, 1);
        this.bodyTexture.setSpecular(0.1, 0.1, 0.1, 1);
        this.bodyTexture.setShininess(10.0);
        this.bodyTexture.loadTexture('textures/light_aluminium.jpg');
        this.bodyTexture.setTextureWrap('REPEAT', 'REPEAT');

        this.bodyWindow = new CGFappearance(this.scene);
        this.bodyWindow.setAmbient(0.9, 0.9, 0.9, 1);
        this.bodyWindow.setDiffuse(0.9, 0.9, 0.9, 1);
        this.bodyWindow.setSpecular(0.1, 0.1, 0.1, 1);
        this.bodyWindow.setShininess(10.0);
        this.bodyWindow.loadTexture('textures/heli_window.jpg');
        this.bodyWindow.setTextureWrap('REPEAT', 'REPEAT');
    }

    display() {
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(this.posX, this.posY, this.posZ));
        this.scene.multMatrix(getYRotationMatrix(180 + this.orientation));
        this.scene.multMatrix(getXRotationMatrix(this.inclination));

        // Main Helicopter Body
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(0, 24, 0))
        this.scene.scale(0.59, 0.48, 0.71);
        this.bodyTexture.apply();
        this.body.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(0, 24, -1))
        this.scene.scale(0.5, 0.42, 0.67);
        this.bodyWindow.apply();
        this.body.display();
        this.scene.popMatrix();

        // Small part that connects the helices to the body
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(0, 27, 0))
        this.scene.scale(0.05, 0.2, 0.05);
        this.bodyTexture.apply();
        this.body.display();
        this.scene.popMatrix();

        // Left feet
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(2.5, 20, 0))
        this.scene.scale(0.4, 0.4, 10);
        this.bodyTexture.apply();
        this.feet.display();
        this.scene.popMatrix();

        // Left Feet Connector
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(2, 20.5, 0))
        this.scene.multMatrix(getZRotationMatrix(45));
        this.scene.scale(0.3, 4, 0.3);
        this.bodyTexture.apply();
        this.feet.display();
        this.scene.popMatrix();

        // Right feet
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(-2.5, 20, 0))
        this.scene.scale(0.4, 0.4, 10);
        this.bodyTexture.apply();
        this.feet.display();
        this.scene.popMatrix();

        // Right Feet Connector
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(-2, 20.5, 0))
        this.scene.multMatrix(getZRotationMatrix(-45));
        this.scene.scale(0.3, 4, 0.3);
        this.bodyTexture.apply();
        this.feet.display();
        this.scene.popMatrix();

        // Top Helice_1
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(0, 28, 0))
        this.scene.scale(0.4, 0.4, 10);
        this.bodyTexture.apply();
        this.feet.display();
        this.scene.popMatrix();

        // Top Helice_2
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(0, 28, 0))
        this.scene.multMatrix(getYRotationMatrix(90))
        this.scene.scale(0.4, 0.4, 10);
        this.bodyTexture.apply();
        this.feet.display();
        this.scene.popMatrix();

        // Tail
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(0, 24, 2))
        this.scene.scale(0.15, 0.15, 1);
        this.bodyTexture.apply();
        this.body.display();
        this.scene.popMatrix();

        // Small part that connects the back helices to the body
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(0, 24, 9))
        this.scene.scale(0.05, 0.2, 0.05);
        this.bodyTexture.apply();
        this.body.display();
        this.scene.popMatrix();

        // Another small part that lets the helices spin without hitting the body
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(-0.5, 24, 9))
        this.scene.multMatrix(getZRotationMatrix(90))
        this.scene.scale(0.02, 0.1, 0.02);
        this.bodyTexture.apply();
        this.body.display();
        this.scene.popMatrix();

        // Back Helice_1
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(-0.75, 24, 9))
        this.scene.multMatrix(getXRotationMatrix(135))
        this.scene.scale(0.2, 0.2, 2);
        this.bodyTexture.apply();
        this.feet.display();
        this.scene.popMatrix();

        // Back Helice_2
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(-0.75, 24, 9))
        this.scene.multMatrix(getXRotationMatrix(45))
        this.scene.scale(0.2, 0.2, 2);
        this.bodyTexture.apply();
        this.feet.display();
        this.scene.popMatrix();

        this.scene.popMatrix();

    }

    update(delta) {

        this.posX = isNaN(this.posX) ? 0 : this.posX;
        this.posY = isNaN(this.posY) ? 0 : this.posY;
        this.posZ = isNaN(this.posZ) ? 0 : this.posZ;

        this.posX += this.velocity_vec3[0] * delta * Math.sin(getRad(this.orientation));
        this.posY += this.velocity_vec3[1] * delta;
        this.posZ += this.velocity_vec3[2] * delta * Math.cos(getRad(this.orientation));

        this.last_velocity_vec3[0] = this.velocity_vec3[0];
        this.last_velocity_vec3[1] = this.velocity_vec3[1];
        this.last_velocity_vec3[2] = this.velocity_vec3[2];

    }

    turn(v) {
        this.orientation += v;

        console.log(`Current orientation ${this.orientation}`);
    }

    accelarate(t) {

        let baseAcceleration = 9.8
        this.velocity_vec3[0] += baseAcceleration * t;
        this.velocity_vec3[2] += baseAcceleration * t;

        if ((this.velocity_vec3[0] - this.last_velocity_vec3[0] < 0.0) || (this.velocity_vec3[2] - this.last_velocity_vec3[2] < 0.0)) {


            if (this.velocity_vec3[0] < 0.0 || this.velocity_vec3[2] < 0.0) {
                this.velocity_vec3 = [0, 0, 0]; // The helicopter can only go backwards if it is pointing in the other direction
                this.inclination = 0; // Since we stoped no need for the helicopter to be inclined.
                return;
            } else {
                this.inclination = 4 // Begin braking and point backwards
            }

        } else {
            if (this.velocity_vec3[0] > 0.0 || this.velocity_vec3[2] > 0.0) {
                this.inclination = -8; // Stop braking and point ahead
            }
        }

    }

    reset() {
        this.orientation = 0;
        this.inclination = 0;
        this.last_velocity_vec3 = [0, 0, 0];
        this.posX = 0;
        this.posY = 0;
        this.posZ = 0;
        this.velocity_vec3 = [0, 0, 0];
    }

}
