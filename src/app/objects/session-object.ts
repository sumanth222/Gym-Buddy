export class SessionObject{
    id: string;
    user_id: string;
    username: string;
    trainer_id: string;
    status: string;
    requested_date: Date;
    startTime: string;
    endTime: string;
    locality: string;
    feedback: string;
    created_date: Date;
    description: string;
    hours: number;
    gymName: string;
    pincode: string;
    landmark: string;
    state: string;
    rate: number

    constructor(id: string,user_id: string, username: string, trainer_id: string, status: string, req_date: Date, 
        feedback: string, created_date: Date, description: string, hrs: number, gymname: string, locality: string, landmark: string,
        state: string, pincode: string, startTime: string, endTime: string, rate: number
    ){
        this.id = id;
        this.user_id = user_id;
        this.username = username;
        this.trainer_id = trainer_id;
        this.status = status;
        this.requested_date = req_date;
        this.feedback = feedback;
        this.created_date = created_date;
        this.description = description
        this.hours = hrs;
        this.gymName = gymname;
        this.locality = locality;
        this.landmark = landmark;
        this.state = state;
        this.pincode = pincode;
        this.startTime = startTime;
        this.endTime = endTime;
        this.rate = rate
    }
}