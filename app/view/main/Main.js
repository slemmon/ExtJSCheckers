Ext.define('Checkers.view.main.Main',{
    extend: 'Ext.panel.Panel',
    requires: [
        'Checkers.view.board.Board'
    ],
    title: 'ExtJS Checkers',
    viewModel: {
        data: {
            turn: 'clear',
            gameTime: null,
            clearMoves: 0,
            darkMoves: 0,
            clearPieces: 12,
            darkPieces: 12
        }
    },
    layout: {
        type: 'hbox',
        align: 'middle',
        pack: 'center'
    },
    tbar: [{
        text: 'Restart Game',
        handler: function(b) {
            var panel = b.up('panel'),
                board = panel.down('checkersboard');

            board.getController().restartGame();
            
        }
    },{
        xtype: 'label',
        bind: {
            text: 'Turn: {turn}'
        }
    },{
        xtype: 'label',
        bind: {
            text: 'Clear Piece Moves: {clearMoves}'
        }
    },{
        xtype: 'label',
        bind: {
            text: 'Dark Piece Moves: {darkMoves}'
        }
    },{
        xtype: 'label',
        bind: {
            text: 'Total Clear Pieces: {clearPieces}'
        }
    },{
        xtype: 'label',
        bind: {
            text: 'Total Clear Pieces: {darkPieces}'
        }
    },{
        xtype: 'label',
        bind: {
            text: 'Total Game Time: {gameTime}'
        }
    }],
    items: [{
        xtype: 'checkersboard'
    }]
});