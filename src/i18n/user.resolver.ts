import { ExecutionContext, Injectable } from '@nestjs/common'
import { I18nResolver } from 'nestjs-i18n'

@Injectable()
export class UserResolver implements I18nResolver {
  resolve(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest()
    const user = request?.user
    return user?.language || user?.country
  }
}
