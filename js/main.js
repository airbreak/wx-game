/**
 * Created by jiangjianming@bmkp.cn on 2018/4/11.
 */

import Player from './player/index'
import Enemy from './npc/enemy'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'

let ctx = canvas.getContext('2d')
let databus = new DataBus()

/*
* 游戏主函数
* */
export default class Main {
    constructor () {
        //维护当前的requestAnimationFrame 的id
        this.aniId = 0
        this.musicPlayStatus = true
        this.restart()
    }

    restart() {
        console.log('restart1')
        databus.reset()
        canvas.removeEventListener(
            'touchstart',
            this.touchHandler
        )
        canvas.removeEventListener(
          'touchstart',
          this.touchHandlerMusicCtrl
        )
        canvas.addEventListener(
          'touchstart',
          this.touchHandlerMusicCtrl.bind(this)
        )
        this.bg = new BackGround(ctx)
        this.player = new Player(ctx)
        this.gameinfo = new GameInfo()
        this.music = new Music()
        this.bindLoop = this.loop.bind(this)
        this.hasEventBind = false

        // 清除上一局的动画
        window.cancelAnimationFrame(this.aniId)

        this.aniId = window.requestAnimationFrame(
            this.bindLoop,
            canvas
        )
        this.music.renderCtrlMusicBtn(ctx)
    }

    /*
    * 随着帧数变化的敌机生成逻辑
    * */
    enemyGenerate() {
        if(databus.frame % 30 === 0) {
            let enemy = databus.pool.getItemByClass('enemy', Enemy)
            enemy.init(6)
            databus.enemys.push(enemy)
        }
    }

    /*
    * 全局碰撞检测
    * */
    collisionDetection () {
        let that = this
        databus.bullets.forEach((bullets)=>{
            for(let i = 0,il = databus.enemys.length; i < il; i++){
                let enemy = databus.enemys[i]

                if(!enemy.isPlaying && enemy.isCollideWith(bullets)){
                    enemy.playAnimation()
                    if(that.musicPlayStatus) {
                        that.music.playExplosion()
                    }

                    bullets.visible = false

                    databus.score +=1
                    break
                }
            }
        })

        for (let i = 0, il = databus.enemys.length; i < il; i++){
            let enemy = databus.enemys[i]

            if(this.player.isCollideWith(enemy)) {
                databus.gameOver = true
                break
            }
        }
    }

    /*游戏结束后的触摸事件处理逻辑*/
    touchEventHandler (e) {
        e.preventDefault()

        let x = e.touches[0].clientX
        let y = e.touches[0].clientY

        let area = this.gameinfo.btnArea

        if(x >= area.startX
            && x <= area.endX
            && y >=area.startY
            && y <= area.endY) {
            this.restart()
        }
    }

    /*触摸事件处理逻辑, 关闭、开启音乐*/
    touchHandlerMusicCtrl(e) {
      e.preventDefault()

      let x = e.touches[0].clientX
      let y = e.touches[0].clientY

      let area = this.music.btnArea

      if (x >= area.startX
        && x <= area.endX
        && y >= area.startY
        && y <= area.endY) {
        this.musicPlayStatus = !this.musicPlayStatus
        this.music.ctrlAudio(this.musicPlayStatus)
      }
    }

    /*
    * canvas 重绘函数
    * 每一帧重新绘制所有的需要展示的元素
    * */
    render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        this.bg.render(ctx)
        this.music.renderCtrlMusicBtn(ctx,this.musicPlayStatus)

        databus.bullets
            .concat(databus.enemys)
            .forEach((item) => {
                item.drawToCanvas(ctx)
            })

        this.player.drawToCanvas(ctx)

        databus.animations.forEach((ani) =>{
            if(ani.isPlaying) {
                ani.aniRender(ctx)
            }
        })

        this.gameinfo.renderGameScore(ctx,databus.score)

        //游戏结束时停止帧循环
        if(databus.gameOver) {
            window.cancelAnimationFrame(this.aniId);
            this.gameinfo.renderGameOver(ctx,databus.score)
            if( !this.hasEventBind ) {
                this.hasEventBind = true
                this.touchHandler = this.touchEventHandler.bind(this)
                canvas.addEventListener('touchstart', this.touchHandler)
            }
        }
    }

    /*
    * 游戏逻辑更新主函数
    * */
    update() {
        if(databus.gameOver){
            return
        }
        this.bg.update()

        databus.bullets
            .concat(databus.enemys)
            .forEach((item) => {
                item.update()
            })

        this.enemyGenerate()

        this.collisionDetection()

        if(databus.frame % 20 ===0) {
            this.player.shoot()
            if(this.musicPlayStatus) {
                this.music.playShoot()
            }
        }
    }

    /*
    * 实现游戏帧循环
    *  */
    loop() {
        databus.frame ++
        this.update()
        this.render()

        this.aniId = window.requestAnimationFrame(
            this.bindLoop,
            canvas
        )
    }
}
