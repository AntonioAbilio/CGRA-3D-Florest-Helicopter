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
    constructor(scene, num_lines, num_columns) {
        super(scene);

        this.num_lines = num_lines;
        this.num_columns = num_columns;
        this.scene = scene;

        // Generate random positions and parameters for trees
        this.trees = [];
        this.treePositions = [];
        let x = 0;
        let z = 0;
        let spacing = 10;
        for (let row = 0; row < this.num_lines; row++) {
            for (let col = 0; col < this.num_columns; col++) {

                x += Math.random() + spacing;

                // Store the tree and its position
                this.trees.push(new MyTree(this.scene, (Math.random() + 0.2) * 10, 0 + (10 * Math.random()), 0 + (10 * Math.random()), 1, 0x184632));
                this.treePositions.push({
                    x: x,
                    z: z
                });
            }
            x = 0;
            z += spacing;
        }

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

    updateColumns(num_cols) {
        // Generate random positions and parameters for trees
        this.num_columns = num_cols;
        this.trees = [];
        this.treePositions = [];
        let x = 0;
        let z = 0;
        let spacing = 10;
        for (let row = 0; row < this.num_lines; row++) {
            for (let col = 0; col < this.num_columns; col++) {

                x += Math.random() + spacing;

                // Store the tree and its position
                this.trees.push(new MyTree(this.scene, (Math.random() + 0.2) * 10, 0 + (10 * Math.random()), 0 + (10 * Math.random()), 1, 0x184632));
                this.treePositions.push({
                    x: x,
                    z: z
                });
            }
            x = 0;
            z += spacing;
        }
    }

    updateLines(num_lines) {
        // Generate random positions and parameters for trees
        this.num_lines = num_lines;
        this.trees = [];
        this.treePositions = [];
        let x = 0;
        let z = 0;
        let spacing = 10;
        for (let row = 0; row < this.num_lines; row++) {
            for (let col = 0; col < this.num_columns; col++) {

                x += Math.random() + spacing;

                // Store the tree and its position
                this.trees.push(new MyTree(this.scene, (Math.random() + 0.2) * 10, 0 + (10 * Math.random()), 0 + (10 * Math.random()), 1, 0x184632));
                this.treePositions.push({
                    x: x,
                    z: z
                });
            }
            x = 0;
            z += spacing;
        }
    }
}