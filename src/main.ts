import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { GlobalExceptionFilter } from './utils/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Menerapkan Global Try-Catch (Exception Filter) ke seluruh aplikasi
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

  app.use(cookieParser());

  // // Perbaikan di sini: hapus nested `cors` dan langsung tulis opsi cors

  //   origin: '*', // Jika tidak butuh credential (cookies)
  //   // Jika perlu credential, gunakan origin spesifik dan tambahkan credentials: true
  //   // Contoh:
  //   // origin: 'http://10.10.10.5:3000',
  //   // credentials: true,
  // });

  //   // origin: true,
  //   origin: 'http://10.10.10.5:3000',
  //   credentials: true,
  // });

  app.enableCors({
    origin: ['http://10.10.10.5:5000'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 5055);
}
bootstrap();
