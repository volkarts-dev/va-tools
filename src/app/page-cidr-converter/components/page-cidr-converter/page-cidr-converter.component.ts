import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { cidrNotationValidator, ipAddressValidator, validateCidrNotation, validateIpAddress } from '../../directives/cidr-notation-validator.directive';
import { FromCidrConversionResult, ToCidrConversionResult } from '../../entities/cidr-conversion-result';
import { CidrConversionService } from '../../services/cidr-conversion.service';

@Component({
    selector: 'app-page-cidr-converter',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './page-cidr-converter.component.html',
    styles: ``
})
export class PageCidrConverterComponent {
    fromCidrForm = this.formBuilder.group({
        cidrIp: ['', [
            Validators.required,
            cidrNotationValidator("cidrIp"),
        ]],
    });

    toCidrForm = this.formBuilder.group({
        startIp: ['', [
            Validators.required,
            ipAddressValidator("startIp"),
        ]],
        endIp: ['', [
            Validators.required,
            ipAddressValidator("endIp"),
        ]],
    });

    get cidrIp() { return this.fromCidrForm.get("cidrIp"); }
    get startIp() { return this.toCidrForm.get("startIp"); }
    get endIp() { return this.toCidrForm.get("endIp"); }

    fromCidrFormSubmitted: boolean = false;
    fromCidrResult: FromCidrConversionResult | null = null;
    toCidrFormSubmitted: boolean = false;
    toCidrResult: ToCidrConversionResult | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private conversionService: CidrConversionService,
    ) {
    }

    onSubmitFromCidr() {
        this.fromCidrFormSubmitted = true;

        const value = this.fromCidrForm.value['cidrIp'];
        if (!value) {
            return;
        }

        const ip = validateCidrNotation(value);
        if (!ip) {
            return;
        }

        this.fromCidrResult = this.conversionService.convertFromCidr(ip);
    }

    onSubmitToCidr() {
        this.toCidrFormSubmitted = true;

        const start = this.toCidrForm.value["startIp"];
        if (!start) {
            return;
        }
        const end = this.toCidrForm.value["endIp"];
        if (!end) {
            return;
        }

        const startIp = validateIpAddress(start);
        if (!startIp) {
            return;
        }
        const endIp = validateIpAddress(end);
        if (!endIp) {
            return;
        }

        this.toCidrResult = this.conversionService.convertToCidr(startIp, endIp);
    }
}
