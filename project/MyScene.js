import { CGFscene, CGFappearance, CGFcamera, CGFaxis, CGFtexture, CGFshader } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { getScalingMatrix, getTranslationMatrix, getXRotationMatrix, getYRotationMatrix } from './utils/utils.js';
import { MyBuilding } from './MyBuilding.js';
import { MyPanorama } from "./MyPanorama.js";
import { MyTree } from "./tree/MyTree.js";
import { MyFlorest } from "./MyFlorest.js";
import { MyHeli } from "./helicopter/MyHeli.js";
import { MyBuildings } from "./MyBuildings.js";

import { MyFire } from "./MyFire.js";
import { MyHeliLight } from "./MyHeliLight.js";

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
    this.raindropSize = 1;
    this.raindropFreq = 1;

    //Building

    this.buildingColor = 0xffffff;

    this.enableTextures(true);
    this.setUpdatePeriod(50);

    this.axis = new CGFaxis(this, 20, 1);
    this.plane = new MyPlane(this, 200);
    //this.building = new MyBuilding(this, [0, 0, 0]);
    this.heli = new MyHeli(this, 0.0, 0.0, 0.0, 0, [0, 0, 0]);

    this.fireTexture = new CGFtexture(this, "textures/fire.jpg");

    this.forestLines = 5;
    this.forestColumns = 4;
    this.florest = new MyFlorest(this, this.forestLines, this.forestColumns, this.fireTexture);
    this.plane = new MyPlane(this, 64);

    this.buildingTopTexture = new CGFtexture(this, "textures/buildingTop.png");
    this.buildingTopDown = new CGFtexture(this, "textures/buildingTopDown.png");
    this.buildingTopUp = new CGFtexture(this, "textures/buildingTopNew.png");

    this.buildingSideTexture = new CGFtexture(this, "textures/buildingSide.png");
    this.buildingFrontTexture = new CGFtexture(this, "textures/buildingSideFront.png");

    this.defaultWindow = 0;

    this.windowTextureList = {
      'Window Type 1': 0,
      'Window Type 2': 1,
      'Window Type 3': 2
    };

    this.windowText = [
      new CGFtexture(this, "textures/window.jpg"),
      new CGFtexture(this, "textures/window2.jpg"),
      new CGFtexture(this, "textures/window3.jpg")
    ];

    this.buildings = new MyBuildings(
      this,
      this.buildingTopTexture,
      this.buildingTopDown,
      this.buildingTopUp,
      this.buildingFrontTexture,
      this.buildingSideTexture,
      this.windowText[this.defaultWindow]
    );

    this.buildingWidth = 1;
    this.floorCount = 4;
    this.windowCount = 2;

    this.displayTree = false;
    this.tree = new MyTree(this, (Math.random() + 0.2) * 10, -6 + (12 * Math.random()), -6 + (12 * Math.random()), 1, 0x184632, false);
    this.panorama = new MyPanorama(this, new CGFtexture(this, "textures/panorama.jpg"));

    this.grass = new CGFtexture(this, "textures/grass.jpg");
    this.appearance = new CGFappearance(this);
    this.appearance.setTexture(this.grass);
    //this.appearance.setTextureWrap('REPEAT', 'REPEAT');

    this.waterTex = new CGFtexture(this, "textures/waterTex.jpg");
    this.waterMap = new CGFtexture(this, "textures/waterMap.png");
    this.waterShader = new CGFshader(this.gl, "shaders/water.vert", "shaders/water.frag");


    this.waterShader.setUniformsValues({
      uSampler: 0,
      uSampler2: 1,
      uSampler3: 2,
      timeFactor: 0
    })
  }

  updateWindowTexture(index) {
    this.buildings.updateWindow(this.windowText[index]);
  }

  updateMovX(value) {
    this.movX = value;
  }
  updateMovY(value) {
    this.movY = value;
  }
  updateMovZ(value) {
    this.movZ = value;
  }

  updateBuildingWidth(wid) {
    this.buildingWidth = wid;
  }

  checkIfInsideTheLake(position) {
    // Lake parameters
    const lakeCenter = { x: 82, z: 34 };
    const lakeRadius = 45;

    const dx = position[0] - lakeCenter.x;
    const dz = position[2] - lakeCenter.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    // Return true if helicopter is inside lake
    return distance < lakeRadius;
  }

  getSpeedFactor() {
    return this.speedFactor;
  }

  initLights() {
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }

  initCameras() {
    this.camera = new CGFcamera(
      1.0,
      0.9,
      1000,
      vec3.fromValues(-31, 56, -47),
      vec3.fromValues(20, 0, 20)
    );
  }

  checkKeys(deltaTime) {
    var text = "Keys pressed: ";
    var keysPressed = false;

    if (this.gui.isKeyPressed("KeyS")) {
      text += " S ";
      keysPressed = true;
      this.heli.accelarate(-deltaTime);
    }

    // The boolean is only true if the user is pressing the S key because it's the only check that is above
    // the W key. This is mimicking the normal behavior of a vehicle where if a user presses both the accelarator
    // and the brake at the same time the brake has priority over the accelarator.
    if (this.gui.isKeyPressed("KeyW") && !keysPressed) {
      text += " W ";
      keysPressed = true;
      this.heli.accelarate(deltaTime);
    }

    if (this.gui.isKeyPressed("KeyA")) {
      text += " A ";
      keysPressed = true;
      this.heli.turn(1);
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

    if (this.gui.isKeyPressed("KeyO")) {
      text += " O ";
      keysPressed = true;
      this.heli.openBucket();
    }


    if (keysPressed) console.log(text);
  }

  update(time) {

    this.waterShader.setUniformsValues({ timeFactor: time / 1000 % 1000 });

    if (this.prevTime === 0) {
      this.prevTime = time;
      return; // Skip first frame
    }

    const deltaTime = (time - this.prevTime) / 1000;
    this.prevTime = time;

    this.checkKeys(deltaTime);

    this.heli.update(deltaTime);

    this.buildings.update(time);
  }

  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }

  updateBuildingColor(color) {
    this.buildings.updateColor(color);
  }

  updateFloorCount(count) {
    this.buildings.updateFloorCount(count);
  }

  updateFloorWindowCount(count) {
    this.buildings.updateFloorWindowCount(count);
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

    let trMatrix = getTranslationMatrix(...this.camera.position);
    this.pushMatrix();
    this.multMatrix(trMatrix);
    this.panorama.display();
    this.popMatrix();

    if (this.camera.position[1] < 0.0) this.camera.position[1] = 0.0;

    if (this.displayTree) {
      this.pushMatrix();
      this.multMatrix(getTranslationMatrix(20, 0, 20));
      this.tree.display();
      this.popMatrix();
    }

    this.florest.display();

    this.heli.display();

    this.pushMatrix();
    this.multMatrix(getScalingMatrix(this.buildingWidth, 1, this.buildingWidth))
    this.buildings.display();
    this.popMatrix();


    // Display ground
    this.pushMatrix();
    this.scale(400, 1, 400);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.setActiveShader(this.waterShader);
    this.grass.bind(0);
    this.waterMap.bind(1);
    this.waterTex.bind(2);
    this.appearance.apply();
    this.plane.display();
    this.setActiveShader(this.defaultShader);
    this.popMatrix();

  }
}