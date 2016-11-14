Ext.define('Checkers.view.board.BoardController',{
    extend: 'Ext.app.ViewController',
    alias: 'controller.BoardController',

    onBoardRender: function(ct) {
        var tilesPerRow = 8;

        this.renderTiles(ct.getSurface(), tilesPerRow, ct.getHeight(), ct.getWidth());
        this.createInitialPieces();
        this.renderPieces(['dark', 'clear']);
    },

    clearTile: function (tile) {
        tile.setPiece(null);
    },

    renderTiles: function(surface, tilesPerRow, totalHeight, totalWidth) {
        var vm = this.getViewModel(),
            tileMap = vm.get('tileMap'),
            tileWidth = totalWidth/tilesPerRow, 
            tileHeight = totalHeight/tilesPerRow,
            counter = 0,
            i, j, tile;

        for (i = 0; i < tilesPerRow; i++) {
            for (j = 0; j < tilesPerRow; j++) {
                if (!tileMap[j]) {
                    tileMap[j] = [];
                }
                counter++;
                tile = this.generateTile(tileHeight, tileWidth, j*tileWidth, i*tileHeight, (counter+i)%2, {x: j, y: i});
                
                tileMap[j][i] = tile;
                surface.add(tile);
            }
        }
    },

    generateTile: function(height, width, x, y, dark, tileCoordinates) {
        var vm = this.getViewModel(),
            theme = vm.get('theme') || 'standard';

        return Ext.create('Checkers.view.board.Tile',{
            width: width,
            height: height,
            x: x,
            y: y,
            theme: theme,
            position: tileCoordinates,
            type: dark ? 'dark' : 'clear',
            status: dark ? 'free' : null,
            zIndex: dark ? 1 : 0,
            fillStyle: dark ? '#000' : '#FFF'
        });
    },

    createInitialPieces: function() {
        var vm = this.getViewModel(),
            type, i;

        vm.set('clearPieces', []);
        vm.set('darkPieces', []);
        for (i = 0; i < 24; i++) {
            type = i < 12 ? 'dark' : 'clear';
            vm.get(type + 'Pieces').push(
                Ext.create('Checkers.view.piece.Piece',{
                    status: 'rest',
                    type: type,
                    r: 40,
                    zIndex: 2,
                    fillStyle: i < 12 ? '#a00618' : '#e0d195',
                    listeners: {
                        beforedestroy : this.beforePieceDestroy,
                        scope: this
                    }
                })
            );
        }
    },

    renderPieces: function(types) {
        var me = this,
            vm = this.getViewModel(),
            pieces = [], i;

        for (i = 0; i < types.length; i++) {
            pieces = pieces.concat(vm.get(types[i] + 'Pieces'));
        }

        this.actionForEachTile(function(tile, counter) {
            me.renderPiece(pieces[counter], tile);
        }, true, true);
    },

    renderPiece: function(piece, tile) {
        var surface = this.getView().getSurface(),
            color = piece.fillStyle;

        piece.setAttributes({
            r: 40,
            cx: tile.x + 48,
            cy: tile.y + 48,
            zIndex: 2,
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
                   color: '#CECECE'
               }, {
                   offset: 1,
                   color: color
               }]
            }
        });

        tile.setPiece(piece);

        surface.add(piece);
    },

    onSpriteClick: function (item, event) {
        var vm = this.getViewModel(),
            vmParent = vm.getParent(),
            sprite = item.sprite,
            isPiece = sprite.tile,
            activePiece = vm.get('activePiece'),
            activeType = activePiece && activePiece.type;

        if (isPiece) {
            if (sprite.type !== vmParent.get('turn')) {
                return;
            }
            if (sprite.status === 'rest') {
                if (!vm.get('playerMove')) {
                    vm.set('playerMove', 1);
                } else {
                    activePiece.activate(false);
                }
                sprite.activate(true);
            } else {
                vm.set('playerMove', 0);
                sprite.activate(false);
            }
        } else {
            if (sprite.status === 'highlighted') {
                this.movePieceToTile(activePiece, sprite);
                if (this.pieceHasAdditionalMoves(activePiece)) {
                    // TODO: allow additional moves
                } else {
                    vm.set('playerMove', 0);
                    vmParent.set(activeType + 'Moves', vmParent.get(activeType + 'Moves') + 1);
                    vmParent.set('turn', activeType === 'clear' ? 'dark' : 'clear');
                }
            }
        }
    },

    onSpriteMouseOver: function (item, event) {
        var sprite = item.sprite,
            vm = this.getViewModel(),
            isTile = !sprite.tile,
            activePiece = vm.get('activePiece');

        if (!isTile || !activePiece || this === activePiece.tile) {
            return;
        }

        if (activePiece && sprite.getStatus() === 'free' && this.validateMove(activePiece, sprite)) {
            sprite.highlight(true);
        }

    },

    onSpriteMouseOut: function (item, event) {
        var sprite = item.sprite,
            vm = this.getViewModel(),
            isTile = !sprite.tile,
            activePiece = vm.get('activePiece');

        if (!isTile || !activePiece || this === activePiece.tile) {
            return;
        }

        if (sprite.getStatus() === 'highlighted') {
            sprite.highlight(false);
        }
    },

    movePieceToTile: function(piece, tile) {
        var pieceInBetween = piece.pieceInBetween,
            matrix = new Ext.draw.Matrix();

        if (pieceInBetween) {
            this.clearTile(pieceInBetween.tile);
            pieceInBetween.destroy();
            piece.pieceInBetween = null;
        }

        piece.tile.setPiece(null);

        piece.setAnimation({
            duration: 500,
            easing: 'ease'
        });
        Ext.defer(function() {
            piece.setAttributes({
                cx: tile.x + 48,
                cy: tile.y + 48
            });
        }, 20);

        tile.setPiece(piece);
        piece.activate(false);
        tile.highlight(false);
        matrix.destroy();
    },

    pieceHasAdditionalMoves: function (piece) {
        return false;
    },

    validateMove: function(piece, tile) {
        var piecePosition = piece.tile.position,
            tilePosition = tile.position, 
            xDelta = piecePosition.x - tilePosition.x, 
            yDelta = piecePosition.y - tilePosition.y,
            direction = piece.type === 'clear' ? 1 : -1,
            pieceInBetween;

        // Moving a single step forward
        if ((xDelta === 1 || xDelta === -1) && yDelta === (1 * direction)) {
            return true;
        } else if (Math.abs(xDelta) === 2 && yDelta === (2 * direction)) {
            pieceInBetween = this.getPieceAt(piecePosition.x - (xDelta/2), piecePosition.y - (yDelta/2));
            if (pieceInBetween && pieceInBetween.type !== piece.type) {
                piece.pieceInBetween = pieceInBetween;
                return true;
            }
        }
        
        return false;
    }, 

    getPieceAt: function (x, y) {
        var tile = this.getTileAt(x, y);

        if (tile) {
            return tile.getPiece();
        }
    },

    getTileAt: function (x, y) {
        var vm = this.getViewModel(),
            tileMap = vm.get('tileMap');

        if (tileMap && tileMap[x] && tileMap[x][y]) {
            return tileMap[x][y];
        }
        return false;
    },

    beforePieceDestroy: function(piece) {
        var vm = this.getViewModel(),
            parentVM = vm.getParent(),
            totalPieces = parentVM.get(piece.type + 'Pieces');
        if (piece.restarting) {
            return true;
        }

        parentVM.set(piece.type + 'Pieces', --totalPieces);

        if (totalPieces === 0) {
            this.gameOver(piece.type === 'clear' ? 'dark' : 'clear');
        }
    },

    gameOver: function(winner) {
        Ext.Msg.alert('Game Over', winner + ' won the game!');
    },

    restartGame: function() {
        var vm = this.getViewModel(),
            types = vm.get('types');

        this.wipeBoardPieces(types);
        this.resetBoardTiles(null);

        this.getView().getSurface().renderFrame();

        this.createInitialPieces();
        this.renderPieces(types);

        this.getView().getSurface().renderFrame();

        this.resetGameStats();
    },

    resetGameStats: function() {
        var vm = this.getViewModel(),
            parentVM = vm.getParent();

        parentVM.set({
            turn: 'clear',
            gameTime: null,
            clearMoves: 0,
            darkMoves: 0,
            clearPieces: 12,
            darkPieces: 12
        });
    },

    wipeBoardPieces: function(types) {
        var vm = this.getViewModel(),
            i, j, pieces;

        for (i = 0; i < types.length; i++) {
            if ((pieces = vm.get(types[i] + 'Pieces'))) {
                if (pieces.length) {
                    for (j = 0; j < pieces.length; j++) {
                        pieces[j].restarting = true;
                        pieces[j].destroy();
                    }
                }
                vm.set(types[i] + 'Pieces', []);
            }
        }
    },

    actionForEachTile: function(action, darkOnly, skipMidSection) {
        var vm = this.getViewModel(),
            tileMap = vm.get('tileMap'), 
            counter = 0,
            i, j;

        for (i = 0; i < tileMap.length; i++) {
            if (skipMidSection && i > 2 && i < 5) {
                continue;
            }
            for (j = 0; j < tileMap[i].length; j++) {
                if (darkOnly && tileMap[j][i].type === 'clear') {
                    continue;
                }
                action(this.getTileAt(j, i), counter++);
            }
        }
    },

    resetBoardTiles: function (positionMap) {
        if (!positionMap) {
            this.actionForEachTile(function(tile) {
                if (tile.getStatus()) {
                    tile.setPiece(null);
                }
            });
        }
    }
});