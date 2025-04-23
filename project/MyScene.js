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

    //Background color
    this.gl.clearColor(0, 0, 0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    // Interface items
    this.displayAxis = false;
    this.displayNormals = false;
    this.inclination = 0;
    this.rotationAxis = false;
    this.trunkRadius = 10;
    this.leavesRGB = 0xffffff;

    this.enableTextures(true);

    this.setUpdatePeriod(50);

    //Initialize scene objects
    this.axis = new CGFaxis(this, 20, 1);
    this.plane = new MyPlane(this, 64);
    this.building = new MyBuilding(this, [0, 0, 0]);

    // TODO: remove and substitute for florest
    this.tree = new MyTree(this, 6, 1, 20, this.inclination, this.rotationAxis, this.trunkRadius, this.leavesRGB);
    this.panorama = new MyPanorama(this, new CGFtexture(this, "textures/panorama.jpg"));

    // Initialize some textures
    this.grass = new CGFtexture(this, "textures/grass.jpg");

  }
  initLights() {
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  initCameras() {
    this.camera = new CGFcamera(
      0.9,
      0.9,
      1000,
      vec3.fromValues(0, 80, 0),
      vec3.fromValues(30, 0, 0)
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

    this.setDefaultAppearance();

    this.building.initBuffers();

    let trMatrix = getTranslationMatrix(...this.camera.position);

    this.pushMatrix();
    this.multMatrix(trMatrix);
    this.panorama.display();
    this.popMatrix();

    this.building.display();

    if (this.camera.position[1] < 0.0) {
      this.camera.position[1] = 0.0;
    }

    //this.tree.display();


    this.scale(400, 1, 400);

    this.rotate(-Math.PI / 2, 1, 0, 0);

    this.grass.bind();
    this.plane.display();


  }
}
