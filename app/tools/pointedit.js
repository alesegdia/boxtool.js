
var PointTool = (function() {

	var point = function(tool_div, tool_name) {
		Tool.call(this, tool_div, tool_name);
	};

	point.prototype = Object.create(Tool.prototype);
	point.prototype.constructor = point;

	point.prototype.getNameForElement = function(element, num) {
		return "point" + num + "(" + element.coords[0] + "," + element.coords[1] + ")";
	};

	point.prototype.mouseDownListener = function(x,y) {
		this.insertNewElement({ coords : [x,y] });
	};

	point.prototype.mouseUpListener = function(x,y) {
	};

	point.prototype.mouseMoveListener = function(x,y) {
	};

	point.prototype.render = function() {
		for( var i = 0; i < this.currentFrameData.elements.length; i++ )
		{
			ctx.fillStyle = "rgba(0,127,0,255)";
			var point = this.currentFrameData.elements[i].data.coords;
			var name = this.currentFrameData.elements[i].name;
			ctx.fillRect(point[0]-4, point[1]-4,8,8);
			ctx.fillText(name, point[0]+8, point[1]+4);
		}
	};

	return point;

}());

function makePointEdit()
{
	var POINTEDIT = {

		current_frame : 0,
		framesData : [],
		currentFrameData : undefined,
		tool_div : undefined,

		"newFrameData" : function()
		{
			var frameData = {
				selected_point_index : null,
				named_points : [],
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
			this.regenToolbox();
		},

		"regenToolbox" : function()
		{
			$("#point-selector").remove();
			this.tool_div.append("<select id='point-selector'></select>");
			var that = this;
			$("#point-selector").bind("change", function() {
				that.selectPoint();
			});
			for( var i = 0; i < this.currentFrameData.named_points.length; i++ )
			{
				var point = this.currentFrameData.named_points[i];
				var selected = "";
				if( i == 0 )
				{
					selected = "selected='selected'";
				}
				$("#point-selector").append(
						"<option " + selected + " value='" + point.num + "'>" +
							point.name + " (" + point.data[0] + "," + point.data[1] + ")" +
						"</option>");
			}
			this.currentFrameData.selected_point_index = null;
		},

		"init" : function (toolname, tool_div) {
			this.tool_div = $("#" + tool_div);
		},

		"mouseDownListener" : function(x,y) {
			this.currentFrameData.named_points.push({
				data : [x,y],
				name : "point" + this.currentFrameData.named_points.length
			});
			var point_num = this.currentFrameData.named_points.length - 1;
			var is_selected = this.currentFrameData.named_points.length == 0 ? "selected" : "";
			this.currentFrameData.named_points[this.currentFrameData.named_points.length-1].num = point_num;
			$("#point-selector").append(
					"<option " + is_selected + " value='" + point_num + "'>" +
						this.currentFrameData.named_points[point_num].name + " (" + this.currentFrameData.named_points[point_num].data[0] + "," + this.currentFrameData.named_points[point_num].data[1] + ")" +
					"</option>");
			this.selectPoint();
		},
		"mouseUpListener" : function(x,y) { },
		"mouseMoveListener" : function(x,y) { },

		selectPoint : function() {
			this.currentFrameData.selected_point_index = $("#point-selector").val();
			$("#point-name").val(this.currentFrameData.named_points[this.currentFrameData.selected_point_index].name);
		},

		pointNameChanged : function()
		{
			var point = this.named_points[this.currentFrameData.selected_point_index];
			point.name = $("#point-name").val();
			$('#point-selector>option:selected').text(point.name + " (" + point.data[0] + "," + point.data[1] + ")");
		},

		render : function(ctx)
		{
			for( var i = 0; i < this.currentFrameData.named_points.length; i++ )
			{
				ctx.fillStyle = "rgba(0,127,0,255)";
				var point = this.currentFrameData.named_points[i];
				ctx.fillRect(point.data[0]-4, point.data[1]-4,8,8);
				ctx.fillText(point.name, point.data[0]+8, point.data[1]+4);
			}

			if( this.currentFrameData.selected_point_index != null )
			{
				ctx.fillStyle = "rgb(255,0,255)";
				var point = this.currentFrameData.named_points[this.currentFrameData.selected_point_index];
				ctx.fillRect(point.data[0]-4, point.data[1]-4,8,8);
				ctx.fillText(point.name, point.data[0]+8, point.data[1]+4);
			}
		},

	};
	return POINTEDIT;
}
