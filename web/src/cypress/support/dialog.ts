declare namespace Cypress {
  interface Chainable<Subject> {
    /** Click a dialog button with the given text and wait for it to disappear. */
    dialogFinish: typeof dialogFinish

    /** Click a dialog button with the given text. */
    dialogClick: typeof dialogClick

    /** Assert a dialog is present with the given title string. */
    dialogTitle: typeof dialogTitle

    /** Assert a dialog with the given content is present. */
    dialogContains: typeof dialogContains

    /** Update a dialog's form fields with the given values. */
    dialogForm: typeof dialogForm
  }
}

function dialogForm(values: {
  [key: string]: string | string[] | null | boolean
}): void {
  dialog()
  cy.form(values, '[role=dialog] #dialog-form')
}

function dialog(): Cypress.Chainable {
  return cy
    .get('[data-cy=unmounting]')
    .should('not.exist')
    .get('[role=dialog]')
    .should('have.length', 1)
    .should('be.visible')
}
function dialogTitle(title: string): Cypress.Chainable {
  return dialog()
    .find('[data-cy=dialog-title]')
    .should('contain', title)
}
function dialogContains(content: string): Cypress.Chainable {
  return dialog().should('contain', content)
}

function dialogClick(s: string): Cypress.Chainable {
  return dialog()
    .contains('button', s)
    .click()
}

function dialogFinish(s: string): Cypress.Chainable {
  return dialog()
    .get('[data-cy-gu]')
    .then(el => {
      const id = el.data('cyGu')
      return cy
        .dialogClick(s)
        .get(`[data-cy-gu=${id}]`)
        .should('not.exist')
    })
}

Cypress.Commands.add('dialogFinish', dialogFinish)
Cypress.Commands.add('dialogTitle', dialogTitle)
Cypress.Commands.add('dialogForm', dialogForm)
Cypress.Commands.add('dialogContains', dialogContains)
Cypress.Commands.add('dialogClick', dialogClick)
