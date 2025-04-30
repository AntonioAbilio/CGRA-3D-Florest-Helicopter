import { CGFobject, CGFappearance } from '../../lib/CGF.js';
import { MyLeaves } from './MyLeaves.js';
import { getScalingMatrix, getTranslationMatrix, getXRotationMatrix, getZRotationMatrix } from '../utils/utils.js';
import { MyTrunk } from './MyTrunk.js';

/**
* MyTree
* @constructor
 * @param scene - Reference to MyScene object
 * @param slices - number of divisions around the Y axis
 * @param stacks - number of divisions along the Y axis
*/
export class MyTree extends CGFobject {
    constructor(scene, treeSize, X_inclination, Z_inclination, trunkRadius, leavesRGB) {
        super(scene);

        if (treeSize < 2) {
            treeSize = 2;
        }

        this.treeSize = treeSize;
        this.X_inclination = X_inclination;
        this.Z_inclination = Z_inclination;

        // Leaves is 80% of the tree and 20% is the trunk.
        this.max_size_for_leaves = treeSize * 0.8;
        this.max_visible_size_for_trunk = treeSize * 0.2;
        this.leaves_base_radius = trunkRadius * 3;
        this.trunk_radius = trunkRadius;

        // Leaves
        this.leavesMaterial = new CGFappearance(scene);
        this.leavesMaterial.setDiffuse((leavesRGB & 0x0000ff) / 255, ((leavesRGB & 0x00ff00) >>> 8) / 255, ((leavesRGB & 0xff0000) >>> 16) / 255, 0);
        //this.leavesMaterial.setShininess((leavesRGB & 0x0000ff) / 255, ((leavesRGB & 0x00ff00) >>> 8) / 255, ((leavesRGB & 0xff0000) >>> 16) / 255, 0);
        this.leavesMaterial.setAmbient((leavesRGB & 0x0000ff) / 255, ((leavesRGB & 0x00ff00) >>> 8) / 255, ((leavesRGB & 0xff0000) >>> 16) / 255, 0);
        this.leaves = new MyLeaves(this.scene, leavesRGB, this.leaves_base_radius);

        // Trunk
        this.trunk = new MyTrunk(this.scene, 20, 20, this.trunk_radius, this.max_visible_size_for_trunk + 1);


    }

    display() {
        this.scene.pushMatrix();
        this.scene.multMatrix(getXRotationMatrix(this.X_inclination));
        this.scene.multMatrix(getZRotationMatrix(this.Z_inclination));

        let overlap_per_leaf = 1.5;
        let start_z_for_leaves = this.max_visible_size_for_trunk;

        let amount_of_leaves = Math.floor(this.max_size_for_leaves / overlap_per_leaf);

        this.trunk.display();


        for (let i = 0; i < amount_of_leaves; i++) {
            this.scene.pushMatrix();
            this.scene.multMatrix(getTranslationMatrix(0, start_z_for_leaves + (overlap_per_leaf * i), 0));
            this.leavesMaterial.apply();
            this.leaves.display();
            this.scene.popMatrix();

        }
        this.scene.popMatrix();

    }

    updateAmountOfLeaves(treeSize) {
        this.max_size_for_leaves = treeSize * 0.8;
        this.max_visible_size_for_trunk = treeSize * 0.2;
        this.trunk.updateSize(this.max_visible_size_for_trunk + 1.0)
    }

    updateTrunkRadius(radius) {
        this.trunkRadius = radius;
        this.leaves.updateRadius(this.trunkRadius * 2);
        this.trunk.updateRadius(this.trunkRadius);
    }

    updateLeavesColors(hexColor) {
        this.leavesMaterial.setDiffuse((hexColor & 0x0000ff) / 255, ((hexColor & 0x00ff00) >>> 8) / 255, ((hexColor & 0xff0000) >>> 16) / 255, 0);
        this.initBuffers();
        this.initNormalVizBuffers();
    }

    updateXInclination(X_Inc) {
        this.X_inclination = X_Inc;
    }

    updateZInclination(Z_Inc) {
        this.Z_inclination = Z_Inc;
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


