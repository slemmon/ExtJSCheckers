Ext.define('Checkers.view.board.Board',{
    requires: [
         'Checkers.view.board.BoardController',
         'Checkers.view.board.BoardViewModel',
         'Checkers.view.board.Tile',
         'Checkers.view.piece.Piece',
         'Ext.draw.plugin.SpriteEvents'
    ],
    extend: 'Ext.draw.Container',
    xtype: 'checkersboard',
    plugins: ['spriteevents'],
    width: 768,
    height: 768,
    style: {
        border: '1px solid #000'
    },
    viewModel: 'BoardViewModel',
    controller: 'BoardController',
    listeners: {
        afterrender: 'onBoardRender',
        spriteclick: 'onSpriteClick',
        spritemouseover: 'onSpriteMouseOver',
        spritemouseout: 'onSpriteMouseOut'
    }
});