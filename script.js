let y_axis = 0;
let y_speed = 0.9;
let score = 0;
let hiscore = 0;
let endGame = false;
let playing = false;
let readyToPlay = false;
let engine;
let world;
let ground;
let stars = [];
let option;
let particleSystem;
let rocket;
let rocketTexture;
let fuel = 100;
const TIME_LIMIT = 5000;
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

document.getElementById('restartGame').addEventListener('click', function (e) {
  document.querySelector('#status').innerHTML = 'Filling tank...';
  fuel = 100;
  score = 0;
  endGame = false;
  playing = false;
  readyToPlay = false;

  setTimeout(function () {
    document.querySelector('#status').innerHTML = '...done...';
  }, 1000);
  setTimeout(function () {
    document.querySelector('#status').innerHTML = 'Get Ready!';
  }, 1500);

  setTimeout(function () {
    document.querySelector('#status').innerHTML = 'Set!';
  }, 2000);

  setTimeout(function () {
    document.querySelector('#status').innerHTML = 'GO... Spam left click to fly';
    readyToPlay = true;
  }, 2500);
  rocket.previousHeight = height;
  document.querySelector('#score span').innerHTML = score;
  document.querySelector('#time span').innerHTML = fuel;
  document.getElementById('restartGame').classList.add('hidden');
});

if (localStorage.getItem('hiscorerocket')) {
  hiscore = localStorage.getItem('hiscorerocket');
  document.querySelector('#hiscore span').innerHTML = hiscore;
}

function preload() {
  rocketTexture = loadImage('data:image/png;base64,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');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  engine = Engine.create();
  world = engine.world;
  Engine.run(engine);
  ground = new Ground(height - 100);

  for (let x = 0; x < width / 10; x++) {
    stars.push(new Star());
  }
  rocket = new Rocket(width - width / 3, 10, 50, 100);
  setTimeout(function () {
    readyToPlay = true;
  }, 2000);
  particleSystem = new ParticleSystem(createVector(0, 0));
}

function draw() {
  clear();
  translate(0, rocket.body.position.y * -0.01);
  for (let x = 0; x < stars.length; x++) {
    stars[x].show();
  }
  translate(0, rocket.body.position.y * -1 + (height - 220));
  translate(0, rocket.body.position.y * 0.1 - 80);
  ground.show();
  rocket.show();
  translate(rocket.body.position.x + 25, rocket.body.position.y + 150);
  particleSystem.run();
}

function mousePressed() {
  if (!readyToPlay) return;
  if (endGame) {
    document.getElementById('restartGame').classList.remove('hidden');
    return;
  }
  if (!playing) {
    playing = true;
  }
  if (fuel <= 0) {
    fuel = 0;
    endGame = true;
  } else {
    rocket.go();
    fuel -= Math.round(random(0, 4));
    document.querySelector('#time span').innerHTML = fuel;
  }
}

class Rocket {
  constructor(x, y, wid, hei) {
    this.body = Bodies.rectangle(x, y, wid, hei, {
      restitution: .3,
      friction: 1 });

    this.currSpeed = 1;
    this.previousHeight = height;
    this.wid = wid;
    this.hei = hei;
    World.add(world, this.body);
  }
  show() {
    var pos = this.body.position;
    // clear()
    push();
    noStroke();
    // fill('#bdbcbd')
    noFill();
    translate(pos.x, pos.y);
    rect(0, 50, this.wid, this.hei);
    image(rocketTexture, 0, 50, this.wid, this.hei);
    pop();
  }
  go() {
    var f = {
      x: random(-0.0004, 0.0004),
      y: -0.05 };

    particleSystem.addParticle();
    Body.applyForce(this.body, this.body.position, f);
    if (this.body.position.y < this.previousHeight) {
      this.previousHeight = this.body.position.y;
      score = Math.round(height - this.body.position.y) * 55;
      document.querySelector('#score span').innerHTML = score;
      if (score > hiscore) {
        hiscore = score;
        localStorage.setItem('hiscorerocket', hiscore);
        document.querySelector('#hiscore span').innerHTML = hiscore;
      }
    }
  }}


class Ground {
  constructor(y) {
    this.body = Bodies.rectangle(0, height - 100, width + 2500, 100, {
      isStatic: true,
      restitution: .1,
      friction: 10 });

    World.add(world, this.body);
  }
  show() {
    push();
    stroke('#353238');
    strokeWeight(3);
    noFill();
    rect(0, height - 50, width, 100);
    fill('#353238');

    angleMode(DEGREES);
    //rotate(-45)
    for (let x = 0; x < width / 10; x++) {
      noStroke();
      //rect(0 + x * 20, height + x * 20, 1, 80)
      rect(0 + x * 20, height - 50, 1, 100);
    }
    pop();
  }}


class Star {
  constructor() {
    this.x = random(width / 2, width - 100);
    this.y = random(-2000, height);
    this.r = random(2, 10);
  }
  show() {
    push();
    noStroke();
    fill('#353238');
    ellipse(this.x, this.y, this.r);
    pop();
  }}


// A simple Particle class from p5 docs by Daniel Shiffman just converted it to ES5 classes :)
class Particle {
  constructor(position) {
    this.acceleration = createVector(0, 0.05);
    this.velocity = createVector(random(-1, 1), random(-1, 0));
    this.position = position.copy();
    this.lifespan = 155;
  }
  run() {
    this.update();
    this.display();
  }
  // Method to update position
  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;
  }
  // Method to display
  display() {
    stroke(118, 21, 227, this.lifespan);
    strokeWeight(2);
    fill(118, 21, 227, this.lifespan);
    ellipse(this.position.x, this.position.y, 12, 12);
  }
  // Is the particle still useful?
  isDead() {
    return this.lifespan < 0;
  }}


class ParticleSystem {
  constructor(position) {
    this.origin = position.copy();
    this.particles = [];
  }
  addParticle() {
    this.particles.push(new Particle(this.origin));
  }
  run() {
    for (var i = this.particles.length - 1; i >= 0; i--) {
      var p = this.particles[i];
      p.run();
      if (p.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }}