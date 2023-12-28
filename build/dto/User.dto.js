"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginCustomerInput = exports.CreateCustomerInput = void 0;
const class_validator_1 = require("class-validator");
class CreateCustomerInput {
}
exports.CreateCustomerInput = CreateCustomerInput;
__decorate([
    (0, class_validator_1.IsEmail)()
], CreateCustomerInput.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Phone number is required" }),
    (0, class_validator_1.Length)(11, 11, { message: "Phone number must be 11 digits" })
], CreateCustomerInput.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Password is required" }),
    (0, class_validator_1.Length)(6, 20)
], CreateCustomerInput.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "First name is required" }),
    (0, class_validator_1.Length)(1, 12, { message: "First name must be between 1 and 12 characters" })
], CreateCustomerInput.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Last name is required" }),
    (0, class_validator_1.Length)(1, 12, { message: "Last name must be between 1 and 12 characters" })
], CreateCustomerInput.prototype, "lastName", void 0);
class LoginCustomerInput {
}
exports.LoginCustomerInput = LoginCustomerInput;
__decorate([
    (0, class_validator_1.IsEmail)()
], LoginCustomerInput.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Password is required" }),
    (0, class_validator_1.Length)(6, 20)
], LoginCustomerInput.prototype, "password", void 0);
