
function makeBoxEdit ( toolname ) {
	var BOXEDIT = {
		current_rect_topleft 	: [],
		current_rect_size 		: [],
		rectdata 				: [],
		current_rect_size 		: 0,
		tmp 					: [0,0],

		"init" : function() {

		},

		"mouseDownListener" : function(x,y) {
			this.current_rect_topleft = [x,y];
			this.tmp = [0,0];
		},
		"mouseUpListener" : function(x,y) {
			var min = [ Math.min(this.current_rect_topleft[0], x), Math.min(this.current_rect_topleft[1], y) ];
			var max = [ Math.max(this.current_rect_topleft[0], x), Math.max(this.current_rect_topleft[1], y) ];
			this.current_rect_size = [max[0] - min[0], max[1] - min[1]];
			this.rectdata.push([min, this.current_rect_size]);
			current_rect_topleft = null;
			this.tmp = null;
		},
		"mouseMoveListener" : function(x,y) {
			if( this.tmp != null )
			{
				this.tmp[0] = x - this.current_rect_topleft[0];
				this.tmp[1] = y - this.current_rect_topleft[1];
			}
		},
		"render" : function(ctx) {
			for( var i = 0; i < this.rectdata.length; i++ )
			{
				r = this.rectdata[i];
				ctx.strokeStyle = "rgba(0,0,255,255)";
				ctx.strokeRect(r[0][0], r[0][1], r[1][0], r[1][1]);
				ctx.strokeRect(r[0][0], r[0][1], r[1][0], r[1][1]);
				ctx.strokeRect(r[0][0], r[0][1], r[1][0], r[1][1]);
			}

			if( this.current_rect_topleft != null && this.tmp != null )
			{
				ctx.strokeStyle = "rgba(255,0,0,255)";
				ctx.strokeRect(this.current_rect_topleft[0], this.current_rect_topleft[1], this.tmp[0], this.tmp[1]);
				ctx.strokeRect(this.current_rect_topleft[0], this.current_rect_topleft[1], this.tmp[0], this.tmp[1]);
				ctx.strokeRect(this.current_rect_topleft[0], this.current_rect_topleft[1], this.tmp[0], this.tmp[1]);
			}
		},
	};
	return BOXEDIT;
}
