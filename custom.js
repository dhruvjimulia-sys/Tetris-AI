const customBlockSet1 = [
  [
    //C-block
    [false, false, false, false],
    [false, true, true, true],
    [false, true, false, true],
    [false, false, false, false],
  ],

  [
    //Chisel block
    [false, false, false, false],
    [false, true, true, true],
    [true, true, false, true],
    [false, false, false, false],
  ],

  [
    // Arrow block
    [false, false, false, false],
    [false, false, false, false],
    [false, true, true, false],
    [false, true, false, false],
  ],

  [
    // Broken stick block
    [false, false, false, false],
    [false, true, true, false],
    [false, false, false, true],
    [false, false, false, false],
  ],

  [
    // Cap block
    [false, false, false, false],
    [false, false, true, false],
    [false, true, false, true],
    [false, false, false, false],
  ],

  [
    // Shortened I-block
    [false, false, false, false],
    [false, true, true, true],
    [false, false, false, false],
    [false, false, false, false],
  ],

  [
    // Block added to O-block
    [false, false, false, false],
    [false, false, true, true],
    [false, true, true, true],
    [false, false, false, false],
  ],
];
const customBlockSet2 = [
  [
    // Extended C-block
    [false, false, false, false],
    [true, true, true, true],
    [true, false, false, true],
    [false, false, false, false],
  ],

  [
    //Even Shortened I-block
    [false, false, false, false],
    [false, false, false, false],
    [false, false, true, false],
    [false, false, true, false],
  ],

  [
    // Cradle block
    [false, false, false, false],
    [true, false, false, true],
    [false, true, true, false],
    [false, false, false, false],
  ],

  [
    // Extended S-block
    [false, true, false, false],
    [false, true, false, false],
    [false, true, false, false],
    [true, true, false, false],
  ],

  [
    // Half-heart block
    [false, false, false, false],
    [false, true, true, false],
    [false, true, false, true],
    [false, false, false, false],
  ],

  [
    // Double O-block
    [false, false, false, false],
    [true, true, true, true],
    [true, true, true, true],
    [false, false, false, false],
  ],

  [
    // Extended T-block
    [false, false, true, false],
    [false, false, true, true],
    [false, true, true, true],
    [false, false, false, false],
  ],
];
const customBlockSet3 = [
  [
    // Equalized L-block
    [false, false, false, false],
    [false, true, true, true],
    [false, false, false, true],
    [false, false, false, true],
  ],

  [
    // 1.5 O-block
    [false, false, false, false],
    [false, true, true, false],
    [false, true, true, false],
    [false, true, true, false],
  ],

  [
    // Block on horizontal surface block
    [false, false, false, false],
    [false, false, true, false],
    [true, true, true, true],
    [false, false, false, false],
  ],

  [
    // Horizontally extended S-block
    [false, false, false, false],
    [true, true, true, false],
    [false, false, true, true],
    [false, false, false, false],
  ],

  [
    // Simple diagnol block
    [false, false, false, false],
    [false, false, true, false],
    [false, true, false, false],
    [false, false, false, false],
  ],

  [
    // Horizontally Extended L-block
    [false, true, true, true],
    [false, true, false, false],
    [false, true, false, false],
    [false, true, false, false],
  ],

  [
    // Shortened Cap block
    [false, false, true, false],
    [false, false, true, true],
    [false, true, false, true],
    [false, false, false, false],
  ],
];
let startCustomButton, customBackButton;
let classicPreset, preset1, preset2, preset3;
let blockDisplays;

function customDisplay() {
  let boxSpacing = width / 30;
  background(51);
  noFill();
  stroke(255);
  strokeWeight(canvasWidth / 500);
  textAlign(CENTER, CENTER);
  rect(boxSpacing, boxSpacing, width - 2 * boxSpacing, height - 2 * boxSpacing);

  if (classicPreset.selected) {
    startCustomButton.text = "Start Classic Game";
  } else {
    startCustomButton.text = "Start Custom Game";
  }
  startCustomButton.display();
  customBackButton.display();
  classicPreset.display();
  preset1.display();
  preset2.display();
  preset3.display();
  for (let i = 0; i < blockDisplays.length; i++) {
    blockDisplays[i].display(colours[i]);
  }
}

function BlockDisplay(x_, y_, size_, blockSet_) {
  this.blockSet = blockSet_;
  this.x = x_;
  this.y = y_;
  this.size = size_;

  this.display = function (colour) {
    noFill();
    stroke(255);
    strokeWeight(canvasWidth / 500);
    rect(this.x, this.y, this.size, this.size);
    for (let i = 0; i < this.blockSet.length; i++) {
      for (let j = 0; j < this.blockSet[0].length; j++) {
        let blockSize = this.size / 4;
        stroke(200);
        if (this.blockSet[i][j]) {
          fill(colour);
        } else {
          noFill();
        }
        let staX = this.x + j * blockSize;
        let staY = this.y + i * blockSize;
        rect(staX, staY, blockSize, blockSize);
      }
    }
  };

  this.setBlockSet = function (set) {
    this.blockSet = set;
  };
}

function PresetWidget(
  x_,
  y_,
  xsize_,
  ysize_,
  text_,
  selected_,
  subtext_,
  spacing_
) {
  this.text = text_;
  this.x = x_;
  this.y = y_;
  this.xsize = xsize_;
  this.ysize = ysize_;
  this.touchTime = 0;
  this.selected = selected_;
  this.subtext = subtext_;
  this.spacing = spacing_;

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
      fill(175);
    } else if (this.selected) {
      fill(125);
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
    text(
      this.text,
      this.x + this.xsize / 2,
      this.y + this.ysize / 2 - this.spacing
    );
    textSize(floor(canvasWidth / 40));
    text(
      this.subtext,
      this.x + this.xsize / 2,
      this.y + this.ysize / 2 + this.spacing
    );
    textAlign(LEFT, TOP);
  };

  this.setSelected = function (select) {
    this.selected = select;
  };
}
