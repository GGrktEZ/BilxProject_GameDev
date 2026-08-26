# BilxProject_GameDev

Game Development Project in 5 Weeks under BildxZug.

## How to run it

Open `index.html` in a browser, or start it with the VS Code extension
"Live Server". Every path in this project is relative, so both ways work.

## Games

- **Game 1 - Flappy Christian** (`Games/Game1.html`)
  Press Space or click to flap. Fly through the gaps between the Christians.
  One point for every pair you get past. Touching a Christian or the floor
  ends the round, Space starts a new one.
- **Game 2** (`Games/Game2.html`) - still empty.

## Where things are

```
index.html                 the start page with the two game links
css/index.css              styles for the start page
css/flappy.css             styles for Game 1
Games/Game1.html           Game 1
Games/FlappyLogic.js       all of the Game 1 logic
Games/Game2.html           Game 2 (empty for now)
GameAssests/FlappyBird/    bird, Christian and background images
images/                    logo and start page background
```

## Making the game easier or harder

Every number you can tune sits in the settings block at the top of
`Games/FlappyLogic.js`. A bigger `CHRISTIAN_GAP` or a smaller
`CHRISTIAN_SPEED` makes the game easier.

## Two rules that keep it working on all our computers

1. **Always use relative paths** (`./../css/flappy.css`), never paths that
   start with `/`. A leading `/` means "root of the drive" and breaks as soon
   as someone opens the file directly instead of through a server.
2. **Watch upper and lower case in file names.** Windows does not care,
   Linux does. `FlappyLogic.js` and `flappylogic.js` are two different files.
