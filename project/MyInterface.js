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

        var f0 = this.gui.addFolder('Tree Settings');
        f0.add(this.scene, 'rotationAxis').name("X Rotation");
        f0.add(this.scene, 'inclination').name("Inclination");
        f0.add(this.scene, 'trunkRadius', 1, 10).name("Trunk Radius").onChange(this.scene.updateTrunkRadius.bind(this.scene));
        f0.add(this.scene, 'treeSize', 30, 80).name("Tree Size").onChange(this.scene.updateAmountOfLeaves.bind(this.scene));
        f0.addColor(this.scene, 'leavesRGB').name("Leaves Color").onChange(this.scene.updateLeavesColors.bind(this.scene));

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