import { CGFscene, CGFappearance, CGFcamera, CGFaxis, CGFtexture } from "../lib/CGF.js";
import { MySphere } from "./MySphere.js";
import { MyPlane } from "./MyPlane.js";
import { getTranslationMatrix, getXRotationMatrix, getYRotationMatrix } from './utils/utils.js';
import { MyBuilding } from './MyBuilding.js';
import { MyPanorama } from "./MyPanorama.js";
import { MyTree } from "./tree/MyTree.js";
import { MyFlorest } from "./MyFlorest.js";


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

    //Background color
    this.gl.clearColor(0, 0, 0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    // Interface items
    this.displayAxis = false;
    this.displayNormals = false;

    // Tree Settings
    this.treeSize = 10;
    this.X_inclination = 0.0;
    this.Z_inclination = 0.0;
    this.rotationAxis = false;
    this.trunkRadius = 1.5;
    this.leavesRGB = 0x184632;

    this.enableTextures(true);

    this.setUpdatePeriod(50);

    //Initialize scene objects
    this.axis = new CGFaxis(this, 20, 1);
    this.plane = new MyPlane(this, 200);
    this.building = new MyBuilding(this, [0, 0, 0]);

    // TODO: remove and substitute for florest

    this.displayTree = false;
    this.tree = new MyTree(this, this.treeSize, this.X_inclination, this.Z_inclination, this.rotationAxis, this.trunkRadius, this.leavesRGB);

    this.forestLines = 5;
    this.forestColumns = 4;
    this.florest = new MyFlorest(this, this.forestLines, this.forestColumns);
    this.panorama = new MyPanorama(this, new CGFtexture(this, "textures/panorama.jpg"));

    // Initialize some textures
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
      vec3.fromValues(10, 80, 10),
      vec3.fromValues(20, 0, 20)
    );
  }
  checkKeys() {
    var text = "Keys pressed: ";
    var keysPressed = false;

    // Check for key codes e.g. in https://keycode.info/
    if (this.gui.isKeyPressed("KeyW")) {
      text += " W ";
      keysPressed = true;
    }

    if (this.gui.isKeyPressed("KeyS")) {
      text += " S ";
      keysPressed = true;
    }
    if (keysPressed)
      console.log(text);
  }

  update(t) {
    this.checkKeys();
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
    this.florest.updateLines(numLines);
  }

  updateForestColumns(numCols) {
    this.forestColumns = numCols;
    this.florest.updateColumns(numCols);
  }


  display() {
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Draw axis
    if (this.displayAxis)
      this.axis.display();

    if (this.camera.position[1] < 0.0) {
      this.camera.position[1] = 0.0;
    }

    this.setDefaultAppearance();

    this.building.initBuffers();

    let trMatrix = getTranslationMatrix(...this.camera.position);

    this.pushMatrix();
    this.multMatrix(trMatrix);
    this.panorama.display();
    this.popMatrix();


    this.building.display();

    if (this.displayTree) {
      this.tree.display();
    }

    this.pushMatrix();
    this.multMatrix(getYRotationMatrix(90))
    this.multMatrix(getTranslationMatrix(0, 0, 0));
    this.florest.display();
    this.popMatrix()

    this.scale(400, 1, 400);
    this.rotate(-Math.PI / 2, 1, 0, 0);

    this.pushMatrix();
    this.appearance.apply();
    this.plane.display();
    this.popMatrix();

  }
}
