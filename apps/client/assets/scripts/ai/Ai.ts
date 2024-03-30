import { animation, AnimationClip, Sprite, SpriteFrame } from 'cc'
import { Singleton } from '../common/base'
import EventManager from '../global/EventManager'
import { EventEnum } from '../enum'
import { IActor } from '../common'
import DataManager from '../global/DataManager'
import actors from '../config/actor'

export default class Ai extends Singleton {
  static get Instance() {
    return super.GetInstance<Ai>()
  }
  id: number = -1
  actor: IActor

  setActor(type){
    this.actor = actors[type]
  }

  excute() {
    const actor = DataManager.Instance.actors.get(this.id)
    
    const skills = this.actor.skills
    EventManager.Instance.emit(EventEnum.useSkill, skills[0][3], 0, this.id)
    // switch (actor.power) {
    //   case 0:
    //     break
    // }
  }

  reset() {
    this.actor = null
  }
}