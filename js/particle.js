// Classe Particle
class Particle {
    constructor(x, y) {
      this.pos = createVector(x, y);
      this.vel = createVector(0, 0);
      this.acc = createVector(0, 0);
      this.life = 100;
      this.color = random(360);
    }
  
    isAlive() {
      return this.life > 0;
    }
  
    applyForce(f) {
      this.acc.add(f);
    }
  
    update() {
      this.life -= 2;
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.set(0, 0);
    }
  
    render() {
      colorMode(HSB);
      strokeWeight(6);
      stroke(this.color, 100, this.life);
      point(this.pos.x, this.pos.y);
    }
  }