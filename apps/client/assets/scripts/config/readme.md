
# 计算公式
+ 平均每回合一点价值
+ 1气 = 2 伤害价值
+ 快速 伤害-1
+ 远程 伤害+ 1 * power/2  通常是快速攻击，所以抵消  龟波气功，二费打5
+ 对空/对地 伤害+1/+2
+ 范围+1  伤害-1
+ 闪避 特殊判断，跳可以闪远程，不能闪近战
+ pierce穿透 伤害 - 1
+ 防御 伤害价值/2
+ 持续 伤害价值/2

# 属性值映射
+ type：类型 0 蓄力 1 攻击 2 防御 3 闪避 4 持续 5 特殊    根据类型决定判断哪些属性
+ power：蓄力的力量
+ speed： 0 慢速 1 快速   平局就是双赢
+ target：0 对方 1 自己    比如血祭，同时是蓄力与攻击，目标自己，伤害 1，power 2
+ range：0 地面 1 天空 2 地下     没有地下
+ longrang: 是否远程射击
+ pierce：是否穿透防御 
+ hand: 手势 0 手掌 1 双指 2 四指 3 中指   默认1远程2近战3闪避 防御交叉
+ location 当前角色位置，通常只影响一回合
+ particle  图标
+ animal： 动作模块