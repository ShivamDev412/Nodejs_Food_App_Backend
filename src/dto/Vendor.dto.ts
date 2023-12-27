export interface CreateVendorInput {
    name:string,
    ownerName:string,
    foodType:[string],
    pincode:string,
    address:string,
    phone:string,
    email:string,
    password:string
}
export interface VendorLoginInput {
    email:string,
    password:string
}
export interface VendorSignUpInput {
    email:string,
    password:string
}
export interface EditVendorInput {
    email:string,
    name:string,
    address:string,
    phone:string,
    foodType:[string],
}
export interface VendorPayload {
    _id:string,
}
export type AuthPayload =  VendorPayload