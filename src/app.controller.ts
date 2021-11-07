import { Body, Controller, Get, Ip, Param, Post, Query, Req, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiCreatedResponse } from '@nestjs/swagger';
import { I18nService } from 'nestjs-i18n';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly i18n: I18nService,
    ) {}

  @Get()
  async getHello(): Promise<unknown> {
    // return { message: 'index.HELLO_MESSAGE',args:{ username: 'Nitichai'  } }
    throw new UnauthorizedException({
      message: 'index.HELLO_MESSAGE',
      data: { username: 'Nitichai' }
    })
    // throw new UnauthorizedException('index.HELLO_MESSAGE')
    console.log(await this.i18n.translate('index.HELLO_MESSAGE', {
      args: { id: 1, username: 'Nitichai' },
    }));
    return this.appService.getHello();
  }
  
  @ApiCreatedResponse()
  @Post('webhook')
  webhook(
      @Body() data,
      @Param() param,
      @Query() query,
      @Ip() ip,
      // @Req() req,
  ) {
    console.log({
      data,
      param,
      query,
      ip,
      // req,
    })
     
  }
}
