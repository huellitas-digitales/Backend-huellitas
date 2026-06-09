import { MedicinaService } from './medicina.service';
import { DosisInvalidaException } from './exceptions/dosis-invalida.exception';

describe('MedicinaService', () => {
  let service: MedicinaService;

  beforeEach(() => {
    service = new MedicinaService();
  });

  describe('calcularDosis', () => {
    it('debe calcular la dosis correctamente cuando el peso es mayor a cero', () => {
      const resultado = service.calcularDosis({ peso: 10, dosisPorKg: 20 });

      expect(resultado).toBe(200);
    });

    it('debe lanzar DosisInvalidaException cuando el peso es 0', () => {
      expect(() => service.calcularDosis({ peso: 0, dosisPorKg: 20 })).toThrow(DosisInvalidaException);
    });
  });
});
