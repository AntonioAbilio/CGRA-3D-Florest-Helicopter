import { CGFobject, CGFshader} from '../lib/CGF.js';

export class MyFire extends CGFobject {
    constructor(scene, texture, scale = 2.0) {
        super(scene);
        this.texture = texture;
        this.scale = scale;
        this.initBuffers();

        this.shader = new CGFshader(scene.gl, "shaders/fire.vert", "shaders/fire.frag");
        this.shader.setUniformsValues({ uSampler: 0 });

        this.fire_offset = Math.random() * 50;
    }


    subdivideTriangle(tri) {
        // tri is an array of 9 numbers: [Ax, Ay, Az, Bx, By, Bz, Cx, Cy, Cz]

        // Extract vertices
        const A = tri.slice(0, 3);
        const B = tri.slice(3, 6);
        const C = tri.slice(6, 9);

        // Midpoints of each edge
        const AB = A.map((v, i) => (v + B[i]) / 2);
        const BC = B.map((v, i) => (v + C[i]) / 2);
        const CA = C.map((v, i) => (v + A[i]) / 2);

        // Return 4 new triangles, each 9 elements long
        return [
            [...A, ...AB, ...CA], // Triangle 1: A, AB, CA
            [...AB, ...B, ...BC], // Triangle 2: AB, B, BC
            [...CA, ...BC, ...C], // Triangle 3: CA, BC, C
            [...AB, ...BC, ...CA] // Triangle 4: center triangle formed by midpoints
        ];
    }

    initBuffers() {
        const base = 0.5 * this.scale;
        const height = 1.0 * this.scale;

        // Define all front-facing flame triangles
        const verts = [
            // Main flame (center)
            [0.0, height, 0.0, -base, 0.0, 0.0, base, 0.0, 0.0],
            // Side flame 1 (left, leaning back)
            [-0.2 * base, height * 1.2, -0.2 * this.scale, -base * 0.8, 0.0, -0.1 * this.scale, 0.0, 0.0, -0.2 * this.scale],
            // Side flame 2 (right, leaning back)
            [0.2 * base, height * 1.1, -0.2 * this.scale, 0.0, 0.0, -0.2 * this.scale, base * 0.8, 0.0, -0.1 * this.scale],
            // Side flame 3 (forward)
            [0.0, height * 1.15, 0.25 * this.scale, -0.4 * base, 0.0, 0.2 * this.scale, 0.4 * base, 0.0, 0.2 * this.scale]
        ];

        let subdividedVerts = [];
        for (const tri of verts) {
            const subs = this.subdivideTriangle(tri);
            subdividedVerts.push(...subs);
        }

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const tex = [0.5, 0.0, 0.0, 1.0, 1.0, 1.0];

        let idx = 0;
        for (let v of subdividedVerts) {
            // Front face
            this.vertices.push(...v);
            this.indices.push(idx, idx + 1, idx + 2);
            for (let i = 0; i < 3; i++) {
                this.normals.push(0, 0, 1);
            }
            this.texCoords.push(...tex);

            // Back face (same vertices, reversed order)
            this.vertices.push(...v);
            this.indices.push(idx + 5, idx + 4, idx + 3); // reversed
            for (let i = 0; i < 3; i++) {
                this.normals.push(0, 0, -1);
            }
            this.texCoords.push(...tex);

            idx += 6;
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        if (this.texture) this.texture.bind(0);

        this.shader.setUniformsValues({
            uTime: performance.now() / 1000.0, // time in seconds
        });

        this.scene.setActiveShader(this.shader);
        super.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}
