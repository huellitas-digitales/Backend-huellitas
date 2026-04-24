import { Module } from '@nestjs/common';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Tus módulos de negocio
import { UsuariosModule } from '../usuarios/usuarios.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

// Tu infraestructura
import { MyConfigModule } from '../../../infraestructura/config/config.module';
import { MyJwtConfig } from '../../../infraestructura/config/services/jwt.config';

@Module({
  imports: [
    UsuariosModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),

    MyConfigModule,

    JwtModule.registerAsync({
      imports: [MyConfigModule],
      inject: [MyJwtConfig],
      useFactory: (jwtConfig: MyJwtConfig) => {
        const config = jwtConfig.get();

        return {
          secret: config.secret,
          signOptions: {
            // 👇 SOLUCIÓN TIPADA CORRECTA
            expiresIn: config.expiresIn as JwtSignOptions['expiresIn'],
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule, PassportModule, JwtStrategy],
})
export class AuthModule {}