/* eslint-disable */
import html2canvas from "html2canvas";

// 导出图片类型
let exportTypeO = 'jpeg'
let qualityO = 1
/**
 * Html转换图片，加canvas水印，下载（使用需要提前引入html2canvas）
 * @param Object.element 生成图片的目标元素, 必须
 * @param Object.showWaterMark 是否添加水印，默认false
 * @param Object.waterMark 定义水印, 可选
 * @param Object.autoDownload 是否生成图片后自动下载，默认false
 * @param Object.fileName 定义下载图片名称, 可选
 * @param Object.exportExt 定义导出图片类型后缀, 可选
 * @param Object.quality 定义导出图片清晰度, 可选,范围（0-1）
 * @param Object.format 定义预览图片格式, 可选（base64或blob）
 * @method toImage(element) 通过html2canvas转换为canvas
 * @method addWaterMark 添加水印
 * @method downloadImg 下载图片
 * @method getImgUrl 获取可用于预览的图片链接
 * @method callOfTheGodDragon 综合依次方法
 * @method setWaterMark 设置水印
 */
class TransHtmlToImage {
  // element: HTMLElement;
  // canvas: any;
  // imgUrl: string;
  // autoDownload: boolean;
  // showWaterMark: boolean;
  // waterMark: WaterMarkOptions;
  // fileName: string;
  constructor({
    element,
    showWaterMark = false,
    waterMark = undefined,
    autoDownload = false,
    fileName = undefined,
    exportExt = 'png',
    quality = 1,
    format = 'base64',
    useCORS = true,
    drawManually = {
      dom: undefined,
    }
  }) {
    this.element = element;
    this.drawManually = {
      dom: undefined,
      width: 200,
      height: 200,
      ...drawManually
    }
    this.canvas = null;
    this.imgUrl = "";
    this.autoDownload = autoDownload;
    this.showWaterMark = showWaterMark;
    this.waterMark = {
      textAlign: "center",
      textBaseline: "middle",
      font: "32px Microsoft Yahei",
      fillStyle: "#c4c4c4",
      content: "请勿外传",
      rotate: 45,
      spaceX: 200,
      spaceY: 200,
      numbers: 500,
      alpha: 0.3,
      ...(typeof waterMark === "object" ? waterMark : {}),
    };
    this.exportType = exportExt
    this.fileName = fileName ?
      fileName + '.' + this.exportType :
      new Date().getTime() + "." + this.exportType
    this.quality = typeof quality === 'number' && quality <= 1 && quality > 0 ? quality : 1
    this.format = format
    this.useCORS = useCORS
    qualityO = this.quality
    exportTypeO = this.exportType
    this.drawRunning = ''
    this.textCtx = null
    this.addListen()
  }
  addListen(drawManually){
    const dom = drawManually ? drawManually : this.drawManually.dom
    const curPcClinet = isPc()
    if(isElement(dom)){
      const canvasEl = this.getCanvasElement() || document.createElement('canvas')
      setTimeout(() => {
        canvasEl.setAttribute('height', dom.offsetHeight + 'px' || dom.style.height + 'px' || 0+'px')
        canvasEl.setAttribute('width', dom.offsetWidth + 'px' || dom.style.height + 'px' || 0+'px')
        dom.appendChild(canvasEl)
        const ctx = canvasEl.getContext('2d')
        canvasEl.addEventListener(curPcClinet ?'mousedown' : 'touchstart', (e) => {
          e.preventDefault();
          this.drawRunning = 'draw'
          let offsety = canvasEl.offsetTop;
          let offsetx = canvasEl.offsetLeft;
          let px = curPcClinet ? e.pageX : e.targetTouches[0].pageX
          let py = curPcClinet ? e.pageY : e.targetTouches[0].pageY
          let x = px - offsetx;
          let y = py - offsety;
          ctx.beginPath();
          ctx.moveTo(x,y);
        })
        canvasEl.addEventListener(curPcClinet ? 'mousemove' : 'touchmove', (e) => {
          e.preventDefault();
          if(this.drawRunning == "draw"){
            let offsety = canvasEl.offsetTop;
            let offsetx = canvasEl.offsetLeft;
            let px = curPcClinet ? e.pageX : e.targetTouches[0].pageX
            let py = curPcClinet ? e.pageY : e.targetTouches[0].pageY
            let x = px - offsetx;
            let y = py - offsety;
            ctx.lineTo(x,y);
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.lineWidth = 4;
            ctx.strokeStyle = "#ff4444";
            ctx.stroke();
          }else{
            ctx.moveTo(0, 0)
          }
        })
        canvasEl.addEventListener(curPcClinet ? 'mouseup' : 'touchend', (e) => {
          e.preventDefault();
          this.drawRunning = ''
          ctx.moveTo(0, 0)
        })
        canvasEl.addEventListener('mouseover', (e) => {
          this.drawRunning = ''
          ctx.moveTo(0, 0)
        })
      }, 0)
    }
  }
  async saveDraw(){
    await this.toImage(this.element)
    await this.addWaterMark()
  }

