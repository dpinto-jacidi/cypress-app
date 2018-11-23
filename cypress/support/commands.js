

/**
 * Busca un hotel en navicu.
 * @param {string} hotel - Nombre de hotel a buscar.
 * @param {number} fechaInicio - Día de check-in.
 * @param {number} fechaFinal - Día de check-out.
 * @param {number} numAdultos - Cantidad de adultos a alojarse.
 * @param {number} numChildren - Cantidad de niños a alojarse.
 * @param {number} numHab - antidad de habitaciones.
 */
Cypress.Commands.add('BuscarHotel', (hotel, fechaInicio, fechaFinal, numAdultos, numChildren, numHab) => {

	cy.visit('http://www.development.nevicu.com/app_stg.php').then(() => {
		cy.wait(10000);
	});

	// Introduce hotel
	cy.get('.nvc-search__input-container')
		.children('input[name="listSuggestions"]')
		.type(hotel)
		.siblings('ul')
		.find('li a')
		.contains('span', hotel)
		.parent()
		.click({ force: true });

	// Selecciona fecha de check-in
	cy.get('.nvc-search__input--date-start')
		.children('#searchDestinationStartDate')
		.click({ force: true })
		.then(() => {

			cy.get('.datepicker')
				.find('.datepicker-days .table-condensed tbody tr')
				.contains('td', fechaInicio)
				.click({ force: true });

		});


	// Selecciona fecha de check-out
	cy.get('.nvc-search__input--date-end')
		.children('#searchDestinationEndDate')
		.click({ force: true })
		.then(() => {

			cy.get('.datepicker')
				.find('.datepicker-days .table-condensed tbody tr')
				.contains('td', fechaFinal)
				.click({ force: true });

		});


	// Selecciona cantidad de adultos
	if (numAdultos > 0) {

		cy.get('.nvc-search__select--adults:first')
			.children('select')
			.select(numAdultos)
			.should('have.value', numAdultos);

	}


	// Selecciona cantidad de niños
	if (numChildren > 0) {

		cy.get('.nvc-search__select--children:first')
			.children('select')
			.select(numChildren)
			.should('have.value', numChildren);

	}

	// Selecciona cantidad de habitaciones
	if (numHab > 1) {

		cy.get('.nvc-search__select--rooms:first')
			.children('select')
			.select(numHab)
			.should('have.value', numHab);

	}


	// Buscar...
	cy.get('form.nvc-form-inline')
		.submit();

});

/**
 * Busca vuelos en navicu.
 * @param {string} origen - Lugar de origen del vuelo.
 * @param {string} destino - Lugar de destino del vuelo.
 * @param {number} tipo - Tipo de vuelo (Ida y vuelta: 1 - Solo ida: 2).
 * @param {number} fechaInicio - Día de salida.
 * @param {number} fechaFinal - Día de llegada.
 * @param {number} numAdultos - Cantidad de adultos.
 * @param {number} numChildren - Cantidad de niños.
 */
Cypress.Commands.add('BuscarVuelo', (origen, destino, tipo, fechaInicio, fechaFinal, numAdultos, numChildren) => {

	cy.visit('http://www.development.nevicu.com/app_stg.php').then(() => {
		cy.wait(10000)
	});

	//Selecciona sección de vuelos
	cy.get('.buttons')
		.children('li:nth-child(2)')
		.click({ force: true })
		.then(() => {

			if (tipo === 2) {
				cy.get('.nvc-panel__search')
					.find('ul li:nth-child(2) span')
					.click({ force: true })
			}

		});

	//Selecciona origen
	cy.get('.nvc-search--flight')
		.find('.nvc-search__input-container:nth-child(1) input')
		.type(origen)
		.wait(3000)
		.siblings('ul')
		.find('li:first a')
		.click({ force: true });

	//Selecciona destino
	cy.get('.nvc-search--flight')
		.find('.nvc-search__input-container:nth-child(2) input')
		.type(destino)
		.wait(3000)
		.siblings('ul')
		.find('li:first a')
		.click({ force: true });

	// Selecciona fecha de salida
	cy.get('.nvc-search--flight')
		.find('.nvc-search__input--date-start input')
		.click({ force: true })
		.then(() => {

			cy.get('.datepicker')
				.find('.datepicker-days .table-condensed tbody tr')
				.contains('td', fechaInicio)
				.click({ force: true });

		});

	// Selecciona fecha de llegada
	if (tipo === 1) {

		cy.get('.nvc-search--flight')
			.find('.nvc-search__input--date-end input:first')
			.click({ force: true })
			.then(() => {

				cy.get('.datepicker')
					.find('.datepicker-days .table-condensed tbody tr')
					.contains('td', fechaFinal)
					.click({ force: true });

			});
	}

	// Selecciona cantidad de adultos
	if (numAdultos > 0) {

		cy.get('.nvc-search__select--adults:eq(1)')
			.find('select')
			.select(numAdultos)
			.should('have.value', numAdultos)

	}

	// Selecciona cantidad de niños
	if (numChildren > 0) {

		cy.get('.nvc-search__select--children:eq(1)')
			.find('select')
			.select(numChildren)
			.should('have.value', numChildren)

	}

	// Buscar...
	cy.get('form.nvc-form-inline')
		.submit();

});


