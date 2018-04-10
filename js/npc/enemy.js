const __ = {
  poolDic: Symbol('poolDic')
}

/*
* 简易的对象池实现
* 用于对象的存贮和重复使用
* 可以有效减少对对象创建开销和避免频繁的垃圾回收
* 提高游戏性能
*/
export default class Pool {
  constructor() {
    this[__.poolDic] = {}
  }
  /* 
  * 根据对象标识符
  * 获取对应的对象池
  */
  getPoolBySign(name) {
    return this[__.poolDic][name] || (this[__.poolDic][name] = [])
  }
}


