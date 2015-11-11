
var BoxTool = (function() {

	var box = function(tool_div, tool_name) {
		Tool.call(this, tool_div, tool_name);
	};

	box.prototype = Object.create(Tool.prototype);
	box.prototype.constructor = box;

	box.prototype.createFrameUserData = function() {
		return {
			currentRectTL : [],
			currentRectSize : [],
			tmp : [ 0, 0 ],
		};
	};

	box.prototype.getNameForElement = function(element, num) {
		return "box" + num;
	};

	box.prototype.mouseDownListener = function(x,y) {
		this.currentFrameData.userdata.currentRectTL = [ x, y ];
		this.currentFrameData.userdata.tmp = [ 0, 0 ];
	};

	box.prototype.mouseUpListener = function(x,y) {
		var min = [
			Math.min(this.currentFrameData.userdata.currentRectTL[0], x),
			Math.min(this.currentFrameData.userdata.currentRectTL[1], y) ];
		var max = [
			Math.max(this.currentFrameData.userdata.currentRectTL[0], x),
			Math.max(this.currentFrameData.userdata.currentRectTL[1], y) ];
		this.currentFrameData.currentRectSize = [max[0] - min[0], max[1] - min[1]];
		this.insertNewElement({ pos: min, size: this.currentFrameData.currentRectSize });
		this.currentFrameData.userdata.currentRectTL = null;
		this.currentFrameData.userdata.tmp = null;
	};

	box.prototype.mouseMoveListener = function(x,y) {
		if( this.currentFrameData.userdata.tmp != null )
		{
			this.currentFrameData.userdata.tmp[0] = x - this.currentFrameData.userdata.currentRectTL[0];
			this.currentFrameData.userdata.tmp[1] = y - this.currentFrameData.userdata.currentRectTL[1];
		}
	};

	box.prototype.render = function(x,y) {
		for( var i = 0; i < this.currentFrameData.elements.length; i++ )
		{
			var r = this.currentFrameData.elements[i].data;
			ctx.strokeStyle = "rgba(0,0,255,255)";
			ctx.strokeRect(r.pos[0], r.pos[1], r.size[0], r.size[1]);
		}

		if( this.currentFrameData.userdata.currentRectTL != null && this.currentFrameData.userdata.tmp != null )
		{
			var pos = this.currentFrameData.userdata.currentRectTL;
			var size = this.currentFrameData.userdata.tmp;
			ctx.strokeStyle = "rgba(255,0,0,255)";
			ctx.strokeRect(pos[0], pos[1], size[0], size[1]);
		}
	};

	return box;

}());