/**
 * Selecciona moneda de la aplicación
 * @param {string} moneda - Código de moneda.
 */
Cypress.Commands.add('SeleccionarMoneda', (moneda) => {

	cy.get('#navbar-currency-select')
		.children('.nvc-dropdown')
		.click({ force: true })
		.then(() => {

			cy.get('#navbar-currency-select-dropdown')
				.contains('li span', moneda)
				.parent()
				.click({ force: true });

		});

});

/**
 * Selecciona moneda de la aplicación en versión móvil.
 * @param {string} moneda - Código de moneda.
 */
Cypress.Commands.add('SeleccionarMonedaMobile', (moneda) => {

	cy.get('.nvc-navbar__currency--xs')
		.children('section')
		.click({ force: true })
		.then(() => {
			cy.get('ul.nvc-dropdown__menu')
				.contains('li span', moneda)
				.parent()
				.click({ force: true });
		});

});

/**
 * Selecciona hotel y va a pantanlla de pago.
 * @param {string} hotelUrl - Url de hotel buscado en navicu.
 */
Cypress.Commands.add('PagarHotel', (hotelUrl) => {

	cy.visit(hotelUrl).then(() => {
		cy.wait(20000)
	});

	cy.SeleccionarMoneda('VES').then(() => {

		cy.wait(10000);

		cy.get('.nvc-table')
			.find('tbody tr:first td:nth-child(4) select')
			.select('1')
			.should('have.value', 'number:1')
			.then(() => {
				cy.get('.nvc-button.nvc-button__default.nav-grow:first').click()
			});

	});

});



/**
 * Selecciona hotel y va a pantanlla de pago. Versión móvil.
 * @param {string} hotelUrl - Url de hotel buscado en navicu.
 */
Cypress.Commands.add('PagarHotelMobile', (hotelUrl) => {

	cy.visit(hotelUrl).then(() => {
		cy.wait(200000)
	});

	cy.SeleccionarMonedaMobile('VES').then(() => {

		cy.wait(10000);

		cy.get('.nvc-property-mobile__rooms')
			.find('article:first div')
			.click({ force: true })
			.then(() => {

				cy.get('.nvc-property-mobile__rooms')
					.find('section:first select:eq(1)')
					.select('number:1', { force: true })
					.should('have.value', 'number:1')

				cy.get('button.ng-scope')
					.click({ forcer: true })

			});

	});

});


/**
 * Selecciona vuelo y va a pantanlla de pago.
 * @param {string} vueloUrl - Url de vuelo buscado en navicu.
 */
Cypress.Commands.add('PagarVuelo', (vueloUrl) => {

	cy.visit(vueloUrl).then(() => {
		cy.wait(30000);
	});

	cy.get('section.nvc-container.hidden-xs').then((container) => {

		if (container.children('h3:nth-child(2)').length > 0) {
			cy.get('.button.ng-scope:first')
				.children('button')
				.click({ force: true });
		} else {

			cy.get('.nvc-table--flights.ng-scope')
				.find('tbody tr.head-calendar th.active:first')
				.click({ force: true })
				.then(() => {
					cy.get('.button.ng-scope:first')
						.children('button')
						.click({ force: true });
				});

		}
	});

});

/**
 * Selecciona vuelo y va a pantanlla de pago.
 * @param {string} vueloUrl - Url de vuelo buscado en navicu.
 */
Cypress.Commands.add('PagarVueloMobile', (vueloUrl) => {

	cy.visit(vueloUrl).then(() => {
		cy.wait(20000)
	})

	cy.get('.button.ng-scope:eq(1)')
		.children('button')
		.click({ force: true });

});


Cypress.Commands.add('VerificarAlerta', () => {

	cy.get('.nvc-container.ng-scope').then((main) => {

		cy.log('VERIFICAR ALERTA DE MARKETING =>');
		if (main.children('.nvc-alert').length) {

			cy.get('.nvc-alert')
				.should((alert) => {

					expect(alert.children('a'))
						.to.have.class('close');

					expect(alert.children('img'))
						.to.have.length(1);

					expect(alert.children('p'))
						.to.have.text('Si encuentras una mejor oferta, ¡te hacemos un 5% de descuento!');

				})

			cy.log('ALERTA DE MARKETING CORRECTA');

		} else {
			cy.log('ALERTA DE MARKETING NO MOSTRADA');
		}

	})

})