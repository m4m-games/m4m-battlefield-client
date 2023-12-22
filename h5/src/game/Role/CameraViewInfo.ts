/**
 * CameraViewInfo
 */
export class CameraViewInfo {
    //相机观察目标距离
    public distance: number;
    //相机观察目标偏移量
    public camViewOffset: m4m.math.vector3;
    //斜角
    public tiltAngle: number = 0;
    //环绕角
    public panAngle: number = 0;
}
