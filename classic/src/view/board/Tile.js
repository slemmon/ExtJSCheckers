Ext.define('Checkers.view.board.Tile',{
    extend: 'Ext.draw.sprite.Rect',
    surface: 'checkersboard',
    position: {
        x: null,
        y: null
    },
    status: null,
    piece: null,

    getPiece: function() {
        return this.piece;
    },

    setPiece: function (piece) {
        if (piece == null) {
            this.piece = null;
            this.setStatus('free');
        } else {
            piece.setTile(this);
            this.piece = piece;
            this.setStatus('filled');
        }
    },

    getStatus: function() {
        return this.status;
    },

    setStatus: function(status) {
        if (status && status !== this.status) {
            this.status = status;
        }
    },

    highlight: function(enable) {
        if (enable) {
            this.setStatus('highlighted');
        } else {
            this.setStatus(this.piece ? 'filled' : 'free');
        }

        this.setAttributes({
            lineWidth: 3,
            strokeStyle: enable ? '#5fa2dd' : 'none'
        });

        this.getSurface().renderFrame();
    }
});