import { CGFobject, CGFappearance } from '../../lib/CGF.js';
import { MyLeaves } from './MyLeaves.js';
import { getScalingMatrix, getTranslationMatrix, getXRotationMatrix } from '../utils/utils.js';
import { MyTrunk } from './MyTrunk.js';

/**
* MyTree
* @constructor
 * @param scene - Reference to MyScene object
 * @param slices - number of divisions around the Y axis
 * @param stacks - number of divisions along the Y axis
*/
export class MyTree extends CGFobject {
    constructor(scene, treeSize, inclination, rotationAxis, trunkRadius, leavesRGB) {
        super(scene);

        this.inclination = inclination;
        this.rotationAxis = rotationAxis;
        this.treeSize = treeSize;

        // Leaves is 80% of the tree and 20% is the trunk.
        this.max_size_for_leaves = treeSize * 0.8;
        this.max_size_for_trunk = treeSize * 0.2;
        this.leaves_base_radius = trunkRadius * 3;
        this.trunk_radius = trunkRadius;

        // Leaves
        this.leavesMaterial = new CGFappearance(scene);
        this.leavesMaterial.setDiffuse((leavesRGB & 0x0000ff) / 255, ((leavesRGB & 0x00ff00) >>> 8) / 255, ((leavesRGB & 0xff0000) >>> 16) / 255, 0);
        //this.leavesMaterial.setShininess(0.7, 0.7, 0.7, 0);
        this.leavesMaterial.setAmbient((leavesRGB & 0x0000ff) / 255, ((leavesRGB & 0x00ff00) >>> 8) / 255, ((leavesRGB & 0xff0000) >>> 16) / 255, 0);
        this.leaves = new MyLeaves(this.scene, leavesRGB, this.leaves_base_radius);

        // Trunk
        this.trunk = new MyTrunk(this.scene, 20, 20, this.trunk_radius);

        this.initBuffers();
    }

    display() {
        let overlap_per_leaf = 8; // Half of the size of aech leaf
        let start_z_for_leaves = Math.floor(this.max_size_for_trunk);

        let amount_of_leaves = Math.floor(this.max_size_for_leaves / overlap_per_leaf);

        this.scene.pushMatrix();
        this.scene.multMatrix(getTranslationMatrix(0, 1, 0));
        this.scene.multMatrix(getXRotationMatrix(90));
        this.scene.multMatrix(getScalingMatrix(1, 1, -this.max_size_for_trunk));
        this.trunk.display();
        this.scene.popMatrix();


        for (let i = 0; i < amount_of_leaves; i++) {
            this.scene.pushMatrix();
            this.scene.multMatrix(getTranslationMatrix(0, start_z_for_leaves + (overlap_per_leaf * i), 0));
            this.leavesMaterial.apply();
            this.leaves.display();
            this.scene.popMatrix();

        }

    }

    updateAmountOfLeaves(treeSize) {
        this.max_size_for_leaves = treeSize * 0.8;
        this.max_size_for_trunk = treeSize * 0.2;
    }

    updateTrunkRadius(radius) {
        this.trunkRadius = Math.floor(radius);
        this.leaves.updateRadius(this.trunkRadius * 2);
        this.trunk.updateRadius(this.trunkRadius);
    }

    updateLeavesColors(hexColor) {
        this.leavesMaterial.setDiffuse((hexColor & 0x0000ff) / 255, ((hexColor & 0x00ff00) >>> 8) / 255, ((hexColor & 0xff0000) >>> 16) / 255, 0);
        this.initBuffers();
        this.initNormalVizBuffers();
    }

    /**
     * Called when user interacts with GUI to change object's complexity.
     * @param {integer} complexity - changes number of slices
     */
    updateBuffers(complexity) {
        this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}


