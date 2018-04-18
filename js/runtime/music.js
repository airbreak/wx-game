/**
 * Created by jiangjianming@bmkp.cn on 2018/4/11.
 */
let instance

const playImg = new Image()
playImg.src = 'images/play.png'

const pauseImg = new Image()
pauseImg.src = 'images/pause.png'

const playPauseBtnWidth = 30

/*
* 统一的音效管理器
* */
export default class Music {
    constructor (){
        if( instance ){
            return instance
        }
        instance = this

        this.bgmAudio = new Audio()
        this.bgmAudio.loop = true
        this.bgmAudio.src='audio/bgm.mp3'

        this.shootAudio = new Audio()
        this.shootAudio.src ='audio/bullet.mp3'

        this.boomAudio = new Audio()
        this.boomAudio.src = 'audio/boom.mp3'

        this.playBgm()

        /*
        * 重新开始按钮区域
        * 方便简易判断按钮点击
        * */
        this.btnArea = {
          startX: 0,
          startY: 40,
          endX: 5 + playPauseBtnWidth,
          endY: 40 + playPauseBtnWidth
        }
    }

    renderCtrlMusicBtn(ctx,isPlay = false){
        let img = playImg
        if(!isPlay){
            img = pauseImg
        }
        ctx.drawImage(img, 5, 50, playPauseBtnWidth, playPauseBtnWidth);
    }

    playBgm() {
        this.bgmAudio.play()
    }

    playShoot() {
        this.shootAudio.currentTime = 0
        this.shootAudio.play()
    }

    playExplosion() {
        this.boomAudio.currentTime = 0
        this.boomAudio.play()
    }

    ctrlAudio(flag = true) {
      if(!flag){
        this.boomAudio.pause()
        this.shootAudio.pause()
        this.bgmAudio.pause()
      }else{
        this.boomAudio.play()
        this.shootAudio.play()
        this.bgmAudio.play()
      }
    }
}