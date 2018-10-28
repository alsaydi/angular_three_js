import { Component, OnInit, AfterContentInit } from '@angular/core';
import * as d3 from 'd3';
import * as THREE from 'three';
import { CoordinatesService } from '../coordinates.service';
import { Face3 } from 'three';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss']
})
export class DrawComponent implements OnInit, AfterContentInit {
  private camera: any;
  private scene: any;
  private renderer: any;
  private windowScale: any;

  polygonSides = 5;
  constructor(private coordinatesService: CoordinatesService) { }

  ngOnInit() {
  }

  updateScene(): void {
    this.fillScene();
  }

  fillScene(): void {
    this.initWorld();
    this.showGrids();

    // creating and adding the triangle to the scene
    this.drawTriangle();
    // creating and adding your square to the scene !
    this.drawSquare();

    // polygon with n sides
    this.drawPolygon();

    this.addToDOM();
    this.render();
  }

  ngAfterContentInit() {
    console.log('ng after content init ...');
    console.log(THREE);
    this.fillScene();
    d3.select('p').style('color', 'red');
  }

  private drawTriangle() {
    const triangleMaterial = new THREE.MeshBasicMaterial({ color: 0x2685AA, side: THREE.DoubleSide });
    const triangleGeometry = this.getTriangleGeometry();
    const triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);
    this.scene.add(triangleMesh);
  }

  private drawSquare() {
    const square_material = new THREE.MeshBasicMaterial({ color: 0xF6831E, side: THREE.DoubleSide });
    const square_geometry = this.getSquareGeometry(3, 5, 7, 9);
    const square_mesh = new THREE.Mesh(square_geometry, square_material);
    this.scene.add(square_mesh);
  }

  private drawPolygon() {
    const geo = this.getPolygonGeometry(this.polygonSides, new THREE.Vector3(5, 5), 13);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.FrontSide });
    const mesh = new THREE.Mesh(geo, material);
    this.scene.add(mesh);
  }

  getTriangleGeometry(): THREE.Geometry {
    // This code demonstrates how to draw a triangle
    const triangle = new THREE.Geometry();
    triangle.vertices.push(new THREE.Vector3(1, 1, 0));
    triangle.vertices.push(new THREE.Vector3(3, 1, 0));
    triangle.vertices.push(new THREE.Vector3(3, 3, 0));
    triangle.faces.push(new THREE.Face3(0, 1, 2));
    return triangle;
  }

  getSquareGeometry(x1, y1, x2, y2): THREE.Geometry {
    const square = new THREE.Geometry();
    square.vertices.push(new THREE.Vector3(x1, y1, 0));
    square.vertices.push(new THREE.Vector3(x2, y1, 0));
    square.vertices.push(new THREE.Vector3(x2, y2, 0));
    square.vertices.push(new THREE.Vector3(x1, y2, 0));
    square.faces.push(new THREE.Face3(0, 1, 2));
    square.faces.push(new THREE.Face3(2, 0, 3));
    return square;
  }

  getPolygonGeometry(sides: number, polyLocation: THREE.Vector3, radius: number): THREE.Geometry {
    const geo = new THREE.Geometry();

    // generate vertices
    for (let pt = 0; pt < sides; pt++) {
      // Add 90 degrees so we start at +Y axis, rotate counterclockwise around
      const angle = (Math.PI / 2) + (pt / sides) * 2 * Math.PI;

      const x = radius * Math.cos(angle) + polyLocation.x;
      const y = radius * Math.sin(angle) + polyLocation.y;
      geo.vertices.push(new THREE.Vector3(x, y, 0));
    }

    for (let face = 0; face < sides - 2; face++) {
      geo.faces.push(new THREE.Face3(0, face + 1, face + 2));
    }
    return geo;
  }

  initWorld(): any {
    //  Set up some parameters
    const canvasWidth = window.innerWidth * 0.5;
    const canvasHeight = window.innerHeight * 0.5;
    const canvasRatio = canvasWidth / canvasHeight;
    // scene
    this.scene = new THREE.Scene();

    // Camera: Y up, X right, Z up
    this.windowScale = 12;
    const windowWidth = this.windowScale * canvasRatio;
    const windowHeight = this.windowScale;

    this.camera = new THREE.OrthographicCamera(windowWidth / -2, windowWidth / 2, windowHeight / 2, windowHeight / -2, 0, 40);

    const focus = new THREE.Vector3(5, 5, 0);
    this.camera.position.x = focus.x;
    this.camera.position.y = focus.y;
    this.camera.position.z = 20;
    this.camera.lookAt(focus);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.renderer.setSize(canvasWidth, canvasHeight);

    this.renderer.setClearColor(new THREE.Color('wheat'), 1.0);
  }

  showGrids(): void {
    // Background grid and axes. Grid step size is 1, axes cross at 0, 0

    // const size = 100;
    // const divisions = 10;
    // const gridHelper = new THREE.GridHelper(size, divisions, new THREE.Color('yellow'), new THREE.Color('red')  );
    // this.scene.add( gridHelper );

    this.coordinatesService.drawGrid({ size: 100, scale: 1, orientation: 'z' }, this.scene);
    this.coordinatesService.drawAxes({ axisLength: 11, axisOrientation: 'x', axisRadius: 0.04 }, this.scene);
    this.coordinatesService.drawAxes({ axisLength: 11, axisOrientation: 'y', axisRadius: 0.04 }, this.scene);
  }

  addToDOM(): void {

    function _addToDOM(domElement) {
      const container = document.getElementById('container');
      const canvas = container.getElementsByTagName('canvas');
      if (canvas.length > 0) {
        container.removeChild(canvas[0]);
      }
      container.appendChild(domElement);
    }

    _addToDOM(this.renderer.domElement);
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }
}
