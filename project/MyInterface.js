import { CGFinterface, dat } from '../lib/CGF.js';

/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        // call CGFinterface init
        super.init(application);

        // init GUI. For more information on the methods, check:
        // https://github.com/dataarts/dat.gui/blob/master/API.md
        this.gui = new dat.GUI();

        this.initKeys();

        return true;
    }

    initKeys() {
        // create reference from the scene to the GUI
        this.scene.gui = this;

        this.gui.add(this.scene, 'displayAxis').name("Display axis");

        this.gui.add(this.scene, 'displayNormals').name("Display normals");

        this.gui.add(this.scene, 'speedFactor', 0.1, 3).name("Speed Factor").onChange(this.scene.updateSpeedFactor.bind(this.scene));

        // Tree folder
        var f0 = this.gui.addFolder('Tree Settings');
        f0.add(this.scene, 'displayTree').name("Display tree");
        f0.add(this.scene, 'X_inclination', -90, 90).name("X Inclination").onChange(this.scene.updateTreeXInclination.bind(this.scene))
        f0.add(this.scene, 'Z_inclination', -90, 90).name("Z Inclination").onChange(this.scene.updateTreeZInclination.bind(this.scene))
        f0.add(this.scene, 'trunkRadius', 1, 2).name("Trunk Radius").onChange(this.scene.updateTrunkRadius.bind(this.scene));
        f0.add(this.scene, 'treeSize', 2, 10).name("Tree Size").onChange(this.scene.updateAmountOfLeaves.bind(this.scene));
        f0.addColor(this.scene, 'leavesRGB').name("Leaves Color").onChange(this.scene.updateLeavesColors.bind(this.scene));

        // Forest Settings folder
        var f1 = this.gui.addFolder('Forest Settings');
        f1.add(this.scene, 'forestLines', 4, 10).step(1).name("Num. of Lines").onChange(this.scene.updateForestLines.bind(this.scene));
        f1.add(this.scene, 'forestColumns', 4, 10).step(1).name("Num. of Cols").onChange(this.scene.updateForestColumns.bind(this.scene));

        // TODO: remove
        var f2 = this.gui.addFolder('Debug Settings');
        f2.add(this.scene, 'movX', 0.0, 100.0).name("X_pos_tracer").onChange(this.scene.updateMovX.bind(this.scene));
        f2.add(this.scene, 'movY', 0.0, 100.0).name("Y_pos_tracer").onChange(this.scene.updateMovY.bind(this.scene));
        f2.add(this.scene, 'movZ', 0.0, 100.0).name("Z_pos_tracer").onChange(this.scene.updateMovZ.bind(this.scene));

        var f3 = this.gui.addFolder('Realism');
        f3.add(this.scene, 'raindropSize', 1.0, 10.0).name("Raindrop size").onChange(this.scene.updateMovX.bind(this.scene));
        f3.add(this.scene, 'raindropFreq', 1.0, 10.0).name("Raindrop freq.").onChange(this.scene.updateMovX.bind(this.scene));

        var f4 = this.gui.addFolder('Buildings');

        f4.add(this.scene, 'buildingWidth', 0.0, 5.0).name("Building Width").onChange(this.scene.updateBuildingWidth.bind(this.scene));
        f4.add(this.scene, 'floorCount', 1, 8).name("Floor Count").onChange(this.scene.updateFloorCount.bind(this.scene));
        f4.add(this.scene, 'windowCount', 1, 8).name("Floor Window Count").onChange(this.scene.updateFloorWindowCount.bind(this.scene));
        f4.add(this.scene, 'windowText', 1, 3).name("Window Texture").onChange(this.scene.updateWindowTexture.bind(this.scene));
        f4.addColor(this.scene, 'buildingColor').onChange(this.scene.updateBuildingColor.bind(this.scene));

        // disable the processKeyboard function
        this.processKeyboard = function () { };

        // create a named array to store which keys are being pressed
        this.activeKeys = {};
    }
    processKeyDown(event) {
        // called when a key is pressed down
        // mark it as active in the array
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        // called when a key is released, mark it as inactive in the array
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        // returns true if a key is marked as pressed, false otherwise
        return this.activeKeys[keyCode] || false;
    }

}