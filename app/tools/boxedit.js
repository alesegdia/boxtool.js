
function makeBoxEdit () {
	var BOXEDIT = {

		current_frame : 0,
		framesData : [],
		currentFrameData : undefined,

		"newFrameData" : function()
		{
			var frameData = {
				current_rect_topleft 	: [],
				current_rect_size 		: [],
				rectdata 				: [],
				current_rect_size 		: 0,
				tmp 					: [0,0],
			};
			return frameData;
		},

		"frameChanged" : function(new_frame) {
			this.current_frame = new_frame;
			if( this.framesData[new_frame] == undefined )
			{
				this.framesData[new_frame] = this.newFrameData();
			}
			this.currentFrameData = this.framesData[new_frame];
		},

		"init" : function (toolname) {

		},

		"mouseDownListener" : function(x,y) {
			this.currentFrameData.current_rect_topleft = [x,y];
			this.currentFrameData.tmp = [0,0];
		},
		"mouseUpListener" : function(x,y) {
			var min = [ Math.min(this.currentFrameData.current_rect_topleft[0], x), Math.min(this.currentFrameData.current_rect_topleft[1], y) ];
			var max = [ Math.max(this.currentFrameData.current_rect_topleft[0], x), Math.max(this.currentFrameData.current_rect_topleft[1], y) ];
			this.currentFrameData.current_rect_size = [max[0] - min[0], max[1] - min[1]];
			this.currentFrameData.rectdata.push([min, this.currentFrameData.current_rect_size]);
			this.currentFrameData.current_rect_topleft = null;
			this.currentFrameData.tmp = null;
		},
		"mouseMoveListener" : function(x,y) {
			if( this.currentFrameData.tmp != null )
			{
				this.currentFrameData.tmp[0] = x - this.currentFrameData.current_rect_topleft[0];
				this.currentFrameData.tmp[1] = y - this.currentFrameData.current_rect_topleft[1];
			}
		},
		"render" : function(ctx) {
			for( var i = 0; i < this.currentFrameData.rectdata.length; i++ )
			{
				r = this.currentFrameData.rectdata[i];
				ctx.strokeStyle = "rgba(0,0,255,255)";
				ctx.strokeRect(r[0][0], r[0][1], r[1][0], r[1][1]);
				ctx.strokeRect(r[0][0], r[0][1], r[1][0], r[1][1]);
				ctx.strokeRect(r[0][0], r[0][1], r[1][0], r[1][1]);
			}

			if( this.currentFrameData.current_rect_topleft != null && this.currentFrameData.tmp != null )
			{
				ctx.strokeStyle = "rgba(255,0,0,255)";
				ctx.strokeRect(this.currentFrameData.current_rect_topleft[0], this.currentFrameData.current_rect_topleft[1], this.currentFrameData.tmp[0], this.currentFrameData.tmp[1]);
				ctx.strokeRect(this.currentFrameData.current_rect_topleft[0], this.currentFrameData.current_rect_topleft[1], this.currentFrameData.tmp[0], this.currentFrameData.tmp[1]);
				ctx.strokeRect(this.currentFrameData.current_rect_topleft[0], this.currentFrameData.current_rect_topleft[1], this.currentFrameData.tmp[0], this.currentFrameData.tmp[1]);
			}
		},
	};
	return BOXEDIT;
}
