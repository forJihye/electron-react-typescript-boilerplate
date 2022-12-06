import { exec, execSync } from 'child_process'
import { writeFileSync } from 'fs';
import os from 'os';
import path from 'path';
import iconv from 'iconv-lite'; // 언어 인코딩 모듈

class PrinterNameType extends String {}
const PrinterName = (p: string) => new PrinterNameType(p);

class WinPrinter {
  _inited!: Promise<[PrinterNameType[], PrinterNameType]>;
  _AllPrinters!: PrinterNameType[];
  _currentPrinter!: PrinterNameType;
  constructor() {
    if (process.platform !== "win32") {
      console.log('Only available in Windows.');
      return;
    }
    this._inited = Promise.all([
      this.getAllPrints().then(data => this._AllPrinters = data),
      this.getDefaultPrint().then(data => this._currentPrinter = data)
    ]);
  }
  
  getAllPrintsA(): Promise<string[][]> {
    return new Promise(r => {
      const stdout = iconv.decode(Buffer.from(execSync('wmic printer get')), 'cp949');
      r(stdout.replace(/[\r]/g, '').split('\n').filter(i => i.length).map(i => i.trim().split(/ {2,}/g)));
    });
  }

  getAllPrints(params = 'name'): Promise<PrinterNameType[]> {
    return new Promise(r => {
      const stdout = iconv.decode(Buffer.from(execSync(`wmic printer get ${ params }`)), 'cp949');
      r(stdout.replace(/[\r]/g, '').split('\n').filter(i => i.length).slice(1).map(i => i.trim()).map(PrinterName));
    });
  }

  getOnlinePrints(): Promise<PrinterNameType[]> {
    return new Promise(r => {
      const stdout = iconv.decode(Buffer.from(execSync('wmic printer where workoffline=false get name')), 'cp949');
      r(stdout.replace(/[\r]/g, '').split('\n').filter(i => i.length).slice(1).map(i => i.trim()).map(PrinterName));
    });
  }

  getOfflinePrints(): Promise<PrinterNameType[]> {
    return new Promise(r => {
      const stdout = iconv.decode(Buffer.from(execSync('wmic printer where workoffline=true get name')), 'cp949');
      r(stdout.replace(/[\r]/g, '').split('\n').filter(i => i.length).slice(1).map(i => i.trim()).map(PrinterName));
    });
  }
  
  getDefaultPrint(): Promise<PrinterNameType> {
    // if (localStorage['current-printer-name']) return Promise.resolve(localStorage['current-printer-name']);
    return new Promise(resolve => {
      const stdout = iconv.decode(Buffer.from(execSync('wmic printer where default=true get name')), 'cp949');
      const currentPrinterName = stdout.replace(/[\r]/g, '').split('\n').filter(i => i.length)[1].trim();
      localStorage['current-printer-name'] = currentPrinterName;
      resolve(PrinterName(currentPrinterName));
    });
  }
  
  async getStatusOfPrinters(deep: boolean = false): Promise<{online: PrinterNameType[], offline: PrinterNameType[]}> {
    if (deep) this._AllPrinters = await this.getAllPrints();
    const online = await this.getOnlinePrints();
    return {
      online,
      offline: this._AllPrinters.filter(printerName => online.indexOf(printerName) === -1),
    };
  }

  async isCurrentPrinterOnline(): Promise<boolean> {
    const onlinePrinters = await this.getOnlinePrints();
    return onlinePrinters.indexOf(this._currentPrinter) !== -1;
  };

  setCurrentPrinter(targetPrinter: PrinterNameType): boolean {
    localStorage['current-printer-name'] = this._currentPrinter = targetPrinter;
    return true;
  }

  print(image: string, printerName: PrinterNameType = this._currentPrinter): Promise<boolean> {
    return new Promise(r => {
      exec(`rundll32.exe c:/windows/System32/shimgvw.dll,ImageView_PrintTo /pt "${ image }" "${ printerName }"`, err => {
        if (err) r(false);
        r(true);
        console.log(`rundll32.exe c:/windows/System32/shimgvw.dll,ImageView_PrintTo /pt "${ image }" "${ printerName }"`);
      });
    });
  }
  async canvasPrint(canvas: HTMLCanvasElement, printerName: PrinterNameType = this._currentPrinter) {
    const imageData = canvas.toDataURL('image/png', 1.0).replace(/^data:image\/png;base64,/, "")
    const photoDir = path.resolve(os.homedir(), 'hs_print_photo.png')
    writeFileSync(photoDir, imageData, 'base64');
    return this.print(photoDir.replace(/\//g, '\\'), printerName);
  }
  async blobPrint(blob: Blob, printerName: PrinterNameType = this._currentPrinter) {
    const photoDir = path.resolve(os.homedir(), 'hs_print_photo.png')
    writeFileSync(photoDir, Buffer.from(new Uint8Array(await blob.arrayBuffer())));
    return this.print(photoDir.replace(/\//g, '\\'), printerName);
  }
  async filePrint(fileDir: string, printerName: PrinterNameType = this._currentPrinter) {
    return this.print(fileDir.replace(/\//g, '\\'), printerName);
  }
}
export default new WinPrinter