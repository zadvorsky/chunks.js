Game.Systems.CameraSystem = function () {};

Game.Systems.CameraSystem.prototype = {
    create:function() {
        this.cameraAspect = Chunks.engine.createAspect().all(Game.Components.Camera);
        this.focusAspect = Chunks.engine.createAspect().all(Game.Components.CameraFocus, Game.Components.PixiSprite);

        this.bounds = {
            xMin:-Infinity,
            xMax:0,
            yMin:0,
            yMax:Infinity
        };

        Game.Signals.reset.add(this.resetHandler, this);
    },

    resetHandler:function() {
        var camera = this.cameraAspect.getFirst().get(Game.Components.Camera);
        camera.container.x = camera.x = 0;
        camera.container.y = camera.y = 0;
    },

    preUpdate:function() {
        return Game.State.phase === Game.PHASE_FLYING;
    },

    update:function() {
        var camera = this.cameraAspect.getFirst().get(Game.Components.Camera);
        var focusEntity = this.focusAspect.getFirst();

        if (focusEntity) {
            var focusSprite = focusEntity.get(Game.Components.PixiSprite).sprite;

            camera.x = -(focusSprite.x - Game.VIEWPORT_WIDTH_PX * 0.5);
            camera.y = -(focusSprite.y - Game.VIEWPORT_HEIGHT_PX * 0.5);
        }

        camera.x = camera.x > this.bounds.xMax ? this.bounds.xMax : (camera.x < this.bounds.xMin ? this.bounds.xMin : camera.x);
        camera.y = camera.y > this.bounds.yMax ? this.bounds.yMax : (camera.y < this.bounds.yMin ? this.bounds.yMin : camera.y);

        camera.container.x = camera.x;
        camera.container.y = camera.y;
    }
};
