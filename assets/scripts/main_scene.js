window.addEventListener('DOMContentLoaded', function() {
  var canvas = document.getElementById('renderCanvas');
  var space_race_game = new Game(canvas);
  space_race_game.start();
});

var createCamera = function(scene) {
  // Position the camera at x: 0, y: 0, z: 850 to be at the end of the tunnel
  var camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(0, 0, 850), scene);
  // Set the camera to look strait down the tunnel
  camera.setTarget(new BABYLON.Vector3(0, 0, 0));

  return camera;
}

// Create the spaceship
var createSpaceShip = function(scene) {
  // Create the thing babylon is capable of colliding
  var collider = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
  // Create a new material
  var material = new BABYLON.StandardMaterial("ColliderTexture", scene);
  // Make the material invisible
  material.alpha = 0.0;
  // Set the z coordinate to just infront of the camera
  collider.position = new BABYLON.Vector3(0, 0, 800);
  // Assign the invisible material to the collider
  collider.material = material;
  // Tie wasd keybindings to the collider
  setupPlayerKeyboardControls(scene, collider);
  // Import the spaceship mesh
  var spaceship = BABYLON.SceneLoader.ImportMesh(
    "", 
    "/meshes/", 
    "spaceship.stl",
    scene,
    function (spaceship) {
      // Create a new material for the spaceship
      var material = new BABYLON.StandardMaterial("ShipTexture", scene);
      // Assign the material to the spaceship
      spaceship[0].material = material;
      // Make the collider the parent of the ship so the ship can collide with
      // things
      spaceship[0].parent = collider;
  });
  return collider;
}

var createBackground = function(scene) {
  var background = BABYLON.MeshBuilder.CreatePlane("plane", { width: 1024, height: 1024 }, scene);
  background.position = new BABYLON.Vector3(0, 0, 0);
  background.rotate(BABYLON.Axis.X, Math.PI, BABYLON.Space.LOCAL);

  var material = new BABYLON.StandardMaterial("texture", scene);
  material.emmissiveColor = new BABYLON.Color3(100, 100, 100);
  
  var videoTexture = new BABYLON.VideoTexture(
    "StarsVideo",
    ["/textures/space_travel2.mp4"],
    scene,
    true);
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
