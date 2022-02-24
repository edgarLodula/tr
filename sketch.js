// CRIANDO AS VARIÁVEIS: 
var trex, trex_correndo, trex_colidiu;
var solo,imagemdosolo, soloinvisivel;
var nuvem, imagemdanuvem;
var obstaculo, obstaculo1, obstaculo2,obstaculo3,obstaculo4,obstaculo5,obstaculo6;
var pontuacao = 0;
var estadodojogo = "JOGAR";
var grupodeobstaculos, grupodenuvens;
var fimdeJogo, gameOver, restart, reiniciar;
var somSalto, somMorte, somCheckpoint;
var canH, canW;


function preload (){
  
  trex_correndo = loadAnimation ("trex1.png", "trex3.png", "trex4.png");
  trex_colidiu = loadAnimation ("trex_collided.png");
  
  imagemdosolo = loadImage ( "ground2.png");
  
  imagemdanuvem = loadImage ("cloud.png");
  
  obstaculo1 = loadImage ("obstacle1.png");
  obstaculo2 = loadImage ("obstacle2.png");
  obstaculo3 = loadImage ("obstacle3.png");
  obstaculo4 = loadImage ("obstacle4.png");
  obstaculo5 = loadImage ("obstacle5.png");
  obstaculo6 = loadImage ("obstacle6.png");
  
  gameOver = loadImage ("gameOver.png");
  restart = loadImage ("restart.png");
  
  somSalto = loadSound("jump.mp3");
  somMorte = loadSound("die.mp3");
  somCheckpoint = loadSound("checkPoint.mp3");
}


function setup(){ 

 // createCanvas(windowWidth,windowHeight);

 var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    canW = displayWidth; 
    canH = displayHeight; 
    createCanvas(displayWidth, displayHeight);
  } 
  else {
    canW = windowWidth; 
    canH = windowHeight; 
    createCanvas(windowWidth, windowHeight);
  }
  frameRate(80);
  
  //criar um sprite do trex
  trex = createSprite(50,160,20,50);  
  trex.addAnimation ("running", trex_correndo); 
  trex.addAnimation("collided" , trex_colidiu)
  
  trex.scale = 0.5; //scala do trex
  
  //SOLO
  solo = createSprite(300,188,600,20); 
  solo.addImage ("ground1", imagemdosolo)
  
  //solo invisível:
  soloinvisivel = createSprite(300,200,600,10); 
  soloinvisivel.visible = false; 
  
  //Criando os grupos:
  grupodeobstaculos = new Group ();
  grupodenuvens = new Group();

  trex.setCollider("circle", 0,0,40); // raio de colisão
  //trex.debug = true; // Abilita um circulo verde
  
  //FIM DE JOGO: 
  fimdeJogo = createSprite (canW/2,100);
  fimdeJogo.addImage(gameOver);
  fimdeJogo.visible = false;
  fimdeJogo.scale = 0.5;
  
  reiniciar = createSprite (canW/2,140);
  reiniciar.addImage(restart);
  reiniciar.visible = false;
  reiniciar.scale = 0.5;
  
}
 
function draw(){
  //console.log (frameRate(60));
  
  background ("white");
  text("Pontuação: " + pontuacao, canW-100,50);
  
  //ESTADO JOGAR: 
  if (estadodojogo === "JOGAR"){
     solo.velocityX = -(4 + (2*pontuacao/100));
     pontuacao = pontuacao + Math.round(getFrameRate()/60);
    
    if(pontuacao>0 && pontuacao%100 === 0 ){
      somCheckpoint.play();
    }
    
    //SOLO:
    if(solo.x<0) {
      solo.x=solo.width/2;
    }
    
    //trex pulando
    if(touches.length >0 || keyDown("space") && trex.y >=160) {    
      trex.velocityY = -12;
      somSalto.play();
      touches = []; // Array vazio
    }
    trex.velocityY = trex.velocityY + 0.8; //"gravidade"  
    gerarNuvens(); //gerador de nuvens
    gerarObstaculos(); //gerador de obstáculos
 
    if(grupodeobstaculos.isTouching(trex)){
      estadodojogo = "ENCERRAR";
      somMorte.play();
      trex.velocityY = 0;
    }
    
  //ESTADO ENCERRAR: 
  }else if(estadodojogo === "ENCERRAR"){
      solo.velocityX = 0;
    
      // ALTERA A ANIMAÇÃO DO TREX: 
      trex.changeAnimation("collided", trex_colidiu);

      // lifetime dos objetos do fim do jogo: 
      grupodeobstaculos.setLifetimeEach(-1);
      grupodenuvens.setLifetimeEach(-1); 
    
      //fim de jogo:
      fimdeJogo.visible = true;
      reiniciar.visible = true;
    
      grupodeobstaculos.setVelocityXEach(0);
      grupodenuvens.setVelocityXEach(0); 
    
      //Reiniciar:
      if(touches.length>0||keyDown("space")){ 
        reset();
        touches=[]
      }
  }
  
  trex.collide (soloinvisivel );
  
  drawSprites();
}

function gerarNuvens (){
  if (frameCount %60 === 0){ // Add uma nuvem a cada 60 quadros
    nuvem = createSprite (canW+10,100,40,10);
    nuvem.addImage (imagemdanuvem);
    nuvem.y = Math.round(random(10,60))
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
    //tempo de vida: 
    nuvem.lifetime = (canW/nuvem.velocityX) +10;
    
    //Ajustando a profundidade:
    nuvem.depth = trex.depth;
    trex.depth = trex.depth +1;
    
    //add ao grupo de nuvens: 
    grupodenuvens.add(nuvem);
  }
}

function gerarObstaculos () {
  if (frameCount %60 === 0){
    obstaculo = createSprite (canW+10,176,10,40);
    obstaculo.velocityX = -(4 + (2*pontuacao/100));
    
    var rand = Math.round (random(1,6))
    switch(rand){
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
              default: break;
    }
    
    obstaculo.scale = 0.4;
    obstaculo.lifetime = (canW/obstaculo.velocityX) +10;;
    
    //Adicionando o obj ao grupo:
    grupodeobstaculos.add(obstaculo);
    obstaculo.depth = trex.depth;
    trex.depth = trex.depth +1;
  }
}  

function reset (){
  estadodojogo = "JOGAR";
  fimdeJogo.visible = false;
  reiniciar.visible = false;
  
  grupodeobstaculos.destroyEach();
  grupodenuvens.destroyEach();  
  
  trex.changeAnimation("running", trex_correndo);
  
  pontuacao = 0;
}






