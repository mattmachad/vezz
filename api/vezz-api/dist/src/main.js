"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const data_source_1 = require("../database/data-source");
async function bootstrap() {
    try {
        await data_source_1.AppDataSource.initialize();
        console.log('✅ Conexão com o banco de dados estabelecida');
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        await app.listen(process.env.PORT ?? 3000);
        console.log(`🚀 Aplicação rodando na porta ${process.env.PORT ?? 3000}`);
    }
    catch (error) {
        console.error('❌ Erro ao conectar no banco:', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map