import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { IPv4Address } from "../entities/ipv4-address";

export function validateCidrNotation(str: string): IPv4Address | null {
    const ip = IPv4Address.parse(str);
    return (ip && ip.bits) ? ip : null;
}

export function validateIpAddress(str: string): IPv4Address | null {
    return IPv4Address.parse(str);
}

export function cidrNotationValidator(fieldName: string): ValidatorFn {
    function errorResult(value: any): ValidationErrors {
        return { fieldName: { value: value } };
    }

    return (control: AbstractControl): ValidationErrors | null => {
        if (!validateCidrNotation(control.value || "")) {
            return errorResult(control.value);
        }
        return null;
    };
}

export function ipAddressValidator(fieldName: string): ValidatorFn {
    function errorResult(value: any): ValidationErrors {
        return { fieldName: { value: value } };
    }

    return (control: AbstractControl): ValidationErrors | null => {
        if (!validateIpAddress(control.value || "")) {
            return errorResult(control.value);
        }
        return null;
    };
}
