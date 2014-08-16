Game.Systems.DistanceSystem = function () {};

Game.Systems.DistanceSystem.prototype = {
    create:function() {
        this.draggableAspect = Chunks.engine.createAspect().all(Game.Components.Draggable, Game.Components.P2Body);
        this.distanceDisplay = document.getElementById('scoreDisplay');

        this.bestDistance = 0;
        this.currentDistance = 0;
    },

    preUpdate:function() {
        return Game.State.phase === Game.PHASE_FLYING;
    },

    update:function() {
        var body = this.draggableAspect.getFirst().get(Game.Components.P2Body).body;
        var speed = Math.sqrt((body.velocity[0] * body.velocity[0]) + (body.velocity[1] * body.velocity[1]));

        this.currentDistance = body.position[0];

        if (this.currentDistance > 0 && speed > 1e-5) {
            this.updateDistanceDisplay();
        }
        else {
            if (this.currentDistance > this.bestDistance) {
                this.bestDistance = this.currentDistance;
            }

            this.updateDistanceDisplay();

            Game.State.phase = Game.PHASE_LANDED;
        }
    },

    updateDistanceDisplay:function() {
        var str = 'Distance: ' + Math.round(this.currentDistance) + ' meters';

        if (this.bestDistance > 0) {
            str += '<br>Best Distance: ' + Math.round(this.bestDistance) + ' meters';
        }

        this.distanceDisplay.innerHTML = str;
    }
};