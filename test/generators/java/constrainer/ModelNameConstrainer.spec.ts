import { JavaDefaultConstraints } from '../../../../src/generators/java/JavaConstrainer';
import { defaultEnumKeyConstraints, ModelEnumKeyConstraints, DefaultEnumKeyConstraints } from '../../../../src/generators/java/constrainer/EnumConstrainer';
import { DefaultModelNameConstraints, defaultModelNameConstraints, ModelNameConstraints } from '../../../../src/generators/java/constrainer/ModelNameConstrainer';
describe('ModelNameConstrainer', () => {
  test('should never render special chars', () => {
    const constrainedKey = JavaDefaultConstraints.modelName({modelName: '%'});
    expect(constrainedKey).toEqual('Percent');
  });
  test('should never render number as start char', () => {
    const constrainedKey = JavaDefaultConstraints.modelName({modelName: '1'});
    expect(constrainedKey).toEqual('Number_1');
  });
  test('should never contain empty name', () => {
    const constrainedKey = JavaDefaultConstraints.modelName({modelName: ''});
    expect(constrainedKey).toEqual('Empty');
  });
  test('should use constant naming format', () => {
    const constrainedKey = JavaDefaultConstraints.modelName({modelName: 'some weird_value!"#2'});
    expect(constrainedKey).toEqual('SomeWeirdValueExclamationQuotationHash_2');
  });
  test('should never render reserved keywords', () => {
    const constrainedKey = JavaDefaultConstraints.modelName({modelName: 'return'});
    expect(constrainedKey).toEqual('ReservedReturn');
  });
  describe('custom constraints', () => {
    test('should be able to overwrite all hooks', () => {
      const mockedConstraintCallbacks: ModelNameConstraints = {
        NAMING_FORMATTER: jest.fn().mockReturnValue(''),
        NO_SPECIAL_CHAR: jest.fn().mockReturnValue(''),
        NO_NUMBER_START_CHAR: jest.fn().mockReturnValue(''),
        NO_EMPTY_VALUE: jest.fn().mockReturnValue(''),
        NO_RESERVED_KEYWORDS: jest.fn().mockReturnValue('')
      };
      const constrainFunction = defaultModelNameConstraints(mockedConstraintCallbacks);
      constrainFunction({modelName: ''});
      //Expect all callbacks to be called
      for (const jestMockCallback of Object.values(mockedConstraintCallbacks)) {
        expect(jestMockCallback).toHaveBeenCalled();
      }
    });
    test('should be able to overwrite one hooks', () => {
      //All but NAMING_FORMATTER, as we customize that
      const spies = [
        jest.spyOn(DefaultModelNameConstraints, 'NO_SPECIAL_CHAR'),
        jest.spyOn(DefaultModelNameConstraints, 'NO_NUMBER_START_CHAR'),
        jest.spyOn(DefaultModelNameConstraints, 'NO_EMPTY_VALUE'),
        jest.spyOn(DefaultModelNameConstraints, 'NO_RESERVED_KEYWORDS')
      ];
      const jestCallback = jest.fn().mockReturnValue('');
      const constrainFunction = defaultModelNameConstraints({NAMING_FORMATTER: jestCallback});
      const constrainedValue = constrainFunction({modelName: ''});
      expect(constrainedValue).toEqual('');
      for (const jestMockCallback of spies) {
        expect(jestMockCallback).toHaveBeenCalled();
      }
    });
  });
});