Game.Systems.GameStateSystem = function () {};

Game.Systems.GameStateSystem.prototype = {
    create:function() {
        this.$budgetField = $('#budget_field');
        this.$livesField = $('#lives_field');
    },

    update:function() {
        this.$budgetField.html('Budget:' + Game.State.budget);
        this.$livesField.html('Lives:' + Game.State.lives);

        if (Game.State.lives <= 0) {
            Game.State.gameOver = true;
        }
    }
};