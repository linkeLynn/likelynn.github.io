/**
 * Created by chen on 2016/1/18.
 */
var borad=[];
var score=0;
var hasConflicted=[];
window.onload=newgame;
function newgame(){
    // 初始化棋盘
    init();
    // 随机生成两个数字
    createNewNumber();
    createNewNumber();
}
function init(){
    for(var i=0;i<4;i++){
        for(var k=0;k<4;k++){
            var gridCell=$('#grid-cell-'+i+"-"+k);
            gridCell.css('top',getPosTop(i,k));
            gridCell.css('left',getPosLeft(i,k));
        }
    }
    for(var i=0;i<4;i++){
        borad[i]=[];
        hasConflicted[i]=[];
        for(var k=0;k<4;k++){
            borad[i][k]=0;
            hasConflicted[i][k]=false;
        }
    }
    updateNumberView();
    score=0;
}

function updateNumberView(){
    $('.number-cell').remove();
    for(var i=0;i<4;i++){
        for(var k=0;k<4;k++){
            var theNumberCell=$("<div></div>");
            theNumberCell.attr({'class':'number-cell','id':'number-cell-'+i+'-'+k});
            $('#grid-box').append(theNumberCell);
            if(borad[i][k]==0){
                //theNumberCell.hide();
                theNumberCell.css({
                    "width":"0px",
                    "height":"0px",
                    "top":getPosTop(i,k)+50,
                    "left":getPosLeft(i,k)+50})
            }else{
                theNumberCell.css({
                    "width":"100px",
                    "height":"100px",
                    "top":getPosTop(i,k),
                    "left":getPosLeft(i,k),
                    'background-color':getNumberBackgroundColor(borad[i][k]),
                    'color':getNumberFontColor(borad[i][k])});
                theNumberCell.text(borad[i][k]);
            }
            hasConflicted[i][k]=false;
        }
    }
}

function createNewNumber(){
    if(nospace(borad)){
        return false;
    }
    // 随机一个位置
    var randomX=Math.floor(Math.random()*4);
    var randomY=Math.floor(Math.random()*4);
    while(true){
        if(borad[randomX][randomY]==0){
            break;
        }
        randomX=Math.floor(Math.random()*4);
        randomY=Math.floor(Math.random()*4);
    }
    //随机一个数字
    var randomNumber=Math.random()<0.8?2:4;
    //在随机位置上显示随机的数字
    borad[randomX][randomY]=randomNumber;
    showNumberWithAnimation(randomX,randomY,randomNumber);
    return true;
}
$(document).keydown(function(e){
    var ev=e||window.event;
    switch (ev.keyCode){
        case 37:// left
            if(moveLeft()){
                setTimeout(createNewNumber,210);
                setTimeout(isGameOver,300);
            }
            break;
        case 38:// up
            if(moveUp()){
                setTimeout(createNewNumber,210);
                setTimeout(isGameOver,300);
            }
            break;
        case 39:// right
            if(moveRight()){
                setTimeout(createNewNumber,210);
                setTimeout(isGameOver,300);
            }
            break;
        case 40:// down
            if(moveDown()){
                setTimeout(createNewNumber,210);
                setTimeout(isGameOver,300);
            }
            break;
        default: //default
            break;
    }
    updateScore(score);

});
function isGameOver(){
    if(nospace(borad)&&nomove(borad)){
        alert("game over!");
    }
}
function moveLeft(){
    if(!canMoveLeft(borad)){
        return false
    }
    // move Left
    for(var i=0;i<4;i++){
        for(var k=1;k<4;k++) {
            if(borad[i][k]!=0){
                for(var j=0;j<k;j++){
                    if(borad[i][j]==0&&noBlockHorizontal(i,j,k,borad)){
                        //move
                        showMoveAnimation(i,k,i,j);
                        borad[i][j]=borad[i][k];
                        borad[i][k]=0;
                        continue;
                    }else if(borad[i][j]==borad[i][k]&&noBlockHorizontal(i,j,k,borad)&&!hasConflicted[i][j]){
                        //move
                        showMoveAnimation(i,k,i,j);
                        //add
                        borad[i][j]+=borad[i][k];
                        borad[i][k]=0;
                        score+=borad[i][j]
                        hasConflicted[i][j]=true;
                        continue;
                    }
                }
            }
        }
    }
    //updateNumberView();
    setTimeout(updateNumberView,200);
    return true;
}
function moveRight(){
    if(!canMoveRight(borad)){
        return false;
    }

    // move Right
    console.log('right-------');

    for(var i=0;i<4;i++){
        for(var k=2;k>=0;k--) {
            if(borad[i][k]!=0){
                for(var j=3;j>k;j--){
                    if(borad[i][j]==0&&noBlockHorizontal(i,k,j,borad)){
                        //move
                        showMoveAnimation(i,k,i,j);
                        borad[i][j]=borad[i][k];
                        borad[i][k]=0;
                        continue;
                    }else if(borad[i][j]==borad[i][k]&&noBlockHorizontal(i,k,j,borad)&&!hasConflicted[i][j]){
                        //move
                        showMoveAnimation(i,k,i,j);
                        //add
                        borad[i][j]+=borad[i][k];
                        borad[i][k]=0;
                        hasConflicted[i][j]=true;
                        score+=borad[i][j];
                        continue;
                    }
                }
            }
        }
    }
    //updateNumberView();
    setTimeout(updateNumberView,200);
    return true;
}
function moveUp(){
    if(!canMoveUp(borad)){
        return false;
    }
    for(var k=0;k<4;k++){
        for(var i=1;i<4;i++){
            if(borad[i][k]!=0){
                for(var j=0;j<i;j++){
                    if(borad[j][k]==0&&noBlockVertical(k,j,i,borad)){
                        //move
                        showMoveAnimation(i,k,j,k);
                        borad[j][k]=borad[i][k];
                        borad[i][k]=0;
                        continue;
                    }else if(borad[j][k]==borad[i][k]&&noBlockVertical(k,j,i,borad)&&!hasConflicted[j][k]){
                        //move
                        showMoveAnimation(i,k,j,k);
                        //add
                        borad[j][k]+=borad[i][k];
                        borad[i][k]=0;
                        hasConflicted[j][k]=true;
                        score+=borad[j][k];
                        continue;
                    }
                }
            }
        }
    }
    setTimeout(updateNumberView,200);
    return true;
}

function moveDown(){
    if(!canMoveDown(borad)){
        return false;
    }
    for(var k=0;k<4;k++){
        for(var i=2;i>=0;i--){
            if(borad[i][k]!=0){
                for(var j=3;j>i;j--){
                    if(borad[j][k]==0&&noBlockVertical(k,i,j,borad)){
                        //move
                        showMoveAnimation(i,k,j,k);
                        borad[j][k]=borad[i][k];
                        borad[i][k]=0;
                        continue;
                    }else if(borad[j][k]==borad[i][k]&&noBlockVertical(k,i,j,borad)&&!hasConflicted[j][k]){
                        //move
                        showMoveAnimation(i,k,j,k);
                        //add
                        borad[j][k]+=borad[i][k];
                        borad[i][k]=0;
                        hasConflicted[j][k]=true;
                        score+=borad[j][k];
                        continue;
                    }
                }
            }
        }
    }
    setTimeout(updateNumberView,200);
    return true;
}