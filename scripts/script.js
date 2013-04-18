/*
 *
 *  Bejeweled by Bernardo Mariano - 2013, Brazil.
 *
 */


const COL_MAX = 10;
const ROW_MAX = 10;

const GRID = '#grid';

const ELEMS = GRID + ' div';
const ELEM_SIZE = 45; //pixels
const ELEM_MARGIN = 15; // pixels

const GRID_COL = (COL_MAX * ELEM_MARGIN) + (COL_MAX * ELEM_SIZE) + ELEM_MARGIN;
const GRID_ROW = (ROW_MAX * ELEM_MARGIN) + (ROW_MAX * ELEM_SIZE) + ELEM_MARGIN;

const FALL_SPEED = 300;

$(function(){
    //'use strict';
    Elem = function (dom, color) {
        this.dom   = dom; 
        this.color = color;
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
        delete this;
    }

    Elem.prototype.fall = function (count) {
        var count = count || 1;
        this.dom.animate({
            top: ['+='+ (ELEM_SIZE + ELEM_MARGIN) * count +'px', 'easeOutBounce']
        }, FALL_SPEED * 3);
    }

    Bejeweled = {
        init: function () {
            this.colors = ['', 'red', 'green', 'blue', 'yellow', 'gray'];
            this.grid   = [];

            this.prepareElems();
            this.createGrid();

            this.popColumn(6,3,8);
        },

        prepareElems: function () {
            for (var col = 1; col <= COL_MAX; col++) {
                this.grid[col] = [];
                for (var row = 1; row <= ROW_MAX; row++) {
                    var color = this.randomColor(),
                        dom = this.createDomElem(color);

                    if ((col >= 3 && this._rowHasEquals(color, col, row)) ||
                        (row >= 3 && this._colHasEquals(color, col, row))) {
                        row--;
                    } else {
                        this.grid[col][row] = new Elem(dom, color);
                        this.appendToGrid(dom, col, row);
                    }
                }
            }
            $(ELEMS).css({
                width: ELEM_SIZE,
                height: ELEM_SIZE
            });
        },

        prepareOneElem: function (col, row, order) {
            var color = this.randomColor(),
                dom = this.createDomElem(color);

            this.grid[col][row] = new Elem(dom, color);
            dom.css({
                width: ELEM_SIZE,
                height: ELEM_SIZE,
                left: (col - 1) * ELEM_SIZE + (col * ELEM_MARGIN),
                top: order * (ELEM_SIZE + ELEM_MARGIN) * -1 + ELEM_MARGIN
            });
            dom.appendTo($(GRID));
        },

        createGrid: function () {
            $(GRID).css({
                width: GRID_COL,
                height: GRID_ROW
            });
        },

        randomColor: function () {
            return Math.floor(Math.random() * this.colors.length) || this.randomColor();
        },

        createDomElem: function (color) {
            return $('<div class="'+ this.colors[color] +'"></div>');
        },
        
        appendToGrid: function (dom, col, row) {
            dom.css({
                left: (col - 1) * ELEM_SIZE + (col * ELEM_MARGIN),
                top: (row - 1) * ELEM_SIZE + (row * ELEM_MARGIN)
            });
            dom.appendTo($(GRID));
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
            for (var col = 1; col <= COL_MAX; col++) {
                for (var row = 1; row <= ROW_MAX; row++) {
                }
            }
        },

        popColumn: function (col, row_start, row_end) {
            var self = this,
                count = 1 + row_end - row_start,
                order = 1;
            for (var row = row_start; row <= row_end; row++) {
                this.getElem(col, row).pop(col, row);
                self.prepareOneElem(col, row, order++);
            }
            this.fallColumn(col, row_end, count);
        },

        fallColumn: function (col, row_start, count) {
            var self = this;
            setTimeout(function () {
                for (var row = 1; row <= row_start; row++) {
                    self.getElem(col, row).fall(count);
                }
            }, FALL_SPEED / 2);
        }
    };

});