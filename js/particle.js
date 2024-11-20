class Particle {
    constructor() {
      this.pos = createVector(0, 0);
      this.vel = createVector(0, 0);
      this.acc = createVector(0, 0);
      this.life = 100; // Vida inicial do particle
      this.color = random(360); // Cor aleatória em HSB
    }
  
    isAlive() {
      return this.life > 0; // Retorna verdadeiro se a vida for maior que 0
    }
  
    applyForce(f) {
      this.acc.add(f); // Aplica a força à aceleração
    }
  
    update() {
      this.life -= 2; // Diminui a vida
      this.vel.add(this.acc); // Atualiza a velocidade
      this.pos.add(this.vel); // Atualiza a posição
      this.acc.set(0, 0); // Reseta a aceleração
    }
  
    render() {
      colorMode(HSB); // Muda o modo de cor para HSB
      strokeWeight(6); // Define a espessura do traço
      stroke(this.color, 100, this.life); // Define a cor do traço com base na vida
      point(this.pos.x, this.pos.y); // Desenha o ponto na posição atual
    }
  }
  