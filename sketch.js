var PLAY = 1;
var END = 0;
var gameState = PLAY;

var vampire, vampire_running, vampire_collided;
var ground, invisibleGround, groundImage;
var bgImg, bg;

var bloodBagGroup, bloodBagImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
 vampire_running =   loadAnimation("vampire1.png", "vampire2.png", "vampire3.png");
 vampire_collided = loadAnimation("vampire_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  bloodBagImage = loadImage("bloodbag.png");

  bgImg = loadImage("bg.png");
  
  obstacle1 = loadImage("window1.png");
  obstacle2 = loadImage("window2.png");
  obstacle3 = loadImage("torch1.png");
  obstacle4 = loadImage("torch2.png");
  //obstacle5 = loadImage("obstacle5.png");
  //obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  
  //bg = createSprite(600,98)
  bg = createSprite(windowWidth, windowHeight)
  bg.addImage("bg", bgImg);
  bg.x = bg.width/2;
  bg.velocityX = -(6 + 3*score/100);
  bg.scale = 0.5
  

 // vampire = createSprite(50,180,20,50);
 vampire = createSprite(50,height-70,20,50);

  vampire.addAnimation("running", vampire_running);
  vampire.addAnimation("collided", vampire_collided);
  vampire.scale = 0.5;
  

  
  //ground = createSprite(200,180,400,20);
  ground = createSprite(width/2, height, width, 125)
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  //gameOver = createSprite(300,100);
  gameOver = createSprite(width/2,height/2 -50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2, height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  //invisibleGround = createSprite(200,190,400,10);
  invisibleGround = createSprite(width/2,height -10, width, 115);
  invisibleGround.visible = false;
  
  bloodBagGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  vampire.debug = true;
  background("bgImg");
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && vampire.y >= 159) {
      vampire.velocityY = -12;
    }
  
    vampire.velocityY = vampire.velocityY + 0.8
    
    //to make the bg infinte
    if(bg.x < 0){
     bg.x = bg.width/2;
    }

    if (ground.x < 0){
      ground.x = ground.width/2;
    }

  
    vampire.collide(invisibleGround);
    spawnbloodBag();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(vampire)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    vampire.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    bloodBagGroup.setVelocityXEach(0);
    
    //change the trex animation
    vampire.changeAnimation("collided",vampire_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    bloodBagGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnbloodBag() {
  //write code here to spawn the bloodBag
  if (frameCount % 60 === 0) {
    //var bloodBag = createSprite(600,120,40,10);
    var bloodBag = createSprite(width+20,height-300,40,10);
    var r = Math.round(random(1,6));
    switch(r) {
      case 1: bloodBag.addImage(bloodBagImage);
              break;
      case 2: bloodBag.addImage(obstacle3);
              break;
      //case 3: bloodBag.addImage(obstacle3);
              break;
      //case 4: bloodBag.addImage(obstacle4);
              break;
     // case 5: obstacle.addImage(obstacle5);
              break;
      //case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    bloodBag.y = Math.round(random(80,120));
    bloodBag.addImage(bloodBagImage);
    bloodBag.scale = 0.02;
    bloodBag.velocityX = -3;
    
     //assign lifetime to the variable
     bloodBag.lifetime = 200;
    
    //adjust the depth
    bloodBag.depth = vampire.depth;
    vampire.depth = vampire.depth + 1;
    
    //add each bloodBag to the group
    bloodBagGroup.add(bloodBag);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    //var obstacle = createSprite(600,165,10,40);
    var obstacle = createSprite(600,height-95,20,30);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
     // case 5: obstacle.addImage(obstacle5);
              break;
      //case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    //depth
    obstacle.depth = vampire.depth;
    vampire.depth = vampire.depth+1
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  bloodBagGroup.destroyEach();
  
  vampire.changeAnimation("running",vampire_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}