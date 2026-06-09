import { ValidadorService } from './validador.service';

describe('ValidadorService', () => {
  let service: ValidadorService;

  beforeEach(() => {
    service = new ValidadorService();
  });

  describe('validarCURP', () => {
    it("debe retornar true para 'HEGG560427MVZRRL04'", () => {
      expect(service.validarCURP('HEGG560427MVZRRL04')).toBe(true);
    });

    it("debe retornar false para 'INVALIDO123'", () => {
      expect(service.validarCURP('INVALIDO123')).toBe(false);
    });
  });

  describe('validarRFC', () => {
    it("debe retornar true para 'XAXX010101000'", () => {
      expect(service.validarRFC('XAXX010101000')).toBe(true);
    });
  });
});
