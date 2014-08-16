// game state
Game.State = {};
Game.State.score = 0;
Game.State.highscore = 0;
Game.State.gameOver = false;
// constants
Game.WORLD_WIDTH = 512;
Game.WORLD_HEIGHT = 512;

var prevTime;
var scoreDisplayElement = document.getElementById("scoreDisplay");

function start() {
    // reset the game state
    Game.State.score = 0;
    Game.State.gameOver = false;

    // first, check if coins or enemies should be spawned
    Chunks.engine.createSystem(Game.Systems.SpawnSystem);
    // then handle player input
    Chunks.engine.createSystem(Game.Systems.PlayerControlSystem);
    // then update positions
    Chunks.engine.createSystem(Game.Systems.PositionSystem);
    Chunks.engine.createSystem(Game.Systems.WorldBoundsSystem);
    // after final positions have been determined, check for collisions
    Chunks.engine.createSystem(Game.Systems.CollisionSystem);
    // after all state changes have been processed, draw things on screen
    Chunks.engine.createSystem(Game.Systems.CircleDrawingSystem);

    // create the player here, so
    Game.EntityManager.createPlayer(256, 256);

    prevTime = Date.now();
    window.requestAnimationFrame(update);
}

function update() {

    var newTime = Date.now();
    var delta = newTime - prevTime;
    prevTime = newTime;

    // update all systems in the order they were created
    // the delta time will be passed to preUpdate and update functions in every system
    Chunks.engine.update(delta);

    // after the update has run, check if the game is over
    // if it is not, update again
    // if it is, restart the game
    if (Game.State.gameOver === false) {
        window.requestAnimationFrame(update);
    }
    else {
        // destroying the engine will destroy all systems, entities and aspects
        Chunks.engine.destroy();

        if (Game.State.score > Game.State.highscore) {
            Game.State.highscore = Game.State.score;
        }

        start();
    }

    scoreDisplayElement.innerHTML = 'Score: ' + Game.State.score + (Game.State.highscore > 0 ? ("<br>Highscore: " + Game.State.highscore) : "");
}

start();