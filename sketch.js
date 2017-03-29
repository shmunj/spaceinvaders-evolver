var maxx = 5;
var maxy = 8;
var pixwidth = 4;
var population;
var population_count;
var fitnessinc = 0.25;
var barscale = 10;
var button;

function setup() {
  createCanvas(800, 150);
  var population_count = floor(width / ((pixwidth * 2) + (maxx * pixwidth)));
  population = new Population(population_count);

  button = {
    pressed : false,
    col : color(255),
    x : width / 4,
    y : pixwidth * (4 + maxy + barscale),
    w : width / 2,
    h : pixwidth * barscale,
    draw : function() {
      push();
      translate(this.x, this.y);
      noStroke();
      fill(this.col);
      rect(0, 0, this.w, this.h);
      pop();
    },
    mouseOver : function() {
      if (mouseX > this.x && mouseX < this.x + this.w &&
          mouseY > this.y && mouseY < this.y + this.h) {
        this.col = color(200, 0, 150);
        this.pressed = true;
      } else {
        this.col = color(255);
        this.pressed = false;
      }
    }
  };
}

function draw() {
  background(51);
  translate(0, pixwidth * 2);
  population.update();
  button.mouseOver();
  button.draw();
}

function mousePressed() {
  if (button.pressed) {
    population.evolve();
  }
}
