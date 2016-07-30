
var chessBoard = []; //二维数组，判断是否有落子
var me = true; //me初始值为true
var over = false; //初始化 棋局没有结束

// 赢法数组（三维）
var wins = [];


//赢法统计数组
var myWin = [];
var computerWin = [];


//初始化棋盘，没有落子为空
for(var i=0; i<15; i++){
	chessBoard[i] = [];
	for(var j=0; j<15; j++) {
		chessBoard[i][j] = 0; 
	}
}

//初始化赢法数组
for(var i=0; i<15; i++){
	wins[i] = [];
	for(var j=0; j<15; j++){
		wins[i][j] = [];
	}

}


var count = 0; //嬴法种类（一维数组）
// 所有横线嬴法
for (var i=0; i<15; i++){  
	for(var j=0; j<11; j++){
		// 第0种嬴法：
		// wins[0][0][0] = true
		// wins[0][1][0] = true
		// wins[0][2][0] = true
		// wins[0][3][0] = true
		// wins[0][4][0] = true

		// 第1种嬴法：
		// wins[0][1][1] = true
		// wins[0][2][1] = true
		// wins[0][3][1] = true
		// wins[0][4][1] = true
		// wins[0][5][1] = true
		for(var k=0; k<5; k++){
			wins[i][j+k][count] = true;
		}
		count++;
	}
}

// 所有竖线嬴法
for (var i=0; i<15; i++){  
	for(var j=0; j<11; j++){
		for(var k=0; k<5; k++){
			wins[j+k][i][count] = true;
		}
		count++;
	}
}

// 所有斜线嬴法
for (var i=0; i<11; i++){  
	for(var j=0; j<11; j++){
		for(var k=0; k<5; k++){
			wins[i+k][j+k][count] = true;
		}
		count++;
	}
}

// 所有反斜线嬴法
for (var i=0; i<11; i++){  
	for(var j=14; j>3; j--){
		for(var k=0; k<5; k++){
			wins[i+k][j-k][count] = true;
		}
		count++;
	}
}

console.log(count); //count = 572

//初始化myWin和computerWin，都是[0,0,...0] 一共有572个0
for (var i=0; i<count; i++) {
	myWin[i] = 0;
	computerWin[i] = 0;
}

var chess = document.getElementById('chess');
var context = chess.getContext('2d');

context.strokeStyle = "#bfbfbf";

var logo = new Image();
logo.src = "images/logo.jpg";
logo.onload = function() {
	context.drawImage(logo, 0,0,450,450);
	drawChessboard();

	// oneStep(0,0,true);
	// oneStep(1,1,false);
}


function drawChessboard() {
	for(var i=0; i<15; i++) {
		context.moveTo(15 + i*30, 15);
		context.lineTo(15 + i*30, 435);
		context.stroke();
		context.moveTo(15, 15 + i*30);
		context.lineTo(435, 15 + i*30);
		context.stroke();
	}
}


// 测试画线 context.moveTo(0, 0);
// context.lineTo(450, 450);
// context.stroke();


//画一个棋子
var oneStep = function(i, j, me) {

	context.beginPath();
	context.arc(15+i*30, 15+j*30, 13, 0, 2*Math.PI); //arc画扇形，0和2PI是起始和终止的角度
	context.closePath();

	var gradient = context.createRadialGradient(15+i*30+2, 15+j*30-2, 13, 15+i*30+2, 15+j*30-2,0);
	
	if (me) {
		gradient.addColorStop(0,"#0a0a0a");
		gradient.addColorStop(1,"#636766");
	} else {
		gradient.addColorStop(0,"#d1d1d1");
		gradient.addColorStop(1,"#f9f9f9");
	}
	
	context.fillStyle = gradient;
	context.fill(); //stroke是描边，fill是填充

}

chess.onclick = function(e){
	if(over){
		return;
	}
	if(!me) {
		return; //onclick方法只对我方下棋有效。如果不是我方，则直接return
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / 30);
	var j = Math.floor(y / 30);
	if(chessBoard[i][j] === 0) { //如果这个坐标没有落子，才允许操作，包括me=!me
		oneStep(i,j,me); //在i,j 处画一个棋子
		//if(me) {
			chessBoard[i][j] = 1; //黑棋=1
		// } else {
		// 	chessBoard[i][j] = 2; //白棋=2
		// }
		//if(me){
			for (var k=0; k<count; k++) {
				if(wins[i][j][k]) { //如果在[i][j]处落子，属于第k种赢法里的一步
					myWin[k]++; //则我第k种赢法+1(加到5就赢了)
					computerWin[k] = 6; //设为异常，因为我方已经落子，对方这种赢法不可能
					if(myWin[k] === 5) {
						window.alert("你赢了");
						over = true;
					}
				}
			}
		//}
		
		if (!over) {
			me = !me;
			computerAI(); //如果还没有结束，则调用函数computerAI
		}
	}
}


var　computerAI = function(){
	var myScore = []; //在棋盘的每一格，都赋值一个得分（每走一步，所有得分都update）
	var computerScore = [];
	var max = 0; //保存最高分值
	var u = 0, v = 0; //保存最高分的坐标
	for (var i=0; i<15; i++) {
		myScore[i] = [];
		computerScore[i] = [];
		for(var j=0; j<15; j++){
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}

	for(var i=0; i<15; i++) {
		for(var j=0; j<15; j++){
			if(chessBoard[i][j] === 0){
				for(var k=0; k<count; k++){
					if(wins[i][j][k]){
						if(myWin[k] === 1){
							myScore[i][j] += 200;
						} else if (myWin[k] === 2) {
							myScore[i][j] += 400;
						} else if (myWin[k] === 3) {
							myScore[i][j] += 2000;
						} else if (myWin[k] === 4) {
							myScore[i][j] += 10000;
						}
						if(computerWin[k] === 1){
							computerScore[i][j] += 220;
						} else if (computerWin[k] === 2) {
							computerScore[i][j] += 420;
						} else if (computerWin[k] === 3) {
							computerScore[i][j] += 2200;
						} else if (computerWin[k] === 4) {
							computerScore[i][j] += 20000;
						}
					}

				}
				if(myScore[i][j] > max) {
					max = myScore[i][j];
					u = i;
					v = j;
				} else if (myScore[i][j] === max) {
					if(computerScore[i][j] > computerScore[u][v]){
						u = i;
						v = j;
					}
				}
				if(computerScore[i][j] > max) {
					max = computerScore[i][j];
					u = i;
					v = j;
				} else if (computerScore[i][j] === max) {
					if(myScore[i][j] > myScore[u][v]){
						u = i;
						v = j;
					}
				}
			}
		}

	}
	oneStep(u, v, false);
	chessBoard[u][v] = 2; //记录计算机的落子
	for (var k=0; k<count; k++) {
				if(wins[u][v][k]) { 
					computerWin[k]++; 
					myWin[k] = 6; 
					if(computerWin[k] === 5) {
						window.alert("计算机赢了");
						over = true;
					}
				}
			}
	if (!over) {
		me = !me;
	}
}