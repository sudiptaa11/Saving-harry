//loading variables
var hRunningfwImg,hRunningbwImg;

var grass;

var hermione;

var wallH, wallV; 

var caveImg, cave;
  
var wandImg, wand1, wand2, wand3, wandCount = 0;

var snakeImg, snakeH, snakeG;

var life= 3;

var gameState = 0;

var holly, holie, houly;

var win;

var harryHImg;

var hermioneHImg;

function preload(){
  //loading images and animations
  hRunningfwImg = loadAnimation("images/h1.png","images/h2.png","images/h3.png","images/h4.png","images/h5.png","images/h6.png","images/h7.png");

  hRunningbwImg = loadAnimation("images/x1.png","images/x2.png","images/x3.png","images/x4.png","images/x5.png","images/x6.png","images/x7.png");

  grass = loadImage("images/grass.jpg");

  caveImg = loadImage("images/cave.png");

  wandImg = loadImage("images/wand.png");

  snakeImg = loadImage("images/snake.png");

  harryHImg = loadImage("images/harryHappy.png");

  hermioneHImg = loadImage("images/hermioneHappy.png");
}


function setup() {
  createCanvas(1000,600);

  //creatimg cave
  cave = createSprite(900,500,50,50);
  cave.addImage(caveImg);
  cave.scale = 0.5;
  cave.setCollider("rectangle",0,150, 500, 50);

  //creating hermione
  hermione = createSprite(50,100,20,20);
  hermione.addAnimation("hermione_runningfw",hRunningfwImg);
  hermione.addAnimation("hermione_runningbw",hRunningbwImg);
  hermione.setCollider("rectangle",0,0, 50, 100);
  hermione.depth = cave.depth + 1;

  //calling create wands function which is made because we want wand to reappear when game is restarted
  createWands();

  //creating variable for edge sprites which will be used in bounceOff function
  edges = createEdgeSprites();

  //creating groups for the walls of maze and snake
  verticalWalls = new Group();
  horizontalWalls = new Group();
  snakeG = new Group();

}

function draw() {
  background(grass);  

  //creating maze when gameState is not 3
  if(gameState !== 3){
    createMazeH(80, 200);
    createMazeH(-190, 450);
    createMazeH(-100, 450);
    
    createMazeV(150, -50);
    createMazeV(420, -50);
    createMazeV(690, -50);
  }

  //making gameState play when space is pressed while gameState is start
  if(keyDown("SPACE") && gameState === 0){
    gameState = 1;
  }

  drawSprites();

  //displaying text for life remaining
  textSize(30);
  fill("yellow");
  text("Life : "+life, 800,25);

  //determining what happes in start state
  if(gameState === 0){
    //displaying instruction text
    textSize(30);
    fill("yellow")
    text("Press Space to start the game", 300, 350);

    //determining position of hermione
    hermione.x = 50;
    hermione.y = 100;

    //making sure hermione is only facing forwards
    hermione.changeAnimation("hermione_runningfw",hRunningfwImg);
  }

  //calling play function when gameState is 1
  else if(gameState === 1){
    play();
  } 

  //determining what happens in lost end state
  else if(gameState === 2){
    //destroying all snakes
    snakeG.destroyEach();

    //displaying text
    fill("yellow");
    text("Oops! you failed to save harry!",300,350);
    text("Press R to restart",300,400);

    //restarting game when R is pressed
    if(keyDown("R")){
      gameState = 0;
      life = 3;
      wandCount = 0;
      wand1.destroy();
      wand2.destroy();
      wand3.destroy();
      createWands();

    }
  } 
  //determimg what happens in won end state
  else {
    //covering canvas
    win = createSprite(500,300,1000,600);
    win.shapeColor= "yellow";
    //displaying text
    textSize(45);
    fill("blue");
    text("You Won!", 400, 300);

    //displaying happy hermione and harry
    var hermioneH = createSprite(200,300);
    hermioneH.addImage(hermioneHImg);
    
    var harryH = createSprite(780,290);
    harryH.addImage(harryHImg);
    harryH.scale = 0.6;

  }

}

//creating Horizontal maze walls
function createMazeH(x,y){
  for(var i = 0; i < 4; i++){
    wallH = createSprite(x+275*i,y, 150, 30);
    wallH.shapeColor ="brown";
    wallH.lifetime = 10;
    horizontalWalls.add(wallH);
  }
}

