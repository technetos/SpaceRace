// Setup the Solid Particle System for the asteroids
var createAsteroids = function(scene) {
  var SPS = new BABYLON.SolidParticleSystem("Asteroid_SPS", scene);
  var asteroid = BABYLON.MeshBuilder.CreateIcoSphere(
    "Asteroid",
    {radius: 2, radiusY: 3, subdivisions: 4},
    scene);

  SPS.addShape(asteroid, 3);
  
  var mesh = SPS.buildMesh();
  mesh.position.z = -5;
  mesh.material = new BABYLON.StandardMaterial("AsteroidMaterial", scene);
  asteroid.dispose();
  
  // Init
  SPS.initParticles = function() {
    for (var p = 0; p < this.nbParticles; p++) {
      this.recycleParticle(this.particles[p]);
    }
  };

  // Recycle
  SPS.recycleParticle = function(particle) {
    particle.position.x = boundedRandom(-4, 4);
    particle.position.y = boundedRandom(-4, 4);
    particle.position.z = 0;

    particle.velocity.x = 0;
    particle.velocity.y = 0;
    particle.velocity.z = boundedRandom(1, 8);

    var scale = 1;

    particle.scale.x = scale * boundedRandom(1, 1.2);
    particle.scale.y = scale * boundedRandom(0.2, 1.2);
    particle.scale.z = 1

    particle.rotation.x = 0;
    particle.rotation.y = boundedRandom(1, 2);
    particle.rotation.z = boundedRandom(1, 2);
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
  };

  SPS.initParticles();
  SPS.setParticles();
  SPS.computeParticleColor = false;
  SPS.computeParticleTexture = false;

  scene.registerBeforeRender(function() {
    SPS.setParticles();
  });

  return SPS;
}

