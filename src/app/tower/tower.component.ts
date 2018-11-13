import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { animate } from '@angular/animations';

@Component({
  selector: 'app-tower',
  templateUrl: './tower.component.html',
  styleUrls: ['./tower.component.scss']
})
export class TowerComponent implements OnInit, AfterViewInit {

  constructor() { }

  private camera;
  private scene;
  private renderer;
  private mesh;

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.initScene();
  }

  private initScene(): void {
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.z = 400;
    this.scene = new THREE.Scene();

    const texture = new THREE.TextureLoader().load('/assets/crate.gif');
    const geometry = new THREE.BoxBufferGeometry(200, 200, 200);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    this.mesh = new THREE.Mesh(geometry, material);
    // this.scene.add(this.mesh );


    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 1);

    const lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(- 100, - 200, - 100);

    this.scene.add(lights[0]);
    this.scene.add(lights[1]);
    this.scene.add(lights[2]);

    this.addTorusGeometryToScene();

    this.addToDOM();
    //
    // window.addEventListener( 'resize', onWindowResize, false );
  }

  private addTorusGeometryToScene() {
    const data = {
      radius: 105,
      tube: 20,
      radialSegments: 26,
      tubularSegments: 100,
      arc: Math.PI * 2.0
    };

    const group = new THREE.Group();

    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.addAttribute('position', new THREE.Float32BufferAttribute([], 3));

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    const meshMaterial = new THREE.MeshPhongMaterial({ color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true });

    group.add(new THREE.LineSegments(bufferGeometry, lineMaterial));
    group.add(new THREE.Mesh(bufferGeometry, meshMaterial));

    const t_geometry = new THREE.TorusGeometry(data.radius, data.tube, data.radialSegments, data.tubularSegments, data.arc);

    group.children[1].geometry = t_geometry;
    group.position.setX(-310);
    group.position.setY(-100);
    group.rotateY(40);
    group.rotateX(0.45 * Math.PI);
    this.scene.add(group);
    this.animate(group);
  }

  private animate (group): void {
    const currentScene = this.scene;
    const currentCamera = this.camera;
    const self = this;
    const animateCallback = function () {
      requestAnimationFrame(animateCallback);
      group.rotation.x += 0.005;
      group.rotation.y += 0.005;
      self.renderer.render(currentScene, currentCamera);
    };
    // this.renderer.render(this.scene, this.camera);

     requestAnimationFrame(animateCallback);
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
}
