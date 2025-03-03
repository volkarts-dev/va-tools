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
        rangeType: ['ip-mask', [
            Validators.required,
        ]],
        singleIp: ['', [
            Validators.required,
            ipAddressValidator("singleIp"),
        ]],
        maskIp: ['', [
            Validators.required,
            ipAddressValidator("maskIp"),
        ]],
    });

    get cidrIp() { return this.fromCidrForm.get("cidrIp"); }
    get rangeType() { return this.toCidrForm.get("rangeType"); }
    get singleIp() { return this.toCidrForm.get("singleIp"); }
    get maskIp() { return this.toCidrForm.get("maskIp"); }

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

        const start = this.toCidrForm.value["singleIp"];
        if (!start) {
            return;
        }
        const end = this.toCidrForm.value["maskIp"];
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

        let type = this.toCidrForm.value["rangeType"];
        switch (type) {
            case 'ip-mask':
                this.toCidrResult = this.conversionService.convertToCidrIPMask(startIp, endIp);
                break;
            case 'start-end':
                this.toCidrResult = this.conversionService.convertToCidrStartEnd(startIp, endIp);
                break;
        }

    }
}
