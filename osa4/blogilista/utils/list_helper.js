const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

function totalLikes(blogs) {
  return blogs.reduce((acc, curr) => {
    return acc + curr.likes
  }, 0)
}

function favoriteBlog(blogs) {
  // Miten pisteet, dots toimii
  /*
  const x = blogs.map((cur) => cur.likes)
  console.log(x)
  console.log(...x)
  console.log(Math.max(...blogs.map((cur) => cur.likes)))
  // v ei toimi koska blogsin alla olevista likeista se ei kato vaan blogeista itestaan
  //console.log(blogs.indexOf(Math.max(...blogs.map((cur) => cur.likes))))
  console.log(Math.max(...x))
  */
  const likesArray = blogs.map( (cur) => cur.likes )

  const idx = likesArray.indexOf(
    Math.max(...likesArray)
  )
  return blogs[idx]
}

function mostBlogs(blogs) {

  const authorCollection = blogs.reduce((authors, currBlog) => {
    if (currBlog.author in authors) {
      authors[currBlog.author]++
    }
    else {
      authors[currBlog.author] = 1
    }

    return authors
  }, {})

  const blogsByAuthors = Object.values(authorCollection)
  const authorList = Object.keys(authorCollection)

  const idx = blogsByAuthors.indexOf(Math.max(...blogsByAuthors))
  return { 'author': authorList[idx], 'blogs': blogsByAuthors[idx] }
}

function mostLikes(blogs) {

  const authorCollection = blogs.reduce((authors, currBlog) => {
    if (currBlog.author in authors) {
      authors[currBlog.author] += currBlog.likes
    }
    else {
      authors[currBlog.author] = currBlog.likes
    }

    return authors
  }, {})

  const likesForAuthors = Object.values(authorCollection)
  const authorList = Object.keys(authorCollection)

  const idx = likesForAuthors.indexOf(Math.max(...likesForAuthors))
  return { 'author': authorList[idx], 'blogs': likesForAuthors[idx] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}