  async toImage(element) {
    const config = {
      backgroundColor: this.exportType === 'png' ? null : "#ffffff",
      allowTaint: this.useCORS,
      useCORS: this.useCORS,
    };
    if (this.waterMark.width)
      (config.scale = 1),
      (config.width = config.windowWidth = this.waterMark.width);
    if (this.waterMark.height)
      config.height = config.windowHeight = this.waterMark.height;
    this.canvas = await html2canvas(element, config);
    return this.canvas;
  }
  addWaterMark() {
    return new Promise((resolve, reject) => {
      if (!this.canvas) reject('Please run the "toImage" function first !');
      if (!this.waterMark)
        reject("Please define a second watermark parameter !");

      const ctx = this.canvas.getContext("2d");
      ctx.textAlign = this.waterMark.textAlign;
      ctx.textBaseline = this.waterMark.textBaseline;
      ctx.font = this.waterMark.font;
      const nc =
        this.canvas.width > this.canvas.height ?
        this.canvas.width :
        this.canvas.height;
      let left = -nc / 2;
      let top = -nc / 2;
      if(isElement(this.drawManually.dom)){
        const textCanvas = this.getCanvasElement()
        if(!textCanvas.width){
          resolve(this.canvas);
          return
        }
        // 把手绘水印转为图片更改透明度然后覆盖到html上后转为canvas
        const textImg = new Image()
        textImg.src = textCanvas.toDataURL(`image/png}`, 0.9);
        textImg.style.opacity = this.waterMark.alpha
        textImg.style.position = 'absolute'
        textImg.style.zIndex = 2
        textImg.width = this.drawManually.width
        textImg.height = this.drawManually.height
        textImg.style.left = (this.element.width || this.element.offsetWidth) / 2 - (textImg.width / 2) + 'px'
        textImg.style.top = (this.element.height || this.element.offsetHeight) / 2 - (textImg.height / 2) + 'px'
        const copyEl = this.element.cloneNode(true)
        copyEl.id+= "copy";
        const imgParent = document.createElement('div')
        imgParent.style.position = 'fixed'
        imgParent.style.top = '-999em'
        imgParent.style.left = '-999em'
        imgParent.appendChild(copyEl)
        imgParent.appendChild(textImg)
        document.body.appendChild(imgParent)
        this.toImage(imgParent).then((canvas) => {
          setTimeout(() => {
            document.body.removeChild(imgParent)
          }, 2000)
          resolve(canvas);
        })
      }else{
        const textWidth = ctx.measureText(this.waterMark.content).width;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.translate(
          textWidth + 0.5 * this.canvas.width,
          40 + 0.5 * this.canvas.height
        );
        ctx.rotate(((this.waterMark.rotate || 45) * Math.PI) / 180);
        for (var i = 0; i < (this.waterMark.numbers || 500); i++) {
          ctx.fillStyle = hexToRgba(
            this.waterMark.fillStyle,
            this.waterMark.alpha
          );
          if (i == 0) {
            //
          } else if (left >= nc) {
            left = -nc / 2;
            top += this.waterMark.spaceY || 200;
          } else {
            if (typeof this.waterMark.spaceX == 'number') left += textWidth + this.waterMark.spaceX;
          }
          ctx.fillText(this.waterMark.content, left, top);
        }
        resolve(this.canvas);
      }
    });
  }
  resetDraw(){
    if(!!this.drawManually.dom && isElement(this.drawManually.dom)){
      const textCanvas = this.getCanvasElement()
      const ctx = textCanvas.getContext('2d')
      ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    }
  }
  downloadImg() {
    if (!this.canvas) {
      return new Error('Please run the "toImage" function first !');
    }
    return downloadFile(this.canvas, this.fileName);
  }
  getImgUrl() {
    if (!this.canvas)
      return new Error('Please run the "toImage" function first !');
    if (!this.imgUrl) this.imgUrl = this.canvas.toDataURL(`image/${this.exportType}}`, this.quality);
    return this.imgUrl;
  }

