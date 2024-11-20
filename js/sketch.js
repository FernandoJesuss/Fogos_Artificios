let grav;
let time;
let fireworks = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  grav = createVector(0, 0.1); 
  time = 0; 
}

function draw() {
  colorMode(RGB);
  background(0, 50); 

  // Adiciona um novo foguete a cada 500 milissegundos
  if (millis() - time >= 200) {
    time = millis();
    fireworks.push(new Firework());
  }

  // Atualiza e renderiza os fogos de artifício
  for (let i = fireworks.length - 1; i >= 0; i--) {
    let f = fireworks[i];
    if (f.isAlive()) {
      f.applyForce(grav); 
      f.update(); 
      f.render();
    } else {
      fireworks.splice(i, 1); 
    }
  }
}

function mousePressed() {
  console.log(fireworks); 
}









