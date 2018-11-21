const origen = 'Caracas',
    destino = 'Miami',
    tipo = 2,
    fechaInicio = new Date(Date.now()).getDate(),
    fechaFinal = (new Date(Date.now()).getDate()) + 5,
    numAdultos = '0',
    numChildren = '0';

describe('BUSCAR VUELOS', () => {
    it('BUSCAR...', () => {

        cy.BuscarVuelo(origen, destino, tipo, fechaInicio, fechaFinal, numAdultos, numChildren);

    });
});

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
});
