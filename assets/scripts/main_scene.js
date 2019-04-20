window.addEventListener('DOMContentLoaded', function() {

  var canvas = document.getElementById('renderCanvas');

  // load the 3D engine
  var engine = new BABYLON.Engine(canvas, true);

  var createScene = function() {
    // Create a basic BJS Scene object
    var scene = new BABYLON.Scene(engine);
    // Create the camera
    var camera = createCamera(scene);
    camera.attachControl(canvas, true);
    // Create a basic light, aiming 0,1,0 - meaning, to the sky.
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);
    // Create the tunnel
    var tunnel = createTunnel(scene);
    // Create the spaceship
    var ship = createSpaceShip(scene);
    // Create the background to simulate flying through space
    var background = createBackground(scene);
    // Create asteroids system
    var asteroids = createAsteroids(scene);


    // Return the created scene.
    return scene;
  }

  var scene = createScene();

  engine.runRenderLoop(function() {
    scene.render();
  });

  window.addEventListener('resize', function() {
    engine.resize();
  });
});

var createCamera = function(scene) {
  // Position the camera at x: 0, y: 0, z: 850 to be at the end of the tunnel
  var camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(0, 0, 850), scene);
  // Set the camera to look strait down the tunnel
  camera.setTarget(new BABYLON.Vector3(0, 0, 0));

  return camera;
}

var createTunnel = function(scene) {
  // Load the tunnel mesh
  var tunnel = BABYLON.SceneLoader.ImportMesh("", "/meshes/", "tunnel.stl", scene, function (tunnel) {
    // Position the tunnel mesh at the origin
    tunnel[0].position = new BABYLON.Vector3.Zero();
    // Create a new material
    var material = new BABYLON.StandardMaterial("TunnelTexture", scene);
    // Make the material transparent
    material.alpha = 0.1;
    // Assign the material to the tunnel
    tunnel[0].material = material;

  });

  return tunnel;
}

var createSpaceShip = function(scene) {
  // replace with actual ship mesh
  var spaceship = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
  spaceship.position = new BABYLON.Vector3(0, 0, 800);
  setupPlayerKeyboardControls(scene, spaceship);
  return spaceship;
}

var createBackground = function(scene) {
  var background = BABYLON.MeshBuilder.CreatePlane("plane", { width: 1024, height: 1024 }, scene);
  background.position = new BABYLON.Vector3(0, 0, 0);
  background.rotate(BABYLON.Axis.X, Math.PI, BABYLON.Space.LOCAL);

  var material = new BABYLON.StandardMaterial("texture", scene);
  material.emmissiveColor = new BABYLON.Color3(100, 100, 100);
  
  var videoTexture = new BABYLON.VideoTexture("StarsVideo", ["/textures/space_travel2.mp4"], scene, true);

  material.diffuseTexture = videoTexture;
  background.material = material;


  return background;
}

// Check that the x & y coordinates are within the bounds of the tunnel.  hehe.
var checkBounds = function(x, y, padding) {
  var radius = Math.sqrt(((x)**2) + ((y)**2))
  return ((radius + padding) < 8)
}

var setupPlayerKeyboardControls = function(scene, player) {
  scene.registerBeforeRender(function() {
    if(KeyBoardState.pressLeft) {
      var x = player.position.x;
      var y = player.position.y;
      if (checkBounds(x+1, y, 0)) {
        player.position.x = x+1;
      }
    }
    if(KeyBoardState.pressRight) {
      var x = player.position.x;
      var y = player.position.y;
      if (checkBounds(x-1, y, 0)) {
        player.position.x = x-1;
      }
    }
    if(KeyBoardState.pressDown) {
      var x = player.position.x;
      var y = player.position.y;
      if (checkBounds(x, y-1, 0)) {
        player.position.y = y-1;
      }
    }
    if(KeyBoardState.pressUp) {
      var x = player.position.x;
      var y = player.position.y;
      if (checkBounds(x, y+1, 0)) {
        player.position.y = y+1;
      }
    }
  });
}

function boundedRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
