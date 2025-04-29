import { CGFscene, CGFcamera, CGFaxis, CGFtexture } from "../lib/CGF.js";
import { MySphere } from "./MySphere.js";
import { MyPlane } from "./MyPlane.js";
import { getTranslationMatrix, getYRotationMatrix } from './utils/utils.js';
import { MyBuilding } from './MyBuilding.js';
import { MyPanorama } from "./MyPanorama.js";
import { MyTree } from "./MyTree.js";

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
    this.inclination = 0;
    this.rotationAxis = false;
    this.trunkRadius = 10;
    this.leavesRGB = 0xffffff;

    this.enableTextures(true);
    this.setUpdatePeriod(50);

    this.axis = new CGFaxis(this, 20, 1);
    this.plane = new MyPlane(this, 64);

    this.buildingTopTexture = new CGFtexture(this, "textures/buildingTop.png");
    this.buildingSideTexture = new CGFtexture(this, "textures/buildingSide.png");
    this.windowTexture = new CGFtexture(this, "textures/window.jpg");

    // Create three buildings with different sizes and number of floors
    this.centerBuilding = new MyBuilding(
      this, 
      this.buildingTopTexture, 
      this.buildingSideTexture, 
      this.buildingSideTexture, 
      this.windowTexture, 
      3,  // 6 floors for center building
      true
    );
    
    this.leftBuilding = new MyBuilding(
      this, 
      this.buildingSideTexture, 
      this.buildingSideTexture, 
      this.buildingSideTexture, 
      this.windowTexture, 
      2  // 4 floors for left building
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
  }

  initLights() {
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }

  initCameras() {
    this.camera = new CGFcamera(0.9, 0.9, 1000, vec3.fromValues(0, 80, 0), vec3.fromValues(30, 0, 0));
  }

  checkKeys() {
    var text = "Keys pressed: ";
    var keysPressed = false;
    if (this.gui.isKeyPressed("KeyW")) {
      text += " W ";
      keysPressed = true;
    }
    if (this.gui.isKeyPressed("KeyS")) {
      text += " S ";
      keysPressed = true;
    }
    if (keysPressed) console.log(text);
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

  display() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.updateProjectionMatrix();
    this.loadIdentity();
    this.applyViewMatrix();

    if (this.displayAxis) this.axis.display();

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

    // Display ground
    this.pushMatrix();
    this.scale(400, 1, 400);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.grass.bind();
    this.plane.display();
    this.popMatrix();
  }
}