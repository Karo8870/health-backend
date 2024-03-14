import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { readFileSync } from 'fs';

async function bootstrap() {
	const app = await NestFactory.create(AppModule/*, {
		httpsOptions: {
			key: readFileSync('ssl/server.key'),
			cert: readFileSync('ssl/server.cert')
		}
	}*/);

	app.useGlobalPipes(new ValidationPipe());

	const config = new DocumentBuilder()
		.setTitle('FIICode API')
		.setDescription('The FIICode API description')
		.setVersion('1.0')
		.addTag('FIICode')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(5000);
}

bootstrap();
