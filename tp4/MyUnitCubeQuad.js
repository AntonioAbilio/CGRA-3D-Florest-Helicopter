import { CGFobject } from '../../lib/CGF.js';
import { MyQuad } from './MyQuad.js';
import { getTranslationMatrix, getXRotationMatrix, getYRotationMatrix } from './utils/utils.js';

/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends CGFobject {

    quad
    topTexture
    frontTexture
    rightTexture
    leftTexture
    backTexture
    bottomTexture
    textureFiltering


    constructor(scene, topTexture, frontTexture, rightTexture, leftTexture, backTexture, bottomTexture) {
        super(scene);
        this.initBuffers();

        this.quad = new MyQuad(scene);
        this.topTexture = topTexture;
        this.frontTexture = frontTexture;
        this.rightTexture = rightTexture;
        this.leftTexture = leftTexture;
        this.backTexture = backTexture;
        this.bottomTexture = bottomTexture;
        this.textureFiltering = this.scene.gl.NEAREST;
    }

    display() {
        let rotation = null;
        let translation = null;

        // Top face of the cube
        rotation = getXRotationMatrix(270);
        translation = getTranslationMatrix(0, 0.5, 0);

        this.scene.pushMatrix();
        this.scene.multMatrix(translation);
        this.scene.multMatrix(rotation);
        this.topTexture.bind();
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.textureFiltering);
        this.quad.display();
        this.scene.popMatrix();

        // Front face of the cube
        rotation = getXRotationMatrix(360);
        translation = getTranslationMatrix(0, 0, 0.5);

        this.scene.pushMatrix();
        this.scene.multMatrix(translation);
        this.scene.multMatrix(rotation);
        this.frontTexture.bind();
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.textureFiltering);
        this.quad.display();
        this.scene.popMatrix();

        // Right face of the cube
        rotation = getYRotationMatrix(90);
        translation = getTranslationMatrix(0.5, 0, 0);

        this.scene.pushMatrix();
        this.scene.multMatrix(translation);
        this.scene.multMatrix(rotation);
        this.rightTexture.bind();
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.textureFiltering);
        this.quad.display();
        this.scene.popMatrix();

        // Back face of the cube
        rotation = getYRotationMatrix(180);
        translation = getTranslationMatrix(0, 0, -0.5);

        this.scene.pushMatrix();
        this.scene.multMatrix(translation);
        this.scene.multMatrix(rotation);
        this.backTexture.bind();
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.textureFiltering);
        this.quad.display();
        this.scene.popMatrix();

        // Left face of the cube
        rotation = getYRotationMatrix(270);
        translation = getTranslationMatrix(-0.5, 0, 0);

        this.scene.pushMatrix();
        this.scene.multMatrix(translation);
        this.scene.multMatrix(rotation);
        this.leftTexture.bind();
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.textureFiltering);
        this.quad.display();
        this.scene.popMatrix();

        // Bottom face of the cube
        rotation = getXRotationMatrix(90);
        translation = getTranslationMatrix(0, -0.5, 0);

        this.scene.pushMatrix();
        this.scene.multMatrix(translation);
        this.scene.multMatrix(rotation);
        this.bottomTexture.bind();
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.textureFiltering);
        console.log(this.textureFiltering)
        this.quad.display();
        this.scene.popMatrix();

    }

    changeTexFiltering(filter) {
        this.textureFiltering = filter
    }
}

