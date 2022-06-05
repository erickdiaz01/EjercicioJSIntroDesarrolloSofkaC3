(function () {
  self.Board = function (width, height) {
    this.width = width;
    this.height = height;
    this.playing = false;
    this.gameOver = false;
    this.bars = [];
    this.ball = null;
  };
  self.Board.prototype = {
    get elements() {
      var elements = this.bars;
      elements.push(this.ball);
      return elements;
    },
  };
})();

(function () {
  self.Ball = function (x, y, radio, board) {
    this.x = x;
    this.y = y;
    this.radio = radio;
    this.speedY = 0;
    this.speedX = 3;
    this.board = board;
    board.ball = this;
    this.kind = "circle";
  };
})();

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
    play: function () {
      this.clean();
      this.draw();
    },
  };
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
var board = new Board(800, 400);
var bar = new Bar(20, 100, 40, 100, board);
var bar2 = new Bar(735, 100, 40, 100, board);
var canvas = document.getElementById("canvas");
var boardView = new BoardView(canvas, board);
var ball = new Ball(350,100,10,board);

document.addEventListener("keydown", function (ev) {
  if (ev.key === "ArrowUp") {
    bar.up();
  } else if (ev.key === "ArrowDown") {
    bar.down();
  } else if (ev.key === "w" || ev.key === "W") {
    bar2.up();
  } else if (ev.key === "s" || ev.key === "S") {
    bar2.down();
  }
  console.log("" + bar);
});

window.addEventListener("load", controller);
window.requestAnimationFrame(controller);

function controller() {
  boardView.play();
  window.requestAnimationFrame(controller);
}
