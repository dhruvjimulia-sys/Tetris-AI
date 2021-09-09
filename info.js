let aboutBackButton;
let infoDisplayWidgetSpacing;

function infoDisplay(title, content) {
  let boxSpacing = width / 30;
  background(51);
  noFill();
  stroke(255);
  strokeWeight(canvasWidth / 500);
  rect(boxSpacing, boxSpacing, width - 2 * boxSpacing, height - 2 * boxSpacing);

  textAlign(CENTER, CENTER);
  noStroke();
  textFont("Arial");
  fill(255);
  textSize(floor(canvasWidth / 10));
  text(title, width / 2, height / 8);

  textAlign(LEFT, TOP);
  textSize(floor(canvasWidth / 30));
  text(
    content,
    boxSpacing + width / 18,
    boxSpacing + height / 5,
    width - 2 * boxSpacing - width / 10,
    height - 2 * boxSpacing - infoDisplayWidgetSpacing
  );
  text(
    "- 20th July 2020",
    boxSpacing + width * (4 / 7),
    boxSpacing + height * (66 / 100),
    width - 2 * boxSpacing - width / 10,
    height - 2 * boxSpacing - infoDisplayWidgetSpacing
  );
}

function helpDisplay() {
  let boxSpacing = width / 30;
  background(51);
  noFill();
  stroke(255);
  strokeWeight(canvasWidth / 500);
  rect(boxSpacing, boxSpacing, width - 2 * boxSpacing, height - 2 * boxSpacing);

  textAlign(CENTER, CENTER);
  noStroke();
  textFont("Arial");
  fill(255);
  textSize(floor(canvasWidth / 10));
  text("Guidelines", width / 2, height / 8);

  textAlign(LEFT, TOP);
  textSize(floor(canvasWidth / 30));
  text(
    "This is a demonstration of AI learning to be better at the task of playing Tetris. Although initially the AI is likely to make terrible moves, eventually, it will learn from its mistakes and increase the high score.",
    boxSpacing + width / 16,
    boxSpacing + height / 6,
    width - 2 * boxSpacing - width / 10,
    height - 2 * boxSpacing - infoDisplayWidgetSpacing
  );
  text(
    "In the rare case that the AI continues to perform badly (doing moves that are obviously wrong even after Trial 50), I recommend going back to the menu and restarting: AI, like humans, can be unpredictable too.",
    boxSpacing + width / 16,
    boxSpacing + height * (31 / 100),
    width - 2 * boxSpacing - width / 10,
    height - 2 * boxSpacing - infoDisplayWidgetSpacing
  );
  text(
    "Keeping fast speed will ensure that the AI learns quickly, but slow speed can be more satisfying to watch, especially after the AI has learnt a good strategy.",
    boxSpacing + width / 16,
    boxSpacing + height * (45.4 / 100),
    width - 2 * boxSpacing - width / 10,
    height - 2 * boxSpacing - infoDisplayWidgetSpacing
  );
  text(
    "Even if AI learns the optimal strategy, scores are likely to be lower in Custom mode since the pieces are much more complex.",
    boxSpacing + width / 16,
    boxSpacing + height * (56.5 / 100),
    width - 2 * boxSpacing - width / 10,
    height - 2 * boxSpacing - infoDisplayWidgetSpacing
  );
  text(
    "The trials go on indefinitely.",
    boxSpacing + width / 16,
    boxSpacing + height * (68 / 100),
    width - 2 * boxSpacing - width / 10,
    height - 2 * boxSpacing - infoDisplayWidgetSpacing
  );
  text(
    "For reference: the world record in NES Tetris is 1,357,428 (as of 20/7/2020). If you are lucky, this AI can come really close to the record, or even beat it!",
    boxSpacing + width / 16,
    boxSpacing + height * (72 / 100),
    width - 2 * boxSpacing - width / 10,
    height - 2 * boxSpacing - infoDisplayWidgetSpacing
  );
}
