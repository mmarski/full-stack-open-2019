describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Testeri Teppo',
      username: 'The Tester',
      password: 'teppotulppu'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('contains login prompt at first', function() {
    cy.contains('Login')
    cy.get('form').contains(/username/i)
    cy.get('form').contains(/password/i)
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('The Tester')
      cy.get('#password').type('teppotulppu')
      cy.get('#login-button').click()
      cy.contains(/logged in/i)
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('pekkapouta')
      cy.get('#password').type('akuankka')
      cy.get('#login-button').click()
      cy.get('.error').contains('Invalid').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'The Tester', password: 'teppotulppu' })
    })

    it('user can create a blog and it appears in the list', function() {
      cy.contains('Create New Blog').click()
      cy.get('#title').type('Aku Ankka Seikkailee')
      cy.get('#author').type('Unkka T Kumiankka')
      cy.get('#url').type('ankka.linna')
      cy.get('#create-blog-button').click()
      cy.contains(/created new blog/i)

      cy.contains('Create New Blog').click()
      cy.get('#title').type('Nakkikioskin Kaverukset')
      cy.get('#author').type('Unkka T Kumiankka')
      cy.get('#url').type('ankka.linna')
      cy.get('#create-blog-button').click()
      cy.contains(/created new blog/i)

      cy.get('.blogList').contains('Aku Ankka Seikkailee')
      cy.get('.blogList').contains('Nakkikioskin Kaverukset')
    })

    it('user can like a blog', function() {
      cy.contains('Create New Blog').click()
      cy.get('#title').type('Aku Ankka Seikkailee')
      cy.get('#author').type('Unkka T Kumiankka')
      cy.get('#url').type('ankka.linna')
      cy.get('#create-blog-button').click()
      cy.contains(/created new blog/i)

      cy.get('.blogList').contains('Aku Ankka Seikkailee')
        .parent().contains('Show').click()
        .parent().get('.togglableContent').contains('Likes 0')
        .parent().get('.likeButton').click()
        .parent().contains('Likes 1')
      cy.contains(/liked blog/i)
    })

    describe('When blog created', function() {
      beforeEach(function() {
        cy.contains('Create New Blog').click()
        cy.get('#title').type('Aku Ankka Seikkailee')
        cy.get('#author').type('Unkka T Kumiankka')
        cy.get('#url').type('ankka.linna')
        cy.get('#create-blog-button').click()
        cy.contains(/created new blog/i)
      })

      it('only the user who created a blog can delete it', function() {
        const user2 = {
          name: 'Tulpun Teppo',
          username: 'Fake Tester',
          password: 'teppotulppu'
        }
        cy.request('POST', 'http://localhost:3003/api/users', user2)

        // Other user can't delete
        cy.contains(/log out/i).click()
        cy.login({ username: 'Fake Tester', password: 'teppotulppu' })

        cy.get('.blogList').contains('Aku Ankka Seikkailee')
          .parent().contains('Show').click()
          .parent().contains(/remove/i).should('not.be.visible')

        // Correct user can delete
        cy.contains(/log out/i).click()
        cy.login({ username: 'The Tester', password: 'teppotulppu' })

        cy.get('.blogList').contains('Aku Ankka Seikkailee')
          .parent().contains('Show').click()
          .parent().contains(/remove/i).click()
        cy.on('window:confirm', () => true)
        cy.contains(/removed blog/i)
      })

      it('blogs are sorted by most likes', function() {
        // Create blog 2
        cy.contains('Create New Blog').click()
        cy.get('#title').type('Ooga Booga')
        cy.get('#author').type('Unkka T Kumiankka')
        cy.get('#url').type('ankka.linna')
        cy.get('#create-blog-button').click()
        cy.contains(/created new blog/i)
        // Create blog 3
        cy.contains('Create New Blog').click()
        cy.get('#title').type('Uka Uka')
        cy.get('#author').type('Unkka T Kumiankka')
        cy.get('#url').type('ankka.linna')
        cy.get('#create-blog-button').click()
        cy.contains(/created new blog/i)

        cy.get('.blogList').contains('Aku Ankka Seikkailee').parent().within(() => {
          cy.contains('Show').click({force: true})
          cy.wait(500)
          cy.get('.likeButton').click({force: true})
        })

        cy.get('.blogList').contains('Uka Uka').parent().within(() => {
          cy.contains('Show').click({force: true})
          cy.wait(500)
          for(let n = 0; n < 2; n ++){
            cy.get('.likeButton').click({force: true})
            cy.contains('Likes ' + (n+1))
          }
        })

        cy.get('.blogList').contains('Ooga Booga').parent().within(() => {
          cy.contains('Show').click({force: true})
          cy.wait(500)
          for(let n = 0; n < 8; n ++){
            cy.get('.likeButton').click({force: true})
            cy.contains('Likes ' + (n+1))
          }
        })

        cy.get('.Blog').each((el, i, array) => {
          var pattern = /[0-9]+/g
          if (i > 0) {
            cy.wrap(el).within(() => {
              cy.contains('Likes').then(likes => {
                var amount = parseInt(likes.text().match(pattern))
                cy.wrap(array[i-1]).within(() => {
                  cy.contains('Likes').then(likes2 => {
                    var amount2 = parseInt(likes2.text().match(pattern))
                    expect(amount2).to.be.greaterThan(amount)
                  })
                })
              })
            })
          }
        })
      })
    })
  })
})