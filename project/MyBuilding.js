import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';
import { MyWindow } from './MyWindow.js';
import { getTranslationMatrix, getXRotationMatrix, getYRotationMatrix } from './utils/utils.js';

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
    constructor(scene, topTexture, frontTexture, sideTexture, windowTexture, floors = 4, entrance = false, width = 10, height = 10, depth = 10) {
        super(scene);
        
        this.quad = new MyQuad(scene);
        this.topTexture = topTexture;
        this.frontTexture = frontTexture;
        this.sideTexture = sideTexture;
        this.windowTexture = windowTexture;
        
        this.floors = floors;
        this.width = width;
        this.height = height;
        this.depth = depth;

		this.entrance = entrance;
        
        this.textureFiltering = this.scene.gl.NEAREST; // Default texture filtering
        
        // Create the window object
        this.window = new MyWindow(scene, windowTexture);
        
        // Initialize window properties
        this.initializeWindowProperties();
    }
    

    initializeWindowProperties() {
        // Calculate floor height
        this.floorHeight = this.height / this.floors;
        
        // Window dimensions - proportional to building size
        this.windowWidth = this.width * 0.2;
        this.windowHeight = this.floorHeight * 0.6;
        
        // Window spacing from the edges
        this.windowMarginX = this.width * 0.1;
        this.windowMarginY = this.floorHeight * 0.2;
    }

   
    displayWindow(x, y, z) {
        this.scene.pushMatrix();
        this.scene.translate(x, y, z);
        this.scene.scale(this.windowWidth, this.windowHeight, 1);
        this.window.display();
        this.scene.popMatrix();
    }
    

    displayFaceWindows(isFront) {

        // Position for the front face
        const posZ = isFront ? this.depth/2 + 0.01 : -this.depth/2 - 0.01;
        // Rotation for the back face (if not front)
        const rotation = isFront ? 0 : Math.PI;
        
        // Calculate left and right positions for windows
        const leftQuarterX = -this.width/4;
        const rightQuarterX = this.width/4;
        
        this.scene.pushMatrix();
        
        // Apply rotation if this is the back face
        if (!isFront) {
            this.scene.rotate(rotation, 0, 1, 0);
        }
        
        // Calculate center position for the first floor
        const firstFloorY = -this.height/2 + this.floorHeight/2;
        
        // Place windows on each floor
        for (let floor = 0; floor < this.floors; floor++) {

			if(floor == 0 && this.entrance)continue;

            // Calculate Y position for this floor
            const floorY = firstFloorY + floor * this.floorHeight;
            
            // Left half of the building - left window
            this.displayWindow(leftQuarterX, floorY, posZ);
            
            // Right half of the building - left window
            this.displayWindow(rightQuarterX, floorY, posZ);
        }
        
        this.scene.popMatrix();
    }
    
    displaySideWindows(isRight) {
        // Position for the side face
        const posX = isRight ? this.width/2 + 0.01 : -this.width/2 - 0.01;
        // Rotation for the side face
        const rotation = isRight ? Math.PI/2 : -Math.PI/2;
        
        this.scene.pushMatrix();
        
        // Apply rotation for the side face
        this.scene.rotate(rotation, 0, 1, 0);
        
        // Calculate center position for the first floor
        const firstFloorY = -this.height/2 + this.floorHeight/2;
        
        // Place windows on each floor
        for (let floor = 0; floor < this.floors; floor++) {
            // Calculate Y position for this floor
            const floorY = firstFloorY + floor * this.floorHeight;
            
            // Side face - left window
            this.displayWindow(-this.depth/4, floorY, posX);
            
            // Side face - right window
            this.displayWindow(this.depth/4, floorY, posX);
        }
        
        this.scene.popMatrix();
    }

    display() {
        // Top face of the building
        this.scene.pushMatrix();
        this.scene.translate(0, this.height/2, 0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.scale(this.width, this.depth, 1);
        this.topTexture.bind();
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.textureFiltering);
        this.quad.display();
        this.scene.popMatrix();

        // Front face of the building
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.depth/2);
        this.scene.scale(this.width, this.height, 1);
        this.frontTexture.bind();
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.textureFiltering);
        this.quad.display();
        this.scene.popMatrix();

        // Back face of the building
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -this.depth/2);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(this.width, this.height, 1);
        this.sideTexture.bind(); // Using front texture for back as well for consistency
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.textureFiltering);
        this.quad.display();
        this.scene.popMatrix();

        // Right face of the building
        this.scene.pushMatrix();
        this.scene.translate(this.width/2, 0, 0);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.scale(this.depth, this.height, 1);
        this.sideTexture.bind();
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.textureFiltering);
        this.quad.display();
        this.scene.popMatrix();

        // Left face of the building
        this.scene.pushMatrix();
        this.scene.translate(-this.width/2, 0, 0);
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
        this.scene.scale(this.depth, this.height, 1);
        this.sideTexture.bind();
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.textureFiltering);
        this.quad.display();
        this.scene.popMatrix();

        // Bottom face of the building
        this.scene.pushMatrix();
        this.scene.translate(0, -this.height/2, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(this.width, this.depth, 1);
        this.topTexture.bind(); // Using top texture for bottom as well
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.textureFiltering);
        this.quad.display();
        this.scene.popMatrix();
        
        // Display windows on front face
        this.displayFaceWindows(true);
    }

    changeTexFiltering(filter) {
        this.textureFiltering = filter;
    }
}