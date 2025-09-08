import { AICode } from '../enums';
import { IBarcodeValue } from './barcode-value';

export interface BarcodeValueEntry {
    code: string | AICode;
    value: string | number | Date | undefined;
}

export interface BarcodeData extends Omit<IBarcodeValue, 'pluck'> {
    values: BarcodeValueEntry[];
    getApplicationIdentifier(
        identifierCode: string | AICode
    ): string | number | Date | undefined;
}

export class ParsedBarcode implements BarcodeData {
    private _errorMessage = '';
    private _success = true;
    private _checkDigit = -1;

    constructor(
        readonly symbology: string,
        readonly rawValue: string,
        readonly values: BarcodeValueEntry[]
    ) {}

    public get errorMessage(): string {
        return this._errorMessage;
    }

    public set errorMessage(value: string) {
        this._errorMessage = value;
    }

    public get success(): boolean {
        return this._success;
    }

    public set success(value: boolean) {
        this._success = value;
    }

    public get checkDigit(): number {
        return this._checkDigit;
    }

    public set checkDigit(value: number) {
        this._checkDigit = value;
    }

    public getApplicationIdentifier(
        identifierCode: string | AICode
    ): string | number | Date | undefined {
        return this.values.find(({ code }) => code === identifierCode)?.value;
    }
}
