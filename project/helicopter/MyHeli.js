import { CGFobject, CGFappearance } from '../../lib/CGF.js';
import { MyHeliPrimitive } from './MyHeliPrimitive.js';
import { getRad, getTranslationMatrix, getXRotationMatrix, getYRotationMatrix, getZRotationMatrix } from '../utils/utils.js';
import { Cube } from './Cube.js'
import { MyBucket } from '../MyBucket.js';
import { MyCircle } from '../MyCircle.js';

/**
 * MyHeli
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyHeli extends CGFobject {
    constructor(scene, posX, posY, posZ, orientation = 0, velocity_vec3 = [0, 0, 0]) {
        super(scene);
        this.scene = scene;

        // Objects that make up the helicopter
        this.body = new MyHeliPrimitive(scene, 100, 100, 7);
        this.parts = new Cube(scene);

        // Helicopter's Velocity
        this.last_velocity_vec3 = [0, 0, 0];
        this.velocity_vec3 = velocity_vec3;

        // Helicopter's Position
        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;
        this.orientation = orientation;
        this.inclination = 0;

        this.bucket = new MyBucket(this.scene);
        this.bucketCover = new MyCircle(this.scene);

        // Helicopter's Functionality
        // FIXME: Substitute this for a state machine...
        this.isFlying = false;
        this.ignoreInputs = false;
        this.readyToDescend = false;
        this.readyToLand = false;
        this.bucketOpen = false;
        this.autoPilotState = -1;

        // Helices's Position
        this.top_helice_1_ang = 0.0;
        this.top_helice_2_ang = 0.0;
        this.back_helice_1_ang = 0.0;
        this.back_helice_2_ang = 0.0;

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

        // Bucket
        if (this.isFlying) {
            this.scene.pushMatrix();
            this.scene.multMatrix(getTranslationMatrix(0, 10, 0));
            this.scene.multMatrix(getXRotationMatrix(-90));
            this.bodyTexture.apply();
            this.bucket.display();
            this.scene.popMatrix();

            // Bucket Cover
            this.scene.pushMatrix();
            this.scene.multMatrix(getTranslationMatrix(0, 10, 0));
            this.bodyTexture.apply();
            if (this.bucketOpen) {
                this.scene.multMatrix(getXRotationMatrix(90));
            }
            this.bucketCover.display();
            this.scene.popMatrix();
        }

        // Main Helicopter Body
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(0, 24, 0))
        this.scene.multMatrix(getXRotationMatrix(this.inclination));
        this.scene.scale(0.59, 0.48, 0.71);
        this.bodyTexture.apply();
        this.body.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(0, 24, 0))
        this.scene.multMatrix(getXRotationMatrix(this.inclination));
        this.scene.multMatrix(getTranslationMatrix(0, 0, -1))
        this.scene.scale(0.5, 0.42, 0.67);
        this.bodyWindow.apply();
        this.body.display();
        this.scene.popMatrix();

        // Small part that connects the helices to the body
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(0, 27, 0))
        this.scene.multMatrix(getXRotationMatrix(this.inclination));
        this.scene.scale(0.05, 0.2, 0.05);
        this.bodyTexture.apply();
        this.body.display();
        this.scene.popMatrix();

        // Left feet
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(2.5, 20, 0))
        this.scene.multMatrix(getXRotationMatrix(this.inclination));
        this.scene.scale(0.4, 0.4, 10);
        this.bodyTexture.apply();
        this.parts.display();
        this.scene.popMatrix();

        // Left Feet Connector
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(2, 20.5, 0))
        this.scene.multMatrix(getXRotationMatrix(this.inclination));
        this.scene.multMatrix(getZRotationMatrix(45));
        this.scene.scale(0.3, 1.5, 0.3);
        this.bodyTexture.apply();
        this.parts.display();
        this.scene.popMatrix();

        // Right feet
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(-2.5, 20, 0))
        this.scene.multMatrix(getXRotationMatrix(this.inclination));
        this.scene.scale(0.4, 0.4, 10);
        this.bodyTexture.apply();
        this.parts.display();
        this.scene.popMatrix();

        // Right Feet Connector
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(-2, 20.5, 0))
        this.scene.multMatrix(getXRotationMatrix(this.inclination));
        this.scene.multMatrix(getZRotationMatrix(-45));
        this.scene.scale(0.3, 1.5, 0.3);
        this.bodyTexture.apply();
        this.parts.display();
        this.scene.popMatrix();

        // Top Helice_1
        this.scene.pushMatrix();
        this.scene.multMatrix(getYRotationMatrix(this.top_helice_1_ang))
        this.scene.multMatrix(getTranslationMatrix(0, 28, 0))
        this.scene.multMatrix(getXRotationMatrix(this.inclination));
        this.scene.scale(0.4, 0.4, 10);
        this.bodyTexture.apply();
        this.parts.display();
        this.scene.popMatrix();

        // Top Helice_2
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(0, 28, 0))
        this.scene.multMatrix(getXRotationMatrix(this.inclination));
        this.scene.multMatrix(getYRotationMatrix(90))
        this.scene.multMatrix(getYRotationMatrix(this.top_helice_2_ang))
        this.scene.scale(0.4, 0.4, 10);
        this.bodyTexture.apply();
        this.parts.display();
        this.scene.popMatrix();

        // Tail
        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(0, 24, 2))
        this.scene.multMatrix(getXRotationMatrix(this.inclination));
        this.scene.scale(0.15, 0.15, 1);
        this.bodyTexture.apply();
        this.body.display();
        this.scene.popMatrix();

        // Small part that connects the back helices to the body
        this.scene.pushMatrix();

        if (this.inclination < 0) {
            this.scene.multMatrix(getTranslationMatrix(0, this.inclination == 0 ? 24 : 25, 9))

        } else {
            this.scene.multMatrix(getTranslationMatrix(0, this.inclination == 0 ? 24 : 23.5, 9))

        }

        this.scene.multMatrix(getXRotationMatrix(this.inclination));
        this.scene.scale(0.05, 0.2, 0.05);
        this.bodyTexture.apply();
        this.body.display();
        this.scene.popMatrix();

        // Another small part that lets the helices spin without hitting the body
        this.scene.pushMatrix();
        if (this.inclination < 0) {
            this.scene.multMatrix(getTranslationMatrix(-0.5, this.inclination == 0 ? 24 : 25, 9))

        } else {
            this.scene.multMatrix(getTranslationMatrix(-0.5, this.inclination == 0 ? 24 : 23.5, 9))

        }

        this.scene.multMatrix(getZRotationMatrix(90))
        this.scene.scale(0.02, 0.1, 0.02);
        this.scene.multMatrix(getXRotationMatrix(this.inclination));
        this.bodyTexture.apply();
        this.body.display();
        this.scene.popMatrix();

        // Back Helice_1
        this.scene.pushMatrix();
        if (this.inclination < 0) {
            this.scene.multMatrix(getTranslationMatrix(-0.75, this.inclination == 0 ? 24 : 25, 9))

        } else {
            this.scene.multMatrix(getTranslationMatrix(-0.75, this.inclination == 0 ? 24 : 23.5, 9))

        }

        this.scene.multMatrix(getXRotationMatrix(this.inclination));
        this.scene.multMatrix(getXRotationMatrix(135))
        this.scene.multMatrix(getXRotationMatrix(this.back_helice_1_ang))
        this.scene.scale(0.2, 0.2, 2);
        this.bodyTexture.apply();
        this.parts.display();
        this.scene.popMatrix();

        // Back Helice_2
        this.scene.pushMatrix();
        if (this.inclination < 0) {
            this.scene.multMatrix(getTranslationMatrix(-0.75, this.inclination == 0 ? 24 : 25, 9))

        } else {
            this.scene.multMatrix(getTranslationMatrix(-0.75, this.inclination == 0 ? 24 : 23.5, 9))

        }
        this.scene.multMatrix(getXRotationMatrix(this.inclination));
        this.scene.multMatrix(getXRotationMatrix(45))
        this.scene.multMatrix(getXRotationMatrix(this.back_helice_2_ang))
        this.scene.scale(0.2, 0.2, 2);
        this.bodyTexture.apply();
        this.parts.display();
        this.scene.popMatrix();

        this.scene.popMatrix();

    }

    updatePosition(delta) {
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

    flyChecks() {
        // Check if have already hit the cruzing altitude.
        // If we are not flying but our Y position is already equal or over 10 then we are flying (we have reached the target altitude)
        // which means that the helicopter should stop ascending and user should now be able to control the helicopter.
        if (!this.isFlying && this.posY >= 10.0) {
            this.velocity_vec3[1] = 0.0;
            this.isFlying = true;
            this.ignoreInputs = false;
        }

        // User used the L key...
        if (this.readyToDescend) {

            // TODO: Need to do more verifications (See 4.3.2)
            if (false) {
                console.log("TODO: Check if above lake, above bulding, empty or full bucket...")
            } else {
                // If we aren't top of the lake and on top of the bulding than we need to activate autopilot
                if (this.autoPilotState == -1) {
                    this.autoPilotState = 0;
                }
            }
        }

        // We are only ready to land in the case that we are above the bulding or in the case where the bucket is
        // empty and we are not on top of the lake...
        if (this.readyToLand) {
            this.reset();
        }

    }

    updateHelices(delta) {
        const topHeliceSpeed = 500;
        const backHeliceSpeed = 900;

        // Update helice angles
        this.top_helice_1_ang += topHeliceSpeed * delta;
        this.top_helice_2_ang += topHeliceSpeed * delta;
        this.back_helice_1_ang += backHeliceSpeed * delta;
        this.back_helice_2_ang += backHeliceSpeed * delta;

        // Prevents big values...
        this.top_helice_1_ang %= 360;
        this.top_helice_2_ang %= 360;
        this.back_helice_1_ang %= 360;
        this.back_helice_2_ang %= 360;

        // FIXME: WHY IS THIS HAPPENING ???
        this.top_helice_1_ang = isNaN(this.top_helice_1_ang) ? 0 : this.top_helice_1_ang;
        this.top_helice_2_ang = isNaN(this.top_helice_1_ang) ? 0 : this.top_helice_1_ang;
        this.back_helice_1_ang = isNaN(this.back_helice_1_ang) ? 0 : this.back_helice_1_ang;
        this.back_helice_2_ang = isNaN(this.back_helice_2_ang) ? 0 : this.back_helice_2_ang;
    }

    autoPilotStateUpdate() {

        switch (this.autoPilotState) {
            case 0: // We are dealing with positive Z
                if (this.posZ < 0.0) {
                    this.autoPilotState++;
                    break;
                }

                if (this.posZ > 0.0) {

                    if (this.orientation == 180 || this.orientation == -180) {
                        this.posZ -= 1.0;
                    } else {

                        if (this.orientation <= 0) {
                            this.orientation--;
                        }

                        if (this.orientation > 0) {
                            this.orientation++;
                        }

                    }
                } else {
                    this.posZ = 0.0;
                    this.autoPilotState++;
                }
                break;
            case 1: // We are dealing with negative Z
                if (this.posZ < 0.0) {

                    if (this.orientation == 0) {
                        this.posZ += 1.0;
                    } else {

                        if (this.orientation > 0) {
                            this.orientation--
                        }

                        if (this.orientation <= 0) {
                            this.orientation++
                        }

                    }
                } else {
                    this.autoPilotState++;
                }
                break;
            case 2: // We are dealing with positive X
                if (this.posX < 0.0) {
                    this.autoPilotState++;
                    break;
                }

                if (this.posX > 0.0) {

                    if (this.orientation == 270 || this.orientation == -90) {
                        this.posX -= 1.0;
                    } else {

                        if (this.orientation <= 0) {
                            this.orientation--;
                        }

                        if (this.orientation > 0) {
                            this.orientation++;
                        }

                    }
                } else {
                    this.posX = 0.0;
                    this.autoPilotState++;
                }
                break;
            case 3: // We are dealing with negative X
                if (this.posX < 0.0) {

                    if (this.orientation == 90 || this.orientation == -270) {
                        this.posX += 1.0;
                    } else {

                        if (this.orientation <= 0) {
                            this.orientation--;
                        }

                        if (this.orientation > 0) {
                            this.orientation++;
                        }

                    }
                } else {
                    this.posX = 0.0;
                    this.autoPilotState++;
                }
                break;
            case 4: // Reset the orientation to be the initial one.
                if (this.orientation < 0) {
                    this.orientation++;
                } else {
                    this.orientation--;
                }

                if (this.orientation == 0) {
                    this.autoPilotState++;
                    this.velocity_vec3[1] -= this.scene.baseAcceleration; // Apply the velocity
                }
                break;
            case 5:
                if (this.posY <= 0.5) {
                    this.readyToLand = true;
                    this.autoPilotState = -1;
                }
                break;
            default: // Autopilot is not active
                break;
        }

    }



    update(delta) {
        if (this.posY > 0.0) {
            this.updateHelices(delta);
        }

        // TODO: remove
        //console.log(`OR: ${this.orientation} X: ${this.posX} Y: ${this.posY} Z: ${this.posZ}`)

        // Update autopilot state. If it is set to -1 nothing will happen.
        this.autoPilotStateUpdate();

        // Updates the X, Y and Z position of the helicopter according to delta and the velocity
        this.updatePosition(delta);

        // Checks if the helicopter can stop movement on the Y axis.
        this.flyChecks();

        // Keep the orientation between (-360 and 360).
        this.orientation %= 360;
    }

    turn(v) {
        this.orientation += (v * this.scene.speedFactor);
    }

    accelarate(t) {
        if (this.ignoreInputs) {
            return;
        }

        this.velocity_vec3[0] += this.scene.baseAcceleration * t;
        this.velocity_vec3[2] += this.scene.baseAcceleration * t;

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
        this.isFlying = false;
        this.ignoreInputs = false;
        this.readyToDescend = false;
        this.readyToLand = false;
        this.bucketOpen = false;
        this.autoPilotState = -1;
    }

    fly() {

        // Check if we are already flying and if we need to ignore inputs.
        if (this.isFlying || this.ignoreInputs) {
            return;
        }

        // Prevent interactions with the helicopter while its taking off or desending.
        this.ignoreInputs = true;

        // Start the movement of the helicopter.
        this.velocity_vec3[1] += this.scene.baseAcceleration;

    }

    stopFlying() {

        // Check if we are really flying and if we should ignore inputs.
        if (!this.isFlying || this.ignoreInputs || this.readyToDescend) {
            return;
        }

        // Start the autopilot...
        this.readyToDescend = true;

        // Prevent interactions with the helicopter while its taking off or desending.
        this.ignoreInputs = true;
    }

}
