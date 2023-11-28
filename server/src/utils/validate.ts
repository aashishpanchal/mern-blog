import { defaultsDeep } from 'lodash';
import { validate as classValidate } from 'class-validator';
import { ClassConstructor, plainToClass } from 'class-transformer';
import type { ValidatorOptions } from 'class-validator';

export async function validate<T, V>(
  type: ClassConstructor<T>,
  value: V,
  options?: ValidatorOptions,
) {
  // step 1: transform data to dto
  let entity = plainToClass(type, value, {
    enableImplicitConversion: true,
  });

  const isCtorNotEqual = entity.constructor !== type;

  if (isCtorNotEqual) entity.constructor = type;

  // step 2: validate dto with class-validator
  options = defaultsDeep(options, {
    whitelist: true,
    forbidUnknownValues: false,
  });
  const errors = await classValidate(entity as any, options);

  // step 3: throw validation errors
  if (errors.length > 0) throw errors;

  // finally return dto with validated data
  return entity;
}
