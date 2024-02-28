class Game {
  constructor() {
    this.resetTitle=createElement("h2")
    this.resetButton=createButton("")

    this.leadeboardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");

  }
  //BP
  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  //BP
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  // AM
  start() {
    player = new Player();
   
 


    playerCount = player.getCount();
    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];
     fuels=new Group();
     powerCoins=new Group();
     

    this.addSprites(fuels,4,fuelImage,0.02)
    this.addSprites(powerCoins,18,powerCoinImage,0.09)
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      x = random(width / 2 + 150, width / 2 - 150);
      y = random(-height * 4.5, height - 400);

      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }


  //BP
  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("Reiniciar el juego");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width/2+200,40)

    this.resetButton.class("resetButton")
    this.resetButton.position(width/2 +230,100)

    this.leadeboardTitle.html("Tabla de puntuación");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);


  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        carsAtEnd:0,
        playerCount: 0,
        gameState: 0,
        players: {}
      });
      window.location.reload();
    });
  }

  handlePlayerControls(){
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10;
      player.update();
    }
    if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
      player.positionX -= 5;
      player.update();
    }
  
    if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
      player.positionX += 5;
      player.update();
    }


   }

  //AA
  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo(); // Agregado

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);
      this.showLeaderboard();

      // Índice del arreglo
      var index = 0;
      for (var plr in allPlayers) {
        // Usa datos de la base de datos para mostrar los autos en dirección x e y
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index].position.x = x;
        cars[index].position.y = y;

        // Agrega 1 al índice en cada ciclo
        index = index + 1;
      }
      
      if(index===player.index){
        stroke(10);
        fill("red");
        ellipse(x,y,60,60)
        this.handleFuel(index);
        this.handlePowerCoins(index);


        camera.position.x=width/2;
        camera.position.y=cars[index-1].position.y;
      }

    

      // Manipulación de eventos de teclado
      if (keyIsDown(UP_ARROW)) {
        player.positionY += 10;
        player.update();
      }
      this.handlePlayerControls();
      drawSprites();
    }
  }


  handleFuel(index) {
    // Agregando combustible
    cars[index - 1].overlap(fuels, function(collector, collected) {
      player.fuel = 185;
      // "collected" es el sprite en el grupo de coleccionables que detona
      // el evento
      collected.remove();
    });
  }

   handlePowerCoins(index) {
    // Agregando monedas
    cars[index - 1].overlap(powerCoins, function(collector, collected) {
      player.score += 21;
      player.update();
      //"collected" es el sprite en el grupo de coleccionables que detona
      // el evento
      collected.remove();
    });
  }
  showLeaderboard(){
  var leader1,leader2;
  var players=Object.values(allPlayers)
  if(
    (players[0].rank===0 && players[1].rank==0)||
    player[0].rank==1
  )
  {
    leader1=
    players[0].rank+
    "&emsp;"+
    players[0].name+
    "&emsp;"+
    players[0].score;

    leader2=
    players[1].rank+
    "&emsp;"+
    players[1].name+
    "&emsp;"+
    players[1].score;

  }

  if(players[1].rank===1){
    leader1=
    players[1].rank+
    "&emsp;"+
    players[1].name+
    "&emsp;"+
    players[1].score;

    leader2=
    players[0].rank+
    "&emsp;"+
    players[0].name+
    "&emsp;"+
    players[0].score;


  }
  this.leader1.html(leader1);
  this.leader2.html(leader2);

  }

}
