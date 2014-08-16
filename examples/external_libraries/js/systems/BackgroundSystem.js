Game.Systems.BackgroundSystem = function () {};

Game.Systems.BackgroundSystem.prototype = {
    create:function() {
        this.cameraAspect = Chunks.engine.createAspect().all(Game.Components.Camera);
        this.backgroundAspect = Chunks.engine.createAspect().all(Game.Components.Background, Game.Components.PixiSprite);

        this.prevX = 0;
        this.prevY = 0;

        Game.Signals.reset.add(this.resetHandler, this);
    },

    resetHandler:function() {
        var backgroundSprite = this.backgroundAspect.getFirst().get(Game.Components.PixiSprite).sprite;

        this.prevX = backgroundSprite.tilePosition.x = 0;
        this.prevY = backgroundSprite.tilePosition.y = 0;
    },

    preUpdate:function() {
        return Game.State.phase === Game.PHASE_FLYING;
    },

    update:function() {
        var camera = this.cameraAspect.getFirst().get(Game.Components.Camera);
        var backgroundSprite = this.backgroundAspect.getFirst().get(Game.Components.PixiSprite).sprite;

        backgroundSprite.tilePosition.x += (camera.x - this.prevX);
        backgroundSprite.tilePosition.y += (camera.y - this.prevY);

        this.prevX = camera.x;
        this.prevY = camera.y;
    }
};