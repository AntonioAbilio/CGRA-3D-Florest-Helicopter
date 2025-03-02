import { CGFscene, CGFcamera, CGFaxis } from "../lib/CGF.js";
import { MyQuad } from "./Objects/MyQuad.js";
import { MyTangram } from "./Objects/MyTangram.js";
import { MyUnitCube } from "./Objects/MyUnitCube.js";
import { MyUnitCubeQuad } from "./Objects/MyUnitCubeQuad.js";
import { getXRotationMatrix, getZRotationMatrix } from "./utils/utils.js";


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
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    //Initialize scene objects
    this.axis = new CGFaxis(this);

    this.tangram = new MyTangram(this);
    this.unitCube = new MyUnitCube(this);
    this.quad = new MyQuad(this);
    this.unitCubeQuad = new MyUnitCubeQuad(this);

    //Objects connected to MyInterface
    this.displayAxis = true;
    this.scaleFactor = 1;
    this.showTangram = true;
    this.showUnitCube = false;
    this.showQuad = false;
    this.showUnitCubeQuad = true;
  }
  initLights() {
    this.lights[0].setPosition(15, 2, 5, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  initCameras() {
    this.camera = new CGFcamera(
      0.4,
      0.1,
      500,
      vec3.fromValues(15, 15, 15),
      vec3.fromValues(0, 0, 0)
    );
  }
  setDefaultAppearance() {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
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
    if (this.displayAxis) this.axis.display();

    this.setDefaultAppearance();


    if (this.showTangram) {
      this.pushMatrix()
      this.multMatrix(getXRotationMatrix(-90))
      this.translate(2 * Math.sqrt(2) + 1, - 2 * Math.sqrt(2), 0)
      this.tangram.display();
      this.popMatrix()
      this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    }

    // Place the cube behind the tangram
    if (this.showUnitCube) {
      this.pushMatrix();
      this.scale(8, 8, 8)
      this.translate(0.5, -0.51, 0.5);
      this.setDiffuse(1, 1, 1, 0)
      this.unitCube.display();
      this.popMatrix()
      this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    }

    if (this.showQuad) {
      this.quad.display()
    }

    if (this.showUnitCubeQuad) {
      this.setDiffuse(0.2, 0.4, 0.8, 1.0);
      this.pushMatrix();
      this.scale(8, 8, 8)
      this.translate(0.5, -0.51, 0.5);
      this.unitCubeQuad.display()
      this.popMatrix()
    }

  }
}
