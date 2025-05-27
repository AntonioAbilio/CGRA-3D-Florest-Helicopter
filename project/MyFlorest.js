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

        this.num_lines = num_lines;
        this.num_columns = num_columns;
        this.scene = scene;

        this.x_size = 60;
        this.z_size = 60;

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
                this.treePositions[i].x,
                0,
                this.treePositions[i].z
            ));
            this.trees[i].display();
            this.scene.popMatrix();
        }
    }

    update(num_cols = this.num_columns, num_lines = this.num_lines) {

        this.num_columns = num_cols;
        this.num_lines = num_lines;

        // Generate random positions and parameters for trees
        this.trees = [];
        this.treePositions = [];
        let x = 0;
        let z = 0;

        let spacing_x = this.x_size / this.num_columns;
        let spacing_z = this.z_size / this.num_lines;

        for (let row = 0; row < this.num_lines; row++) {
            for (let col = 0; col < this.num_columns; col++) {

                // Store the tree and its position
                this.trees.push(new MyTree(this.scene, (Math.random() + 0.2) * 10, -6 + (12 * Math.random()), -6 + (12 * Math.random()), 1, 0x184632, this.fireTexture));
                this.treePositions.push({
                    x: x,
                    z: z
                });

                x += spacing_x;
            }
            x = 0;
            z += spacing_z;
        }
    }
}