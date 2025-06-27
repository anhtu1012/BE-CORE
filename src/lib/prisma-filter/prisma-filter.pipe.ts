import { Injectable, PipeTransform } from '@nestjs/common';
import { IFilterOr } from './prisma-filter.interface';
import { FilterParser } from './prisma-filter.parser';
import { IGeneratedFilter, OrderBy } from '@chax-at/prisma-filter';

@Injectable()
export class DirectOrFilterPipe<TDto, TWhereInput>
  implements PipeTransform<IFilterOr<TDto>, IGeneratedFilter<TWhereInput>>
{
  private readonly filterParser: FilterParser<TDto, TWhereInput>;

  constructor(
    keys: Array<keyof TDto & keyof TWhereInput & string>,
    compoundKeys: string[] = [],
    defaultOrderBy: OrderBy<TWhereInput> = [],
  ) {
    const mapping: { [p in keyof TDto]?: keyof TWhereInput & string } =
      Object.create(null);
    for (const key of keys) {
      mapping[key] = key;
    }
    for (const untypedKey of compoundKeys) {
      (mapping as any)[untypedKey] = untypedKey;
    }
    this.filterParser = new FilterParser<TDto, TWhereInput>(
      mapping,
      false,
      defaultOrderBy,
    );
  }

  public transform(value: IFilterOr<TDto>): IGeneratedFilter<TWhereInput> {
    return {
      ...value,
      findOptions: this.filterParser.generateQueryFindOptions(value),
    };
  }
}
