// a very basic system for drawing circles on a canvas element
Game.Systems.PixiRenderSystem = function() {};

Game.Systems.PixiRenderSystem.prototype = {
    create:function(canvasElement) {
        this.renderAspect = Chunks.engine.createAspect().all(Game.Components.PixiSprite);
        this.renderAspect.entityAdded.add(this.entityAddedHandler, this);
        this.renderAspect.entityRemoved.add(this.entityRemovedHandler, this);

        this.renderer = PIXI.autoDetectRenderer(Game.VIEWPORT_WIDTH_PX, Game.VIEWPORT_HEIGHT_PX, canvasElement);
        this.stage = new PIXI.Stage(0x000000);
    },

    entityAddedHandler:function(entity) {
        var spriteComponent = entity.get(Game.Components.PixiSprite);
        var sprite = spriteComponent.sprite;
        var parent = spriteComponent.parent;

        if (parent !== null) {
            parent.addChild(sprite);
        }
        else {
            this.stage.addChild(sprite);
        }
    },

    entityRemovedHandler:function(entity) {
        var spriteComponent = entity.get(Game.Components.PixiSprite);
        var sprite = spriteComponent.sprite;
        var parent = spriteComponent.parent;

        if (parent !== null) {
            parent.removeChild(sprite);
        }
        else {
            this.stage.removeChild(sprite);
        }
    },

    update:function() {
        this.renderer.render(this.stage);
    }
};