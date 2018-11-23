
const nombreCliente = 'Luisa Carrillo',
    identificacion = '20428519',
    emailCliente = Math.random().toString(36).substring(7) + '@gmail.com',
    telCliente = '04124752832',
    numeroTarjeta = '5122454299487844',
    expTarjeta = '0324',
    cvcTarjeta = '642',
    moneda = 'VES',
    vueloUrl = 'http://www.development.nevicu.com/app_stg.php/flights/search/CCS/MIA?adult=1&kid=0&startDate=30-11-2018&flightSearch=true&roundTrip=0&listSuggestions=caracas';


describe('PAGAR VUELO', () => {
    it('IR A PAGAR', () => {

        cy.PagarVuelo(vueloUrl).then(() => {
            cy.SeleccionarMoneda(moneda).then(() => {
                cy.wait(5000)
            });
        });

    });

    it('DATOS DEL CLIENTE', () => {

        cy.get('input[name="fullName0"]:first')
            .type(nombreCliente);

        cy.get('input[name="documentNumber0"]:first')
            .type(identificacion);

        cy.get('input[name="email0"]:first')
            .type(emailCliente);

        cy.get('input[name="phone0"]:first')
            .type(telCliente);

        cy.get('#birthDay0')
            .select('08')
            .should('have.value', '08');

        cy.get('#birthMonth0')
            .select('10')
            .should('have.value', '10');

        cy.get('#birthYear0')
            .select('1992')
            .should('have.value', '1992');
    })

    it('DATOS TDC', () => {

        cy.get('input[name="CardNumber"]')
            .type(numeroTarjeta);

        cy.get('input[name="CardExpiry"]')
            .type(expTarjeta);

        if (moneda === 'VES') {

            cy.get('input[name="CardCvc"]')
                .type(cvcTarjeta);

            cy.get('input[name="cardAmount"]')
                .should('have.attr', 'placeholder')
                .then((placeholder) => {
                    const montoPagar = placeholder.replace('Monto a pagar ', '')
                    cy.get('input[name="cardAmount"]')
                        .type(montoPagar)
                });

        } else {

            cy.get('input[name="CardCvv"]')
                .type(cvcTarjeta);

        }


    })

    it('PAGAR/COMPRAR', () => {

        cy.get('button.ng-scope')
            .click({ force: true })
            .then(() => {

                cy.wait(5000);

                const textosError = [
                    'Disculpe, los datos de la tarjeta de crédito', 
                    'Lo sentimos, la disponibilidad de vuelos, según tu búsqueda ha',
                    'cambiado, por favor intenta nuevamente',
                    'no son correctos, por favor ingrese los datos nuevamente'
                ];

                cy.get('.nvc-modal--payment')
                    .find('.nvc-modal__content--right .nvc-modal__content--wrapper .nvc-modal__content--error:first span:first')
                    .should((span) => {

                        let textoCorrecto = false;
                        if (textosError.indexOf(span.text().trim()) > -1) textoCorrecto = true;

                        expect(textoCorrecto).to.be.true

                    });

                cy.get('.nvc-modal--payment')
                    .find('.nvc-modal__content--right .nvc-modal__content--wrapper .nvc-modal__content--error:eq(1) span:first')
                    .should((span) => {
                        
                        let textoCorrecto = false;
                        if (textosError.indexOf(span.text().trim()) > -1) textoCorrecto = true;

                        expect(textoCorrecto).to.be.true
                    });
            });
    })

})

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
});