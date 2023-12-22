/**
 * 变换信息 数据
 */
export class TransformData{
    /** 位置 */
    public positon: m4m.math.vector3 = new m4m.math.vector3();
    /** 旋转（各轴欧拉角，角度值） */
    public euler: m4m.math.vector3 = new m4m.math.vector3();
    /** 缩放 */
    public scale: m4m.math.vector3 = new m4m.math.vector3();
}