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
    waterMark,
    autoDownload = false,
    fileName,
    exportExt,
    quality,
    format
  }) {
    this.element = element;
    this.canvas = null;
    this.imgUrl = "";
    this.autoDownload = autoDownload;
    this.showWaterMark = showWaterMark ? showWaterMark : false;
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
    this.exportType = exportExt || 'jpeg'
    this.fileName = fileName ?
      fileName + '.' + this.exportType :
      new Date().getTime() + "." + this.exportType
    this.quality = typeof quality === 'number' && quality <= 1 && quality > 0 ? quality : 1
    this.format = format || 'base64'
    qualityO = this.quality
    exportTypeO = this.exportType
  }
  async toImage(element) {
    if (element !== undefined) {
      this.element = element;
    }
    const config = {
      backgroundColor: "#ffffff",
      // allowTaint: true,
      // useCORS: true,
    };
    if (this.waterMark.width)
      (config.scale = 1),
      (config.width = config.windowWidth = this.waterMark.width);
    if (this.waterMark.height)
      config.height = config.windowHeight = this.waterMark.height;
    this.canvas = await html2canvas(this.element, config);
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
      // console.log(this.canvas.width,this.canvas.height,"canvas: width and height");
      let top = -nc / 2;
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
        // console.log(left, top);
        ctx.fillText(this.waterMark.content, left, top);
      }
      resolve(this.canvas);
    });
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
    await this.toImage();
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
    await this.toImage();
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

export default TransHtmlToImage;
