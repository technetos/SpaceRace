window.addEventListener('DOMContentLoaded', function() {
  // All the following code is entered here.

  var canvas = document.getElementById('renderCanvas');

  // load the 3D engine
  var engine = new BABYLON.Engine(canvas, true);

  var createScene = function() {
    // Create a basic BJS Scene object.
    var scene = new BABYLON.Scene(engine);

    // Create a FreeCamera, and set its position to (x:0, y:5, z:-10).
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, new BABYLON.Vector3.Zero, scene);

    // Target the camera to scene origin.
    //camera.setTarget(BABYLON.Vector3.Zero());

    // Attach the camera to the canvas.
    camera.attachControl(canvas, false);

    // Create a basic light, aiming 0,1,0 - meaning, to the sky.
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

    var tunnel = BABYLON.SceneLoader.ImportMesh("", "/meshes/", "tunnel.stl", scene, function (tunnel) {
      var material = new BABYLON.StandardMaterial("texture", scene);
      material.emmissiveColor = new BABYLON.Color3(100, 100, 100);

      var videoTexture = new BABYLON.VideoTexture("video", ["/textures/space_travel2.mp4"], scene, true, true);
      material.diffuseTexture = videoTexture;

      tunnel[0].material = material;

      scene.onPointerUp = function() {
        videoTexture.video.play();
      }
    });

    scene.debugLayer.show();
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
