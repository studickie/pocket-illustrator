$(document).ready(function(){

	// chose an object to hold all values
	const shapeEditor = {
		selected: {
			id: ""
		},
		knobs:[{
				id: "rotate",
				active: false,
				outputValue: 0,
				currentY: 0,
				maxMin: 135
			},{
				id: "radius",
				active: false,
				outputValue: 0,
				currentY: 0,
				maxMin: 50
			}
		],
		dpad:[{
				trans: "transX",
				operator: function(a, b, selected){
					if(selected < 99){
						return a + b;
					} else {
						return 99;
					};
				},
				id: "buttonRight",
				pressed: "buttonRight_pressed"
			},{
				trans: "transX",
				operator: function(a, b, selected){
					if(selected > 0){
						return a - b;
					} else {
						return 0;
					};
				},
				id: "buttonLeft",
				pressed: "buttonLeft_pressed"
			},{
				trans: "transY",
				operator: function(a, b, selected){
					if(selected > 1){
						return a - b;
					} else {
						return 1;
					};
				},
				id: "buttonUp",
				pressed: "buttonUp_pressed"
			},{
				trans: "transY",
				operator: function(a, b, selected){
					if(selected < 99){
						return a + b;
					} else {
						return 99;
					};
				},
				id: "buttonDown",
				pressed: "buttonDown_pressed"
			}
		],
		scaleBtn:[{
				scale: "scaleX",
				operator: function(a, b, selected){
					if(selected.scaleX > 1){
						return a - b;
					} else {
						return 1;
					};
				},
				id: "scale_xDown",
				pressed: "scale_xDown_pressed"
			},{
				scale: "scaleX",
				operator: function(a, b, selected){
					if(selected.scaleX < 100){
						return a + b;
					} else {
						return 100;
					};
				},
				id: "scale_xUp",
				pressed: "scale_xUp_pressed"
			},{
				scale: "scaleY",
				operator: function(a, b, selected){
					if(selected.scaleY > 1){
						return a - b;
					} else {
						return 1;
					};
				},
				id: "scale_yDown",
				pressed: "scale_yDown_pressed"
			},{
				scale: "scaleY",
				operator: function(a, b, selected){
					if(selected.scaleY < 100){
						return a + b;
					} else {
						return 100;
					};
				},
				id: "scale_yUp",
				pressed: "scale_yUp_pressed"
			}
		],
		shapes: [],
		shapeDefault: {
			name: "New Shape",
	        scaleX: 33,
	        scaleY: 33,
	        transX: 33,
	        transY: 33,
	        rotate: 0,
	        radius: -135,
	        color: "#0000FF",
		},
	};
	
	// add shaoe to display window
	$("#addShape").on("click",function(){
		// add new shape to shapes array
		addShape(shapeEditor, shapeEditor["shapeDefault"]);
		// update shapes in display window
		renderShapes(shapeEditor["shapes"]);
		// update shapes info section
		renderShapeInfo(shapeEditor["shapes"], shapeEditor["selected"]);
		// set knob values, color to new shape
		setValuesToShape();
		// clear input text field	
		$("#shapeName").val("");
	});

	// add shape on enter keypress
	$(document).on("keypress", function(){
		// determine which key has been pressed
		if(event.which === 13){
			// add new shape to shapes array
			addShape(shapeEditor, shapeEditor["shapeDefault"]);
			// update shapes in display window
			renderShapes(shapeEditor["shapes"]);
			// update shapes info section
			renderShapeInfo(shapeEditor["shapes"], shapeEditor["selected"]);
			// set knob values, color to new shape
			setValuesToShape();
			// clear input text field	
			$("#shapeName").val("");
		};
	});

	// remove shape from display window
	$("#removeShape").on("click", function(){
		// remove shape from shapes array
		removeShape(shapeEditor["shapes"], shapeEditor["selected"])
		// re-assign checkbox true to another object if object is not last
		reassignCheckbox();
		// values of newly selected shape to knobs, color
		const selectedShape = getSelectedShape(shapeEditor["shapes"], shapeEditor["selected"]["id"]);
		setValuesToShape(selectedShape);
		// update shapes in display window
		renderShapes(shapeEditor["shapes"]);
		// update shapes info section
		renderShapeInfo(shapeEditor["shapes"], shapeEditor["selected"]);
	});

	// copy and add a shape
	$("#copyShape").on("click", function(){
		// get item selected for copy
		const selectedShape = getSelectedShape(shapeEditor["shapes"], shapeEditor["selected"]["id"]);
		// add item with selected shape's values
		addShape(shapeEditor, selectedShape);
		// update shapes in display window
		renderShapes(shapeEditor["shapes"]);
		// update shapes info section
		renderShapeInfo(shapeEditor["shapes"], shapeEditor["selected"]);
		// set knob values, color to current shape
		setValuesToShape(selectedShape);
		// clear input text field
		$("#shapeName").val("");
	});

	// set selected shape to checkbox selection
	$("#infoWindow").on("mousedown", "input", function(){
		// get id from selected checkbox
		const $clicked = $(this).attr("id");
		// set selected shape
		const selectedShape = getSelectedShape(shapeEditor["shapes"], $clicked);
		shapeEditor["selected"]["id"] = selectedShape["id"];
		// set checkbox value of selected shape
		setSelectedCheckbox(shapeEditor["shapes"], $clicked);
		// render info section with updated checkbox data
		renderShapeInfo(shapeEditor["shapes"], shapeEditor["selected"]);
		// set knob values, color to current shape
		setValuesToShape(selectedShape);
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

	// change position of selected shape, css of button
	$(".dpad_button").on("mousedown", function(){
		// get selected shape
		const selected = getSelectedShape(shapeEditor["shapes"], shapeEditor["selected"]["id"]);
		// get selected button by id
		const $buttonID = `${$(this).attr("id")}`
		// get translate button object
		const button = getSelectedObject(shapeEditor["dpad"], $buttonID);
		// set button class toggle for graphic change
		$(this).toggleClass($buttonID).toggleClass(`${button["pressed"]}`);
		// update translate value of selected shape
		selected[button["trans"]] = button.operator(selected[button["trans"]], 3, selected[button["trans"]]);
		// Render shapes in display window
		renderShapes(shapeEditor["shapes"]);

	});

	// change css of button
	$(".dpad_button").on("mouseup", function(){
		// get selected button by id
		const $buttonID = `${$(this).attr("id")}`
		// get translate button object
		const button = getSelectedObject(shapeEditor["dpad"], $buttonID);
		// set button class toggle for graphic change
		$(this).toggleClass($buttonID).toggleClass(`${button["pressed"]}`)
	});

	// change scale of selected shape, css of button
	$(".circleBtn_cap").on("mousedown", function(){
		// get selected shape
		const selected = getSelectedShape(shapeEditor["shapes"], shapeEditor["selected"]["id"]);
		// get selected button by id
		const $buttonID = `${$(this).attr("id")}`;
		// get scale button object
		const button = getSelectedObject(shapeEditor["scaleBtn"], $buttonID);
		// set button class toggle for graphic change
		$(this).toggleClass($buttonID).toggleClass(`${button["pressed"]}`)
		// update size value of selected shape
		selected[button["scale"]] = button.operator(selected[button["scale"]], 3, selected);
		// render shapes in display window
		renderShapes(shapeEditor["shapes"]);
	});

	// change css of button
	$(".circleBtn_cap").on("mouseup", function(){
		// get selected button by id
		const $buttonID = `${$(this).attr("id")}`;
		// get scale button object
		const button = getSelectedObject(shapeEditor["scaleBtn"], $buttonID);
		// set button class toggle for graphic change
		$(this).toggleClass($buttonID).toggleClass(`${button["pressed"]}`)
	})

	// change rotation and radius values of selected shape --> 3-tiered event
	// mousedown event handler, wait for click portion of click-and-drg
	$(".knob_cap").on("mousedown", function(){
		// get selected knob id
		const $knobID = `${$(this).attr("id")}`;
		// get selected knob object by id
		const knob = getSelectedObject(shapeEditor["knobs"], $knobID)
		// set selected knob to active true
		knob["active"] = true;
	});

	// mousemove handler for drag portion of knob click-and-drag
	$(document).on("mousemove", function(event){
		// prevent mouse click-and-drag default selection action
		event.preventDefault()
		// run lots of code
		dragKnob(event);
	});

	// mouseup handler for end portion of knob functionality
	$(document).on("mouseup", function(){
		// set knobs' active to false
		shapeEditor["knobs"].forEach(item => item["active"] = false)
	});

	// event handler for project note
	// $("#noteClose").on("click", function(){
	// 	$(".noteContainer").css("display", "none");
	// });

	// add shape from default values or copied shape values
	const addShape = function(shapeEditor, shapeValue){

		// create unique id for shape identification within program
		const shapeID = uniqueID();
		// push new shape object to shapes array
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

	// reassign checkbox to last shape in array after shape removed
	const reassignCheckbox = function(){

		const length = shapeEditor["shapes"].length

		if(length > 0){
			shapeEditor["shapes"][length - 1]["checkbox"] = true;
			shapeEditor["selected"]["id"] = shapeEditor["shapes"][length - 1]["id"]
		};
	};

	// returns shape object matching selected id
	const getSelectedShape = function(shapes, selected){
		
		return shapes.find(shape => shape.id === selected);
	};

	// returns object matching selected html element
	// ---> find a way to further abscure, combine with above function? DRY...
	const getSelectedObject = function(array, selectedEl){

		return array.find(item => item["id"] === selectedEl);
	};

	// 
	const setValuesToShape = function(selected = shapeEditor["shapeDefault"]){
		// set knob values to match selected shape
		shapeEditor["knobs"].forEach(function(knob){
			$(`#${knob["id"]}`).css("transform", `rotate(${selected[`${knob["id"]}`]}deg)`)
			knob["outputValue"] = selected[`${knob["id"]}`];
		});
		// set color value to match shape
		$("#shapeColor").val(`${selected["color"]}`);
	};

	// Render shapes in display window
	const renderShapes = function(shapes){

		const $displayWindow = $("#displayWindow")
		// clear displayWindow children
		$displayWindow.empty();
		// generate shape for each object in shapes array
		generateShapes(shapes, $displayWindow);
	};

	// generate shapes 
	const generateShapes = function(shapes, display){

		shapes.forEach(function(shape){
			// create div for each shape with shape properties
			$("<div/>")
			.css("background-color", `${shape["color"]}`)
			.css("width", `${shape["scaleX"]}%`)
			.css("height", `${shape["scaleY"]}%`)
			.css("transform", `rotate(${shape["rotate"]}deg)`)
			.css("border-radius", `${shape["radius"]}%`)
			.css("left", `${shape["transX"]}%`)
			.css("top", `${shape["transY"]}%`)
			.css("position", "absolute")
			// append to display
			.appendTo(display);
		});
	};

	// Render shape info in info window
	const renderShapeInfo = function(shapes, selected){

		const $infoWindow = $("#infoWindow");
		// clear info window children
		$infoWindow.empty();
		// generate text info for each object in shape array
		generateShapeInfo(shapes, $infoWindow);
	};

	const generateShapeInfo = function(shapes, display){

		shapes.forEach(function(shape, index){
			// create parent element
	        const $infoEl = $("<div/>");
	        // create checkbox element based on shape checked status, append to div
	        const $checkbox = $("<input/>").attr("type", "checkbox")
	        					.prop("checked", shape["checkbox"])
	        					.attr("id", shape["id"]);
	        $checkbox.appendTo($infoEl);
	        // create span element for shape index, append to div
	        const $indexEl = $("<span/>").text(`${index + 1 }.`);
	        $indexEl.appendTo($infoEl);
	        // create span element for shape name, append to div
	        const $nameEl = $("<span/>").text(` ${shape["name"]}`);
	        $nameEl.appendTo($infoEl);
	        // append div to info window
	       	$infoEl.appendTo(display);
	    });
	};

	const dragKnob = function(event){
		
		const rotate = shapeEditor["knobs"][0]["active"]
		const radius = shapeEditor["knobs"][1]["active"]
		// event fires if true
		if(rotate || radius){
			// get selected shape
			const selected = getSelectedShape(shapeEditor["shapes"], shapeEditor["selected"]["id"]);
			// get selected knob object based on active value
			const knob = shapeEditor["knobs"].find(item => item["active"] === true);

			// set rotation and value parameters
			if(event.clientY - knob["currentY"] > 0 && knob["outputValue"] > -knob["maxMin"]){
				knob["outputValue"] -= 5;
			} else if(event.clientY - knob["currentY"] < 0 && knob["outputValue"] < knob["maxMin"]){
				knob["outputValue"] += 5;
			} 

			// update reference value
			knob["currentY"] = event.clientY;
			// set css transform rotation to html element
			$(`#${knob["id"]}`).css("transform", `rotate(${knob.outputValue}deg)`);
			// apply knob value to shape
			selected[`${knob["id"]}`] = knob["outputValue"];
			// render shapes in display window
			renderShapes(shapeEditor["shapes"]);
		};
	};

	// Produces random number between caller specific values
	const randomNum = function(min, max){

	    return Math.floor(Math.random() * (max - min) + min);
	};

	// Returns unique 16 character string
	const uniqueID = function(){

	    const numArray = [];
	    const charGroups = [];
	    // create 16 random numbers
	    for(a = 0; a < 16; a++){
	        const newNum = randomNum(1, 4);
	        // generate values based off random number generated at start of each loop
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
	    // create characters from numbers in numArray
	    const charArray = numArray.map(function(num){
	        return String.fromCharCode(num);
	    });
	    // join into 4 groups, 4 characters long
	    for(i = 0; i < 4; i++){
	        charGroups.push([charArray.join("").slice((i * 4), (i * 4 + 4))]);
	    };
	    // return 16 digit unique ID
	    return `${charGroups[0]}-${charGroups[1]}-${charGroups[2]}-${charGroups[3]}`;
	};


}); // END document ready