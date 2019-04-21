// Setup the Solid Particle System for the asteroids
var createAsteroids = function(scene, player, killPlayerCallback) {
  // Create an instance of the solid particle system
  var SPS = new BABYLON.SolidParticleSystem(
    "Asteroid_SPS",
    scene,
    {particleIntersection: true});
  // Create the mesh that is used as the particle template
  var asteroid = BABYLON.MeshBuilder.CreateIcoSphere(
    "Asteroid",
    {radius: 2, subdivisions: 1},
    scene);
  // Set the template to use in the SPS
  SPS.addShape(asteroid, 5);
  // Construct the meshes we will need
  var asteroidMesh = SPS.buildMesh();
  // Place the instantiation position behind the video plane at z=0 so the
  // asteroids seem like they are coming from deep in space ;)
  asteroidMesh.position.z = -5;
  // Set the material used for the asteroid
  var material = new BABYLON.StandardMaterial("AsteroidMaterial", scene);
  material.diffuseTexture = new BABYLON.Texture("textures/asteroid.jpg", scene);
  // Make the texture not shiny
  material.specularColor = new BABYLON.Color3(0, 0, 0);
  // Assign the asteroid material to the asteroids
  asteroidMesh.material = material;
  // Free the template instance
  asteroid.dispose();
  
  // Init
  SPS.initParticles = function() {
    for (var p = 0; p < this.nbParticles; p++) {
      this.recycleParticle(this.particles[p]);
    }
  };

  // Recycle
  SPS.recycleParticle = function(particle) {
    // Randomize where the asteroids come from with respect to the x and y
    // coordinates between -5 and 5
    particle.position.x = boundedRandom(-5.0, 5.0);
    particle.position.y = boundedRandom(-5.0, 5.0);
    particle.position.z = -5;

    // Randomize the velocity along the z axis between 3 and 12, this means the
    // asteroids fly at varying speeds
    particle.velocity.x = 0;
    particle.velocity.y = 0;
    particle.velocity.z = boundedRandom(8, 12);

    // Randomize the rotation along the y and z axis so that the asteroids arent
    // boring
    particle.rotation.x = 0;
    particle.rotation.y = boundedRandom(1, 8);
    particle.rotation.z = boundedRandom(1, 8);
 };

  SPS.updateParticle = function(particle) {
    // I love it when a framework does something exactly how I imagined it!
    // When the asteroid has passed z = 860 = the camera position + 10, reset it and
    // use it again.  
    if(particle.position.z > 860) {
      this.recycleParticle(particle);
    }
    // Update the particles new position
    (particle.position).addInPlace(particle.velocity);
    particle.position.z += 1;

    // player, accurate_bounding_box
    if(particle.intersectsMesh(player, true) && particle.position.z > 100) {
      killPlayerCallback();
    }
  };

  SPS.initParticles();
  SPS.setParticles();
  SPS.computeParticleColor = true;
  SPS.computeParticleTexture = true;

  scene.registerBeforeRender(function() {
    SPS.setParticles();
  });

  return SPS;
}

