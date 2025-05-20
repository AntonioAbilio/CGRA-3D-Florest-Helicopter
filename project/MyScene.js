import { CGFscene, CGFappearance, CGFcamera, CGFaxis, CGFtexture } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { getTranslationMatrix, getXRotationMatrix, getYRotationMatrix } from './utils/utils.js';
import { MyBuilding } from './MyBuilding.js';
import { MyPanorama } from "./MyPanorama.js";
import { MyTree } from "./tree/MyTree.js";
import { MyFlorest } from "./MyFlorest.js";
import { MyHeli } from "./helicopter/MyHeli.js";

import { MyFire } from "./MyFire.js";

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
  }
  init(application) {
    super.init(application);

    this.initCameras();
    this.initLights();

    this.gl.clearColor(0, 0, 0, 1.0);
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.displayAxis = false;
    this.displayNormals = false;

    // World variables
    this.baseAcceleration = 9.8;
    this.speedFactor = 3;

    // Tree Settings
    this.treeSize = 10;
    this.X_inclination = 0.0;
    this.Z_inclination = 0.0;
    this.rotationAxis = false;
    this.trunkRadius = 1.5;
    this.leavesRGB = 0x184632;

    this.enableTextures(true);
    this.setUpdatePeriod(50);

    this.axis = new CGFaxis(this, 20, 1);
    this.plane = new MyPlane(this, 200);
    this.building = new MyBuilding(this, [0, 0, 0]);
    this.heli = new MyHeli(this, 0.0, 0.0, 0.0, 0, [0, 0, 0]);
    // TODO: remove and substitute for florest

    this.displayTree = false;
    this.tree = new MyTree(this, this.treeSize, this.X_inclination, this.Z_inclination, this.rotationAxis, this.trunkRadius, this.leavesRGB);


    this.fireTexture = new CGFtexture(this, "textures/fire.jpg");
    this.fire = new MyFire(this, this.fireTexture, 4);

    this.forestLines = 5;http://127.0.0.1:5500/project/
    this.forestColumns = 4;
    this.florest = new MyFlorest(this, this.forestLines, this.forestColumns);
    this.plane = new MyPlane(this, 64);

    this.buildingTopTexture = new CGFtexture(this, "textures/buildingTop.png");
    this.buildingSideTexture = new CGFtexture(this, "textures/buildingSide.png");
    this.buildingFrontTexture = new CGFtexture(this, "textures/buildingSideFront.png");
    this.windowTexture = new CGFtexture(this, "textures/window.jpg");

    // Create three buildings with different sizes and number of floors
    this.centerBuilding = new MyBuilding(
      this,
      this.buildingTopTexture,
      this.buildingFrontTexture,
      this.buildingSideTexture,
      this.windowTexture,
      3,
      true
    );

    this.leftBuilding = new MyBuilding(
      this,
      this.buildingSideTexture,
      this.buildingSideTexture,
      this.buildingSideTexture,
      this.windowTexture,
      2
    );

    this.rightBuilding = new MyBuilding(
      this,
      this.buildingSideTexture,
      this.buildingSideTexture,
      this.buildingSideTexture,
      this.windowTexture,
      2  // 5 floors for right building
    );

    this.tree = new MyTree(this, 6, 1, 20, this.inclination, this.rotationAxis, this.trunkRadius, this.leavesRGB);
    this.panorama = new MyPanorama(this, new CGFtexture(this, "textures/panorama.jpg"));

    this.grass = new CGFtexture(this, "textures/grass.jpg");
    this.appearance = new CGFappearance(this);
    this.appearance.setTexture(this.grass);
    this.appearance.setTextureWrap('REPEAT', 'REPEAT');

  }

  initLights() {
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }

  initCameras() {
    this.camera = new CGFcamera(
      0.6,
      0.9,
      1000,
      vec3.fromValues(-31, 56, -47),
      vec3.fromValues(20, 0, 20)
    );
  }

  checkKeys(deltaTime) {
    var text = "Keys pressed: ";
    var keysPressed = false;
    if (this.gui.isKeyPressed("KeyW")) {
      text += " W ";
      keysPressed = true;
      this.heli.accelarate(deltaTime);
    }

    if (this.gui.isKeyPressed("KeyA")) {
      text += " A ";
      keysPressed = true;
      this.heli.turn(1);
    }

    if (this.gui.isKeyPressed("KeyS")) {
      text += " S ";
      keysPressed = true;
      this.heli.accelarate(-deltaTime);
    }

    if (this.gui.isKeyPressed("KeyD")) {
      text += " D ";
      keysPressed = true;
      this.heli.turn(-1);
    }

    if (this.gui.isKeyPressed("KeyR")) {
      text += " R ";
      keysPressed = true;
      this.heli.reset();
    }

    if (this.gui.isKeyPressed("KeyP")) {
      text += " P ";
      keysPressed = true;
      this.heli.fly();
    }

    if (this.gui.isKeyPressed("KeyL")) {
      text += " L ";
      keysPressed = true;
      this.heli.stopFlying();
    }


    if (keysPressed) console.log(text);
  }

  update(t) {

    if (this.prevTime === 0) {
      this.prevTime = t;
      return; // Skip first frame
    }

    const deltaTime = (t - this.prevTime) / 1000;
    this.prevTime = t;

    this.checkKeys(deltaTime);

    this.heli.update(deltaTime);
  }

  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }

  updateAmountOfLeaves(newSize) {
    this.tree.updateAmountOfLeaves(newSize)
  }

  updateTrunkRadius(newRadius) {
    this.tree.updateTrunkRadius(newRadius);
  }

  updateLeavesColors(hexColor) {
    this.tree.updateLeavesColors(hexColor);
  }

  updateTreeXInclination(inclination) {
    this.tree.updateXInclination(inclination);
  }

  updateTreeZInclination(inclination) {
    this.tree.updateZInclination(inclination);
  }

  updateForestLines(numLines) {
    this.forestLines = numLines;
    this.florest.update(undefined, numLines);
  }

  updateForestColumns(numCols) {
    this.forestColumns = numCols;
    this.florest.update(numCols, undefined);
  }

  updateSpeedFactor(speedFactor) {
    this.speedFactor = speedFactor;
    this.baseAcceleration = 9.8 * speedFactor;
  }


  display() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.updateProjectionMatrix();
    this.loadIdentity();
    this.applyViewMatrix();

    if (this.displayAxis) this.axis.display();

    if (this.camera.position[1] < 0.0) {
      this.camera.position[1] = 0.0;
    }

    this.setDefaultAppearance();

    // Initialize buffers for all buildings
    this.centerBuilding.initBuffers();
    this.leftBuilding.initBuffers();
    this.rightBuilding.initBuffers();

    let trMatrix = getTranslationMatrix(...this.camera.position);
    this.pushMatrix();
    this.multMatrix(trMatrix);
    this.panorama.display();
    this.popMatrix();


    // Display center tall building
    this.pushMatrix();
    this.translate(0, 10, 0);
    this.scale(1.5, 2, 1.5); // Make center building taller
    this.centerBuilding.display(); // Windows are automatically displayed with the building
    this.popMatrix();

    // Display left smaller building
    this.pushMatrix();
    this.translate(-13.5, 7.5, 0); // Position to the left
    this.scale(1.2, 1.5, 1); // Make it smaller
    this.leftBuilding.display(); // Windows are automatically displayed with the building
    this.popMatrix();

    // Display right smaller building
    this.pushMatrix();
    this.translate(13.5, 7.5, 0); // Position to the right
    this.scale(1.2, 1.5, 1); // Make it smaller
    this.rightBuilding.display(); // Windows are automatically displayed with the building
    this.popMatrix();

    if (this.camera.position[1] < 0.0) this.camera.position[1] = 0.0;

    if (this.displayTree) {
      this.pushMatrix();
      this.multMatrix(getTranslationMatrix(30, 0, 30));
      this.tree.display();
      this.popMatrix();
    }

    this.pushMatrix();
    this.multMatrix(getYRotationMatrix(90));
    this.multMatrix(getTranslationMatrix(0, 0, 0));
    this.florest.display();
    this.popMatrix()

    this.heli.display();

    this.pushMatrix();
    this.translate(0, 10, 30); // adjust as needed
    this.fire.display();
    this.popMatrix();

    // Display ground
    this.pushMatrix();
    this.scale(400, 1, 400);
    this.rotate(-Math.PI / 2, 1, 0, 0);

    this.pushMatrix();
    this.appearance.apply();
    this.plane.display();
    this.popMatrix();

  }
}