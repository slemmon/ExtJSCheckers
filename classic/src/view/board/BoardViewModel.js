Ext.define('Checkers.view.board.BoardViewModel',{
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.BoardViewModel',

    data: {
        tileMap: [],
        playerMove: 0,
        types: ['dark', 'clear'],
        theme : 'standard'
    }
});