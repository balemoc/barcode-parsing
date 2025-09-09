import { AICode } from '../enums';
import { IBarcodeValue } from './barcode-value';

export interface BarcodeValueEntry {
    code: string | AICode;
    value: string | number | Date | undefined;
}

export interface BarcodeData
    extends Omit<IBarcodeValue, 'pluck' | 'errorMessage' | 'success'> {
    values: BarcodeValueEntry[];
    getApplicationIdentifier<T extends string | number | Date>(
        identifierCode: string | AICode
    ): T | undefined;
}

export class ParsedBarcode implements BarcodeData {
    constructor(
        readonly symbology: string,
        readonly rawValue: string,
        readonly values: BarcodeValueEntry[],
        readonly checkDigit = -1
    ) {}

    public getApplicationIdentifier<T>(identifierCode: string | AICode): T | undefined {
        return this.values.find(({ code }) => code === identifierCode)
            ?.value as T | undefined;
    }
}
