describe('Blog app', function() {
  it('contains login prompt at first', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Login')
  })
})