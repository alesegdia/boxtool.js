
function makePointEdit()
{
	var POINTEDIT = {
		selected_point_index : null,
		named_points : [],

		"mouseDownListener" : function(x,y) {
			console.log("DOWN!");
			this.named_points.push({
				data : [x,y],
				name : "point" + this.named_points.length
			});
			console.log(this.named_points.length);
			var point_num = this.named_points.length - 1;
			var is_selected = this.named_points.length == 0 ? "selected" : "";
			$("#point-selector").append(
					"<option " + is_selected + " value='" + point_num + "'>" +
						this.named_points[point_num].name + " (" + this.named_points[point_num].data[0] + "," + this.named_points[point_num].data[1] + ")" +
					"</option>");
			this.selectPoint();
		},
		"mouseUpListener" : function(x,y) { },
		"mouseMoveListener" : function(x,y) { },

		selectPoint : function() {
			this.selected_point_index = $("#point-selector").val();
			console.log(this.selected_point_index);
			console.log("bleh");
			$("#point-name").val(this.named_points[this.selected_point_index].name);
		},

		pointNameChanged : function()
		{
			var point = this.named_points[selected_point_index];
			point.name = $("#point-name").val();
			$('#point-selector>option:selected').text(point.name + " (" + point.data[0] + "," + point.data[1] + ")");
		},

		render : function(ctx)
		{
			for( var i = 0; i < this.named_points.length; i++ )
			{
				ctx.fillStyle = "rgba(0,127,0,255)";
				var point = this.named_points[i];
				ctx.fillRect(point.data[0]-4, point.data[1]-4,8,8);
				ctx.fillText(point.name, point.data[0]+8, point.data[1]+4);
			}

			if( this.selected_point_index != null )
			{
				ctx.fillStyle = "rgb(255,0,255)";
				var point = this.named_points[this.selected_point_index];
				ctx.fillRect(point.data[0]-4, point.data[1]-4,8,8);
				ctx.fillText(point.name, point.data[0]+8, point.data[1]+4);
			}
		},

	};
	return POINTEDIT;
}
