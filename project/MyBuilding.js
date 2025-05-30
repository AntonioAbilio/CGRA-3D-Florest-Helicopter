import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { CGFshader } from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';
import { MyWindow } from './MyWindow.js';
import { getTranslationMatrix, getXRotationMatrix, getYRotationMatrix } from './utils/utils.js';
import { MyHeliLight } from "./MyHeliLight.js";

/**
 * MyBuilding
 * @constructor
 * @param scene - Reference to MyScene object
 * @param topTexture - Texture for the top face
 * @param frontTexture - Texture for the front face
 * @param sideTexture - Texture for the side faces
 * @param windowTexture - Texture for windows (new parameter)
 * @param floors - Number of floors (new parameter)
 * @param width - Width of the building (defaults to 10)
 * @param height - Height of the building (defaults to 20)
 * @param depth - Depth of the building (defaults to 10)
 */
export class MyBuilding extends CGFobject {
    constructor(scene, topTexture, frontTexture, sideTexture, windowTexture, width = 10, height = 10, depth = 10, floors = 4, entrance = false, topTextureDown = null, topTextureUp = null) {
        super(scene);

        this.quad = new MyQuad(scene);
        this.window = new MyWindow(scene, windowTexture);

        this.width = width;
        this.height = height;
        this.depth = depth;
        this.floors = floors;

        this.windowsPerFloor = 2;

        this.entrance = entrance;
        this.isCenterBuilding = (entrance === true);
        this.textureFiltering = this.scene.gl.NEAREST;

        // Default white color
        const white = [1.0, 1.0, 1.0, 1.0];

        // MATERIALS
        this.topMaterial = new CGFappearance(scene);
        this.topMaterial.setTexture(topTexture);
        this.topMaterial.setAmbient(...white);
        this.topMaterial.setDiffuse(...white);
        this.topMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.topMaterial.setShininess(10);

        this.frontMaterial = new CGFappearance(scene);
        this.frontMaterial.setTexture(frontTexture);
        this.frontMaterial.setAmbient(...white);
        this.frontMaterial.setDiffuse(...white);
        this.frontMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.frontMaterial.setShininess(10);

        this.sideMaterial = new CGFappearance(scene);
        this.sideMaterial.setTexture(sideTexture);
        this.sideMaterial.setAmbient(...white);
        this.sideMaterial.setDiffuse(...white);
        this.sideMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.sideMaterial.setShininess(10);

        if (this.isCenterBuilding) {
            this.heliLights = [
                new MyHeliLight(scene, -this.width / 2 + 0.5, this.height / 2 + 0.2, -this.depth / 2 + 0.5),
                new MyHeliLight(scene, this.width / 2 - 0.5, this.height / 2 + 0.2, -this.depth / 2 + 0.5),
                new MyHeliLight(scene, -this.width / 2 + 0.5, this.height / 2 + 0.2, this.depth / 2 - 0.5),
                new MyHeliLight(scene, this.width / 2 - 0.5, this.height / 2 + 0.2, this.depth / 2 - 0.5),
            ];
        }

        this.initializeWindowProperties();

        this.topShader = new CGFshader(this.scene.gl, "shaders/dynamicTop.vert", "shaders/dynamicTop.frag");
        this.texSelector = 1;

        this.topShader.setUniformsValues({
            uTex0: 0,
            uTex1: 1,
            uTex2: 2,
            uTexSelector: 0
        });

        this.topTexture = topTexture;
        this.topTextureDown = topTextureDown;
        this.topTextureUp = topTextureUp;
    }

    setWindowTexture(texture){
        this.window.material.setTexture(texture);
    }


    setBuildingColor(hexColor) {
        // Extract RGB components from hexColor (0xRRGGBB)
        const r = ((hexColor >> 16) & 0xFF) / 255;
        const g = ((hexColor >> 8) & 0xFF) / 255;
        const b = (hexColor & 0xFF) / 255;
        const a = 1.0;

        const materials = [this.topMaterial, this.frontMaterial, this.sideMaterial];

        for (let material of materials) {
            material.setAmbient(r, g, b, a);
            material.setDiffuse(r, g, b, a);
            material.setSpecular(0.1, 0.1, 0.1, a);
            material.setShininess(10);
        }
    }

    initializeWindowProperties() {
        // Calculate floor height
        this.floorHeight = (this.height / this.floors);
        this.windowWidth = (this.width / this.windowsPerFloor);
        
        // Window dimensions - proportional to building size
        this.windowWidth = this.windowWidth * 0.4;
        this.windowHeight = this.floorHeight * 0.6;

        // Window spacing from the edges
        this.windowMarginX = this.width * 0.1;
        this.windowMarginY = this.floorHeight * 0.2;
    }

