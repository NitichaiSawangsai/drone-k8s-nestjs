import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface Response<T> {
  statusCode: number
  message: string
  data: T
}

@Injectable()
export class TransformInterceptor<T>
implements NestInterceptor<T, Promise<Response<T>>> {
  constructor(private readonly _i18n: I18nService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<Response<T>>>> {
    const lang =
      context.switchToHttp().getRequest()?.headers?.['x-lang'] ||
      context.switchToHttp().getRequest()?.user?.student?.['language']
    return next.handle().pipe(
      map(async data => {
        const message = await this._i18n.translate(
          data?.message || 'index.SUCCESS_MESSAGE.SUCCESS',
          { lang, args: data?.args },
        )
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          timestamp: new Date().toLocaleDateString(),
          message: message,
          data: data?.message ? null : data ? data : null,
          length: data ? data.length : 0,
        }
      }),
    )
  }
}
