Ext.define('Checkers.view.piece.Piece',{
    extend: 'Ext.draw.sprite.Circle',
    
    type: null,
    status: null,
    width: 96,
    height: 96,
    isKing: false,
    isFlyingKing : true,
    setTile: function (tile) {
        if (tile && tile != this.tile) {
            this.tile = tile;
        }
    },
    setStatus: function(status) {
        if (status && status !== this.status) {
            this.status = status;
        }
    },
    activate: function (enable) {
        var vm = this.getSurface().lookupViewModel(),
            me = this;

        this.setStatus(enable ? 'active' : 'rest');
        vm.set('activePiece', enable ? this : null);

        this.setAttributes({
            fillStyle: {
               type: 'radial',
               start: {
                   x: 0,
                   y: 0,
                   r: 0
               },
               end: {
                   x: 0,
                   y: 0,
                   r: 1
               },
               stops: [{
                   offset: 0,
                   color: enable ? '#fd6b1b' : '#CECECE'
               }, {
                   offset: 1,
                   color: me.fillStyle
               }]
            }
        });

        this.getSurface().renderFrame();
    }
});