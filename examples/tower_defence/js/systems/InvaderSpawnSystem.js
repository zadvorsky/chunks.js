Game.Systems.InvaderSpawnSystem = function() {};

Game.Systems.InvaderSpawnSystem.prototype = {

    create:function() {
        this.invaderAspect = Chunks.engine.createAspect().all(Game.Components.Invader);

        this.waveInterval = 3000;
        this.waveElapsed = 0;
        this.spawnInterval = this.spawnElapsed = 1000;

        this.waveStarted = false;
        this.waveCount = 0;
        this.waveSize = 10;
        this.currentWave = 0;

        this.invaderSpeed = 50;
        this.invaderHealth = 1;
        this.invaderValue = 2;

        this.$waveField = $('#wave_field');
        this.$waveField.html("Wave:" + this.currentWave);
    },

    preUpdate:function(delta) {
        if (this.waveStarted === false) {
            this.waveElapsed += delta;

            if (this.waveElapsed >= this.waveInterval) {
                this.waveElapsed = 0;
                this.waveStarted = true;

                this.currentWave++;
                this.$waveField.html("Wave:" + this.currentWave);
            }

            return false;
        }
        else {
            this.spawnElapsed += delta;

            if (this.spawnElapsed >= this.spawnInterval) {
                this.spawnElapsed = 0;

                return true;
            }

            return false;
        }
    },

    update:function() {
        if (this.waveCount < this.waveSize) {
            Game.EntityManager.createInvader(this.invaderSpeed, this.invaderHealth, this.invaderValue);
            this.waveCount++;
        }
        else {
            if (this.invaderAspect.size === 0) {
                this.waveStarted = false;
                this.waveCount = 0;

                this.waveSize++;
                this.invaderSpeed = Math.min(300, this.invaderSpeed + 10);
                this.invaderHealth++;
                this.spawnInterval = Math.max(100, this.spawnInterval - 100);
            }
        }
    }
};