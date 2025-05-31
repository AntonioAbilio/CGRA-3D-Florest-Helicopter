import { CGFobject, CGFappearance } from '../../lib/CGF.js';
import { MyQuad } from '../primitives/MyQuad.js';

/**
 * MyWindow - Simple window implementation for buildings
 * @constructor
 * @param scene - Reference to MyScene object
 * @param texture - Texture for the window
 */
export class MyWindow extends CGFobject {
    constructor(scene, texture) {
        super(scene);
        
        this.quad = new MyQuad(scene);
        this.texture = texture;
        
        // Create a material/appearance for the window
        this.material = new CGFappearance(this.scene);
        this.material.setAmbient(0.8, 0.8, 0.8, 1.0);
        this.material.setDiffuse(0.8, 0.8, 0.8, 1.0);
        this.material.setSpecular(0.3, 0.3, 0.3, 1.0);
        this.material.setShininess(20.0);
        this.material.setTexture(this.texture);

        // Frame thickness relative to window size
        this.frameThickness = 0.1;
    }

    /**
     * Displays the window at the current transformation matrix position
     */
    display() {
        
        // Then draw the glass part
        this.material.apply();
        this.quad.display();
    }
}