PixiUtils = {
    generateRectTexture:function(w, h, fillColor, strokeColor, strokeWidth) {
        var g = new PIXI.Graphics();

        if (strokeColor !== undefined) {
            g.lineStyle(strokeWidth || 1, strokeColor);
        }

        g.beginFill(fillColor);
        g.drawRect(0, 0, w, h);
        g.boundsPadding = 1;

        return g.generateTexture();
    },

    generateTilingRectTexture:function(w, h, fillColor, strokeColor, strokeWidth) {
        var g = new PIXI.Graphics();

        if (strokeColor !== undefined) {
            g.lineStyle(strokeWidth || 1, strokeColor);
        }

        g.beginFill(fillColor);
        g.drawRect(0, 0, w, h);
        g.boundsPadding = 0;

        return g.generateTexture();
    },

    generateCircTexture:function(r, fillColor, strokeColor, strokeWidth) {
        var g = new PIXI.Graphics();

        if (strokeColor !== undefined) {
            g.lineStyle(strokeWidth || 1, strokeColor);
        }

        g.beginFill(fillColor);
        g.drawCircle(0, 0, r);
        g.boundsPadding = 1;

        return g.generateTexture();
    }
};