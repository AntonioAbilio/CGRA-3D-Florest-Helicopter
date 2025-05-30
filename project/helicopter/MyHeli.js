import { CGFobject, CGFappearance } from '../../lib/CGF.js';
import { MyHeliPrimitive } from './MyHeliPrimitive.js';
import { getRad, getScalingMatrix, getTranslationMatrix, getXRotationMatrix, getYRotationMatrix, getZRotationMatrix } from '../utils/utils.js';
import { Cube } from './Cube.js'
import { MyBucket } from '../MyBucket.js';
import { MyCircle } from '../MyCircle.js';
import { MyPyramid } from '../MyPyramid.js';

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

        // Water
        this.water = new MyBucket(this.scene);
        this.waterTop = new MyCircle(this.scene);
        this.waterBottom = new MyCircle(this.scene);
        this.lastTimeWaterDropCreated = 0;
        this.waterBucketState = 0;
        this.waterDrops = [];

        // Helicopter's Functionality
        this.shouldFlashLights = false;
        this.isFlying = false;
        this.ignoreInputs = false;
        this.readyToDescend = false;
        this.readyToAscend = false;
        this.readyToLand = false;
        this.bucketOpen = false;
        this.firstTimeHere = true;
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

        this.waterTexture = new CGFappearance(this.scene);
        this.waterTexture.setAmbient(0.9, 0.9, 0.9, 1);
        this.waterTexture.setDiffuse(0.9, 0.9, 0.9, 1);
        this.waterTexture.setSpecular(0.1, 0.1, 0.1, 1);
        this.waterTexture.setShininess(10.0);
        this.waterTexture.loadTexture('textures/waterTex.jpg');
        this.waterTexture.setTextureWrap('REPEAT', 'REPEAT');
    }

    display() {

        for (let idx = 0; idx < this.waterDrops.length; idx++) {
            this.scene.pushMatrix();
            this.scene.multMatrix(getTranslationMatrix(this.waterDrops.at(idx).currentPosition[0], this.waterDrops.at(idx).currentPosition[1], this.waterDrops.at(idx).currentPosition[2]));
            this.scene.multMatrix(getScalingMatrix(0.3, 0.5, 0.3))
            this.waterDrops.at(idx).waterDrop.display();
            this.scene.popMatrix();
        }

        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(this.posX, this.posY, this.posZ));
        this.scene.multMatrix(getYRotationMatrix(180 + this.orientation));

        // Bucket
        if (this.isFlying) {
            this.scene.pushMatrix();
            this.scene.multMatrix(getTranslationMatrix(0, 10, 0));
            if (this.waterBucketState >= 1) {

                this.scene.pushMatrix()
                this.scene.multMatrix(getXRotationMatrix(-180));
                this.waterTexture.apply();
                this.waterBottom.display();
                this.scene.popMatrix();
                this.scene.pushMatrix();

                this.scene.multMatrix(getXRotationMatrix(-90));
                this.waterTexture.apply();
                this.bucket.display();
                this.scene.popMatrix();

                this.scene.pushMatrix()
                this.scene.multMatrix(getScalingMatrix(1, 0.8, 1));
                this.scene.multMatrix(getTranslationMatrix(0, 1, 0));
                this.scene.multMatrix(getXRotationMatrix(180));
                this.waterTexture.apply();
                this.waterTop.display();
                this.scene.popMatrix()

            }
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

            // If the user presses the L key on top of the lake then we will enter this and
            // execute the instructions for the helicopter to descend.

            // But in the case that the user did not press the button while on top of the lake
            // this variable will be already false which means that the user intention was not to
            // fill the bucket but intead to return to the building.
            if (this.firstTimeHere && this.scene.checkIfInsideTheLake([this.posX, this.posY, this.posZ])) {
                // If we hit the final state, pressing the L key does not do anything because the bucket is already full.
                if (this.autoPilotState == -1) {
                    this.autoPilotState = 6;
                }

            } else {
                // If we aren't top of the lake and on top of the bulding than we need to activate autopilot
                if (this.autoPilotState == -1) {
                    this.autoPilotState = 0;
                }
            }
            this.firstTimeHere = false;
        }

        // User used the P key...
        if (this.readyToAscend) {
            if (this.autoPilotState == 11) {
                this.readyToDescend = false;
                this.autoPilotState = 12;
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

        this.top_helice_1_ang = isNaN(this.top_helice_1_ang) ? 0 : this.top_helice_1_ang;
        this.top_helice_2_ang = isNaN(this.top_helice_1_ang) ? 0 : this.top_helice_1_ang;
        this.back_helice_1_ang = isNaN(this.back_helice_1_ang) ? 0 : this.back_helice_1_ang;
        this.back_helice_2_ang = isNaN(this.back_helice_2_ang) ? 0 : this.back_helice_2_ang;
    }

    autoPilotStateUpdate() {
        // Exit early if autopilot is not active
        if (this.autoPilotState < 0) return;


        const rotationStep = 2 * this.scene.getSpeedFactor();
        const movementStep = 0.5 * this.scene.getSpeedFactor();

        // Tolerances
        const posTolerance = 0.1;
        const angleTolerance = 2 * this.scene.getSpeedFactor();

        // Helper function to normalize orientation to [-180, 180]
        const normalizeOrientation = (angle) => {
            let result = angle % 360;
            if (result > 180) result -= 360;
            if (result < -180) result += 360;
            return result;
        };

        // Helper function to get shortest rotation direction
        const getRotationDirection = (current, target) => {
            const normalized = normalizeOrientation(current);
            const diff = normalizeOrientation(target - normalized);
            return diff > 0 ? 1 : -1;
        };

        switch (this.autoPilotState) {
            case 0: // Handle positive Z - rotate to 180 degrees and move to Z=0
                // If we're already in negative Z space, move to next state
                if (this.posZ < -posTolerance) {
                    this.autoPilotState++;
                    break;
                }

                // Check if we need to rotate to 180 degrees
                if (Math.abs(Math.abs(normalizeOrientation(this.orientation)) - 180) > angleTolerance) {
                    // Rotate toward 180 degrees
                    this.orientation += rotationStep * getRotationDirection(this.orientation, 180);
                } else {
                    this.posZ -= movementStep;
                    // If we've reached or passed Z=0, move to next state
                    if (Math.floor(Math.abs(this.posZ)) == 0) {
                        this.posZ = 0.0;
                        this.autoPilotState++;
                    }
                }
                break;

            case 1: // Handle negative Z - rotate to 0 degrees and move to Z=0
                // If Z is already near 0, move to next state
                if (Math.floor(Math.abs(this.posZ)) == 0.0) {
                    this.posZ = 0.0;
                    this.autoPilotState++;
                    break;
                }

                // Check if we need to rotate to 0 degrees
                if (Math.abs(normalizeOrientation(this.orientation)) > angleTolerance) {
                    // Rotate toward 0 degrees
                    this.orientation += rotationStep * getRotationDirection(this.orientation, 0);
                } else {
                    // If properly oriented, move forward
                    this.posZ += movementStep;
                }
                break;

            case 2: // Handle positive X - rotate to -90 or 270 degrees and move to X=0
                // If we're already in negative X space, move to next state
                if (this.posX < -posTolerance) {
                    this.autoPilotState++;
                    break;
                }

                // Check if we need to rotate to -90 degrees
                if (Math.abs(normalizeOrientation(this.orientation) - (-90)) > angleTolerance &&
                    Math.abs(normalizeOrientation(this.orientation) - 270) > angleTolerance) {
                    // Rotate toward -90 degrees
                    this.orientation += rotationStep * getRotationDirection(this.orientation, -90);
                } else {
                    this.posX -= movementStep;

                    // If we've reached or passed X=0, move to next state
                    if (Math.floor(Math.abs(this.posX)) == 0) {
                        this.posX = 0.0;
                        this.autoPilotState++;
                    }
                }
                break;

            case 3: // Handle negative X - rotate to 90 degrees and move to X=0
                // If X is already near 0, move to next state
                if (Math.floor(Math.abs(this.posX)) == 0.0) {
                    this.posX = 0.0;
                    this.autoPilotState++;
                    break;
                }

                // Check if we need to rotate to 90 degrees
                if (Math.abs(normalizeOrientation(this.orientation) - 90) > angleTolerance) {
                    // Rotate toward 90 degrees
                    this.orientation += rotationStep * getRotationDirection(this.orientation, 90);
                } else {
                    this.posX += movementStep;
                }
                break;
            case 4: // Reset orientation to 0 degrees

                // If already at 0 orientation, move to landing state
                if (Math.abs(normalizeOrientation(this.orientation)) < angleTolerance) {
                    this.orientation = 0;
                    this.autoPilotState++;
                    this.velocity_vec3[1] -= this.scene.baseAcceleration; // Apply downward velocity
                    break;
                }

                // Rotate toward 0 degrees
                this.orientation += rotationStep * getRotationDirection(this.orientation, 0);
                break;

            case 5: // Land the helicopter
                if (this.posY <= 0.5) {
                    this.readyToLand = true;
                    this.autoPilotState = -1;
                }
                break;
            case 6: // Handle Z > 34 - rotate to 180 degrees and move to Z=34
                if (Math.floor(Math.abs(this.posZ)) <= 34.0) {
                    this.autoPilotState++;
                    break;
                }

                // Check if we need to rotate to 180 degrees
                if (Math.abs(Math.abs(normalizeOrientation(this.orientation)) - 180) > angleTolerance) {
                    this.orientation += rotationStep * getRotationDirection(this.orientation, 180);
                } else {
                    this.posZ -= movementStep;
                    // If we've reached or passed Z=34, move to next state
                    if (Math.floor(Math.abs(this.posZ)) == 34.0) {
                        this.posZ = 34.0;
                        this.autoPilotState++;
                    }
                }
                break;
            case 7: // Handle Z < 34 - rotate to 0 degrees and move to Z=34
                if (Math.floor(Math.abs(this.posZ)) >= 34.0) {
                    this.autoPilotState++;
                    break;
                }

                // Check if we need to rotate to 0 degrees
                if (Math.abs(normalizeOrientation(this.orientation)) > angleTolerance) {
                    this.orientation += rotationStep * getRotationDirection(this.orientation, 0);
                } else {
                    this.posZ += movementStep;
                }
                break;
            case 8: // Handle X > 82 - rotate to -90 or 270 degrees and move to X=82
                if (Math.floor(Math.abs(this.posX)) <= 82.0) {
                    this.autoPilotState++;
                    break;
                }

                // Check if we need to rotate to -90 degrees
                if (Math.abs(normalizeOrientation(this.orientation) - (-90)) > angleTolerance && Math.abs(normalizeOrientation(this.orientation) - 270) > angleTolerance) {
                    this.orientation += rotationStep * getRotationDirection(this.orientation, -90);
                } else {
                    this.posX -= movementStep;

                    if (Math.floor(Math.abs(this.posX)) == 82.0) {
                        this.posX = 82.0;
                        this.autoPilotState++;
                    }
                }
                break;
            case 9:  // Handle X < 82 - rotate to 90 degrees and move to X=82
                if (Math.floor(Math.abs(this.posX)) >= 82.0) {
                    this.posX = 82.0;
                    this.autoPilotState++;
                    break;
                }

                // Check if we need to rotate to 90 degrees
                if (Math.abs(normalizeOrientation(this.orientation) - 90) > angleTolerance) {
                    this.orientation += rotationStep * getRotationDirection(this.orientation, 90);
                } else {
                    this.posX += movementStep;
                }
                break;
            case 10: // Lower the helicoper to capture the water
                this.posY -= movementStep

                if (this.posY < -10.0)
                    this.autoPilotState++;
                break;
            case 11: // Capture the water
                this.waterBucketState = 1; // Since we have touched the water our bucket will be filled.
                this.ignoreInputs = false;
                break;
            case 12: // As soon as the user is ready to ascend, do it.
                if (this.posY >= 10.0) {
                    this.posY = 10.0;
                    this.ignoreInputs = false;
                    this.autoPilotState = -1;
                    break;
                }
                this.posY += movementStep;
                break;
        }

        // TODO: remove
        console.log(this.autoPilotState)

        this.velocity_vec3 = [0.0, this.velocity_vec3[1], 0.0];
        this.inclination = 0;
    }

    updateAnimations(delta) {
        this.shouldFlashLights = false;
        if (this.posY > 0.0 || this.isFlying) {
            this.updateHelices(delta);

            // We can only toggle between the "H" and the "UP" textures when we actually take off from the bulding.
            if (!this.readyToDescend && this.waterBucketState == 0) {
                if (this.posY < 9.0) {
                    if (!this.lastTextureToggleTime) {
                        this.lastTextureToggleTime = 0;
                    }

                    const currentTime = performance.now();

                    if (currentTime - this.lastTextureToggleTime >= 150) {
                        this.scene.buildings.centerBuilding.toggleUpTexture();
                        this.lastTextureToggleTime = currentTime;
                    }
                    this.shouldFlashLights = true;
                } else {
                    this.scene.buildings.centerBuilding.setTopTextureSelector(0);
                }

            }
        }

        if (this.autoPilotState >= 0 && this.autoPilotState <= 5) {
            if (this.posY > 1.0) {
                if (!this.lastTextureToggleTime) {
                    this.lastTextureToggleTime = 0;
                }

                const currentTime = performance.now();

                if (currentTime - this.lastTextureToggleTime >= 200) {
                    this.scene.buildings.centerBuilding.toggleDownTexture();
                    this.lastTextureToggleTime = currentTime;
                }
            } else {
                this.scene.buildings.centerBuilding.setTopTextureSelector(0);
            }
            this.shouldFlashLights = true
        }
    }

    update(delta) {
        // Controlls whether the building shows "UP", "DOWN" or "H" texture.
        // Also controlls the propellers of the helicopter.
        this.updateAnimations(delta);

        // State machine that updates the bucket.
        this.updateBucketState();

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
        if (this.ignoreInputs || !this.isFlying) {
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
        this.waterBucketState = 0;
        this.waterDrops = [];
        this.readyToAscend = false;
        this.firstTimeHere = true;
        this.shouldFlashLights = false;
        this.autoPilotState = -1;
    }

    fly() {

        // This may also indicate that the user has pressed the button to ascend.
        // This is mostly for the case where the helicopter went down to get water and is now trying to fly up again.
        this.readyToAscend = true;

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

        this.readyToAscend = false;

        // Start the autopilot...
        this.readyToDescend = true;

        // Prevent interactions with the helicopter while its taking off or desending.
        this.ignoreInputs = true;
    }

    updateBucketState() {
        switch (this.waterBucketState) {
            case 0: // Bucket is empty and need to be filled
                break;
            case 1: // Bucket is full
                break;
            case 2: // The user wants to drop the water to extinguish the fire.
                this.readyToDescend = false; // While we are dropping the water the helicopeter cannot descend.
                if (!this.lastTimeWaterDropCreated) {
                    this.lastTimeWaterDropCreated = 0;
                }

                const currentTime = performance.now();

                if (currentTime - this.lastTimeWaterDropCreated >= (1 / this.scene.raindropFreq) * 1000) {
                    console.log("Water drop created")
                    this.waterDrops.push({
                        waterDrop: new MyPyramid(this.scene, 0xffffff, this.scene.raindropSize, 'textures/waterTex.jpg'), currentPosition: [this.posX, this.posY + 10, this.posZ]
                    });
                    this.lastTimeWaterDropCreated = currentTime;
                }

                for (let idx = 0; idx < this.waterDrops.length; idx++) {
                    let newWaterX = this.waterDrops.at(idx).currentPosition[0];
                    let newWaterY = this.waterDrops.at(idx).currentPosition[1] - 1;
                    let newWaterZ = this.waterDrops.at(idx).currentPosition[2];
                    this.waterDrops.at(idx).currentPosition = [newWaterX, newWaterY, newWaterZ];
                    this.scene.florest.stopFire([newWaterX, newWaterY, newWaterZ]);
                }

                break;
            case 3: // After releasing the water drops the bucket will be empty again
                this.waterBucketState = 0;
                this.bucketOpen = false;
                this.waterDrops = [];
                // Excluding the reset only when we drop the water that we have can we go back to the lake to pick up more.
                this.firstTimeHere = true;
                break;
            default:
                break;
        }
    }

    openBucket() {

        if (this.waterBucketState == 1 && this.scene.florest.checkIfHelicopterInside([this.posX, this.posY, this.posZ])) {
            this.waterBucketState = 2; // Let's let the water fall out.
            this.bucketOpen = true;
        }

    }

}
