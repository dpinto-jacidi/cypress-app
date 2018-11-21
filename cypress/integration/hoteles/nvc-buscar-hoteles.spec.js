const hotel = 'Hesperia',
    fechaInicio = 15,
    fechaFinal = (new Date(Date.now()).getDate()) + 5,
    numAdultos = '3',
    numChildren = '2',
    numHab = '2';

describe('BUSCAR HOTELES', () => {
    it('BUSCAR...', () => {
        cy.BuscarHotel(hotel, fechaInicio, fechaFinal, numAdultos, numChildren, numHab);
    });
});

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
});
