import Animation from '../base/animation'
import DataBus from '../databus'

const ENEMY_IMG_SRC = 'images/enemy.png'
const ENEMY_WIDTH = 60
const ENEMY_HEIGHT = 60

const __ = {
  speed: Symbol('speed')
}

let databus = new DataBus()

function rnd(start, end) {
    return Math.floor(Math.random() * (end - start) + start)
}

export default  class Ememy extends Animation {
  constructor() {
      super(ENEMY_IMG_SRC, ENEMY_WIDTH, ENEMY_HEIGHT)
      this.iniExplosionAnimation()
  }

  init(speed) {
      this.x = rnd(0,window.innerWidth - ENEMY_WIDTH)
      this.y = -this.height

      this[__.speed] = speed

      this.visible = true
  }

  // 预设爆炸的动画帧呢
  iniExplosionAnimation() {
      let frames = []

      const EXPLO_IMG_PREFIX = 'images/explosion'
      const EXPLO_FRAME_COUNT = 19

      for( let i = 0; i<EXPLO_FRAME_COUNT;i++) {
        frames.push(EXPLO_IMG_PREFIX + ( i + 1) + '.png')
      }
      this.initFrames(frames)
  }

  // 每一帧更新子弹的位置
  update() {
    this.y += this[__.speed]
     // 对象回放
     if( this.y > window.innerHeight + this.height)
       databus.removeEnemey(this)
  }
}
