function DNA(genes) {
  this.getGenes = function() {
    this.genes = [];
    
    for (var y = 0; y < maxy; y++) {
      for (var x = 0; x < maxx; x++) {
        var r = floor(random(2));
        var i = y * maxx + x;
        this.genes[i] = r;
      }
    }
  }
  
  if (genes) {
    this.genes = genes;
  } else {
    this.getGenes();
  }
  
  this.mutation_rate = 0.03;
  
  this.mix = function(dna) {
    var newgenes = [];
    var r = floor(random(this.genes.length));
    for (var i = 0; i < this.genes.length; i++) {
      if (i <= r) {
        newgenes[i] = this.genes[i];
      } else {
        newgenes[i] = dna.genes[i];
      }
      var mutation = random(1);
      if (mutation <= this.mutation_rate) {
        newgenes[i] = abs(newgenes[i] - 1);
      }
    }
    return newgenes;
  }
}

function Invader(dna) {
  if (dna) {
    this.dna = dna;
  } else {
    this.dna = new DNA();
  }
  
  this.fitness = 0;
  
  this.draw = function(col) {
    if (!col) {
      var col = color(255);
    } else {
      var col = color(col);
    }
    
    noStroke();
    fill(col);
    
    var g = 0;
    for (var y = 0; y < maxy; y++) {
      for (var x = 0; x < maxx; x++) {
        if (this.dna.genes[g] > 0) {
          rect(x * pixwidth, y * pixwidth,
                pixwidth, pixwidth);
          rect((maxx - x) * pixwidth, y * pixwidth,
                pixwidth, pixwidth);
        }
        g++;
      }
    }
    var bar = map(this.fitness,
                  0, barscale,
                  0, barscale * pixwidth
    );
    rect(0, (y + 2) * pixwidth,
      (pixwidth + 1) * maxx, bar);
  }
}

function Population(number) {
  this.invaders = [];
  this.matingpool = [];
  
  for (var i = 0; i < number; i++) {
    this.invaders[i] = new Invader();
  }
  this.population_count = this.invaders.length;
  
  this.update = function() {
    for (var i = 0; i < this.invaders.length; i++) {
      var x = pixwidth * 2 + (pixwidth * 2 + maxx * pixwidth) * i;
      var invader = this.invaders[i];
      
      push();
      translate(
        x, 0
      );
      
      if (mouseX > x &&
          mouseX < x + pixwidth * maxx &&
          mouseY > pixwidth * 2 &&
          mouseY < pixwidth * maxy + pixwidth * 2) {
        var col = color(200, 0, 150);
        invader.fitness += fitnessinc;
        if (invader.fitness > barscale) {
          invader.fitness = barscale;
        }
      } else {
        var col = color(255);
      }
      
      invader.draw(col);
      pop();
    }
  }
  
  this.evolve = function() {
    this.matingpool = [];
    for (var i = 0; i < this.invaders.length; i++) {
      var invader = this.invaders[i];
      var chance = invader.fitness * 10;
      if (chance == 0) {
        chance = 1;
      }
      for (var j = 0; j <= chance; j++) {
        this.matingpool.push(invader);
      }
    }
    this.invaders = [];
    
    var parent1dna = random(this.matingpool).dna;
    var parent2dna = random(this.matingpool).dna;
    
    for (var i = 0; i < this.population_count; i++) {
      var genes = parent1dna.mix(parent2dna);
      var dna = new DNA(genes);
      var child = new Invader(dna);
      this.invaders.push(child);
    }
    
    this.matingpool = [];
  }
}
