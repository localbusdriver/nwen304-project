import * as THREE from "three";
import Stats from "stats";
import { FlyControls } from "fly";
import { Lensflare, LensflareElement } from "lens";

let container, stats;

let camera, scene, renderer;
let controls;

const clock = new THREE.Clock();

init();
animate();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

//Create camera
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    15000
  );
  camera.position.z = 250;

  //Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color().setHSL(0.51, 0.4, 0.01); //h,s,l = 「色相(Hue)」「彩度(Saturation)」「輝度（Lightness)」
  scene.fog = new THREE.Fog(scene.background, 3500, 15000);
  const size = 250;

  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xffffff, //Reflection
    shininess: 50, //Brightness
  });

  function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return new THREE.Color(`rgb(${r},${g},${b})`);
}

//Creates 2500 objects
  for (let i = 0; i < 2500; i++) {
    const randomColor = getRandomColor();//get random color
    const material = new THREE.MeshPhongMaterial({
        color: randomColor,//Here setting random color
        specular: 0xffffff, //reflection
        shininess: 50, // brightness
    });
    const mesh = new THREE.Mesh(geometry, material);

    //randomize position
    mesh.position.x = 8000 * (2.0 * Math.random() - 1.0);
    mesh.position.y = 8000 * (2.0 * Math.random() - 1.0);
    mesh.position.z = 8000 * (2.0 * Math.random() - 1.0);

    //randomize rotation
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    mesh.rotation.z = Math.random() * Math.PI;

    mesh.matrixAutoUpdate = false; //set this to false so it wont auto calculate
    mesh.updateMatrix(); //Manually update matrix

    scene.add(mesh);
  }


  const dirLight = new THREE.DirectionalLight(0xffffff, 0.03);
  dirLight.position.set(0, -1, 0).normalize(); //set light comes out from y axis
  dirLight.color.setHSL(0.1, 0.7, 0.5);
  scene.add(dirLight);

  //Build lensflare
  const textureLoader = new THREE.TextureLoader();

  const textureFlare = textureLoader.load("./textures/LensFlare.png");
  const textureFlare3 = textureLoader.load("./textures/LensFlare2.png");

  addLight(0.55, 0.9, 0.9, 5000, 0, -1000);
  addLight(0.08, 0.3, 0.9, 0, 0, -1000);
  addLight(0.995, 0.5, 0.9, 5000, 5000, -1000);

  function addLight(h, s, l, x, y, z) {
    const light = new THREE.PointLight(0xffffff, 1.5, 2000); 
    light.color.setHSL(h, s, l);
    light.position.set(x, y, z);
    scene.add(light);

    const lensflare = new Lensflare();
    lensflare.addElement(
      new LensflareElement(textureFlare, 700, 0, light.color)
    );
    lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
    lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
    light.add(lensflare);
  }

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);
  //

  controls = new FlyControls(camera, renderer.domElement);

  controls.movementSpeed = 2500;
  controls.domElement = container;
  controls.rollSpeed = Math.PI / 20;
  controls.autoForward = false;
  controls.dragToLook = false;

  // stats
  stats = new Stats();
  container.appendChild(stats.dom);

  //auto window resize
  window.addEventListener("resize", onWindowResize);
}

//
function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

//
function animate() {
  requestAnimationFrame(animate);

  render();
  stats.update();
}

function render() {
  const delta = clock.getDelta(); //obtain the time

  controls.update(delta); //allowed mouse sensor
  renderer.render(scene, camera);
}