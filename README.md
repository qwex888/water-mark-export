## 功能介绍

快速将你指定的元素通过canvas转为带有自定义水印显示的图片，并且支持png于jpg的预览和下载、导出。

## 安装

```
npm i water-mark-export -D
#or
yarn add water-mark-export -D
#of
pnpm i water-mark-export -D
```

## 快速上手

### 使用示例

```js
import TransHtmlToImage from 'water-mark-export'

const transf = new TransHtmlToImage({
        // 绑定元素, 必须
        // 其他配置均为可选参数
        element: document.getElementById("box"),
        showWaterMark: true, // 是否添加水印，默认false
        autoDownload: false, // 是否生成图片后自动下载，默认false
        // fileName: 'file', // 导出图片的名称，默认当前时间戳
        // 水印配置项,皆为可选项
        // waterMark:{
          // textAlign: "center", // 文字排列
          // textBaseline: "middle", // 文本基线
          // font: "32px Microsoft Yahei", // 文本字体
          // fillStyle: "#c4c4c4", // 文本颜色
          // content: "请勿外传", // 文字内容
          // rotate: 45, // 旋转角度
          // spaceX: 200, // 水印列间距
          // spaceY: 200, // 水印行间距
          // numbers: 500, // 水印数量
          // alpha: 0.3, // 水印透明度
        // }
      });

transf.callOfTheGodDragon();
```

### 获取图片的url

```js
// transf.callOfTheGodDragon();
// callOfTheGodDragon 是综合方法，toImage是转成canvas的实际触发方法
await transf.toImage()
const imgUrl = transf.getImgUrl()
```

### 手动触发下载

```js
// 支持自动下载，可以在配置项中修改,需要先渲染才能下载
await transf.toImage()
transf.downloadImg();
```

### 动态设置水印

```js
// transf.setWaterMark(type, value)
// type : "rotate" | "spaceX" | "spaceY" | "fillStyle" , 或者是水印配置对象
// value 实际值

transf.setWaterMark('fillStyle', '#ffffff')
transf.setWaterMark('alpha', '0.1')
transf.setWaterMark('rotate', '45')

await transf.setWaterMark(waterMarkOptions)

const imgUrl = transf.getImgUrl()
```

## API

### Props

参数名称|是否必填|说明|类型|默认
:-|:-:|:-|:-:|:-:
element|必填|指定要渲染的元素|ref、event|
useCORS|可选|元素包含网络图片，是否支持跨域|Boolean|true
showWaterMark|可选|生成图片是否显示水印|Boolean|false
autoDownload|可选|是否生成图片后自动下载|Boolean|false
waterMark|可选|水印定义选项|Object|详见下方定义
fileName|可选|定义下载图片名称|String|时间戳
exportExt|可选|定义导出图片类型后缀|jpeg、png|jpeg
quality|可选|定义导出图片质量，范围（0~1）|Number|1
format|可选|定义生成的预览图片格式,blob更流畅，base64兼容更好|base64、blob|base64

### Methods

通过组件实例调用的方法。

名称|说明|传参|回调参数
:-|:-|:-:|:-:
callOfTheGodDragon|一键执行转换导出| |imgUrl
toImage|通过html2canvas转换为canvas|element`可选`|canvas
addWaterMark|手动执行触发水印添加函数| |canvas
downloadImg|手动执行触发图片下载| |imgUrl
getImgUrl|获取可用于预览的图片链接| |imgUrl
setWaterMark|手动设置水印样式|`WaterMarkOptions` or `string`|imgUrl

### 水印配置项

参数名|说明|类型|默认
:-|:-|:-:|:-:
textAlign|文字排列对齐方式|String|center
textBaseline|文本基线|String|middle
font|文本字体|String|32px Microsoft Yahei
fillStyle|文本颜色,目前仅支持十六进制颜色|String|#c4c4c4
content|文字内容|String|请勿外传
rotate|旋转角度，范围(0-360)|Number|45
spaceX|水印列间距|Number|200
spaceY|水印行间距|Number|200
numbers|水印数量，调整水印的密集度|Number|500
alpha|水印透明度，范围（0-1）|Number|0.3
