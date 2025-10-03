import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get } from '@nestjs/common';

@Controller()
class AppController {
  @Get('/')
  health() {
    return { ok: true, service: 'api-gateway' };
  }
}

@Module({
  controllers: [AppController],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(4000);
  // eslint-disable-next-line no-console
  console.log('API Gateway listening on http://localhost:4000');
}
bootstrap();
