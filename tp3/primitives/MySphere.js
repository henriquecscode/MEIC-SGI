import { CGFobject } from '../../lib/CGF.js';


export class MySphere extends CGFobject {
  /**
   * MySphere
   * @method constructor
   * @param scene - MyScene object
   * @param slices - number of slices 
   * @param stacks - number of stacks (half sphere) 
   * @param radius - radius of the sphere
   */

  constructor(scene, id, slices, stacks, radius) {
    super(scene);

    this.slices = slices;
    this.stacks = stacks;
    this.latDivs = stacks * 2;
    this.longDivs = slices;

    this.radius = radius;
    this.initBuffers();
  }
  /**
   * @method initBuffers
   * Initializes the sphere buffers
   * TODO: DEFINE TEXTURE COORDINATES
   */
  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.staticTexCoords = [];
    this.texCoords = [];

    var phi = 0;
    var theta = 0;
    var phiInc = Math.PI / this.latDivs;
    var thetaInc = (2 * Math.PI) / this.longDivs;
    var latVertices = this.longDivs + 1;

    for (let latitude = 0; latitude <= this.latDivs; latitude++) {
      var sinPhi = Math.sin(phi);
      var cosPhi = Math.cos(phi);
      var lat = 1 / this.latDivs * latitude;

      // in each stack, build all the slices around, starting on longitude 0
      theta = 0;
      for (let longitude = 0; longitude <= this.longDivs; longitude++) {
        //--- Vertices coordinates
        var x = Math.cos(theta) * sinPhi;
        var y = cosPhi;
        var z = Math.sin(-theta) * sinPhi;
        this.vertices.push(x * this.radius, y * this.radius, z * this.radius);

        var long = 1 / this.longDivs * longitude;

        this.staticTexCoords.push(long, lat);

        //--- Indices
        if (latitude < this.latDivs && longitude < this.longDivs) {
          var current = latitude * latVertices + longitude;
          var next = current + latVertices;


          this.indices.push(current + 1, current, next);
          this.indices.push(current + 1, next, next + 1);
        }

        this.normals.push(x, y, z);
        theta += thetaInc;

      }
      phi += phiInc;
    }


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
  /**
* @method updateTexCoords
* Updates the list of texture coordinates of the rectangle
* @param {Array} coords - Array of texture coordinates
*/
  updateTexCoords(length_s, length_t) {
    this.texCoords = this.staticTexCoords.map((val, index) => {
      if (index % 2 == 0) {
        return val / length_s;
      }
      else {
        return val / length_t;
      }
    })
    this.updateTexCoordsGLBuffers();


  }
}

