let pg;
let img;
function setup(){
  frameRate(60);
  createCanvas(1600, 900);
  background(255, 255, 255);
  color(0, 0, 0);
  textSize(20);
  grid();
  pg=createGraphics(width-300, height-300);
  img=loadImage("mesi.png");
}

class Nod{
  constructor(x=0, y=0, next=null){
    this.x=x;
    this.y=y;
    this.next=next;
  }
}

let N;
let MVOL=15;
let RB=300;
let stage=-50;
let pmX;
let pmY;
let seta=MVOL;
let list_x=[];
let list_y=[];
let ans_x=[];
let ans_y=[];
let Fpx, Fpy;
let wr;
let wi;
let cnt=0;
let nl=0;
let HEAD=new Nod();
let cur=HEAD;

function draw(){
  N=900;
  fill(255, 255, 255);
  rect(10, 10, 100, 50);
  fill(0, 0, 0);
  text(floor(frameRate()/10+0.5)*10+" "+cnt, 15, 40);
  fill(255, 255, 255);
  if(stage<0){
    rect(0, 0, width, height);
    grid();
    tint(255, 127);
    image(img, 300, 300);
    tint(255, 255);
    stage++;
  }
  else if(stage==0){
    
    if(mouseIsPressed==true){
      strokeWeight(2);
      line(pmX, pmY, mouseX, mouseY);
      nl++;
      if(nl>=4){
        cur.x=mouseX;
        cur.y=mouseY;
        print(cur.x+" "+cur.y);
        cur.next=new Nod();
        cur=cur.next;
        cnt++;
        nl=0;
      }
    }
    pmX=mouseX;
    pmY=mouseY;
  }
  else if(stage==1){
    wr=cos(TWO_PI/cnt);
    wi=sin(TWO_PI/cnt);
    cur=HEAD;
    for(let i=0; i<cnt; i++){
      append(list_x, cur.x);
      append(list_y, cur.y);
      cur=cur.next;
    }
    cur=HEAD;
    stage++;
  }
  else if(stage==2){
    ans_x=DFT(list_x);
    ans_y=DFT(list_y);
    //frameRate(30);
    stage++;
  }
  else if(stage==3){
    fill(255);
    stroke(255, 255, 255);
    rect(0, 0, width, height);
    stroke(0, 0, 0);
    grid();
    strokeWeight(2);
    noStroke();
    rect(0, 0, RB, height);
    rect(0, 0, width, RB);
    stroke(0, 0, 0, 127);
    let x=pg.width/2+RB, y=RB/2;
    let _px=x, _py=y;
    
    for(let i=1; i<cnt/2+1; i++){
      let _i=i;
      let _x=seta*_i*TWO_PI/N;
      let dx=(ans_x[i][1]*cos(_x)+ans_x[i][2]*sin(_x));
      let dy=(ans_x[i][1]*cos(PI/2+_x)+ans_x[i][2]*sin(PI/2+_x));
      x+=dx;
      y+=dy;
      noFill();
      circle(_px, _py, 2*sqrt(sq(dx)+sq(dy)));
      line(_px, _py, x, y);
      _px=x;
      _py=y;
    }
    let Y=y;
    
    x=RB/2;
    y=pg.height/2+RB;
    
    _px=x;
    _py=y;
    
    for(let i=1; i<cnt/2+1; i++){
      let _i=i;
      let _x=seta*_i*TWO_PI/N;
      let dx=(ans_y[i][1]*cos(PI/2+_x)+ans_y[i][2]*sin(PI/2+_x));
      let dy=(ans_y[i][1]*cos(_x)+ans_y[i][2]*sin(_x));
      x+=dx;
      y+=dy;
      noFill();
      circle(_px, _py, 2*sqrt(sq(dx)+sq(dy)));
      line(_px, _py, x, y);
      _px=x;
      _py=y;
    }
    let X=x;
    
    x=pg.width/2;
    y=pg.height/2;
    for(let i=1; i<cnt/2+1; i++){
      let _i=i;
      let _x=seta*_i*TWO_PI/N;
      x+=(ans_x[i][1]*cos(_x)+ans_x[i][2]*sin(_x));
      y+=(ans_y[i][1]*cos(_x)+ans_y[i][2]*sin(_x));
    }
    line(X, y+RB, x+RB, y+RB);
    line(x+RB, Y, x+RB, y+RB);
    print(" x: "+x+" y: "+y);
    pg.strokeWeight(2);
    if(seta>MVOL){
      pg.line(Fpx, Fpy, x, y);
    }
    image(pg, RB, RB);
    Fpx=x;
    Fpy=y;
    if(++seta==N-MVOL){
      stage++;
    }
  }
  else if(stage==4){
    rect(0, 0, width, height);
    grid();
    image(pg, RB, RB);
    print("real: ");
    for(let i=0; i<cnt; i++){
      print(ans_x[i][0]+" ");
    }
    stage++;
  }
}

function touchStarted(){
  if(cnt>10 && stage==0){
    stage++;
  }
}

function DFT(list){
  let ansr=[];
  let ansi=[];
  let ans=[];
  let real=[];
  let img=[];
  for(let y=0; y<cnt; y++){
    append(real, []);
    append(img, []);
    append(ans, [0, 0, 0]);
    append(ansr, 0);
    append(ansi, 0);
    for(let x=0; x<cnt; x++){
      if(y*x==0){
        append(real[y], 1);
        append(img[y], 0);
      }
      for(let i=0; i<y*x; i++){
        let ryx=real[y][x];
        let iyx=img[y][x];
        if(i==0){
          real[y][x]=wr;
          img[y][x]=wi;
        }
        else{
          real[y][x]=wr*ryx-wi*iyx;
          img[y][x]=wr*iyx+wi*ryx;
        }
      }
      real[y][x]*=list[x];
      img[y][x]*=list[x];
      ansr[y]+=real[y][x];
      ansi[y]+=img[y][x];
    }
    ansr[y]/=cnt/2;
    ansi[y]/=cnt/2;
    ans[y][0]=sqrt(sq(ansr[y])+sq(ansi[y]));
    ans[y][1]=ansr[y];
    ans[y][2]=ansi[y];
  }
  return ans;
}

function grid(){
  let N=50;
  strokeWeight(1);
  for(let i=RB/N; i<height/N; i++){
    line(RB, i*N, width, i*N);
  }
  for(let i=RB/N; i<width/N; i++){
    line(i*N, RB, i*N, height);
  }
  strokeWeight(2);
}
