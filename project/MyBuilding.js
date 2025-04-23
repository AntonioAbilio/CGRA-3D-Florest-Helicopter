import { CGFobject } from '../lib/CGF.js';
import { MyWindow } from './MyWindow.js';

/**
 * MyQuad
 * @constructor
 * @param {MyScene} scene - Reference to MyScene object
 * @param {Array} coords - Array of texture coordinates (optional)
 */
export class MyBuilding extends CGFobject {
	constructor(scene, coords) {
		super(scene);
		this.windows = []

		for (let i = 0; i < 18; i++) {
			this.windows.push(new MyWindow(scene))
		}

		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [];
		this.normals = [];
		this.indices = [];


		this.building(12, 20, 20, 10, 0, 10)
		this.building(12, 15, 15, 20, 0, 12.5)
		this.building(12, 15, 15, 0, 0, 12.5)


		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
	

	building(x_size, y_size, z_size, x_offset = 0, y_offset = 0, z_offset = 0){

		this.addFace(
			[ //Vertices
				0, 0, 0,	//0
				x_size, 0, 0,	//1
				0, y_size, 0,	//2
				x_size, y_size, 0	//3
			],
			[ //Faces
				2, 1, 0,
				2, 3, 1
			],
			[ //Normals
				0, 0, 1,
				0, 0, 1,
				0, 0, 1,
				0, 0, 1
			],
			x_offset, y_offset, z_offset
		)

		this.addFace(
			[ //Vertices
				0, 0, z_size,	//0
				x_size, 0, z_size,	//1
				0, y_size, z_size,	//2
				x_size, y_size, z_size	//3
			],
			[ //Faces
				0, 1, 2,
				1, 3, 2
			],
			[ //Normals
				0, 0, -1,
				0, 0, -1,
				0, 0, -1,
				0, 0, -1
			],
			x_offset, y_offset, z_offset
		)

		this.addFace(
			[ //Vertices
				0, 0, 0,	//0
				0, 0, z_size,	//1
				0, y_size, 0,	//2
				0, y_size, z_size	//3
			],
			[ //Faces
				0, 1, 2,
				1, 3, 2
			],
			[ //Normals
				1, 0, 0,
				1, 0, 0,
				1, 0, 0,
				1, 0, 0
			],
			x_offset, y_offset, z_offset
		)

		this.addFace(
			[ //Vertices
				x_size, 0, 0,	//0
				x_size, 0, z_size,	//1
				x_size, y_size, 0,	//2
				x_size, y_size, z_size	//3
			],
			[ //Faces
				2, 1, 0,
				2, 3, 1
			],
			[ //Normals
				-1, 0, 0,
				-1, 0, 0,
				-1, 0, 0,
				-1, 0, 0
			],
			x_offset, y_offset, z_offset
		)

		this.addFace(
			[ //Vertices
				0, y_size, 0,	//0
				0, y_size, z_size,	//1
				x_size, y_size, 0,	//2
				x_size, y_size, z_size	//3
			],
			[ //Faces
				0, 1, 2,
				1, 3, 2
			],
			[ //Normals
				-1, 0, 0,
				-1, 0, 0,
				-1, 0, 0,
				-1, 0, 0
			],
			x_offset, y_offset, z_offset
		)
	}

	addFace(verts, indic, norm, x_offset = 0, y_offset = 0, z_offset = 0) {

		let offset = Math.floor(this.vertices.length / 3);

		for (var i = 0; i < verts.length; i++) {
			var coord = i % 3

			switch (coord) {

				case 0:
					verts[i] += x_offset;
					break;

				case 1:

					verts[i] += y_offset;
					break;

				case 2:
					verts[i] += z_offset;
					break;
			}
		}

		for (var i = 0; i < indic.length; i++) indic[i] += offset;

		this.vertices = this.vertices.concat(verts);
		this.indices = this.indices.concat(indic);
		this.normals = this.normals.concat(norm);

	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the quad
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}

