
var Tool = (function() {

	var tool = function(tool_div, tool_name, element_base_name) {
		this.toolDiv = $("#" + tool_div);
		this.toolName = tool_name;
		this.elementBaseName = element_base_name;
		this.toolSelectorID = tool_name + "-selector";
		this.toolEditorID = tool_name + "-editor";
		this.currentFrame = 0;
		this.framesData = [];
		this.currentFrameData = undefined;
	};

	tool.prototype.getToolSelector = function() {
		return $("#" + this.toolSelectorID);
	};

	tool.prototype.getToolEditor = function() {
		return $("#" + this.toolEditorID);
	};

	tool.prototype.clearFrameData = function() {

	};

	tool.prototype.insertNewElement = function(the_data) {
		var element_num = this.currentFrameData.elements.length;
		var obj = {
			data : the_data,
			name : this.getNameForElement(the_data, element_num),
			num : element_num
		};
		this.currentFrameData.elements.push(obj);
		this.appendElementOption(obj);
	};

	tool.prototype.appendElementOption = function(element) {
		this.getToolSelector().append("<option " + "value='" + element.num + "'>" + element.name + "</option>");
	};

	tool.prototype.frameChanged = function(new_frame) {
		this.currentFrame = new_frame;
		if( this.framesData[new_frame] == undefined ) {
			this.framesData[new_frame] = this.newFrameData();
		}
		this.currentFrameData = this.framesData[new_frame];
		this.createSelect();
	};

	tool.prototype.newFrameData = function() {
		var frameData = {
			selectedElementIndex : null,
			elements : [],
		};
		return frameData;
	};

	tool.prototype.createSelect = function() {
		// delete previous selector if any
		this.getToolSelector().remove();
		this.getToolEditor().remove();

		// create new selector
		this.toolDiv.append("<select id='" + this.toolSelectorID + "'></select>");
		this.toolDiv.append("<input type='text' id='" + this.toolEditorID + "' />");

		// bind 'onchange' event to this.selectPoint()
		var that = this;
		this.getToolSelector().bind("change", function() {
			console.log(that.getToolSelector().val());
			that.currentFrameData.selectedElementIndex = that.getToolSelector().val();
			that.getToolEditor().val(that.currentFrameData.elements[that.currentFrameData.selectedElementIndex].name);
		});
		this.getToolEditor().bind("keyup", function() {
			console.log(that.currentFrameData.selectedElementIndex);
			if( that.currentFrameData.selectedElementIndex != null ) {
				that.currentFrameData.elements[that.currentFrameData.selectedElementIndex].name = that.getToolEditor().val();
				$("#" + that.toolSelectorID + " option[value='" + that.currentFrameData.selectedElementIndex + "']").html( that.getToolEditor().val() );
			}
		});

		for( var i = 0; i < this.currentFrameData.elements.length; i++ )
		{
			var element = this.currentFrameData.elements[i];
			var selected = "";
			if( i == 0 ) selected = "selected='selected'";
			var value = element.num;
			var name = element.name;
			this.getToolSelector().append("<option " + selected + " value='" + value + "'>" + name + "</option>");
		}
	};

	tool.prototype.getValueForElement = function(element) {
		throw new Error("getValueForElement not implemented!");
	}

	tool.prototype.getNameForElement = function(element) {
		throw new Error("getNameForElement not implemented!");
	}

	tool.prototype.selectElement = function() {
		this.getToolSelector().val(this.currentFrameData.elements[this.currentFrameData.selectedElementIndex].name);
	};

	return tool;

}());

