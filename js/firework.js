class Firework extends Particle {
  constructor() {
    super();
    this.pos.set(random(100, width - 100), height);
    this.vel.set(random(-2, 2), random(-10, -8));
    this.exploded = false;
    this.sparks = [];
  }

  isAlive() {
    return !this.exploded || this.sparks.length > 0;
  }

  update() {
    super.update();
    this.life = 100;

    if (!this.exploded && this.vel.y >= 0) { // Corrigido para >= para garantir a explosão ao atingir o topo
      this.exploded = true;
      for (let i = 0; i < 100; i++) {
        let p = new Particle();
        p.pos = this.pos.copy();
        p.vel = p5.Vector.random2D();
        p.vel.setMag(random(0, 3));
        p.color = this.color; // Certifique-se de que a cor está definida na classe Particle
        this.sparks.push(p);
      }
    }

    if (this.exploded) {
      for (let i = this.sparks.length - 1; i >= 0; i--) {
        let p = this.sparks[i];
        if (p.isAlive()) {
          p.applyForce(grav); // Verifique se 'grav' está definido
          p.update();
        } else {
          this.sparks.splice(i, 1);
        }
      }
    }
  }

  render() {
    if (this.exploded) {
      this.sparks.forEach((p) => {
        p.render();
      });
    } else {
      super.render();
    }
  }
}












