import { BaseReader } from '../../readers/base.reader';
import { IBarcodeValue, IReaderConfiguration } from '../../models';
import { ParsedBarcode } from '../../models/parsed-barcode';

const REG = /[0-9]/;
const SYMBOLOGY = 'MYSYMBOLOGY';

class TestReader extends BaseReader {
    public decodeOrThrow(): ParsedBarcode {
        throw new Error('Method not implemented.');
    }

    constructor(readerConfig?: IReaderConfiguration) {
        super(SYMBOLOGY, REG, readerConfig);
    }

    public get config() {
        return this._readerConfig;
    }

    public validate(val: string) {
        return super.validate(val);
    }

    public decode(): IBarcodeValue {
        return {} as IBarcodeValue;
    }
}

describe('baseReader', () => {
    const config = {} as IReaderConfiguration;
    let classUnderTest: TestReader;

    beforeEach(() => {
        classUnderTest = new TestReader(config);
    });

    test('should set symbology', () => {
        classUnderTest = new TestReader({} as IReaderConfiguration);
        expect(classUnderTest.symbology).toBe(SYMBOLOGY);
    });

    test('should set readerConfig', () => {
        classUnderTest = new TestReader(config);
        expect(classUnderTest.config).toBe(config);
    });

    describe('validate', () => {
        test('should validate using validationExpression', () => {
            expect(classUnderTest.validate('1')).toBe(true);
            expect(classUnderTest.validate('a')).toBe(false);
        });
    });
});