    setTopTextureSelector(selector) {
        this.texSelector = selector;
        this.topShader.setUniformsValues({ uTexSelector: this.texSelector });
    }

    toggleUpTexture() {
        if (this.toggle) {
            this.setTopTextureSelector(2);
        } else {
            this.setTopTextureSelector(0);
        }
        this.toggle = !this.toggle;
    }

    toggleDownTexture() {
        if (this.toggle) {
            this.setTopTextureSelector(1);
        } else {
            this.setTopTextureSelector(0);
        }
        this.toggle = !this.toggle;
    }

    displayWindow(x, y, z) {
        this.scene.pushMatrix();
        this.scene.translate(x, y, z);
        this.scene.scale(this.windowWidth, this.windowHeight, 1);
        this.window.display();
        this.scene.popMatrix();
    }

    update(t) {
        if (this.isCenterBuilding) {
            this.heliLights.forEach(light => light.update(t));
        }
    }

    displayFaceWindows(isFront) {

        // Position for the front face
        const posZ = isFront ? this.depth / 2 + 0.01 : -this.depth / 2 - 0.01;
        // Rotation for the back face (if not front)
        const rotation = isFront ? 0 : Math.PI;

        // Calculate left and right positions for windows
        const leftQuarterX = -this.width / 4;
        const rightQuarterX = this.width / 4;

        const windowGap = (this.width/2) / (Math.floor(this.windowsPerFloor) - 1);

        this.scene.pushMatrix();

        // Apply rotation if this is the back face
        if (!isFront) {
            this.scene.rotate(rotation, 0, 1, 0);
        }

        // Calculate center position for the first floor
        const firstFloorY = this.height/2 - this.floorHeight/2 + (this.entrance ? this.floorHeight : 0);
        
        // Place windows on each floor
        for (let floor = 0; floor < this.floors; floor++) {

            if (floor == 0 && this.entrance) continue;

            // Calculate Y position for this floor
            const floorY = firstFloorY - floor * this.floorHeight;
            
            for(let w = 0; w < this.windowsPerFloor; w++){
                const floorX = leftQuarterX + w * windowGap;

                this.displayWindow(floorX, floorY, posZ);
            }


        }

        this.scene.popMatrix();
    }

    display() {
        if (this.topTextureDown != null) {
            this.scene.pushMatrix();
            this.scene.translate(0, this.height/2, 0);
            this.scene.rotate(-Math.PI / 2, 1, 0, 0);
            this.scene.scale(this.width, this.depth, 1);

            this.scene.setActiveShader(this.topShader);

            this.scene.gl.activeTexture(this.scene.gl.TEXTURE0);
            this.topTexture.bind(0);

            this.scene.gl.activeTexture(this.scene.gl.TEXTURE1);
            this.topTextureDown.bind(1);

            this.scene.gl.activeTexture(this.scene.gl.TEXTURE2);
            this.topTextureUp.bind(2);

            this.topMaterial.apply();

            this.quad.display();

            this.scene.setActiveShader(this.scene.defaultShader);
            this.scene.popMatrix();
        } else {
            this.scene.pushMatrix();
            this.scene.translate(0, this.height/2, 0);
            this.scene.rotate(-Math.PI / 2, 1, 0, 0);
            this.scene.scale(this.width, this.depth, 1);
            this.topMaterial.apply();
            this.quad.display();
            this.scene.popMatrix();
        }

        // Front
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.depth / 2);
        this.scene.scale(this.width, this.height, 1);
        this.frontMaterial.apply();
        this.quad.display();
        this.scene.popMatrix();

        // Back
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -this.depth / 2);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(this.width, this.height, 1);
        this.sideMaterial.apply();
        this.quad.display();
        this.scene.popMatrix();

        // Right
        this.scene.pushMatrix();
        this.scene.translate(this.width / 2, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.scale(this.depth, this.height, 1);
        this.sideMaterial.apply();
        this.quad.display();
        this.scene.popMatrix();

        // Left
        this.scene.pushMatrix();
        this.scene.translate(-this.width / 2, 0, 0);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.scene.scale(this.depth, this.height, 1);
        this.sideMaterial.apply();
        this.quad.display();
        this.scene.popMatrix();

        // Bottom
        this.scene.pushMatrix();
        this.scene.translate(0, -this.height / 2, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(this.width, this.depth, 1);
        this.topMaterial.apply(); // reuse top material
        this.quad.display();
        this.scene.popMatrix();

        this.displayFaceWindows(true);

        if (this.isCenterBuilding) {
            this.heliLights.forEach(light => light.display());
        }
    }

    updateWindowsPerFloor(count){
        this.windowsPerFloor = Math.floor(count);
        this.initializeWindowProperties()
    }

    changeTexFiltering(filter) {
        this.textureFiltering = filter;
    }
}