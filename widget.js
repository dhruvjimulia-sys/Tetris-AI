function Widget(x_, y_, xsize_, ysize_, text_) {
  this.text = text_;
  this.x = x_;
  this.y = y_;
  this.xsize = xsize_;
  this.ysize = ysize_;
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
    if (this.mousePresent() && this.touchTime < touchResponse) {
      fill(150);
    } else {
      fill(51);
    }

    stroke(255);
    textFont("Arial");
    strokeWeight(windowWidth / 500);
    rect(this.x, this.y, this.xsize, this.ysize);
    textSize(floor(canvasWidth / 30));
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    text(this.text, this.x + this.xsize / 2, this.y + this.ysize / 2);
    textAlign(LEFT, TOP);
  };
}
