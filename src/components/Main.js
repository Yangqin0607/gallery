require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

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

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
      		<section className="img-sec">
      		</section>
			<nav className="controller-nav">
			</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
