import {CGFobject} from '../lib/CGF.js';
/**
* MyPrism
* @constructor
 * @param scene - Reference to MyScene object
 * @param slices - number of divisions around the Y axis
 * @param stacks - number of divisions along the Y axis
*/
export class MyPrism extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        var alphaAng = (2*Math.PI)/this.slices;
        var nEdges = 0;
        
        var offset = this.stacks / 2;

        for(var o = 0; o < this.stacks; o++){

            var basei = this.slices * o;
            var targeti = this.slices * (o + 1);

            var basez = o - offset;

            for(var i = basei; i < targeti; i++){

                // All vertices have to be declared for a given face
                // even if they are shared with others, as the normals 
                // in each face will be different

                console.log(`Slices :::::: ${i}`);

                var ang = i * alphaAng;

                var sa  =  Math.sin(ang);
                var saa =  Math.sin(ang + alphaAng);
                var ca  =  Math.cos(ang);
                var caa =  Math.cos(ang + alphaAng);
                
                if(o == 0){ //start face
                    this.vertices.push(sa, ca, basez);
                    this.vertices.push(saa, caa, basez);
                    this.vertices.push(0, 0, basez);
                    this.indices.push(3*nEdges, (3*nEdges+1) , (3*nEdges+2));
                    nEdges += 1;
                }
                

                //x y z
                this.vertices.push(sa, ca, basez + 1);
                this.vertices.push(saa, caa, basez);
                this.vertices.push(sa, ca, basez);

                // triangle normal computed by cross product of two edges
                var normal= [
                    saa-sa,
                    ca*saa-sa*caa,
                    caa-ca
                ];

                // normalization
                var nsize=Math.sqrt(
                    normal[0]*normal[0]+
                    normal[1]*normal[1]+
                    normal[2]*normal[2]
                    );
                normal[0]/=nsize;
                normal[1]/=nsize;
                normal[2]/=nsize;

                this.indices.push(3*nEdges, (3*nEdges+1) , (3*nEdges+2) );
                nEdges += 1;

                // push normal once for each vertex of this triangle
                this.normals.push(...normal);
                this.normals.push(...normal);
                this.normals.push(...normal);
            }

            for(var t = basei; t < targeti; t++){
                // All vertices have to be declared for a given face
                // even if they are shared with others, as the normals 
                // in each face will be different

                console.log(`Second Slices :::::: ${t}`);

                var ang = (t) * alphaAng;

                var sa  =  Math.sin(ang);
                var saa =  Math.sin(ang + alphaAng);
                var ca  =  Math.cos(ang);
                var caa =  Math.cos(ang + alphaAng);

                if(o == this.stacks - 1){ //start face
                    this.vertices.push(0, 0, basez + 1);
                    this.vertices.push(saa, caa, basez + 1);
                    this.vertices.push(sa, ca, basez + 1);
                    this.indices.push(3*nEdges, (3*nEdges+1) , (3*nEdges+2));
                    nEdges += 1;
                }

                //x y z
                this.vertices.push(saa, caa, basez + 1);
                this.vertices.push(saa, caa, basez);
                this.vertices.push(sa, ca, basez + 1);

                // triangle normal computed by cross product of two edges
                var normal= [
                    saa-sa,
                    ca*saa-sa*caa,
                    caa-ca
                ];

                // normalization
                var nsize=Math.sqrt(
                    normal[0]*normal[0]+
                    normal[1]*normal[1]+
                    normal[2]*normal[2]
                    );
                normal[0]/=nsize;
                normal[1]/=nsize;
                normal[2]/=nsize;

                this.indices.push(3*nEdges, (3*nEdges + 1) , (3*nEdges + 2) );
                nEdges += 1;

                // push normal once for each vertex of this triangle
                this.normals.push(...normal);
                this.normals.push(...normal);
                this.normals.push(...normal);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    /**
     * Called when user interacts with GUI to change object's complexity.
     * @param {integer} complexity - changes number of slices
     */
    updateBuffers(complexity){

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}


