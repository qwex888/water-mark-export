interface WaterMarkOptions {
  textAlign?: "left" | "center" | "right";
  textBaseline?: "top" | "middle" | "bottom";
  font?: string;
  fillStyle?: string;
  content?: string;
  rotate?: number;
  spaceX?: number;
  spaceY?: number;
  numbers?: number;
  alpha?: number;
}
declare class TransHtmlToImage {
  /**
  * 生成图片的目标元素
  */
  element: HTMLElement;
  /**
  * html转换后的canvas
  */
  canvas?: any;
  /**
  * 生成图片的url链接
  */
  imgUrl?: string;
  /**
  * 是否生成图片后自动下载
  */
  autoDownload?: boolean;
  /**
  * 生成图片是否显示水印
  */
  showWaterMark?: boolean;
  /**
  * 水印定义选项
  */
  waterMark?: WaterMarkOptions;
  /**
  * 定义下载图片名称
  */
  fileName?: string;
  /**
  * 定义导出图片类型后缀
  */
  exportExt?: 'jpeg' | 'png';
  /**
  * 定义导出图片质量，范围（0~1）
  */
  quality?: number;
  /**
  * 定义生成的预览图片格式，可选项base64、blob
  */
  format?: 'base64' | 'blob'

  constructor({
    element,
    showWaterMark,
    waterMark,
    autoDownload,
    fileName,
    exportExt,
    quality,
    format
  }: {
    element: HTMLElement;
    showWaterMark?: boolean;
    waterMark?: WaterMarkOptions;
    autoDownload?: boolean;
    fileName?: string;
    exportExt?: 'jpeg' | 'png';
    quality?: number;
    format?: 'base64' | 'blob'
  });
  /**
  * 通过html2canvas转换为canvas
  */
  toImage?(element?: HTMLElement): Function
  /**
  * 手动执行触发水印添加函数
  */
  addWaterMark?(): PromiseConstructor
  /**
  * 手动执行触发图片下载
  */
  downloadImg?(): Function
  /**
  * 获取可用于预览的图片链接
  */
  getImgUrl?(): Function
  /**
  * 一键执行转换导出
  */
  callOfTheGodDragon?(): void
  /**
  * 手动设置水印样式
  */
  setWaterMark?(
    type: "rotate" | "spaceX" | "spaceY" | "fillStyle" | WaterMarkOptions,
    value: string | number | undefined
  ): Function

}
export default TransHtmlToImage;
