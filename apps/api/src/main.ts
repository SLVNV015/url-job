import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { cleanupOpenApiDoc, ZodValidationPipe } from 'nestjs-zod';
import { GlobalExceptionFilter } from 'src/shared/global-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const config = app.get(ConfigService);

  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder().setTitle('URL Jobs').build();
  let document = SwaggerModule.createDocument(app, swaggerConfig);
  document = cleanupOpenApiDoc(document);

  SwaggerModule.setup('docs', app, document);

  const PORT = config.get<number>('PORT') || 3000;
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application listening on port ${PORT}`);
  logger.debug(`docs is available on http://localhost:${PORT}/docs`);

  const handleFatalError = async (err: Error, type: string) => {
    logger.error(`Fatal error ${type}: ${err.message}`, err.stack);

    try {
      logger.log(`Shutting down gracefully`);

      await Promise.race([
        app.close(),
        new Promise((_resolve, reject) =>
          setTimeout(() => reject(new Error(`Shutdown timeout`)), 5000),
        ),
      ]);

      logger.log(`Shutdown complete, application stopped`);
      process.exit(1);
    } catch (error) {
      logger.error(error);
      process.exit(1);
    }
  };

  process.on('uncaughtException', (err) => handleFatalError(err, 'uncaught'));
  process.on('unhandledRejection', (err) =>
    handleFatalError(err as unknown as Error, 'unhandled'),
  );
}
bootstrap();
