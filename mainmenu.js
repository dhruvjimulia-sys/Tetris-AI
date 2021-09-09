let classicButton;
let aboutButton;
let customButton;

function displayMainMenu() {
  let boxSpacing = width / 30;
  background(51);
  noFill();
  stroke(255);
  strokeWeight(3);
  textAlign(CENTER, CENTER);
  rect(boxSpacing, boxSpacing, width - 2 * boxSpacing, height - 2 * boxSpacing);
  noStroke();
  textFont("Arial");
  fill(255);
  textSize(floor(canvasWidth / 5));
  text("Tetris AI", width / 2, height / 3);
  textSize(floor(canvasWidth / 20));
  text(
    "Artificial Intelligence learning to play",
    width / 2,
    height * (48 / 100)
  );
  text(
    "the world's most influential puzzle game",
    width / 2,
    height * (54 / 100)
  );

  classicButton.display();
  customButton.display();
  aboutButton.display();
}

function MenuWidget(x_, y_, xsize_, ysize_, text_, subtext_, spacing_) {
  this.subtext = subtext_;
  this.text = text_;
  this.x = x_;
  this.y = y_;
  this.xsize = xsize_;
  this.ysize = ysize_;
  this.spacing = spacing_;
  this.touchTime = 0;

  this.mousePresent = function () {
    return (
      this.x < mouseX &&
      this.x + this.xsize > mouseX &&
      this.y < mouseY &&
      this.y + this.ysize > mouseY
    );
  };

  this.display = function () {
    if (this.mousePresent()) {
      fill(150);
    } else {
      fill(51);
    }
    stroke(255);
    strokeWeight(canvasHeight / 300);
    rect(this.x, this.y, this.xsize, this.ysize);
    textSize(floor(canvasWidth / 20));
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textFont("Arial");
    let increment = 0;
    if (this.text == "Classic" || this.text == "Custom") {
      increment = height / 100;
    }
    text(
      this.text,
      this.x + this.xsize / 2,
      this.y + this.ysize / 2 - this.spacing + increment
    );
    textSize(floor(canvasWidth / 40));
    text(
      this.subtext,
      this.x + this.xsize / 2,
      this.y + this.ysize / 2 + this.spacing + increment
    );
    textAlign(LEFT, TOP);
  };
}
