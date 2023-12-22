export class ShowAttackManager {

    public static get Instance(): ShowAttackManager {
        if (this._instance == null) {
            this._instance = new ShowAttackManager();
        }
        return this._instance;
    }
    public Attackstate: number;
    private static _instance: ShowAttackManager;
}