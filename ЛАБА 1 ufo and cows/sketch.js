let flying_nlo = {
    x: 600,
    y: 400,
    width: 350,
    height: 80,
    color_1: '#89F39A',
    color_2: '#747474',
    
    draw_signal: function() {
        fill(127, 255, 0);//светящиеся кружки
        for(let i = 0; i < 14; i++)
            circle(this.x - this.width/2 + i * 27, this.y, 10);
        fill(127, 255, 0, 100);
        for(let i = 0; i < 14; i++)
            circle(this.x - this.width/2 + i * 27, this.y, 15);
        fill(127, 255, 0, 70);
        for(let i = 0; i < 14; i++)
            circle(this.x - this.width/2 + i * 27, this.y, 20);
        fill(127, 255, 0, 50);
        for(let i = 0; i < 14; i++)
            circle(this.x - this.width/2 + i * 27, this.y,30);
        fill(127, 255, 0, 10);
        for(let i = 0; i < 14; i++)
            circle(this.x - this.width/2 + i * 27, this.y,50);
    },

    change_pos: function(direction) {
        this.x += direction;
    },

    draw_fly: function() {
        fill(this.color_1);
        arc(this.x, this.y - this.height/2, this.width/2, this.height, PI, TWO_PI);
        fill(this.color_2);
        arc(this.x, this.y, this.width, this.height + 10, PI, TWO_PI);
        fill(60);
        arc(this.x, this.y, this.width, this.height/2, 0, PI);
        this.draw_signal();  
    },

    beam: function() {
        //лучи
        fill(50, 205, 50, 150);
      
        beginShape();
        vertex(this.x - this.width/8, this.y + 10);
        vertex(this.x + this.width/8, this.y + 10);
        vertex(this.x + this.width/4, height - 100);
        vertex(this.x - this.width/4, height - 100);
        endShape();
      
        fill(173, 255, 47, 70);
        beginShape();
        vertex(this.x - this.width/20, this.y + 10);
        vertex(this.x + this.width/20, this.y + 10);
        vertex(this.x + this.width/6, height - 100);
        vertex(this.x - this.width/6, height - 100);
        endShape();
      
       //след от луча
        fill(173, 255, 47, 70);
        arc(this.x, height - 100, 175, 20, 0, PI);
        fill(173, 255, 47, 50);
        arc(this.x, height - 100, 185, 25, 0, PI);
        fill(173, 255, 47, 30);
        arc(this.x, height - 100, 195, 30, 0, PI);
        fill(173, 255, 47, 30);
        arc(this.x, height - 100, 205, 35, 0, PI);
        
      
      
    }
}

let cows = [];
let counter = 0;

function Cow(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.walk = function() {
        this.x += this.direction;
    }
    this.draw = function() {
        push();
        translate(this.x, this.y);
        if (this.direction > 0) {
            scale(-1, 1);
        }
        fill(169, 169, 169); 
        rect(32,-15, 5, 15);//нога3
        rect(60,-15, 5, 15);//нога 4
      
        fill (255, 192, 203); //вымя
        rect(50,-17, 10, 7);
      
        fill(245, 255, 250);
        rect(30,-30, 40, 15); //тело
        rect(20,-35, 12, 12); //голова
        rect(16,-30, 12, 5); //нос рот 
        rect(25,-38, 3, 4); //уши
        rect(63,-15, 5, 15); //нога
        rect(35,-15, 5, 15); //нога2
      
        //пятна
        fill(45,45,45);
        rect(40,-29, 7, 7);
        rect(42,-27, 10, 7);
        rect(60,-22, 5, 5);
        rect(57,-25, 6, 8);
        rect(38,-23, 6, 6);
        rect(62,-29, 3, 3);
        rect(48,-19, 3, 3);
      
      
        pop();
    }
}

function CowManager() {
    let countCows = 5;

    this.update = function() {
        while(cows.length < countCows) {
            cows.push(new Cow(random(0, width), height - 100, random(-2, 2)));
        }
        for (let i = 0; i < cows.length; i++) {
            cows[i].walk();
            if (cows[i].x > width + 100)
                cows[i].x = 0;
            else if (cows[i].x < -100)
                cows[i].x = width;
        }
    }
    this.draw = function() {
        for(let i = 0; i < cows.length; i++)
            cows[i].draw();
    }
    return this;
}
function checkCow() {
    for (let i = cows.length - 1; i >= 0; i--) {
        if (cows[i].x > flying_nlo.x - 70 && cows[i].x < flying_nlo.x + 70) {
            counter += 1;
            cows.splice(i, 1);
            // Spawn a new cow
            cows.push(new Cow(random(0, width), height - 100, random(-2, 2)));
        }
    }
}

function setup() {
    createCanvas(1000, 1000);
    frameRate(1000);
    noStroke();
}

function draw() {
//дома
    background(25, 20, 50);
    fill(64, 44, 30);
    rect(170,760,170,140);
    triangle(150,760,240,660,340,760);
    fill(84, 57, 37);
    rect(100,820,120,80);
    triangle(100,820,160,740,220,820);
  
    fill (84, 57, 37);
    rect(750,820,120,80);//дом1
    triangle(750,820,810,765,870,820);//крышадом1
    rect(574,865,7,40);//забор1
    rect(609,865,7,40);
    rect(642,860,7,40);
    rect(670,865,7,40);
    rect(700,868,7,40);
    rect(609,873,100,7);
    rect(559,883,150,7);
   
    fill (100, 73, 53);//забор2
    rect(404,865,7,40);
    rect(439,863,7,40);
    rect(462,864,7,40);
    rect(490,874,7,40);
    rect(381,872,7,40);
    rect(378,877,121,7);
    rect(371,887,150,7);
    
    let cowManager = new CowManager();
    cowManager.update();
    cowManager.draw();
    checkCow();
    
    fill('#FFFFFF');
    textSize(25);
    text('Коров поймано: ' + counter, 380, 200);

    fill(0, 70, 0);
    rect(0, height - 100, width, 100);

    flying_nlo.draw_fly();
    flying_nlo.beam();

    if (keyIsDown(LEFT_ARROW))
        flying_nlo.change_pos(-2);
    if (keyIsDown(RIGHT_ARROW))
        flying_nlo.change_pos(2);
    
    fill(0);
    strokeWeight(4);
    textSize(20);
    text("X: " + round(mouseX), mouseX - 50, mouseY - 25);
    text("Y: " + round(mouseY), mouseX - 50, mouseY);
}