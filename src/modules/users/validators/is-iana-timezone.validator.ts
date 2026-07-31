import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isIanaTimezone', async: false })
export class IsIanaTimezoneConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    try {
      new Intl.DateTimeFormat(undefined, { timeZone: value });
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid IANA timezone`;
  }
}

export function IsIanaTimezone(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsIanaTimezoneConstraint,
    });
  };
}
