import { CGFobject, CGFappearance } from '../../lib/CGF.js';
import { MyTree } from './tree/MyTree.js';
import { getTranslationMatrix } from './utils/utils.js';

/**
* MyFlorest
* @constructor
 * @param scene - Reference to MyScene object
 * @param num_lines - number of lines
 * @param num_columns - number of columns
*/
export class MyFlorest extends CGFobject {
    constructor(scene, num_lines, num_columns, fireTexture) {
        super(scene);
        this.scene = scene;
        this.num_lines = num_lines;
        this.num_columns = num_columns;
        this.scene = scene;

        this.x_size = 60;
        this.z_size = 60;
        this.start_florest_x = -30;
        this.start_florest_z = 30;

        // Generate random positions and parameters for trees
        this.trees = [];
        this.treePositions = [];

        this.fireTexture = fireTexture;

        this.update(num_columns, num_lines);

    }


    display() {
        // Display each tree
        for (let i = 0; i < this.trees.length; i++) {
            this.scene.pushMatrix();
            this.scene.multMatrix(getTranslationMatrix(
                this.trees[i].position[0],
                0,
                this.trees[i].position[1]
            ));
            this.trees[i].tree.display();
            this.scene.popMatrix();
        }
    }

    update(num_cols = this.num_columns, num_lines = this.num_lines) {

        this.num_columns = num_cols;
        this.num_lines = num_lines;

        // Generate random positions and parameters for trees
        this.trees = [];
        /* this.treePositions = []; */
        let x = this.start_florest_x;
        let z = this.start_florest_z;

        let spacing_x = this.x_size / (this.num_columns - 1);
        let spacing_z = this.z_size / (this.num_lines - 1);

        for (let row = 0; row < this.num_lines; row++) {
            for (let col = 0; col < this.num_columns; col++) {

                // Store the tree and its position
                this.trees.push({ tree: new MyTree(this.scene, (Math.random() + 0.2) * 10, -6 + (12 * Math.random()), -6 + (12 * Math.random()), 1, 0x184632, this.fireTexture, true, 'textures/leaves.jpg'), position: [x, z] });

                x += spacing_x;
            }
            x = this.start_florest_x;
            z += spacing_z;
        }
    }

    checkIfHelicopterInside(helicopterPosition) {

        let x_stopFlorest = this.start_florest_x + this.x_size;
        let z_stopFlorest = this.start_florest_z + this.z_size;

        let heli_x = Math.ceil(helicopterPosition[0]);
        let heli_z = Math.ceil(helicopterPosition[2]);

        if (heli_x >= this.start_florest_x && heli_x <= x_stopFlorest && heli_z >= this.start_florest_z && heli_z <= z_stopFlorest) {
            return true;
        }

        return false;
    }

    stopFire(waterDropPosition) {

        let isFireExtinguished = true;
        // Considering that the center is the water drop's position
        if (waterDropPosition[1] < 0.0) {

            // We can also use this for loop to check if the fire has been completely extinguished.
            for (let idx = 0; idx < this.trees.length; idx++) {
                const treeRef = this.trees.at(idx);

                isFireExtinguished = isFireExtinguished && (!treeRef.tree.isOnFire());

                const dx = treeRef.position[0] - waterDropPosition[0];
                const dz = treeRef.position[1] - waterDropPosition[2];
                const distance = Math.sqrt(dx * dx + dz * dz);

                if (Math.ceil(distance) <= (this.scene.raindropSize * 0.5) + 5) {
                    treeRef.tree.disableFire();
                }

            }

            this.scene.heli.waterDrops = this.scene.heli.waterDrops.filter(drop => drop.currentPosition[1] > 0);

            if (isFireExtinguished) {
                this.scene.heli.waterBucketState = 3;
            }
        }



    }
}