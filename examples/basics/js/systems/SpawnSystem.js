Game.Systems.SpawnSystem = function() {};

Game.Systems.SpawnSystem.prototype = {
    create:function() {
        this.spawnInterval = 1000;
        this.minSpawnInverval = 100;
        this.enemySpawnChance = 0.1;
        this.maxEnemySpawnChance = 0.8;
        this.entitySpeed = 50;
        this.maxEntitySpeed = 500;

        this.elapsedTime = 0;
        this.spawnCount = 0;
        this.levelUpThreshold = 10;
    },

    preUpdate:function(delta) {
        this.elapsedTime += delta;

        if (this.elapsedTime >= this.spawnInterval) {
            this.elapsedTime = 0;

            return true;
        }

        return false;
    },

    update:function() {
        // get a random spawn position and velocity
        var x, y, vx, vy;

        switch (Math.floor(Math.random() * 4)) {
            case 0:
                x = Math.random() * Game.WORLD_WIDTH;
                y = 0;
                vx = 0;
                vy = this.entitySpeed;
                break;
            case 1:
                x = Game.WORLD_WIDTH;
                y = Math.random() * Game.WORLD_HEIGHT;
                vx = -this.entitySpeed;
                vy = 0;
                break;
            case 2:
                x = Math.random() * Game.WORLD_WIDTH;
                y = Game.WORLD_HEIGHT;
                vx = 0;
                vy = -this.entitySpeed;
                break;
            case 3:
                x = 0;
                y = Math.random() * Game.WORLD_HEIGHT;
                vx = this.entitySpeed;
                vy = 0;
                break;
        }
        // spawn either an enemy or a coin
        if (Math.random() <= this.enemySpawnChance) {
            Game.EntityManager.createEnemy(x, y, vx, vy);
        }
        else {
            Game.EntityManager.createCoin(x, y, vx, vy);
        }
        // check if it is time to increase the difficulty
        if (++this.spawnCount % this.levelUpThreshold) {
            this.enemySpawnChance = Math.min(this.enemySpawnChance * 1.01, this.maxEnemySpawnChance);
            this.spawnInterval = Math.max(this.spawnInterval * 0.99, this.minSpawnInverval);
            this.entitySpeed = Math.min(this.entitySpeed * 1.01, this.maxEntitySpeed);
        }
    }
};