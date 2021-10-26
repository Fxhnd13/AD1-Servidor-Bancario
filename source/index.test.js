const {get_random_int,is_six_months_earlier,is_six_months_later,plus_one_month,print_request_type, is_owner, has_bureaucratic_or_admin_access, has_admin_access} = require('./controllers/utilities_controller');

describe('Pruebas unitarias', ()=>{
    test('Obtenemos un número aleatorio entre 1000 y 9999', ()=>{
        expect(get_random_int(1000,9999)).toBeWithinRange(1000,9999);
    });
    test('20-03-2021 es 6 meses o más antes de hoy', ()=>{
        expect(is_six_months_earlier(new Date('2021-03-20'))).toBe(true);
    });
    test('20-09-2021 no es 6 meses o más antes de hoy', ()=>{
        expect(is_six_months_earlier(new Date('2021-09-26'))).toBe(false);
    });
    test('20-01-2022 no es 6 meses o más después de hoy', ()=>{
        expect(is_six_months_later(new Date('2022-01-20'))).toBe(false);
    });
    test('20-07-2022 es 6 meses o más después de hoy', ()=>{
        expect(is_six_months_later(new Date('2022-07-20'))).toBe(true);
    });
    test('El tipo de solicitud 1 es actualización de datos', ()=>{
        expect(print_request_type(1)).toBe('Actualizacion de datos');
    });
    test('El tipo de solicitud 2 es cancelación de tarjeta', ()=>{
        expect(print_request_type(2)).toBe('Cancelacion de tarjeta');
    });
    test('El tipo de solicitud 3 es tarjeta de credito', ()=>{
        expect(print_request_type(3)).toBe('Tarjeta de credito');
    });
    test('El tipo de solicitud 4 es tarjeta de debito', ()=>{
        expect(print_request_type(4)).toBe('Tarjeta de debito');
    });
    test('El tipo de solicitud 5 es prestamo', ()=>{
        expect(print_request_type(5)).toBe('Prestamo');
    });
    test('El tipo de solicitud 6 es cuenta', ()=>{
        expect(print_request_type(6)).toBe('Cuenta');
    });
    test('El tipo de usuario 3 tiene permisos de visualización de datos', ()=>{
        expect(has_bureaucratic_or_admin_access(3)).toBe(true);
    });
    test('El tipo de usuario 4 tiene permisos de administrador', ()=>{
        expect(has_admin_access(4)).toBe(true);
    });
    test('El tipo de usuario 1 no tiene permisos de visualizacion de datos', ()=>{
        expect(has_bureaucratic_or_admin_access(1)).toBe(false);
    });
    test('El tipo de usuario 2 no tiene permisos de visualización de datos', ()=>{
        expect(has_bureaucratic_or_admin_access(2)).toBe(false);
    });
    test('El cui de la persona 1000000000000 es dueño de la cuenta con cui 1000000000000', ()=>{
        expect(is_owner(1000000000000,1000000000000)).toBe(true);
    });
    test('El cui de la persona 1000000000000 no es dueño de la cuenta con cui 1000000000001', ()=>{
        expect(is_owner(1000000000000,1000000000001)).toBe(false);
    });
    test('Sumarle un mes a 20-05-2021 es 20-06-2021',()=>{
        expect(plus_one_month(new Date('2021-05-20'))).toStrictEqual(new Date('2021-06-20'));
    });
    test('Sumarle un mes a 20-12-2021 es 20-01-2022', ()=>{
        expect(plus_one_month(new Date('2021-12-20'))).toStrictEqual(new Date('2022-01-20'));
    });
});

expect.extend({
    toBeWithinRange(received, floor, ceiling) {
        const pass = received >= floor && received <= ceiling;
        if (pass) {
            return {
            message: () =>
                `expected ${received} not to be within range ${floor} - ${ceiling}`,
            pass: true,
            };
        } else {
            return {
            message: () =>
                `expected ${received} to be within range ${floor} - ${ceiling}`,
            pass: false,
            };
      }
    },
});