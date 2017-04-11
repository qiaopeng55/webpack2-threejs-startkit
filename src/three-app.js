import * as THREE from 'three';
import Stats from 'stats.js';
import dat from 'dat.gui/build/dat.gui';

import styles from './app.css';
// import ConvexGeometry from './utils/ConvexGeometry';

// import obc from './utils/OrbitControls';

// check if HMR is enabled
if (module.hot) {
    // accept itself
  module.hot.accept();
}

// once everything is loaded, we run our Three.js stuff.
function init() {
  let stopMovingLight = false;
  const stats = initStats();
			// create a scene, that will hold all our elements such as objects, cameras and lights.
  const scene = new THREE.Scene();
			// create a camera, which defines where we're looking at.
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
			// create a render and set the size
  const renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xFFEEFF, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;
  renderer.shadowMapType = THREE.PCFShadowMap;
			// create the ground plane
  const planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
			// rotate and position the plane
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 15;
  plane.position.y = 0;
  plane.position.z = 0;
			// add the plane to the scene
  scene.add(plane);
			// create a cube
  const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff3333 });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;
			// position the cube
  cube.position.x = -4;
  cube.position.y = 3;
  cube.position.z = 0;
			// add the cube to the scene
  scene.add(cube);
  const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
  const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
			// position the sphere
  sphere.position.x = 20;
  sphere.position.y = 0;
  sphere.position.z = 2;
  sphere.castShadow = true;
			// add the sphere to the scene
  scene.add(sphere);
			// position and point the camera to the center of the scene
  camera.position.x = -35;
  camera.position.y = 30;
  camera.position.z = 25;
  camera.lookAt(new THREE.Vector3(10, 0, 0));
			// add subtle ambient lighting
  const ambiColor = '#1c1c1c';
  const ambientLight = new THREE.AmbientLight(ambiColor);
  scene.add(ambientLight);
			// add spotlight for a bit of light
  const spotLight0 = new THREE.SpotLight(0xcccccc);
  spotLight0.position.set(-40, 30, -10);
  spotLight0.lookAt(plane);
  scene.add(spotLight0);
  const target = new THREE.Object3D();
  // target.position = new THREE.Vector3(5, 0, 0);
  const pointColor = '#ffffff';
  const spotLight = new THREE.SpotLight(pointColor);
  spotLight.position.set(-40, 60, -10);
  spotLight.castShadow = true;
  spotLight.shadowCameraNear = 2;
  spotLight.shadowCameraFar = 200;
  spotLight.shadowCameraFov = 30;
  spotLight.target = plane;
  spotLight.distance = 0;
  spotLight.angle = 0.4;
  scene.add(spotLight);
			// add a small sphere simulating the pointlight
  const sphereLight = new THREE.SphereGeometry(0.2);
  const sphereLightMaterial = new THREE.MeshBasicMaterial({ color: 0xac6c25 });
  const sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
  sphereLightMesh.castShadow = true;
  // sphereLightMesh.position = new THREE.Vector3(3, 20, 3);
  scene.add(sphereLightMesh);
			// add the output of the renderer to the html element
  document.getElementById('WebGL-output').appendChild(renderer.domElement);
			// call the render function
  let step = 0;
			// used to determine the switch point for the light animation
  let invert = 1;
  let phase = 0;
  const controls = new function () {
    this.rotationSpeed = 0.03;
    this.bouncingSpeed = 0.03;
    this.ambientColor = ambiColor;
    this.pointColor = pointColor;
    this.intensity = 1;
    this.distance = 0;
    this.exponent = 30;
    this.angle = 0.1;
    this.debug = false;
    this.castShadow = true;
    this.onlyShadow = false;
    this.target = 'Plane';
    this.stopMovingLight = false;
  }();
  const gui = new dat.GUI();
  gui.addColor(controls, 'ambientColor').onChange((e) => {
    ambientLight.color = new THREE.Color(e);
  });
  gui.addColor(controls, 'pointColor').onChange((e) => {
    spotLight.color = new THREE.Color(e);
  });
  gui.add(controls, 'angle', 0, Math.PI * 2).onChange((e) => {
    spotLight.angle = e;
  });
  gui.add(controls, 'intensity', 0, 5).onChange((e) => {
    spotLight.intensity = e;
  });
  gui.add(controls, 'distance', 0, 200).onChange((e) => {
    spotLight.distance = e;
  });
  gui.add(controls, 'exponent', 0, 100).onChange((e) => {
    spotLight.exponent = e;
  });
  gui.add(controls, 'debug').onChange((e) => {
    spotLight.shadowCameraVisible = e;
  });
  gui.add(controls, 'castShadow').onChange((e) => {
    spotLight.castShadow = e;
  });
  gui.add(controls, 'onlyShadow').onChange((e) => {
    spotLight.onlyShadow = e;
  });
  gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange((e) => {
    console.log(e);
    switch (e) {
      case 'Plane':
        spotLight.target = plane;
        break;
      case 'Sphere':
        spotLight.target = sphere;
        break;
      case 'Cube':
        spotLight.target = cube;
        break;
    }
  });
  gui.add(controls, 'stopMovingLight').onChange((e) => {
    stopMovingLight = e;
  });
  render();
  function render() {
    stats.update();
					// rotate the cube around its axes
    cube.rotation.x += controls.rotationSpeed;
    cube.rotation.y += controls.rotationSpeed;
    cube.rotation.z += controls.rotationSpeed;
					// bounce the sphere up and down
    step += controls.bouncingSpeed;
    sphere.position.x = 20 + (10 * (Math.cos(step)));
    sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));
					// move the light simulation
    if (!stopMovingLight) {
      if (phase > 2 * Math.PI) {
        invert *= -1;
        phase -= 2 * Math.PI;
      } else {
        phase += controls.rotationSpeed;
      }
      sphereLightMesh.position.z = +(7 * (Math.sin(phase)));
      sphereLightMesh.position.x = +(14 * (Math.cos(phase)));
      sphereLightMesh.position.y = 10;
      if (invert < 0) {
        const pivot = 14;
        sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
      }
      spotLight.position.copy(sphereLightMesh.position);
    }
					// render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
  function initStats() {
    const stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms
					// Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.getElementById('Stats-output').appendChild(stats.domElement);
    return stats;
  }
}
window.onload = init;
