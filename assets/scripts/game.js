var playerIsAlive = true;

function Game(canvas) {
  this.canvas = canvas;
  this.engine = new BABYLON.Engine(canvas, true);
}

Game.prototype.createMainGameScene = function() {
  // Create a basic BJS Scene object
  var scene = new BABYLON.Scene(this.engine);
  scene.clearColor = new BABYLON.Color3(0, 0, 0);
  // Create the camera
  var camera = createCamera(scene);
  // Create a basic light, aiming 0,1,0 - meaning, to the sky.
  var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);
  // Create the spaceship
  var ship = createSpaceShip(scene);
  // Create the background to simulate flying through space
  var background = createBackground(scene);
  // Create asteroids system
  var asteroids = createAsteroids(scene, ship, this.killPlayer);

  // Return the created scene.
  return scene;
}

Game.prototype.createGameOverScene = function() {
  var scene = new BABYLON.Scene(this.engine);
  var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);
  scene.clearColor = new BABYLON.Color3(0, 0, 0);
  var plane = new BABYLON.MeshBuilder.CreatePlane(
    "messages",
    {width: 1000, height: 512, subdivisions:100},
    scene);
  plane.position = new BABYLON.Vector3(0, 0, 0);
  plane.rotate(BABYLON.Axis.X, Math.PI, BABYLON.Space.LOCAL);
  plane.rotate(BABYLON.Axis.Z, Math.PI, BABYLON.Space.LOCAL);

  var material = new BABYLON.StandardMaterial("MsgTexture", scene);
  var game_over_texture = new BABYLON.Texture("textures/arrrg_strawhat_game_over.png", scene);
  material.diffuseTexture = game_over_texture;
  plane.material = material;

  var play_again = new BABYLON.MeshBuilder.CreatePlane(
    "play_again",
    {width: 150, height: 100, subdivisions: 16},
    scene);
  play_again.position = new BABYLON.Vector3(0, -200, 1);
  play_again.rotate(BABYLON.Axis.X, Math.PI, BABYLON.Space.LOCAL);
  play_again.rotate(BABYLON.Axis.Z, Math.PI, BABYLON.Space.LOCAL);

  var play_again_mat = new BABYLON.StandardMaterial("BtnMaterial", scene);
  var play_again_texture = new BABYLON.Texture("textures/PlayAgain.png", scene);
  play_again_mat.diffuseTexture = play_again_texture;
  play_again.material = play_again_mat;

  play_again.actionManager = new BABYLON.ActionManager(scene);
  play_again.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnLeftPickTrigger,
      function(event) {
        this.restartGame();
      }.bind(this)));


  var camera = createCamera(scene);
  return scene;
}

Game.prototype.killPlayer = function() {
  var scene = new BABYLON.Scene(this.engine);
  var camera = createCamera(scene);
  var explosion = new BABYLON.Sound("explosion", "/sounds/explosion.wav", scene,
    function() {
      explosion.play();
    },
    {
      loop: false,
      autoplay: true,
      volume: .5
    }
  );
  playerIsAlive = false;
}

Game.prototype.restartGame = function() {
  playerIsAlive = true;
}

Game.prototype.start = function() {
  var main_game_scene = this.createMainGameScene();
  var game_over_scene = this.createGameOverScene();

  this.engine.runRenderLoop(function() {
    if(playerIsAlive === true) {
      main_game_scene.render();
    } else {
      game_over_scene.render();
    }
  }.bind(this));

  window.addEventListener('resize', function() {
    this.engine.resize();
  }.bind(this));
}
