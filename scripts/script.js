/*
 *
 *  Bejeweled by Bernardo Mariano - 2013, Brazil.
 *
 */


const COL_MAX = 9;
const ROW_MAX = 9;

const GRID = '#grid';

const ELEMS = GRID + ' div';
const ELEM_SIZE = 30; //pixels
const ELEM_MARGIN = 7; // pixels

const GRID_COL = (COL_MAX * ELEM_MARGIN) + (COL_MAX * ELEM_SIZE) + ELEM_MARGIN;
const GRID_ROW = (ROW_MAX * ELEM_MARGIN) + (ROW_MAX * ELEM_SIZE) + ELEM_MARGIN;

const COLORS = ['red', 'green', 'blue', 'yellow', 'gray'];

const FALL_SPEED = 300;

$(function(){
    //'use strict';
    Elem = function (color, col, row) {
        this.dom   = this.createDomElem(color, col, row);
        this.color = color;
    }

    Elem.prototype.createDomElem = function (color, col, row) {
        return $('<div class="'+ COLORS[color] +'"> '+col+','+row+' </div>');
    }

    Elem.prototype.appendToGrid = function (col, row) {
        this.dom.css({
            left: (col - 1) * ELEM_SIZE + (col * ELEM_MARGIN),
            top: (row - 1) * ELEM_SIZE + (row * ELEM_MARGIN)
        });
        this.dom.appendTo($(GRID));
    }

    Elem.prototype.mark = function () {
        this.dom.html('x');
    }

    Elem.prototype.pop = function (col, row) {
        this.dom.animate({
            opacity: 0,
            width: 0,
            height: 0,
            left: (col * ELEM_SIZE + col * ELEM_MARGIN) - ELEM_SIZE/2,
            top: (row * ELEM_SIZE + row * ELEM_MARGIN) - ELEM_SIZE/2
        }, FALL_SPEED, function () {
            $(this).remove();
        });
    }

    Elem.prototype.fall = function (count) {
        var count = count || 1;
        this.dom.animate({
            top: ['+='+ (ELEM_SIZE + ELEM_MARGIN) * count +'px', 'easeOutBounce']
        }, FALL_SPEED * 3);
    }

    Bejeweled = {
        init: function () {
            this.grid   = [];

            this.prepareElems();
            this.createGrid();

            var self = this;
            setTimeout(function () {
                self.popColumn(6,4,6);
            }, 1000);
            // this._checkEntireGrid();
        },

        prepareElems: function () {
            for (var col = 1; col <= COL_MAX; col++) {
                this.grid[col] = [];
                for (var row = 1; row <= ROW_MAX; row++) {
                    var color = this.randomColor();

                    if ((col >= 3 && this._rowHasEquals(color, col, row)) ||
                        (row >= 3 && this._colHasEquals(color, col, row))) {
                        row--;
                    } else {
                        this.grid[col][row] = new Elem(color, col, row);
                        this.getElem(col, row).appendToGrid(col, row);
                    }
                }
            }
            $(ELEMS).css({
                width: ELEM_SIZE,
                height: ELEM_SIZE
            });
        },

        prepareOneElem: function (col, row, order) {
            var color = this.randomColor();

            this.grid[col][row] = new Elem(color, col, row);

            this.getElem(col, row).dom.css (
                {
                    width: ELEM_SIZE,
                    height: ELEM_SIZE,
                    left: (col - 1) * ELEM_SIZE + (col * ELEM_MARGIN),
                    top: order * (ELEM_SIZE + ELEM_MARGIN) * -1 + ELEM_MARGIN
                }
            ).appendTo($(GRID));
        },

        createGrid: function () {
            $(GRID).css({
                width: GRID_COL,
                height: GRID_ROW
            });
        },

        randomColor: function () {
            return Math.floor(Math.random() * COLORS.length);
        },
        
        getElem: function (col, row) {
            return this.grid[col][row];
        },

        _rowHasEquals: function (color, col_index, row) {
            var elem, count = 1;
            for (var col = col_index-1; col >= 1; col--) {
                elem = this.getElem(col, row);
                if (elem.color == color) {
                    count++;
                    if (count === 3) {
                        return true;
                    }
                } else {
                    return false;
                }
            }
        },

        _colHasEquals: function (color, col, row_index) {
            var elem, count = 1;
            for (var row = row_index-1; row >= 1; row--) {
                elem = this.getElem(col, row);
                if (elem.color == color) {
                    count++;
                    if (count === 3) {
                        return true;
                    }
                } else {
                    return false;
                }
            }
        },

        _checkEntireGrid: function () {
            this.getColsEquals();
            //this.getRowEquals();
        },

        getColsEquals: function () {
            var elem, elemColor, currentColor, count = 1, row_start, row_end;
            for (var col = 1; col <= COL_MAX; col++) {
                if (count >= 3) {
                    row_end = ROW_MAX;
                    console.log('Found equals on col '+(col-1)+', from row '+row_start+' to '+row_end);
                    var self = this;
                    self.popColumn(col, row_start, row_end);
                }
                currentColor = -1;
                count = 1;
                for (var row = 1; row <= ROW_MAX; row++) {
                    elem = this.getElem(col, row) || 0;
                    elemColor = elem.color || -1;
                    if (elemColor == currentColor) {
                        if (count == 1) {
                            row_start = row - 1;
                        }
                        count++;
                    } else {
                        if (count >= 3) {
                            row_end = row - 1;
                            console.log('Found equals on col '+col+', from row '+row_start+' to '+row_end);
                            var self = this;
                            self.popColumn(col, row_start, row_end);
                        }
                        count = 1;
                        currentColor = elemColor;
                    }
                }
            }
        },

        updatePosElem: function (elem, col, row) {
            this.grid[col][row] = elem;
        },

        popColumn: function (col, row_start, row_end) {
            var self = this,
                count = 1 + row_end - row_start,
                order = 1;
            for (var row = row_end; row >= row_start; row--) {
                console.log('popping '+col,row);
                this.getElem(col, row).pop(col, row);
            }
            console.log('');
            if (row_start == 1) {
                for (var row = row_end; row >= 1; row--) {
                    self.prepareOneElem(col, row, order++);
                }
            } else {
                for (var row = row_end-count; row >= 1; row--) {
                    var elem = this.getElem(col, row);
                    this.updatePosElem(elem, col, row+count);
                    console.log('updating elem pos from '+col,row+' to '+col,row+count);
                }

                console.log('');
                console.log('creating elem on col '+col+', from '+(row_start-1)+' to 1...');
                for (var row = count; row >= 1; row--) {
                    self.prepareOneElem(col, row, order++);
                    console.log('created '+col, row);
                }
            }
            console.log('');
            console.log('falling col '+col+', from row '+row_end+' to 1');
            this.fallColumn(col, row_end, count);
        },

        fallColumn: function (col, row_end, count) {
            var self = this;
            setTimeout(function () {
                for (var row = 1; row <= row_end; row++) {
                    self.getElem(col, row).fall(count);
                }
                setTimeout(function () {
                    console.log('');
                    console.log('reChecking entire grid...');
                    self._checkEntireGrid();
                }, FALL_SPEED * 3);
            }, FALL_SPEED / 2);
        }
    };

});