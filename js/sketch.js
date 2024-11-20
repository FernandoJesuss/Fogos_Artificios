let grav;
let time;
let fireworks = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  grav = createVector(0, 0.1); // Força da gravidade
  time = 0; // Inicializa o tempo
}

function draw() {
  colorMode(RGB);
  background(0, 50); // Fundo preto com transparência

  // Adiciona um novo foguete a cada 500 milissegundos
  if (millis() - time >= 500) {
    time = millis();
    fireworks.push(new Firework());
  }

  // Atualiza e renderiza os fogos de artifício
  for (let i = fireworks.length - 1; i >= 0; i--) {
    let f = fireworks[i];
    if (f.isAlive()) {
      f.applyForce(grav); // Aplica a gravidade
      f.update(); // Atualiza a posição e estado do foguete
      f.render(); // Renderiza o foguete
    } else {
      fireworks.splice(i, 1); // Remove foguete se não estiver mais vivo
    }
  }
}

function mousePressed() {
  console.log(fireworks); // Exibe a lista de fogos de artifício no console
}