//creating Vertical maze walls
function createMazeV(x,y){
  for(var i = 0; i < 4; i++){
    wallV = createSprite(x,y+275*i, 30, 150);
    wallV.shapeColor ="brown";
    wallV.lifetime = 10;
    verticalWalls.add(wallV);
  }
}

//spawing snakes at determined y and framecounts
function spawnSnakesH(y, f){
  if (frameCount%f === 0){
    //creatting snake
    snakeH = createSprite(500,y);
    snakeH.addImage(snakeImg);
    snakeH.scale = 0.15;
  
    //giving snakes random velocity and position
    var snakeSpeed = Math.round(random(5,6));
    var position = Math.round(random(1,2));
  
    if(position === 1){
      snakeH.x = -20;
      snakeH.velocityX = snakeSpeed;
    }
    if(position === 2){
      snakeH.x = 1020;
      snakeH.velocityX = -snakeSpeed;
    }

    //giving snakes lifetime
    snakeH.lifetime = 250;

    //adding snakes to snakes group
    snakeG.add(snakeH)
  
  }
}

function lifeOver(){
  //decreasing a life
  life = life - 1;
  //making game end if player loses all the life
  if(life === 0){
    gameState = 2;
    fill("yellow");
    text("Oops! you failed to save harry!",300,350);
    text("Press R to restart",300,400); 
  } 
  //resetting game
  else{
    gameState = 0;
    snakeG.destroyEach();
  }
}

function play(){
  //calling lifeover if hermione is caught by a snake
  if(hermione.isTouching(snakeG)){
    lifeOver();
  }

  //making hermione collide with edges
  hermione.collide(edges[0]);
  hermione.collide(edges[1]);
  hermione.collide(edges[2]);
  hermione.collide(edges[3]);

  //increasing wand count each time hermione touches a wand and destroying the wand
  if(hermione.isTouching(wand1) || hermione.isTouching(wand2) || hermione.isTouching(wand3)){
    wandCount = wandCount + 1;
    if(hermione.isTouching(wand1)){
      wand1.destroy();
    } else if(hermione.isTouching(wand2)){
      wand2.destroy();
    } else{
      wand3.destroy();
    }
  }

  //only spawning snakes when hermione hasn't collected all the wand
  if(wandCount< 3){
    spawnSnakesH(80,200);
    spawnSnakesH(360,150);
  }

  //destroying all snakes when all wands are collected
  if(wandCount === 3){
    snakeG.destroyEach();
  }

  //making hermione move with arrow keys
  if(keyDown("RIGHT_ARROW")){
    hermione.x = hermione.x + 5;
    hermione.changeAnimation("hermione_runningfw",hRunningfwImg);
  }

  if(keyDown("LEFT_ARROW")){
    hermione.x = hermione.x - 5;
    hermione.changeAnimation("hermione_runningbw",hRunningbwImg);
  }

  if(keyDown("UP_ARROW")){
    hermione.y = hermione.y - 5;
  }

  if(keyDown("DOWN_ARROW")){
    hermione.y = hermione.y + 5;
  }

  //making hermione collide with wands
  hermione.collide(verticalWalls);
  hermione.collide(horizontalWalls);

  //displaying question if hermione has succeded
  if(wandCount === 3 && hermione.isTouching(cave)){
    createForm();
  }
}

//displaying form
function createForm(){
  text("What is the name of Harry's wand?", 300, 100);
  text("a : holie", 150, 350);
  text("b : holly", 450, 350);
  text("c : houly", 750, 350);
  //making game state won end when correct option is pressed
  if(keyDown("B")){
    gameState = 3;
  } 
  //making player lose if wrong option pressed
  else if(keyDown("A") || keyDown("C")){
    gameState = 2;
  }
}

//creating wands
function createWands(){
  wand1 = createSprite(620,250)
  wand1.addImage(wandImg);
  wand1.scale = 0.2;

  wand2 = createSprite(950,25)
  wand2.addImage(wandImg);
  wand2.scale = 0.2;

  wand3 = createSprite(70,380)
  wand3.addImage(wandImg);
  wand3.scale = 0.2;
}
  

