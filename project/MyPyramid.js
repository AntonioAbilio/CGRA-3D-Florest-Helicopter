import { CGFobject, CGFappearance } from '../../lib/CGF.js';
/**
* MyLeaves
* @constructor
 * @param scene - Reference to MyScene object
 * @param slices - number of divisions around the Y axis
*/
export class MyPyramid extends CGFobject {
    constructor(scene, leavesRGB, radius, texturePath) {
        super(scene);
        this.slices = 6;
        this.leavesRGB = leavesRGB;
        this.radius = radius;

        // Texture for leaves.
        this.leaves = new CGFappearance(this.scene);
        this.leaves.setAmbient(0.1, 0.1, 0.1, 1);
        this.leaves.setDiffuse(0.9, 0.9, 0.9, 1);
        this.leaves.setSpecular(0.1, 0.1, 0.1, 1);
        this.leaves.setShininess(10.0);
        this.leaves.loadTexture(texturePath);
        this.leaves.setTextureWrap('REPEAT', 'REPEAT');

        // Pyramid / Leaves Z Size
        this.z_size = 2;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = []; // Add this line to create the texCoords array

        var ang = 0;
        var alphaAng = 2 * Math.PI / this.slices;

        // Create the side faces first
        for (let i = 0; i < this.slices; i++) {
            // All vertices have to be declared for a given face
            // even if they are shared with others, as the normals 
            // in each face will be different

            var sa = Math.sin(ang) * this.radius;
            var saa = Math.sin(ang + alphaAng) * this.radius;
            var ca = Math.cos(ang) * this.radius;
            var caa = Math.cos(ang + alphaAng) * this.radius;

            this.vertices.push(0, this.z_size, 0);
            this.vertices.push(ca, 0, -sa);
            this.vertices.push(caa, 0, -saa);

            // triangle normal computed by cross product of two edges
            var normal = [
                saa - sa,
                ca * saa - sa * caa,
                caa - ca
            ];

            // normalization
            var nsize = Math.sqrt(
                normal[0] * normal[0] +
                normal[1] * normal[1] +
                normal[2] * normal[2]
            );
            normal[0] /= nsize;
            normal[1] /= nsize;
            normal[2] /= nsize;

            // push normal once for each vertex of this triangle
            this.normals.push(...normal);
            this.normals.push(...normal);
            this.normals.push(...normal);

            // Add texture coordinates for side faces
            // Map the tip to the middle top of the texture
            this.texCoords.push(0.5, 0.0);
            // Map the base corners to the bottom of the texture
            this.texCoords.push((i / this.slices), 1.0);
            this.texCoords.push(((i + 1) / this.slices), 1.0);

            this.indices.push(3 * i, (3 * i + 1), (3 * i + 2));

            ang += alphaAng;
        }

        // Now create the bottom face
        const baseVertexCount = this.vertices.length / 3;
        ang = 0;

        // Create a new set of vertices for the bottom face
        for (let i = 0; i < this.slices; i++) {
            var sa = Math.sin(ang) * this.radius;
            var saa = Math.sin(ang + alphaAng) * this.radius;
            var ca = Math.cos(ang) * this.radius;
            var caa = Math.cos(ang + alphaAng) * this.radius;

            this.vertices.push(0, 0, 0);         // Center point
            this.vertices.push(ca, 0, -sa);      // First point on circumference
            this.vertices.push(caa, 0, -saa);    // Second point on circumference

            // Bottom face normal points downward
            this.normals.push(0, -1, 0);
            this.normals.push(0, -1, 0);
            this.normals.push(0, -1, 0);

            // Add texture coordinates for the bottom face
            // Center point maps to center of texture
            this.texCoords.push(0.5, 0.5);
            // Circumference points map based on angle
            this.texCoords.push(0.5 + 0.5 * Math.cos(ang), 0.5 + 0.5 * Math.sin(ang));
            this.texCoords.push(0.5 + 0.5 * Math.cos(ang + alphaAng), 0.5 + 0.5 * Math.sin(ang + alphaAng));

            // Note the reversed winding order for the bottom face
            this.indices.push(baseVertexCount + 3 * i + 2,
                baseVertexCount + 3 * i + 1,
                baseVertexCount + 3 * i);

            ang += alphaAng;
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }


    display() {
        if (this.leaves.texture) {
            this.leaves.apply();
        }
        super.display();
    }

    /**
     * @method updateTexCoords
     * Updates the list of texture coordinates
     * @param {Array} coords - Array of texture coordinates
     */
    updateTexCoords(coords) {
        this.texCoords = [...coords];
        this.updateTexCoordsGLBuffers();
    }

    /**
     * Called when user interacts with GUI to change the radius of the trunk.
     * @param {integer} newRadius - changes the radius of the base of the leaves
     */
    updateRadius(newRadius) {
        console.log(newRadius)
        this.radius = newRadius;
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}