$(document).ready(function(){

	// chose an object to hold all values
	const shapeEditor = {
		selected: {
			id: ""
		},
		knobs:{
			rotate:{

			},
			radius:{

			}
		},
		dpad:[{
			trans: "transX",
			operator: function(a, b, selected){
				if(selected.transX < 99){
					return a + b;
				} else {
					return selected.transX = 99;
				};
			},
			id: "buttonRight"
		},{
			trans: "transX",
			operator: function(a, b, selected){
				if(selected.transX > 0){
					return a - b;
				} else {
					return selected.transX = 0;
				};
			},
			id: "buttonLeft"
		},{
			trans: "transY",
			operator: function(a, b, selected){
				if(selected.transY > 1){
					return a - b;
				} else {
					return selected.transY = 1;
				};
			},
			id: "buttonUp"
		},{
			trans: "transY",
			operator: function(a, b, selected){
				if(selected.transY < 99){
					return a + b;
				} else {
					return selected.transY = 99;
				};
			},
			id: "buttonDown"
		}],
		scaleBtn:[{
			scale: "scaleX",
			operator: function(a, b, selected){
				if(selected.scaleX > 1){
					return a - b;
				} else {
					return selected.scaleX = 1;
				};
			},
			id: "scale_xDown"
		},{
			scale: "scaleX",
			operator: function(a, b, selected){
				if(selected.scaleX < 100){
					return a + b;
				} else {
					return selected.scaleX = 100;
				};
			},
			id: "scale_xUp"
		},{
			scale: "scaleY",
			operator: function(a, b, selected){
				if(selected.scaleY > 1){
					return a - b;
				} else {
					return selected.scaleY = 1;
				};
			},
			id: "scale_yDown"
		},{
			scale: "scaleY",
			operator: function(a, b, selected){
				if(selected.scaleY < 100){
					return a + b;
				} else {
					return selected.scaleY = 100;
				};
			},
			id: "scale_yUp"
		}],
		shapes: [],
		shapeDefault: {
			name: "New Shape",
	        scaleX: 33,
	        scaleY: 33,
	        transX: 33,
	        transY: 33,
	        rotate: 0,
	        radius: 0,
	        color: "#00F",
		},
	};
	
	// add object to shape array
	$("#addShape").on("click",function(){
		// add new shape to shapes array
		addShape(shapeEditor, shapeEditor["shapeDefault"]);
		// update shapes in display window
		renderShapes(shapeEditor["shapes"]);
		// update shapes info section
		renderShapeInfo(shapeEditor["shapes"], shapeEditor["selected"]);
		// clear input text field
		$("#shapeName").val("");
	});

	// removes an object from shape array
	$("#removeShape").on("click", function(){
		// remove shape from shapes array
		removeShape(shapeEditor["shapes"], shapeEditor["selected"])
		// update shapes in display window
		renderShapes(shapeEditor["shapes"]);
		// update shapes info section
		renderShapeInfo(shapeEditor["shapes"], shapeEditor["selected"]);
		// re-assign checkbox true to object ahead of removes object
	});

	// event listener for info window checkbox selection
	$("#infoWindow").on("mousedown", "input", function(){
		// get id from selected checkbox
		const $clicked = $(this).attr("id");
		// set selected shape
		const selectedShape = getSelectedShape(shapeEditor["shapes"], $clicked);
		shapeEditor["selected"]["id"] = selectedShape["id"];
		// set checkbox value of selected shape
		setSelectedCheckbox(shapeEditor["shapes"], $clicked);
		// update shape info section
		renderShapeInfo(shapeEditor["shapes"], shapeEditor["selected"]);
	});

	// copy and add an object
	$("#copyShape").on("click", function(){
		// get item selected for copy
		const selectedShape = getSelectedShape(shapeEditor["shapes"], shapeEditor["selected"]["id"]);
		// add item with selected shape's values
		addShape(shapeEditor, selectedShape);
		// update shapes in display window
		renderShapes(shapeEditor["shapes"]);
		// update shapes info section
		renderShapeInfo(shapeEditor["shapes"], shapeEditor["selected"]);
	});

	// change color of selected shape
	$("#shapeColor").on("input", function(){
		// get selected shape
		const selectedShape = getSelectedShape(shapeEditor["shapes"], shapeEditor["selected"]["id"]);
		// update shape color value
		selectedShape["color"] = $(this).val();
		// render shape with new color
		renderShapes(shapeEditor["shapes"]);
	});

	// change position of selected shape
	$(".dpad_button").on("click", function(){
		// get selected shape
		const selected = getSelectedShape(shapeEditor["shapes"], shapeEditor["selected"]["id"]);
		// get button id
		const $button = `${$(this).attr("id")}`
		// get translate button object
		const move = shapeEditor["dpad"].find(function(item){
			return item["id"] === $button;
		});
		// manipulte location of selected shape
		selected[move["trans"]] = move.operator(selected[move["trans"]], 3, selected);
		// Render shapes in display window
		renderShapes(shapeEditor["shapes"]);

	});

	// change scale of selected shape
	$(".circleBtn_cap").on("click", function(){
		// get selected shape
		const selected = getSelectedShape(shapeEditor["shapes"], shapeEditor["selected"]["id"]);
		// get button id
		const $button = `${$(this).attr("id")}`;
		// get scale button object
		const size = shapeEditor["scaleBtn"].find(function(item){
			return item["id"] === $button;
		});
		// manipulate size of selected shape
		selected[size["scale"]] = size.operator(selected[size["scale"]], 3, selected);
		// render shapes in display window
		renderShapes(shapeEditor["shapes"]);
	});

	const addShape = function(shapeEditor, shapeValue){

		// create unique id for shape identification within program
		const shapeID = uniqueID();

		shapeEditor["shapes"].push({
			id: shapeID,
	        name:  getShapeName(shapeValue["name"]),
	        checkbox: true,
	        scaleX: shapeValue["scaleX"],
	        scaleY: shapeValue["scaleY"],
	        transX: shapeValue["transX"],
	        transY: shapeValue["transY"],
	        rotate: shapeValue["rotate"],
	        radius: shapeValue["radius"],
	        color: shapeValue["color"]
		});

		// set newly created shape id to selected.id
		shapeEditor["selected"]["id"] = shapeID;
		setSelectedCheckbox(shapeEditor["shapes"], shapeEditor["selected"]["id"]);
	};

	const removeShape = function(shapes, selected){

		// get shape index
		const index = shapes.findIndex(function(shape){
			return shape.id === selected.id
		});
		// use index to splice object from shapes array
		if(index > -1){
			shapes.splice(index, 1);
		};
	};

	// Assign name to newly created shape
	const getShapeName = function(defaultName){

		const $shapeName = $("#shapeName").val()
		// check for user specified name, if false use generic
    	return $shapeName != "" ? $shapeName : defaultName;
	};

	// Allow only one checkbox to show true at a time
	const setSelectedCheckbox = function(shapes, selected){
		// search for shape id that matches selected shape id, set checkbox to true; all else to false
		shapes.forEach(function(shape){
			shape["id"] === selected ? shape["checkbox"] = true : shape["checkbox"] = false;
		});
	};

	// returns selected shape
	const getSelectedShape = function(shapes, selected){
		// find shape id that matches selected shape id, return object to caller
		return shapes.find(function(shape){
			return shape.id === selected;
		});
	};

	// Render shapes in display window
	const renderShapes = function(shapes){

		const $displayWindow = $("#displayWindow")
		// clear displayWindow children
		$displayWindow.empty();
		// create div with object values for each object in shapes array, append to display window
		shapes.forEach(function(shape){

			$("<div/>")
			.css("background-color", `${shape["color"]}`)
			.css("width", `${shape["scaleX"]}%`)
			.css("height", `${shape["scaleY"]}%`)
			.css("transform", `rotate(${shape["rotate"]}deg)`)
			.css("border-radius", `${shape["radius"]}`)
			.css("left", `${shape["transX"]}%`)
			.css("top", `${shape["transY"]}%`)
			.css("position", "absolute")

			.appendTo($displayWindow);
		});
	};

	// Render shape info in info window
	const renderShapeInfo = function(shapes, selected){

		const $infoWindow = $("#infoWindow");
		// clear infoWindow children
		$infoWindow.empty();
		// create div with children elements, checkbox, index, title, append to infoWindow
		shapes.forEach(function(shape, index){

	        const $infoEl = $("<div/>");

	        const $checkbox = $("<input/>").attr("type", "checkbox")
	        					.prop("checked", shape["checkbox"])
	        					.attr("id", shape["id"]);
	        $checkbox.appendTo($infoEl);

	        const $indexEl = $("<span/>").text(`${index + 1 }.`);
	        $indexEl.appendTo($infoEl);

	        const $nameEl = $("<span/>").text(` ${shape["name"]}`);
	        $nameEl.appendTo($infoEl);

	       	$infoEl.appendTo($infoWindow);
	    });
	};

	// Produces random number between caller specific values
	const randomNum = function(min, max){

	    return Math.floor(Math.random() * (max - min) + min);
	};

	// Returns unique 16 character string
	const uniqueID = function(){

	    const numArray = [];
	    const charGroups = [];
	    // create 16 random numbers based on random number generated at beginning of each loop, push to numArray
	    for(a = 0; a < 16; a++){
	        const newNum = randomNum(1, 4);

	        if(newNum === 1){
	            // A - Z
	            numArray.push(randomNum(65, 90));
	        } else if(newNum === 2){
	            // 0 - 9
	            numArray.push(randomNum(48, 57));
	        } else if(newNum === 3){
	            // a - z
	            numArray.push(randomNum(97, 122));
	        }
	    };
	    // create characters out of numbers from numArray
	    const charArray = numArray.map(function(num){
	        return String.fromCharCode(num);
	    });
	    // join into 4 group of 4 character long
	    for(i = 0; i < 4; i++){
	        charGroups.push([charArray.join("").slice((i * 4), (i * 4 + 4))]);
	    };

	    return `${charGroups[0]}-${charGroups[1]}-${charGroups[2]}-${charGroups[3]}`;
	};



}); // END document ready

/*
const knob_rotate = document.querySelector(".knob_cap");

		const knob = {
			name: "rotate",
			active: false,
			outputValue: 0,
			currentY: 0,
			currentX: 0
		};

		// Sets intital Y value of click, sets active to true
		const dragStart = function(){

			if(event.target === knob_rotate){
				knob.active = true;
			};
		};

		// Only fires if active is set to true
		const drag = function(){

			if(knob.active === true){

				if(event.clientY - knob.currentY > 0 && knob.outputValue > -135){
					knob.outputValue -= 5;
				} else if(event.clientY - knob.currentY < 0 && knob.outputValue < 135){
					knob.outputValue += 5;
				} 
				knob.currentY = event.clientY;
			};

			rotateKnob();
		};

		// Saves final value of drag, sets active to false
		const dragEnd = function(){

			knob.active = false
		};

		// Sets knob to rotate based on current value
		const rotateKnob = function(){

			knob_rotate.style.transform = `rotate(${knob.outputValue}deg)`;
		};

		knob_rotate.addEventListener("mousedown", dragStart);

		document.addEventListener("mouseup", dragEnd);

		document.addEventListener("mousemove", drag);
		*/