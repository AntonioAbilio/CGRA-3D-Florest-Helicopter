import { CGFobject, CGFappearance } from '../../lib/CGF.js';

import { getScalingMatrix, getTranslationMatrix, getXRotationMatrix, getYRotationMatrix, getZRotationMatrix } from '../utils/utils.js';
import { MyTrunk } from './MyTrunk.js';
import { MyFire } from '../MyFire.js';
import { MyPyramid } from '../MyPyramid.js';

/**
* MyTree
* @constructor
 * @param treeSize - Reference to MyScene object
 * @param X_inclination - number of divisions around the Y axis
 * @param Z_inclination - number of divisions along the Y axis
 * @param trunkRadius - number of divisions along the Y axis
*/
export class MyTree extends CGFobject {
    constructor(scene, treeSize, X_inclination, Z_inclination, trunkRadius, leavesRGB, fireTexture, displayFire, texturePath) {
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
        this.texturePath = texturePath;
        this.leavesMaterial = new CGFappearance(scene);

        if (this.texturePath) {
            this.leavesMaterial.setAmbient(0.1, 0.1, 0.1, 1);
            this.leavesMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
            this.leavesMaterial.setSpecular(0.1, 0.1, 0.1, 1);
            this.leavesMaterial.setShininess(10.0);
            this.leavesMaterial.loadTexture(texturePath);
            this.leavesMaterial.setTextureWrap('REPEAT', 'REPEAT');
        } else {
            this.leavesMaterial.setDiffuse((leavesRGB & 0x0000ff) / 255, ((leavesRGB & 0x00ff00) >>> 8) / 255, ((leavesRGB & 0xff0000) >>> 16) / 255, 0);
            this.leavesMaterial.setShininess((leavesRGB & 0x0000ff) / 255, ((leavesRGB & 0x00ff00) >>> 8) / 255, ((leavesRGB & 0xff0000) >>> 16) / 255, 0);
            this.leavesMaterial.setAmbient((leavesRGB & 0x0000ff) / 255, ((leavesRGB & 0x00ff00) >>> 8) / 255, ((leavesRGB & 0xff0000) >>> 16) / 255, 0);
        }


        this.leaves = new MyPyramid(this.scene, leavesRGB, this.leaves_base_radius, this.leavesMaterial);

        // Trunk
        this.trunk = new MyTrunk(this.scene, 20, 20, this.trunk_radius, this.max_visible_size_for_trunk + 1);

        this.displayFire = displayFire;

        // This means that the probability of a tree not having fire is aproximatly 20%
        if (Math.random() > 0.8) {
            this.displayFire = false;
        } else {
            this.fire = new MyFire(scene, fireTexture, 3);
            this.fire_pos = Math.random();
            this.yRotationMatrix = getYRotationMatrix(Math.random())
        }

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
            this.scene.scale(1 * ((amount_of_leaves - i) / amount_of_leaves), 1.5, 1 * ((amount_of_leaves - i) / amount_of_leaves)); // Make it smaller
            this.leaves.display();
            this.scene.popMatrix();

        }
        this.scene.popMatrix();

        if (this.displayFire) {
            this.scene.pushMatrix();
            this.scene.multMatrix(getTranslationMatrix(0, start_z_for_leaves + (overlap_per_leaf * amount_of_leaves) * this.fire_pos + (Math.sin(performance.now() / 300) * 0.8 * Math.cos(performance.now() / 300) * 0.3), 0));
            this.scene.multMatrix(this.yRotationMatrix);
            this.fire.display();
            this.scene.popMatrix();
        }

    }

    isOnFire() {
        return this.displayFire;
    }

    disableFire() {
        this.displayFire = false;
    }

    enableFire() {
        this.displayFire = true;
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
        if (!this.texturePath) {
            this.leavesMaterial.setDiffuse((hexColor & 0x0000ff) / 255, ((hexColor & 0x00ff00) >>> 8) / 255, ((hexColor & 0xff0000) >>> 16) / 255, 0);
            this.leavesMaterial.setAmbient((hexColor & 0x0000ff) / 255, ((hexColor & 0x00ff00) >>> 8) / 255, ((hexColor & 0xff0000) >>> 16) / 255, 0);
            this.leavesMaterial.setSpecular((hexColor & 0x0000ff) / 255, ((hexColor & 0x00ff00) >>> 8) / 255, ((hexColor & 0xff0000) >>> 16) / 255, 0);
            this.initBuffers();
            this.initNormalVizBuffers();
        }
    }

    updateXInclination(X_Inc) {
        if (!this.texturePath) {
            this.X_inclination = X_Inc;
        }
    }

    updateZInclination(Z_Inc) {
        if (!this.texturePath) {
            this.Z_inclination = Z_Inc;
        }
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


