
import { Field, Model, Validators } from "rethinkts";

export class Alias extends Model {
    @Field()
    public id: string;

    @Field()
    public name: string;

    @Field()
    public createdAt: any; // TODO: Find datetime thing

    @Field()
    public token: string;

    @Field()
    public command: string;

    @Field()
    public commandName: string;

    @Field()
    public arguments: Object[];
}
