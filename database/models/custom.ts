import {Model} from "sequelize";

export class CustomModel extends Model {
    static async getId<M extends Model>(attributes: M['_creationAttributes']) {
        const res = await this.findOne({where: attributes});
        if(!res) {
            throw new Error(`Can not find id of the record in the table ${this.tableName}`);
        }
        return res.get("id")
    }
}