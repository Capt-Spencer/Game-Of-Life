/*Norris Spencer
  Prof. Marriott
  TCSS 491
  March 9 .2018
  References: http://disruptive-communications.com/conwaylifejavascript/#comment-135544
			  http://natureofcode.com/book/chapter-7-cellular-automata/
			  https://www.sitepoint.com/delay-sleep-pause-wait/
 */
 
var Life = (function () {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	ht = 160;
	width = 160;
	var field1 = createField();
	var field2 = createField();

	function createField() {
		var fldArr = [];
		for (var i = 0; i < width; i++) {
			fldArr[i] = []
		}
		return fldArr;
	}

	this.createField = createField;

	function day3() {								//a satirical reference to God creating life on day three.
		for (var i = 0; i < ht; i++) {
			for (var j = 0; j < width; j++) {
				field1[i][j] = Math.floor(Math.random() * 2);
			}
		}
	}
	
	this.day3 = day3;

	function drawField() {
		ctx.clearRect(0, 0, ht, width);
		for (var i = 0; i < ht; i++) {
			for (var j = 0; j < width; j++) {
				if (field1[i][j] === 1) {
					ctx.fillStyle = "black";
					ctx.fillRect(i * 5, j * 5, 5, 5);
				} else {
					ctx.fillStyle = "white";
					ctx.fillRect(i * 5, j * 5, 5, 5);
				} 
			}
		}
	}

	this.drawField = drawField;
	
	function updateField() {
		for (var i = 1; i < ht - 1; i++) {
			for (var j = 1; j < width - 1; j++) {
				var liveNbrs = 0;
				var top = (field1[i - 1][j - 1]) + (field1[i - 1][j]) + (field1[i - 1][j + 1]);
				var ctr = (field1[i][j - 1]) + (field1[i][j + 1]);
				var bot = (field1[i + 1][j - 1]) + (field1[i + 1][j]) + (field1[i + 1][j + 1]);
				liveNbrs = top + ctr + bot;
				switch(liveNbrs) {
					case 2:
						field2[i][j] = field1[i][j];
						break;
						
					case 3:
						field2[i][j] = 1
						break;
				
					default:
						field2[i][j] = 0
				}
			}
		}
		
		var tempField = field1;
		field1 = field2;
		field2 = tempField;
	}

	function sleep(milliseconds) {
		var start = new Date().getTime();
		for (var i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - start) > milliseconds){
				break;
			}
		}
	}
	
	this.sleep = sleep;
	
	function tick() {
		sleep(200);
		drawField();
		updateField();
		requestAnimationFrame(tick);
	}

	this.tick = tick;
	
	return this;
})();

var socket = io.connect("http://24.16.255.56:8888");

var cellStatus = [];

Life.createField();
Life.day3();
Life.drawField();
Life.sleep(3000);
Life.tick();

socket.on("load", function (data) {
	data = JSON.parse(data['data']);
	cellStatus = data;
	Life.startSavedState;

});

function save_simulation(ev) {

	socket.emit("save", { studentname: "Norris Spencer", statename: "GOL_State", data: JSON.stringify(cellStatus) });
}

function load_simulation(ev) {

	socket.emit("load", { studentname: "Norris Spencer", statename: "GOL_State" });
}