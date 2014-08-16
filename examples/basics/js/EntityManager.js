// the EntityManager is responsible for entity configuration
//
Game.EntityManager = {
    createPlayer:function(x, y) {
        var e = Chunks.engine.createEntity('player');
        var radius = 10;

        e.add(new Game.Components.Player(300));
        e.add(new Game.Components.Position(x, y));
        e.add(new Game.Components.Velocity());
        e.add(new Game.Components.Collision(radius));
        e.add(new Game.Components.CircleGraphic(radius, '#00ff00'));

        e.update();
    },
    createEnemy:function(x, y, vx, vy) {
        var e = Chunks.engine.createEntity('enemy');
        var radius = 15;

        e.add(new Game.Components.Enemy());
        e.add(new Game.Components.Position(x, y));
        e.add(new Game.Components.Velocity(vx, vy));
        e.add(new Game.Components.Collision(radius));
        e.add(new Game.Components.CircleGraphic(radius, '#ff0000'));

        e.update();
    },
    createCoin:function(x, y, vx, vy) {
        var e = Chunks.engine.createEntity('coin');
        var radius = 15;

        e.add(new Game.Components.Coin(1));
        e.add(new Game.Components.Position(x, y));
        e.add(new Game.Components.Velocity(vx, vy));
        e.add(new Game.Components.Collision(radius));
        e.add(new Game.Components.CircleGraphic(radius, '#ffd700'));

        e.update();
    }
};