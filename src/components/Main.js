require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

// let yeomanImage = require('../images/yeoman.png');

/*获取图片数据*/
var imageDatas=require('../data/imageData.json');
/*获取图片路径信息*/
imageDatas=(function genImageURL(imageDataArr){
	for(var i=0;i<imageDataArr.length;i++){
		var singleImageData=imageDataArr[i];
		singleImageData.imageURL=require('../images/'+singleImageData.fileName);
		imageDataArr[i]=singleImageData;
	}
	return imageDataArr;
})(imageDatas);

/* 单个图片组件 */
class ImgFigure extends React.Component {
	constructor(props){
		super(props);
		this.handleClick=this.handleClick.bind(this);
	}
	handleClick(event){
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.rangeCenter();
		}
		event.stopPropogation();
		event.preventDefault();
	}
	render(){
		var styleObj={};
		if(this.props.arrange.pos){
			styleObj=this.props.arrange.pos;
		}
		if(this.props.arrange.rotate){
			['Moz','Webkit','ms',''].forEach(function(item){
				styleObj[item+'Transform']='rotate('+this.props.arrange.rotate+'deg)';
			}.bind(this))
		}
		var imgFigClassName='img-figure';
			imgFigClassName+=this.props.arrange.isInverse?' inverse':'';
			imgFigClassName+=this.props.arrange.isCenter?' center':'';
		if(this.props.arrange.isCenter){
			styleObj['zIndex']=11;
		}
		return (
			<figure className={imgFigClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className='fig-back' onClick={this.handleClick}>
						<p>
							{this.props.data.description}
						</p>
					</div>
				</figcaption>
			</figure>
		)
	}
}

/*
	获取区间内的某个随机值
 */
function getRangePos(low,high){
	return Math.ceil(Math.random()*(high-low)+low);
}

/*
 * 获取0-30°正负旋转值
 */
function get30DegRandom(){
	return (Math.random()>0.5?'':'-')+Math.ceil(Math.random()*30);
}
class AppComponent extends React.Component {
  constructor(props){
		super(props);
		this.rearrange=this.rearrange.bind(this);
		this.inverse=this.inverse.bind(this);
		// this.Constant 用于存储左、上、右侧图片的范围区间
		this.Constant={
			centerPos:{
				left:0,  // 558
				top:0  //185
			},
			hposRange:{ // 水平方向的取值范围
				leftSecX:[0,0], // -125 308
				rightSecX:[0,0], // 808 1241
				y:[0,0]
			},
			vposRange:{ // 垂直方向的取值范围
				x:[0,0],  // 433 683
				topY:[0,0] // -115 -45
			}
		};
		this.state={
			imgsArrangeArr:[
			// {
			// 	pos:{ // 位置信息
			// 		left:'0',
			// 		top:'0'
			// 	},
			// 	rotate:0,  // 旋转信息
			// 	isInverse:false, // 是否翻转，true反面，false是正面
			// 	isCenter:false // 是否居中
			// }
			]
		}
  }
  
