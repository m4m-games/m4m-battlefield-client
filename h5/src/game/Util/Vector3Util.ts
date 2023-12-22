export class Vector3Util {
    private static instance: Vector3Util;
    public static get Instance(): Vector3Util {
        if (this.instance == null) {
            this.instance = new Vector3Util();
        }
        return this.instance;

    }
    public MoveTo(current: m4m.math.vector3, target: m4m.math.vector3, distance: number): m4m.math.vector3 {
        let a: m4m.math.vector3 = m4m.math.pool.new_vector3();
        m4m.math.vec3Subtract(target, current, a);
        let magnitude: number = m4m.math.vec3Length(a);
        if (magnitude <= distance) {
            m4m.math.vec3Clone(target, a);
        } else {
            m4m.math.vec3ScaleByNum(a, distance / magnitude, a);
            m4m.math.vec3Add(a, current, a);
        }
        return a;
    }
}