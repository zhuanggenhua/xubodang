import { _decorator, Color, Component, GradientRange, instantiate, Node, ParticleSystem, ParticleSystem2D, Prefab } from 'cc';
import { mapH, mapW } from '../global/DataManager';
const { ccclass, property } = _decorator;

const blinkInterval =  0.5 // 闪烁间隔时间（秒）

@ccclass('HomeMgr')
export class HomeMgr extends Component {
    @property(Prefab)
    bg_light: Prefab = null;
    particleInstances: Node[] = [];
    

    onLoad() {
        this.particleInstances = []; // 存储生成的粒子对象引用
        let spacing = mapW / (10 + 1); // 计算粒子间的间距

        for (let i = 0; i < 10; i++) { // 假设生成10个粒子对象
            const particle = instantiate(this.bg_light); // 创建新的粒子实例
            // 设置粒子颜色为金色，稍微透明
            particle.getComponent(ParticleSystem2D).startColor = new Color(255, 215, 0, 0.5); // 金色，半透明
            particle.getComponent(ParticleSystem2D).endColor =new Color(255, 215, 0, 0); // 金色，完全透明

            this.node.addChild(particle); // 将新粒子添加到当前节点的子节点中
            this.particleInstances.push(particle); // 保存粒子实例的引用
            
            
            // 设置粒子对象的位置
            let posX = spacing * (i + 1) - mapW / 2; // 计算每个粒子的X坐标位置
            let posY = -mapH / 2; // 假设屏幕底部的Y坐标位置
            particle.setPosition(posX, posY);
            
        }
    }

    start() {
        this.schedule(this.blinkParticles, blinkInterval);
    }
    blinkParticles() {
        this.particleInstances.forEach((particle) => {
            particle.active = !particle.active; // 切换粒子的可见性
        })
    }

    update(deltaTime: number) {
        
    }
}


