import { BaseReader } from './base.reader';
import { AimParser } from '../utils';
import { IBarcodeValue, BarcodeValue, IReaderConfiguration } from '../models';
import { ParsedBarcode } from '../models/parsed-barcode';

export class BaseGtinReader extends BaseReader {
    constructor(
        symbology: string,
        validationExpression: RegExp,
        readerConfig?: IReaderConfiguration
    ) {
        super(symbology, validationExpression, readerConfig);
    }

    protected checkDigit(value: string): number {
        return parseInt(value.substring(value.length - 1), undefined);
    }

    protected parseValues(value: string): string {
        return AimParser.parseAimCode(this.symbology, value);
    }

    public decode(value: string): IBarcodeValue {
        const result = new BarcodeValue(this.symbology, value);
        try {
            this.tryValidate(value);
            result.values = this.parseValues(value);
            result.checkDigit = this.checkDigit(value);
        } catch (ex) {
            result.success = false;
            result.errorMessage = ex instanceof Error ? ex.message : JSON.stringify(ex);
        }
        return result;
    }

    public decodeOrThrow(value: string): ParsedBarcode {
        this.tryValidate(value);
        return new ParsedBarcode(
            this.symbology,
            value,
            [],
            this.checkDigit(value)
        );
    }
}