  /*
   * 重新布局所有图片
   * @param centerIndex 指定居中排布哪个图片
   */
  rearrange(centerIndex){
  	var imgsArrangeArr=this.state.imgsArrangeArr,
  		Constant=this.Constant,
  		centerPos=Constant.centerPos,
  		hposRange=Constant.hposRange,
  		vposRange=Constant.vposRange,

  		hposRangeLeftSecX=hposRange.leftSecX,
  		hposRangeRightSexX=hposRange.rightSecX,
  		hposRangeY=hposRange.y,

  		vposRangeX=vposRange.x,
  		vposRangeTopY=vposRange.topY,

  		// 上侧图片数量为1或者2
  		imgsTopArr=[],
  		topImgNum=Math.ceil(Math.random()*2),
 
  		// 从imgsArrangeArr中删除居中的图片，并设置居中图片的pos属性
  		imgCenterArr=imgsArrangeArr.splice(centerIndex,1);
  		imgCenterArr[0].pos=centerPos;
  		imgCenterArr[0].rotate=0;
  		imgCenterArr[0].isCenter=true;
  		
  		// 设置上侧图片的pos属性
  		var imgsTopIndexArr=[];
  		for(var i=0;i<topImgNum;i++){
  			var index=Math.ceil(Math.random()*(imgsArrangeArr.length-topImgNum+i));
  			imgsTopIndexArr.push(index);
  			imgsTopArr.push(imgsArrangeArr.splice(index,1));
  		}
  		
  		imgsTopArr.forEach(function(item){
  			item.pos={
  				top:getRangePos(vposRangeTopY[0],vposRangeTopY[1])+'px',
  				left:getRangePos(vposRangeX[0],vposRangeX[1])+'px'
  			}
  			item.rotate=get30DegRandom();
  			item.isCenter=false;
  		});

  		// 设置左侧右侧图片的pos属性
  		for(var i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
  			var imgsRorL=null;
  			if(i<k){
  				imgsRorL=hposRangeLeftSecX;
  			}else{
  				imgsRorL=hposRangeRightSexX;
  			}
  			imgsArrangeArr[i].pos={
  				left:getRangePos(imgsRorL[0],imgsRorL[1])+'px',
  				top:getRangePos(hposRangeY[0],hposRangeY[1])+'px'
  			}
  			imgsArrangeArr[i].rotate=get30DegRandom();
  			imgsArrangeArr[i].isCenter=false;
  		}

  		// 将上侧图片，居中图片恢复进原来的数组
  		for(var i=0;i<topImgNum;i++){
  			imgsArrangeArr.splice(imgsTopIndexArr[i],0,imgsTopArr[i]);
  		}
  		// 将居中图片回复进原来数组
  		imgsArrangeArr.splice(centerIndex,0,imgCenterArr[0]);

  		// 设置状态state
  		this.setState({
  			imgsArrangeArr:imgsArrangeArr
  		});
  }
/*
 * 控制翻转函数
 * @param index 表示翻转的index图片
 */
  inverse(index,event){
  	var imgsArrangeArr=this.state.imgsArrangeArr;
  	imgsArrangeArr[index].isInverse=!imgsArrangeArr[index].isInverse;
  	this.setState({
  		imgsArrangeArr:imgsArrangeArr
  	})
  }
  componentDidMount(){
  	// 获取stage的宽高
  	var stageDOM=ReactDOM.findDOMNode(this.refs.stage),
  		stageW=stageDOM.scrollWidth,
  		stageH=stageDOM.scrollHeight,
  		halfStageW=Math.ceil(stageW/2),
  		halfStageH=Math.ceil(stageH/2);

  	// 获取img的宽高
  	var imgFigureDOM=ReactDOM.findDOMNode(this.refs.imgFigure0),
  		imgFigW=imgFigureDOM.scrollWidth,
  		imgFigH=imgFigureDOM.scrollHeight,
  		halfImgFigW=Math.ceil(imgFigW/2),
  		halfImgFigH=Math.ceil(imgFigH/2);

  	/* 计算居中图片的位置范围 */
  	this.Constant.centerPos={
  		left:halfStageW-halfImgFigW+'px', //558
  		top:halfStageH-halfImgFigH+'px' //185
  	}
  	/* 计算左侧，右侧区域图片排布位置的取值范围 */
  	this.Constant.hposRange.leftSecX[0]=-halfImgFigW; //-125
  	this.Constant.hposRange.leftSecX[1]=halfStageW-halfImgFigW*3;  // 308
  	this.Constant.hposRange.rightSecX[0]=halfStageW+halfImgFigW; // 808
  	this.Constant.hposRange.rightSecX[1]=stageW-halfImgFigW; // 1241
  	this.Constant.hposRange.y[0]=-halfImgFigH; // -115
  	this.Constant.hposRange.y[1]=stageH-halfImgFigH; // 185
 	
 	/* 计算上侧区域图片排布位置的取值范围 */
  	this.Constant.vposRange.x[0]=halfStageW-imgFigW;  // 433
  	this.Constant.vposRange.x[1]=halfStageW; // 683
  	this.Constant.vposRange.topY[0]=-halfImgFigH;  // -115
  	this.Constant.vposRange.topY[1]=halfStageH-halfImgFigH*3;  // -45

  	this.rearrange(0);
  }
  render() {
  	var controllerArr=[],
  		imgFigureArr=[];
  		imageDatas.forEach(function(item,index){
  			if(!this.state.imgsArrangeArr[index]){
  				this.state.imgsArrangeArr[index]={
  					pos:{
  						left:'0',
  						top:'0'
  					},
  					rotate:0,
  					isInverse:false
  				}
  			}
  			imgFigureArr.push(<ImgFigure key={index} data={item} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse.bind(this,index)} rangeCenter={this.rearrange.bind(this,index)}/>);
  			controllerArr.push(<ControllerUnit key={index} btnCtrl={this.state.imgsArrangeArr[index]} inverse={this.inverse.bind(this,index)} rangeCenter={this.rearrange.bind(this,index)}/>);
  		}.bind(this));
    return (
      <section className="stage" ref="stage">
      		<section className="img-sec">
      			{imgFigureArr}
      		</section>
			<nav className="controller-nav">
				{controllerArr}
			</nav>
      </section>
    );
  }
}

class ControllerUnit extends React.Component{
	constructor(props){
		super(props);
		this.handleClick=this.handleClick.bind(this);
	}
	handleClick(event){
		if(this.props.btnCtrl.isCenter){
			this.props.inverse();
		}else{
			this.props.rangeCenter();
		}
		event.preventDefault();
		event.stopPropogation();
	}
	render(){
		var styleObj={};
		var spanClass='imgCtrl';
		spanClass+=this.props.btnCtrl.isCenter?(this.props.btnCtrl.isInverse?' centerBtn inverseBtn':' centerBtn'):'';
		return (
			<span className={spanClass} onClick={this.handleClick}></span>
		)
	}
}

AppComponent.defaultProps = {
};

export default AppComponent;
// 	// {
		// 	// 	pos:{ // 位置信息
		// 	// 		left:'0',
		// 	// 		top:'0'
		// 	// 	},
		// 	// 	rotate:0,  // 旋转信息
		// 	// 	isInverse:false, // 是否翻转，true反面，false是正面
		// 	// 	isCenter:false // 是否居中
		// 	// }