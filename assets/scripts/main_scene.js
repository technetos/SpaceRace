window.addEventListener('DOMContentLoaded', function() {

  var canvas = document.getElementById('renderCanvas');

  // load the 3D engine
  var engine = new BABYLON.Engine(canvas, true);

  var createScene = function() {
    // Create a basic BJS Scene object.
    var scene = new BABYLON.Scene(engine);

    // Create the camera
    var camera = createCamera(scene);

    // Create a basic light, aiming 0,1,0 - meaning, to the sky.
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

    // Create the tunnel
    let tunnel = createTunnel(scene);
    
    // Create the spaceship
    let ship = createSpaceShip(scene);

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
    // Create a new material and assign it to the tunnel mesh
    var material = new BABYLON.StandardMaterial("texture", scene);
    material.emmissiveColor = new BABYLON.Color3(100, 100, 100);

    // var videoTexture = new BABYLON.VideoTexture("video", ["/textures/space_travel2.mp4"], scene, true, true);
    // material.diffuseTexture = videoTexture;

    tunnel[0].material = material;

    // scene.onPointerUp = function() {
    //   videoTexture.video.play();
    // }
  });

  return tunnel;
}

var createSpaceShip = function(scene) {
  var spaceship = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
  spaceship.position = new BABYLON.Vector3(-4, 0, 800);
  return spaceship;
}

var checkBounds = function(o) {
  if(!!o.position) {
    var pos = o.position;

    return (pos.x <= 4 && pos.y <= 4);
  }
  return false;
}
