var hero = {
  scene: null,
  camera: null,
  renderer: null,
  container: null,
  controls: null,
  clock: null,
  stats: null,

  init: function() { // Initialization

    // create main scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xcccccc, 0.0003);

    var SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight;

    // prepare camera
    var VIEW_ANGLE = 30, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 2000;
    this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    this.scene.add(this.camera);
    this.camera.position.set(30, 20, -50);
    this.camera.lookAt(new THREE.Vector3(0,0,0));

    // prepare renderer
    this.renderer = new THREE.WebGLRenderer({ antialias:true });
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.renderer.setClearColor(this.scene.fog.color);
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapSoft = true;

    // prepare container
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    this.container.appendChild(this.renderer.domElement);

    // events
    THREEx.WindowResize(this.renderer, this.camera);

    // prepare controls (OrbitControls)
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target = new THREE.Vector3(0, 0, 0);
    this.controls.maxDistance = 2000;

    // prepare clock
    this.clock = new THREE.Clock();

    // prepare stats
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '50px';
    this.stats.domElement.style.bottom = '50px';
    this.stats.domElement.style.zIndex = 1;
    this.container.appendChild( this.stats.domElement );

    // add spot light
    var spLight = new THREE.SpotLight(0xffffff, 1.75, 2000, Math.PI / 3);
    spLight.castShadow = true;
    spLight.position.set(-100, 300, -50);
    this.scene.add(spLight);

    // add simple ground
    // var ground = new THREE.Mesh( new THREE.PlaneGeometry(200, 200, 10, 10), new THREE.MeshLambertMaterial({color:0x999999}) );
    // ground.receiveShadow = true;
    // ground.position.set(0, 0, 0);
    // ground.rotation.x = -Math.PI / 2;
    // this.scene.add(ground);

    // load a model
    this.loadModel();
  },
  loadModel: function() {

    // prepare loader and load the model
var oLoader = new THREE.OBJLoader();
oLoader.load('models/mask1.obj', function(object, materials) {

  // var material = new THREE.MeshFaceMaterial(materials);
  var material2 = new THREE.MeshLambertMaterial({ color: 0xfffffff });

  object.traverse( function(child) {
    if (child instanceof THREE.Mesh) {

      // apply custom material
      child.material = material2;

      // enable casting shadows
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  object.position.x = 0;
  object.position.y = -4;
  object.position.z = 0;
  object.scale.set(100, 100, 100);
  hero.scene.add(object);
});
  }
};

// Animate the scene
function animate() {
  requestAnimationFrame(animate);
  render();
  update();
}

// Update controls and stats
function update() {
  hero.controls.update(hero.clock.getDelta());
  hero.stats.update();
}

// Render the scene
function render() {
  if (hero.renderer) {
    hero.renderer.render(hero.scene, hero.camera);
  }
}

// Initialize lesson on page load
function initializeLesson() {
  hero.init();
  animate();
}

if (window.addEventListener)
  window.addEventListener('load', initializeLesson, false);
else if (window.attachEvent)
  window.attachEvent('onload', initializeLesson);
else window.onload = initializeLesson;
