Game.VIEWPORT_WIDTH_PX = 512;
Game.VIEWPORT_HEIGHT_PX = 512;
Game.PHYSICS_SCALE = 32; // 32 pixels per unit (meter)

Game.PHASE_THROWING = 0;
Game.PHASE_FLYING = 1;
Game.PHASE_LANDED = 2;

Game.State = {};
Game.State.phase = 0;

Game.Signals = {};
Game.Signals.reset = new Chunks.Signal();

var prevTime;
var canvasElement = document.getElementById("main_canvas");

function start() {
    var p2World = new p2.World();

    Chunks.engine.createSystem(Game.Systems.MouseDragSystem, [canvasElement, p2World]);
    Chunks.engine.createSystem(Game.Systems.P2PhysicsSystem, [p2World]);
    Chunks.engine.createSystem(Game.Systems.CameraSystem);
    Chunks.engine.createSystem(Game.Systems.BackgroundSystem);
    Chunks.engine.createSystem(Game.Systems.DistanceSystem);
    Chunks.engine.createSystem(Game.Systems.PixiRenderSystem, [canvasElement]);

    Game.EntityManager.init(p2World);

    Game.EntityManager.createBackground();
    Game.EntityManager.createCameraContainer();
    Game.EntityManager.createCamera();
    Game.EntityManager.createGround();
    Game.EntityManager.createProjectile(8, 8);

    Game.State.phase = Game.PHASE_THROWING;

    prevTime = Date.now();
    window.requestAnimationFrame(update);
}

function update() {
    var newTime = Date.now();
    var delta = newTime - prevTime;
    prevTime = newTime;

    Chunks.engine.update(delta);

    if (Game.State.phase === Game.PHASE_LANDED) {
        reset();
    }

    window.requestAnimationFrame(update);
}

function reset() {
    Game.Signals.reset.dispatch();
    Game.State.phase = Game.PHASE_THROWING;
}

start();