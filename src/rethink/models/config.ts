
import { Field, Model } from "rethinkts";

/**
 * Config database model
 * 
 * @export
 * @class Config
 * @extends {Model}
 */
export class Config extends Model {
    @Field()
    public id: string;

    @Field()
    public token: string;

    @Field()
    public services: Object;

    @Field()
    public announce: Object;

    @Field()
    public spam: Object;
}
