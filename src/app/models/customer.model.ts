export interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    phoneNo:string;
    emailAddress:string;
    roles: string[];
    emailConfirmed:boolean;
    isLocked:boolean;
}