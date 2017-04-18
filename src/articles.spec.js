/*
 * Test suite for articles.js
 */
const expect = require('chai').expect
const fetch = require('isomorphic-fetch')

const url = path => `http://localhost:3000${path}`

describe('Unit test to validate POST /article', () => {
	let numAtr
	before('should give me three or more articles', (done) => {
		fetch(url("/articles"))
		.then(res => {
			expect(res.status).to.eql(200)	
			return res.text()
		})
		.then(body => {
			expect(JSON.parse(body).articles.length>=3).to.be.true
			numAtr = JSON.parse(body).articles.length
		})
		.then(done)
		.catch(done)
 	}, 200)

	it('POST article should add one article, the length of articles should increase by one', (done) => {
		fetch(url("/article"), {
            method:'POST',
            headers:new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({text:'new article 1'})
        })
		.then(res => {
			expect(res.status).to.eql(200)	
			return res.text()
		})
		.then(body => {
			expect(JSON.parse(body).articles[0].text).to.equal('new article 1')
			return JSON.parse(body).articles[0].id
		})
		.then(_=>{
			return fetch(url('/articles'))
		})
		.then(res => {
			expect(res.status).to.eql(200)	
			return res.text()				
		})
		.then(body => {
			expect(JSON.parse(body).articles.length).to.equal(numAtr+1)
		})
		.then(done)
		.catch(done)
 	}, 200)
});