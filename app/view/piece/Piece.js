Ext.define('Checkers.view.piece.Piece', {
    extend: 'Ext.draw.sprite.Circle',

    type: null,
    status: null,
    width: 96,
    height: 96,
    isKing: false,
    isFlyingKing: true,
    constructor: function(config) {
        var stops;

        if (config.type === 'dark') {
            stops = [{ offset: 0,  color: '#930038'  }, { offset: .4,  color: '#AA030E'  }, { offset: .7,  color: '#C60324' }, 
                    {  offset: .9,  color: '#AA030E' }, { offset: .15, color: '#AA030E'  }, { offset: .18, color: '#C60324' }, 
                    {  offset: .21, color: '#AA030E' }, { offset: .29,  color: '#AA030E' }, { offset: .32, color: '#C60324' }, 
                    {  offset: .35, color: '#AA030E' }, { offset: .38,  color: '#AA030E' }, { offset: .43, color: '#C60324' }, 
                    {  offset: .45, color: '#AA030E' }, { offset: .47,  color: '#AA030E' }, { offset: .50, color: '#C60324' }, 
                    {  offset: .53, color: '#AA030E' }, { offset: .72,  color: '#AA030E' }];
        } else {
            stops = [{ offset: 0,   color: '#7b7b7b' }, { offset: .4,  color: '#848484' }, { offset: .7,  color: '#8f8f8f' }, 
                    {  offset: .9,  color: '#848484' }, { offset: .15, color: '#848484' }, { offset: .18, color: '#8f8f8f' }, 
                    {  offset: .21, color: '#848484' }, { offset: .29, color: '#848484' }, { offset: .32, color: '#8f8f8f' }, 
                    {  offset: .35, color: '#848484' }, { offset: .38, color: '#848484' }, { offset: .43, color: '#8f8f8f' }, 
                    {  offset: .45, color: '#848484' }, { offset: .47, color: '#848484' }, { offset: .50, color: '#8f8f8f' }, 
                    {  offset: .53, color: '#848484' }, { offset: .72, color: '#848484' }];
        }

        Ext.apply(config, {
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
                stops: stops
            }
        });

        this.callParent([config]);
    },
    setTile: function(tile) {
        if (tile && tile != this.tile) {
            this.tile = tile;
        }
    },
    setStatus: function(status) {
        if (status && status !== this.status) {
            this.status = status;
        }
    },
    activate: function(enable) {
        var me = this,
            vm = this.getSurface().lookupViewModel();

        this.setStatus(enable ? 'active' : 'rest');
        vm.set('activePiece', enable ? this : null);

        this.setAttributes({
            strokeStyle: enable ? (me.type === 'clear' ? '#FFF' : '#fd6b1b') : 'none',
            lineWidth: enable ? 2 : 1
        });

        this.getSurface().renderFrame();
    },
    setKing: function() {
        var me = this,
            fillStyle = me.fillStyle;

        fillStyle.stops[fillStyle.stops.length -1].color = '#000';
        me.isKing = true;

        me.setAttributes({
            fillStyle: fillStyle
        });

        this.getSurface().renderFrame();

    }
});
