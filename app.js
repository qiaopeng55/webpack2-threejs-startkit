import * as THREE from 'three';
import Stats from 'stats.js';
import dat from 'dat.gui/build/dat.gui';
// import ConvexGeometry from './utils/ConvexGeometry';
// import obc from './utils/OrbitControls';

function init() {
  const stats = initStats();
// create a scene, that will hold all our elements such as objects, cameras and lights.
  const scene = new THREE.Scene();
// create a camera, which defines where we're looking at.
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
// create a render and set the size
  const renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xEEEEEE, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;
  renderer.shadowMapType = THREE.PCFSoftShadowMap;

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
  const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
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
  camera.position.x = -25;
  camera.position.y = 30;
  camera.position.z = 25;
  camera.lookAt(new THREE.Vector3(10, 0, 0));
// add subtle ambient lighting
  const ambiColor = '#0c0c0c';
  const ambientLight = new THREE.AmbientLight(ambiColor);
  scene.add(ambientLight);
// add spotlight for the shadows
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);
  spotLight.castShadow = true;
  spotLight.shadowMapWidth = 1024 * 2;
  spotLight.shadowMapHeight = 1024 * 2;

  scene.add(spotLight);
// add the output of the renderer to the html element
  document.body.appendChild(renderer.domElement);
// call the render function
  let step = 0;
  const controls = new function () {
    this.rotationSpeed = 0.02;
    this.bouncingSpeed = 0.03;
    this.ambientColor = ambiColor;
    this.disableSpotlight = false;
  }();
  const gui = new dat.GUI();
  gui.addColor(controls, 'ambientColor').onChange((e) => {
    ambientLight.color = new THREE.Color(e);
  });
  gui.add(controls, 'disableSpotlight').onChange((e) => {
    spotLight.visible = !e;
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
	// render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
  function initStats() {
    const statsInit = new Stats();
    statsInit.setMode(0); // 0: fps, 1: ms
	// Align top-left
    statsInit.domElement.style.position = 'absolute';
    statsInit.domElement.style.left = '0px';
    statsInit.domElement.style.top = '0px';
    document.body.appendChild(statsInit.domElement);
    return statsInit;
  }
}
window.onload = init;
