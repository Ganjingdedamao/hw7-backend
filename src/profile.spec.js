/*
 * Test suite for profile.js
 */
const expect = require('chai').expect
const fetch = require('isomorphic-fetch')

const url = path => `http://localhost:3000${path}`

describe('Unit test to validate PUT /headline', () => {
	let oldHeadline, newHeadline
	it('should update healdine', (done) => {
		fetch(url("/headlines"))
		.then(res => {
			expect(res.status).to.eql(200)	
			return res.text()
		})
		.then(body => {
			oldHeadline = JSON.parse(body).headlines[0].headline
		})
		.then(_=>{
			return fetch(url("/headline"), {
	            method:'PUT',
	            headers:new Headers({ 'Content-Type': 'application/json' }),
	            body: JSON.stringify({headline:'test new headline'})
	        })	
		})
		.then(res => {
			expect(res.status).to.eql(200)	
			return res.text()				
		})
		.then(body => {
			expect(JSON.parse(body).headline).to.equal('test new headline')
		})
		.then(_=>{
			return fetch(url('/headlines'))
		})
		.then(res => {
			expect(res.status).to.eql(200)	
			return res.text()				
		})
		.then(body => {
			expect(JSON.parse(body).headlines[0].headline).to.equal('test new headline')
		})
		.then(_=>{
			return fetch(url("/headline"), {
	            method:'PUT',
	            headers:new Headers({ 'Content-Type': 'application/json' }),
	            body: JSON.stringify({headline:'test real new headline'})
	        })	
		})
		.then(res => {
			expect(res.status).to.eql(200)	
			return res.text()				
		})
		.then(body => {
			expect(JSON.parse(body).headline).to.equal('test real new headline')
		})
		.then(_=>{
			return fetch(url('/headlines'))
		})
		.then(res => {
			expect(res.status).to.eql(200)	
			return res.text()				
		})
		.then(body => {
			expect(JSON.parse(body).headlines[0].headline).to.equal('test real new headline')
		})
		.then(done)
		.catch(done)
 	}, 200)
});