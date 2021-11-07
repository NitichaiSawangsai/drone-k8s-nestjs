import { Catch, ExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

interface ExceptionError {
  status?: number
  error?: string
  message?: string
  response?: {
    status?: number
    statusCode?: number
    error?: string
    message?: string
    inputError?: JSON
  }
}

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  constructor(private readonly _i18n: I18nService) {}
  async catch(exception: ExceptionError, host: ArgumentsHost): Promise<void> {
    const context = host.switchToHttp()
    const request = context.getRequest()
    const response = context.getResponse()
    const user = request?.user
    const args = exception?.response['data']
    const status =
      exception.status ||
      exception?.response?.status ||
      exception?.response?.statusCode ||
      500
    const lang = request?.i18nLang
    const error = exception?.error || exception?.response?.error || 'ERROR'
    const message =
      exception?.response?.message ||
      exception?.message ||
      'index.ERROR_MESSAGE.INTERNAL_ERROR'
    const inputError = exception?.response?.inputError
    const translateMessege =
      typeof message !== 'object'
        ? await this._i18n.translate(message, { lang, args })
        : message
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method,
      error,
      message: inputError || translateMessege,
    }

    Logger.error(
      `[${user ? 'ID: ' + user.id : 'GUEST'}] ${request.method} ${
        request.url
      }`,
      JSON.stringify(errorResponse),
      'ExceptionFilter',
    )

    response.status(status).json(errorResponse)
  }
}
