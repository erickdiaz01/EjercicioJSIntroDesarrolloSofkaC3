/**
 * Esta funcion anonima que se ejecuta a si misma consiste en la creacion de una 'clase' llamada Board,
 *  la cual tiene un constructor que por parametros recibe la altura y el ancho del tablero a crear, 
 * el resto de atributos son inicializados por defecto. Un estado playing para pausar o no, un estado gameOver 
 * para terminar el juego llegado a hacer un punto, el arreglo de barras que inicialmente esta vacio 
 * y una pelota que es necesaria crear con la clase Ball
 * 
 * @author @erickdiaz01
 * @date 05-06-2022
 */
(function () {
  self.Board = function (width, height) {
    this.width = width;
    this.height = height;
    this.playing = false;
    this.gameOver = false;
    this.bars = [];
    this.ball = null;
    this.playing = false;
  };
  self.Board.prototype = {
    get elements() {
      var elements = this.bars.map(function (bar) {
        return bar;
      });
      elements.push(this.ball);
      return elements;
    },
  };
})();
/**
 * Esta funcion anonima que se ejecuta a si misma consiste en la creacion de una 'clase' llamada Ball,
 * tiene un metodo constructor que recibe por parametros los valores de la posicion X y Y, el radio de la bola
 * y el tablero en donde se va a desplazar. El resto de atributos son inicializados por defecto.
 * Contiene una funcion la cual lleva la logica de una colision fisica llevado a lo virtual, cambiando la
 * direccion y el angulo del movimiento de la pelota en los dos ejes
 */
(function () {
  self.Ball = function (x, y, radio, board) {
    this.x = x;
    this.y = y;
    this.radio = radio;
    this.speedY = 0;
    this.speedX = 3;
    this.board = board;
    this.direction = 1;
    this.bounceAngle = 0;
    this.maxBounceAngle = Math.PI / 12;
    this.speed =3;
    board.ball = this;
    this.kind = "circle";
  };
  self.Ball.prototype = {
    move: function () {
      this.x += (this.speedX*this.direction);
      this.y += this.speedY;
    },
    get width() {
      return this.radio * 2;
    },
    get height() {
      return this.radio * 2;
    },
    collision: function (bar) {
      var relativeIntersectY = (bar.y + (bar.height / 2)) - this.y;
      var normalizedIntersectY = relativeIntersectY / (bar.height / 2);

      this.bounceAngle = normalizedIntersectY * this.maxBounceAngle;
      this.speedY = this.speed * -Math.sin(this.bounceAngle);
      this.speedX = this.speed * Math.cos(this.bounceAngle);

      if (this.x > (this.board.width / 2)) {
          this.direction = -1;}
      else {this.direction = 1;}
    },
  };
})();
/**
 * Esta funcion anonima que se ejecuta a si misma consiste en la creacion de una 'clase' llamada Bar,
 * consiste de un metodo constructor el cual recibe por parametros los valores de la posicion x, la posicion y,
 * su altura y ancho y finalmente un tablero en donde se va a mostrar. Los objetos de esta clase son las
 * 'raquetas' del ping pong
 */
(function () {
  self.Bar = function (x, y, width, height, board) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.board = board;

    this.board.bars.push(this);

    this.kind = "rectangle";
    this.speed = 10;
  };

  self.Bar.prototype = {
    down: function () {
      this.y += this.speed;
    },
    up: function () {
      this.y -= this.speed;
    },
    toString: function () {
      return "x: " + this.x + " y: " + this.y;
    },
  };
})();
/**
 * Esta funcion anonima que se ejecuta a si misma consiste en la creacion de una 'clase' llamada BoardView,
 * contiene un metodo constructor el cual recibe por parametros el canvas que es un nodo de HTML en donde se 
 * 'imprimira' el juego y un tablero que es en donde se va a jugar propiamente. 
 * 
 * Tiene un contexto de '2d' dos 
 * dimensiones. 'Renderiza' el tablero cada que tanto la pelota como las barras tengan algun movimiento,
 * generando asi la continuidad del juego, asi mismo contiene una funcion que verifica si la bola ha 
 * colisionado o no con alguna de las barras.
 * 
 *  En esta funcion tambien se ejecutan los metodos para que el juego inicialice.
 */
(function () {
  self.BoardView = function (canvas, board) {
    this.canvas = canvas;
    this.canvas.width = board.width;
    this.canvas.height = board.height;
    this.board = board;
    this.ctx = canvas.getContext("2d");
  };
  self.BoardView.prototype = {
    clean: function () {
      this.ctx.clearRect(0, 0, board.width, board.height);
    },
    draw: function () {
      for (let i = this.board.elements.length - 1; i >= 0; i--) {
        let element = this.board.elements[i];
        draw(this.ctx, element);
      }
    },
    checkCollisions: function () {
      for (let i = this.board.bars.length - 1; i >= 0; i--) {
        var bar = this.board.bars[i];
        if (hit(bar, this.board.ball)) {
          this.board.ball.collision(bar);
        }
      }
    },
    play: function () {
      if (this.board.playing) {
        this.clean();
        this.draw();
        this.checkCollisions();
        this.board.ball.move();
      }
    },
  };
  function hit(a, b) {
    var hit = false;

    if (b.x + b.width >= a.x && b.x < a.x + a.width) {
      if (b.y + b.height >= a.y && b.y < a.y + a.height) hit = true;
    }
    if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
      if (b.y <= a.y && b.y + b.height >= a.y + a.height) hit = true;
    }
    if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
      if (a.y <= b.y && a.y + a.height >= b.y + b.height) hit = true;
    }
    return hit;
  }
  function draw(ctx, element) {
    switch (element.kind) {
      case "rectangle":
        ctx.fillRect(element.x, element.y, element.width, element.height);
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.radio, 0, 7);
        ctx.fill();
        ctx.closePath();
      default:
        break;
    }
  }
})();
/**
 * Instanciacion de los objetos pertenecientes al juego, como lo son el tablero, las barras, el objeto que
 * imprime el juego y la bola, todo esto para ser dibujado en el nodo canvas.
 */
var board = new Board(800, 400);
var bar = new Bar(20, 100, 40, 100, board);
var bar2 = new Bar(735, 100, 40, 100, board);
var canvas = document.getElementById("canvas");
var boardView = new BoardView(canvas, board);
var ball = new Ball(350, 100, 10, board);

/**
 * Adicion del listener de los eventos cuando se precionan las teclas arriba o abajo para un jugador y 
 * las teclas 'W' y 'S' para el contrincante. Esto manda la instrcuccion de subir o bajar las barras.
 */
document.addEventListener("keydown", function (ev) {
  if (ev.key === "ArrowUp") {
    ev.preventDefault();
    bar.up();
  } else if (ev.key === "ArrowDown") {
    ev.preventDefault();
    bar.down();
  } else if (ev.key === "w" || ev.key === "W") {
    ev.preventDefault();
    bar2.up();
  } else if (ev.key === "s" || ev.key === "S") {
    ev.preventDefault();
    bar2.down();
  } else if (ev.key === " ") {
    ev.preventDefault();
    board.playing = !board.playing;
  }
});
/**
 * Se llama el metodo del boarView para dibujar los objetos del tablero.
 * 
 * Se adiciona un listener para saber cuando la pagina haya cargado y se pueda ejecutar el controlador
 * que basicamente es el que inicializa el juego
 */
boardView.draw();
window.addEventListener("load", controller);
window.requestAnimationFrame(controller);
/**
 * Metodo controlador del juego, lo inicializa a traves del boarView
 */
function controller() {
  boardView.play();
  window.requestAnimationFrame(controller);
}
