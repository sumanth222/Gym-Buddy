export class SessionObject{
    id: string;
    user_id: string;
    trainer_id: string;
    status: string;
    requested_time: string;
    requested_date: Date;
    location: string;
    feedback: string;
    created_date: Date;
    description: string;

    constructor(id: string,user_id: string, trainer_id: string, status: string, req_date: Date, req_time: string, location: string, 
        feedback: string, created_date: Date, description: string
    ){
        this.id = id;
        this.user_id = user_id;
        this.trainer_id = trainer_id;
        this.status = status;
        this.requested_date = req_date;
        this.requested_time = req_time;
        this.location = location;
        this.feedback = feedback;
        this.created_date = created_date;
        this.description = description
    }
}