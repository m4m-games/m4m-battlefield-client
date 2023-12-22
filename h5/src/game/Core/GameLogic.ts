
/**
 * 游戏逻辑相关
 * 这是一个存储游戏逻辑相关我们希望全局可访问的东西的地方，都是静态
 */
export class GameLogic {
    // constants

    //game layers-------------------------------------------------------------------------------
    public static readonly layerIndexDefault = 0;
    public static readonly layerIndexGround = 8;
    public static readonly layerIndexActor = 9;
    public static readonly layerIndexBuilding = 10;
    /** ui之上3d模型 */
    public static readonly layerIndexOverUI3d = 30;

    //bit 二进制---------------------------------------------------------------------------------
    public static readonly layerBitDefault = 1 << GameLogic.layerIndexDefault;
    public static readonly layerBitGround = 1 << GameLogic.layerIndexGround;
    public static readonly layerBitActor = 1 << GameLogic.layerIndexActor;
    public static readonly layerBitBuilding = 1 << GameLogic.layerIndexBuilding;
    /** ui之上3d模型 */
    public static readonly layerBitOverUI3d = 1 << GameLogic.layerIndexOverUI3d;

}