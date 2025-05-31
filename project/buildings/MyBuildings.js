import { CGFobject } from '../../lib/CGF.js';
import { MyBuilding } from './MyBuilding.js';

/**
 * MyBuildings
 * @constructor
 * @param scene - Reference to MyScene object.
 * @param topTexture - Texture for the top face.
 * @param topTextureDown - Texture that has the Down wording.
 * @param topTextureUp -  Texture that has the Up wording.
 * @param frontTexture - Texture for the front face.
 * @param sideTexture - Texture for the side faces.
 * @param windowTexture - Texture for windows.
 * @param floors - Number of floors.
 */
export class MyBuildings extends CGFobject {
    constructor(scene, topTexture, topTextureDown, topTextureUp, frontTexture, sideTexture, windowTexture, floors = 8) {
        super(scene);

        // Create three buildings with different sizes and number of floors
        this.centerBuilding = new MyBuilding(
            scene,
            topTexture,
            frontTexture,
            sideTexture,
            windowTexture,
            15,
            20,
            15,
            3,
            true,
            topTextureDown,
            topTextureUp
        );

        this.leftBuilding = new MyBuilding(
            scene,
            sideTexture,
            sideTexture,
            sideTexture,
            windowTexture,
            12,
            15,
            10,
            floors - 1
        );

        this.rightBuilding = new MyBuilding(
            scene,
            sideTexture,
            sideTexture,
            sideTexture,
            windowTexture,
            12,
            15,
            10,
            floors - 1
        );
    }

    update(t) {
        this.centerBuilding.update(t);
    }

    display() {

        // Initialize buffers for all buildings
        this.centerBuilding.initBuffers();
        this.leftBuilding.initBuffers();
        this.rightBuilding.initBuffers();

        // Display left smaller building
        this.scene.pushMatrix();
        this.scene.translate(-13.5, 7.5, 0); // Position to the left
        this.leftBuilding.display(); // Windows are automatically displayed with the building
        this.scene.popMatrix();

        // Display right smaller building
        this.scene.pushMatrix();
        this.scene.translate(13.5, 7.5, 0); // Position to the right
        this.rightBuilding.display(); // Windows are automatically displayed with the building
        this.scene.popMatrix();

        // Display center tall building
        this.scene.pushMatrix();
        this.scene.translate(0, 10, 0);
        this.centerBuilding.display(); // Windows are automatically displayed with the building
        this.scene.popMatrix();
    }

    updateColor(color) {
        this.leftBuilding.setBuildingColor(color)
        this.centerBuilding.setBuildingColor(color)
        this.rightBuilding.setBuildingColor(color)
    }

    updateFloorWindowCount(count) {
        this.leftBuilding.updateWindowsPerFloor(count);
        this.rightBuilding.updateWindowsPerFloor(count);
    }

    updateFloorCount(count) {

        this.leftBuilding.floors = Math.floor(count);
        this.rightBuilding.floors = Math.floor(count);

        this.leftBuilding.initializeWindowProperties();
        this.rightBuilding.initializeWindowProperties();
    }

    updateWindow(text) {
        this.leftBuilding.setWindowTexture(text);
        this.rightBuilding.setWindowTexture(text);
        this.centerBuilding.setWindowTexture(text);
    }

}