Game.Systems.PathFindingSystem = function () {};

Game.Systems.PathFindingSystem.prototype = {
    create:function() {
        this.pathAspect = Chunks.engine.createAspect().all(Game.Components.PathTile);
        this.invaderAspect = Chunks.engine.createAspect().all(Game.Components.Invader);
        this.invaderAspect.entityAdded.add(this.invaderAddedHandler, this);

        this.path = null;

        Game.Signals.gridCreated.add(this.gridUpdatedHandler, this);
    },

    invaderAddedHandler:function(entity) {
        var invader = entity.get(Game.Components.Invader);

        invader.path = this.path.getIterator();
    },

    gridUpdatedHandler:function() {
        var next;

        this.path = new Chunks.List();
        this.path.add(this.findStartTile());

        while (next = this.findNextTile()) {
            this.path.add(next);
        }
    },

    findStartTile:function() {
        var startTile = null;

        this.pathAspect.forEach(function(entity) {
            var tile = entity.get(Game.Components.PathTile);

            if (tile.isStartTile) {
                startTile = tile;
                return false;
            }
            return true;
        }, this);

        return startTile;
    },

    findNextTile:function() {
        var nextTile = null;

        this.pathAspect.forEach(function(entity) {
            var tile = entity.get(Game.Components.PathTile);

            if (this.path.contains(tile) === false && this.checkAreNeighbors(this.path.getLast(), tile) === true) {
                nextTile = tile;
                return false;
            }
            return true;
        }, this);

        return nextTile;
    },

    checkAreNeighbors:function(a, b) {
        var dx = Math.abs(a.xIndex - b.xIndex);
        var dy = Math.abs(a.yIndex - b.yIndex);

        return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
    },

    preUpdate:function() {
        return false;
    }
};