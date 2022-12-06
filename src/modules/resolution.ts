import { cover, contain, ComputedRatio } from './comratio'

export default new class Resolution {
  app: HTMLElement | null;
  width: number;
  height: number;
  mode: 'production'|'cover'|'contain';
  computed: ComputedRatio;
  _inited: boolean;

  constructor() {
    this.app = null
    this.width = 0
    this.height = 0
    this.mode = 'production'
    this.computed = {width: 0, height: 0, top: 0, left: 0, ratio: 0, offset: false};
    this._inited = false
    window.addEventListener('resize', () => this.resize())
  }
  init(app: HTMLElement, width: number, height: number) {
    this.app = app
    this.app.style.transformOrigin = '0 0';
    this.width = width
    this.height = height
    this.setSize(width, height)
    this._inited = true
  }
  setSize(width: number, height: number) {
    (this.app as HTMLElement).style.width = width + 'px';
    (this.app as HTMLElement).style.height = height + 'px';
  }
  setMode(v: 'production'|'cover'|'contain') {
    if (['production', 'contain', 'cover'].indexOf(v) === -1) throw Error('Incorrect value');
    this.mode = v;
    if (v !== 'cover') {
      document.body.style.overflow = 'hidden';
    }
    this.resize();
  }
  resize() {
    if (!this._inited) return
    else if (this.mode === 'production') return (this.app as HTMLElement).style.transform = ''
    else if (this.mode === 'contain') {
      this.computed = contain(innerWidth, innerHeight, this.width, this.height);
      const {width, height, top, left, ratio, offset} = this.computed;
      (this.app as HTMLElement).style.transform = `translate(${left}px, ${top}px) scale(${ratio})`
    }
    else if (this.mode === 'cover') {
      this.computed = cover(innerWidth, innerHeight, this.width, this.height, 0, 0);
      const {width, height, top, left, ratio, offset} = this.computed;
      (this.app as HTMLElement).style.transform = `translate(${left}px, ${top}px) scale(${ratio})`;
      if (offset) {
        document.body.style.overflowX = 'auto';
        document.body.style.overflowY = 'hidden';
      } else {
        document.body.style.overflowX = 'hidden';
        document.body.style.overflowY = 'auto';
      }
    }
  }
}