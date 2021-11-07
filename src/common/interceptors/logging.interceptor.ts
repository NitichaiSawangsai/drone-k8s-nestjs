import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler,
  Logger,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest()
    const method = req.method
    const url = req.url
    const now = Date.now()
    const user = req?.user

    return next
      .handle()
      .pipe(
        tap(() =>
          Logger.log(
            `[${
              user ? 'ID: ' + user.id : 'GUEST'
            }] ${method} ${url} ${Date.now() - now}ms`,
            context.getClass().name,
          ),
        ),
      )
  }
}
