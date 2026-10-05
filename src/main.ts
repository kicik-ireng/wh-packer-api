import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

  app.use(cookieParser());

  // // Perbaikan di sini: hapus nested `cors` dan langsung tulis opsi cors

  //   origin: '*', // Jika tidak butuh credential (cookies)
  //   // Jika perlu credential, gunakan origin spesifik dan tambahkan credentials: true
  //   // Contoh:
  //   // origin: 'http://localhost:3000',
  //   // credentials: true,
  // });

  //   // origin: true,
  //   origin: 'http://localhost:3000',
  //   credentials: true,
  // });

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:3002', 'http://localhost:3000'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
