export interface TaskInterface {
    name?: string;
    when?: Date;
    done?: boolean;
    description?: string;
    user?: string;
    _id?: string;
}

export interface TaskFilterInterface extends TaskInterface {
    untillWhen?: Date;
}