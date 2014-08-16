Game.TILE_SIZE = 64;
Game.VIEWPORT_X = -Game.TILE_SIZE * 0.5;
Game.VIEWPORT_Y = -Game.TILE_SIZE * 0.5;
Game.VIEWPORT_WIDTH_PX = 512;
Game.VIEWPORT_HEIGHT_PX = 512;

Game.State = {};

Game.Signals = {};
Game.Signals.gridCreated = new Chunks.Signal();

Game.Tiles = {};
Game.Tiles.START = 1;
Game.Tiles.PATH = 2;
Game.Tiles.BUILD = 3;

var grid =
[
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 3, 2, 3, 3, 3, 3, 3, 3, 0],
    [0, 3, 2, 3, 3, 3, 3, 3, 3, 0],
    [0, 3, 2, 3, 3, 2, 2, 2, 3, 0],
    [0, 3, 2, 3, 3, 2, 3, 2, 3, 0],
    [0, 3, 2, 3, 3, 2, 3, 2, 3, 0],
    [0, 3, 2, 2, 2, 2, 3, 2, 3, 0],
    [0, 3, 3, 3, 3, 3, 3, 2, 3, 0],
    [0, 3, 3, 3, 3, 3, 3, 2, 3, 0],
    [0, 0, 0, 0, 0, 0, 0, 2, 0, 0]
];

var $canvasElement = $("#main_canvas");
var $gameOverPopUp = $("#game_over_popup");
var $replayButton = $("#replay_button");
var prevTime;

function start() {
    // finds a path for the invaders to follow
    Chunks.engine.createSystem(Game.Systems.PathFindingSystem);
    // spawns invaders in waves of increasing difficulty
    Chunks.engine.createSystem(Game.Systems.InvaderSpawnSystem);
    // builds towers
    Chunks.engine.createSystem(Game.Systems.TowerBuildingSystem);
    // makes the invaders follow the path found by the PathFindingSystem
    // when an invader reaches the end of the path, you lose a life.
    Chunks.engine.createSystem(Game.Systems.InvaderMovementSystem);
    // makes towers fire on the nearest invader within their range
    Chunks.engine.createSystem(Game.Systems.TowerFiringSystem);
    // makes sure the projectiles reach the target they were fired at
    Chunks.engine.createSystem(Game.Systems.TargetSeekingSystem);
    // applies velocities to positions (sprites)
    Chunks.engine.createSystem(Game.Systems.PositionSystem);
    // stores collisions between invaders and projectiles
    Chunks.engine.createSystem(Game.Systems.InvaderCollisionSystem);
    // applies damage to invaders based on the collisions found by the InvaderCollisionSystem
    Chunks.engine.createSystem(Game.Systems.DamageSystem);
    // slows invaders based on the collisions found by the InvaderCollisionSystem
    Chunks.engine.createSystem(Game.Systems.SlowingSystem);
    // draws explosions based on the collisions found by the InvaderCollisionSystem
    Chunks.engine.createSystem(Game.Systems.ExplosiveSystem);
    // removes projectiles after they hit an invader, or fly off screen
    Chunks.engine.createSystem(Game.Systems.ProjectileCleanupSystem);
    // removes killed invaders. Also updates the health bars
    Chunks.engine.createSystem(Game.Systems.InvaderHealthSystem);
    // handles tweening of properties (currently only used for explosions)
    Chunks.engine.createSystem(Game.Systems.AnimationSystem);
    // updates the lives and budget UI, and checks if the game is over (lives < 0)
    Chunks.engine.createSystem(Game.Systems.GameStateSystem);
    // renders all the stuff
    Chunks.engine.createSystem(Game.Systems.PixiRenderSystem, [$canvasElement[0]]);

    // create the container for all sprites
    Game.EntityManager.createContainer();
    // create tile entities based on the grid above
    Game.EntityManager.parseGrid(grid);
    // let the engine know the grid has been created
    // currently, this is only used to trigger the PathFindingSystem
    Game.Signals.gridCreated.dispatch();
    // set the game state to its initial values
    Game.State.budget = 10;
    Game.State.lives = 20;
    Game.State.gameOver = false;

    $gameOverPopUp.hide();

    prevTime = Date.now();
    window.requestAnimationFrame(update);
}

function update() {
    // calculate time(ms) since last frame
    var newTime = Date.now();
    var delta = newTime - prevTime;
    prevTime = newTime;

    // update all systems in the order they were created
    Chunks.engine.update(delta);

    // if the game is not over after the update, update again
    // else show the game over popup
    if (Game.State.gameOver === false) {
        window.requestAnimationFrame(update);
    }
    else {
        // remove all systems, entities and aspects.
        Chunks.engine.destroy();
        // game over, bro
        $gameOverPopUp.show();
    }
}

// create shared resources
Game.EntityManager.init();
// when the game is over, it can be started again
$replayButton.click(start);
// start the game!
start();