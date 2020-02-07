/*
 * @Author: Artha Prihardana 
 * @Date: 2019-08-26 17:07:40 
 * @Last Modified by: Artha Prihardana
 * @Last Modified time: 2020-02-07 14:37:16
 */
import inquirer from "inquirer";
import check from './check';

const questions = [
	{
		type: 'input',
		name: 'address',
		message: "Please input url address to check ssl validate? (https://example.com)",
		validate: value => {
			var reg = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/ig
			var pass = value.match(reg);
			return pass ? true : "Please enter a valid url address"
		}
	}
]

inquirer
	.prompt(questions)
	.then(answers => {
		let addr = answers.address.split(/^((http[s]?|ftp):\/)?\/?/g);
		check.get(addr[addr.length-1]).then(v => {
			console.log(v)
		}).catch(e => {
			console.error(e)
		})
	});
