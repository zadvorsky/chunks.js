Game.Systems.MouseDragSystem = function () {};

Game.Systems.MouseDragSystem.prototype = {
    create:function(canvas, world) {
        this.aspect = Chunks.engine.createAspect().all(Game.Components.Draggable, Game.Components.P2Body);

        this.canvas = canvas;
        this.world = world;

        this.mouseBody = new p2.Body();
        this.world.addBody(this.mouseBody);

        this.mousePosition = [0, 0];
        this.mouseConstraint = null;
        this.isMousePressed = false;
        this.isMouseReleased = false;

        var moveHandler = this.mouseMoveHandler.bind(this);
        var downHandler = this.mouseDownHandler.bind(this);
        var upHandler = this.mouseUpHandler.bind(this);

        canvas.addEventListener('mousedown', downHandler);
        canvas.addEventListener('mouseup', upHandler);
        canvas.addEventListener('mouseout', upHandler);
        canvas.addEventListener('mousemove', moveHandler);

        Game.Signals.reset.add(this.resetHandler, this);
    },

    resetHandler:function() {
        var body = this.aspect.getFirst().get(Game.Components.P2Body).body;

        body.velocity[0] = 0;
        body.velocity[1] = 0;
        body.position[0] = (Game.VIEWPORT_WIDTH_PX / Game.PHYSICS_SCALE) * 0.5;
        body.position[1] = (Game.VIEWPORT_HEIGHT_PX / Game.PHYSICS_SCALE) * 0.5;
        body.angularVelocity = 0;
        body.angle = 0;
    },

    mouseDownHandler:function(event) {
        this.isMousePressed = true;
    },

    mouseUpHandler:function(event) {
        this.isMouseReleased = true;
    },

    mouseMoveHandler:function(event) {
        this.mousePosition = this.convertMousePosition(event);
    },

    convertMousePosition:function(event) {
        var rect = this.canvas.getBoundingClientRect();
        var lx = (event.clientX - rect.left) / Game.PHYSICS_SCALE;
        var ly = (Game.VIEWPORT_HEIGHT_PX - (event.clientY - rect.top)) / Game.PHYSICS_SCALE;

        return [lx, ly];
    },

    preUpdate:function() {
        return Game.State.phase === Game.PHASE_THROWING;
    },

    update:function() {
        this.mouseBody.position[0] = this.mousePosition[0];
        this.mouseBody.position[1] = this.mousePosition[1];

        if (this.mouseConstraint === null && this.isMousePressed) {

            var draggableBody = this.aspect.getFirst().get(Game.Components.P2Body).body;

            if (this.world.hitTest(this.mousePosition, [draggableBody]).length > 0) {

                this.mouseConstraint = new p2.RevoluteConstraint(this.mouseBody, draggableBody, {
                    worldPivot:this.mousePosition,
                    collideConnected:false
                });

                this.world.addConstraint(this.mouseConstraint);
            }
        }
        else if (this.mouseConstraint !== null && this.isMouseReleased) {

            this.world.removeConstraint(this.mouseConstraint);
            this.mouseConstraint = null;

            Game.State.phase = Game.PHASE_FLYING;
        }

        this.isMousePressed = false;
        this.isMouseReleased = false;
    }
};