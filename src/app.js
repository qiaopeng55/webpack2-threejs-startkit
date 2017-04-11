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
  const newDiv = document.createElement('div');
  newDiv.className = styles['red-text'];
  newDiv.id = 'randomId';

  const newContent = document.createTextNode('Hi there and greetings!');
  newDiv.appendChild(newContent); // add the text node to the newly created div.
	// add the newly created element and its content into the DOM
  const currentDiv = document.getElementById('Stats-output');
  document.body.insertBefore(newDiv, currentDiv);


  const stats = initStats();
        // create a scene, that will hold all our elements such as objects, cameras and lights.
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xaaaaaa, 0.010, 200);
        // create a camera, which defines where we're looking at.
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        // create a render and set the size
  const renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xaaaaff, 1.0));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;
        // create the ground plane
  const textureGrass = THREE.ImageUtils.loadTexture('../assets/textures/ground/grasslight-big.jpg');
  textureGrass.wrapS = THREE.RepeatWrapping;
  textureGrass.wrapT = THREE.RepeatWrapping;
  textureGrass.repeat.set(4, 4);
  const planeGeometry = new THREE.PlaneGeometry(1000, 200, 20, 20);
  const planeMaterial = new THREE.MeshLambertMaterial({ map: textureGrass });
//        var planeMaterial = new THREE.MeshLambertMaterial();
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
  const sphereGeometry = new THREE.SphereGeometry(4, 25, 25);
  const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        // position the sphere
  sphere.position.x = 10;
  sphere.position.y = 5;
  sphere.position.z = 10;
  sphere.castShadow = true;
        // add the sphere to the scene
  scene.add(sphere);
        // position and point the camera to the center of the scene
  camera.position.x = -20;
  camera.position.y = 15;
  camera.position.z = 45;
//        camera.position.x = -120;
//        camera.position.y = 165;
//        camera.position.z = 145;
  camera.lookAt(new THREE.Vector3(10, 0, 0));
        // add spotlight for a bit of light
  const spotLight0 = new THREE.SpotLight(0xcccccc);
  spotLight0.position.set(-40, 60, -10);
  spotLight0.lookAt(plane);
  scene.add(spotLight0);
  const target = new THREE.Object3D();
  target.position = new THREE.Vector3(5, 0, 0);
  const hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
  hemiLight.position.set(0, 500, 0);
  scene.add(hemiLight);
  const pointColor = '#ffffff';
//    var dirLight = new THREE.SpotLight( pointColor);
  const dirLight = new THREE.DirectionalLight(pointColor);
  dirLight.position.set(30, 10, -50);
  dirLight.castShadow = true;
//        dirLight.shadowCameraNear = 0.1;
//        dirLight.shadowCameraFar = 100;
//        dirLight.shadowCameraFov = 50;
  dirLight.target = plane;
  dirLight.shadowCameraNear = 0.1;
  dirLight.shadowCameraFar = 200;
  dirLight.shadowCameraLeft = -50;
  dirLight.shadowCameraRight = 50;
  dirLight.shadowCameraTop = 50;
  dirLight.shadowCameraBottom = -50;
  dirLight.shadowMapWidth = 2048;
  dirLight.shadowMapHeight = 2048;
  scene.add(dirLight);
        // add the output of the renderer to the html element
  document.getElementById('WebGL-output').appendChild(renderer.domElement);
        // call the render function
  let step = 0;
        // used to determine the switch point for the light animation
  const invert = 1;
  const phase = 0;
  const controls = new function () {
    this.rotationSpeed = 0.03;
    this.bouncingSpeed = 0.03;
    this.hemisphere = true;
    this.color = 0x00ff00;
    this.skyColor = 0x0000ff;
    this.intensity = 0.6;
  }();
  const gui = new dat.GUI();
  gui.add(controls, 'hemisphere').onChange((e) => {
    if (!e) {
      hemiLight.intensity = 0;
    } else {
      hemiLight.intensity = controls.intensity;
    }
  });
  gui.addColor(controls, 'color').onChange((e) => {
    hemiLight.groundColor = new THREE.Color(e);
  });
  gui.addColor(controls, 'skyColor').onChange((e) => {
    hemiLight.color = new THREE.Color(e);
  });
  gui.add(controls, 'intensity', 0, 5).onChange((e) => {
    hemiLight.intensity = e;
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