  async callOfTheGodDragon() {
    this.imgUrl = ''
    await this.toImage(this.element);
    if (this.showWaterMark) await this.addWaterMark();
    if(this.format === 'base64'){
      // 转base64
      this.imgUrl = this.getImgUrl()
    }
    if(this.format === 'blob'){
      // 转blob
      var blob = await base64Img2Blob(this.getImgUrl());
      this.imgUrl = await URL.createObjectURL(blob);
    }

    if (this.autoDownload) this.downloadImg();
    return this.imgUrl
  }
  async setWaterMark(
    type,
    value
  ) {
    await this.toImage(this.element);
    if (typeof type === "string" && type !== "") {
      this.waterMark[type] = value;
    } else if (Object.keys(type).length && typeof type == "object") {
      this.waterMark = type;
    } else {
      return new Error("Please define a correct watermark parameter !");
    }

    if (this.showWaterMark) await this.addWaterMark();
    this.imgUrl = this.getImgUrl()
    if (this.autoDownload) this.downloadImg();
    return this.imgUrl;
  }
  async getTransparentChannel(){
    if (!this.canvas)
      return new Error('Please run the "toImage" function first !');
    let ctx = this.canvas.getContext('2d')
    let imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    const data = imageData.data
    for(let i = 0; i < data.length; i+=4) {
      // 得到 RGBA 通道的值
      let r = data[i]
        , g = data[i+1]
        , b = data[i+2]
      if([r,g,b].every(v => v < 256 && v > 245)) data[i+3] = 0
    }
    ctx.putImageData(imageData, 0, 0)
    return this.getImgUrl()
  }

  getCanvasElement(){
    return [].slice.call(this.drawManually.dom.children).find(e => e.nodeName === 'CANVAS' && e.nodeType === 1)
  }
}

function hexToRgba(hex, opacity) {
  return (
    "rgba(" +
    parseInt("0x" + hex.slice(1, 3)) +
    "," +
    parseInt("0x" + hex.slice(3, 5)) +
    "," +
    parseInt("0x" + hex.slice(5, 7)) +
    "," +
    opacity +
    ")"
  );
}

function base64Img2Blob(code) {
  var parts = code.split(";base64,");
  var contentType = parts[0].split(":")[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;

  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], {
    type: contentType
  });
}
function isElement (obj) {
  return !!(obj && typeof obj.nodeName === 'string' && typeof obj.nodeType === 'number')
}

function downloadFile(canvas, fileName) {
  var aLink = document.createElement("a");
  var blob = base64Img2Blob(canvas.toDataURL(`image/${exportTypeO}`, qualityO)); //new Blob([content]);
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent("click", false, false); //initEvent 不加后两个参数在FF下会报错
  aLink.download = fileName;
  aLink.href = URL.createObjectURL(blob);
  aLink.click();
  aLink.dispatchEvent(evt);
  return aLink.href
}
function isPc () {
  const u = typeof navigator !== 'undefined' ? navigator.userAgent : 'other';
  if (u.match(/compatible/i) || u.match(/Windows/i) || u.match(/Macintosh/i) || u.match(/MacIntel/i)) {
    return true
  } else if (u.match(/iphone/i) || u.match(/Ipad/i) || u.match(/android/i)) {
    return false
  } else {
    return true
  }
}
export default TransHtmlToImage;
