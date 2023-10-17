const db = require("./database");
const multer = require('multer');
const {PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const path = require('path');

const bucketName = process.env.BUCKET;
const region = process.env.REGION;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.ACCESS_SECRET;

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})

function form(req, res) {
	console.log('GET /submission')
	res.render("./form")
}

function submit(req, res) {

	const { name, department, email, employment} = req.body;
	const file = setQuery(req.file);
	const query = `SELECT MAX(id) FROM submissions`;
	let id;
	db.query(query, (err, result) => {
		console.log(req.body);
		
		if (err || !result[0]['MAX(id)']){
			id = 1;
		} else {
			console.print("this should print out")
			id = result[0]['MAX(id)']+1;
		}
		if (file.originalname)
			file.filename = `${file.fieldname}_${id}${path.extname(file.originalname)}`;
		else 
			file.filename = null;

		const insertQuery = 'INSERT INTO submissions (name, department, email, fileUpload, fileoriginalname, employment) VALUES (?, ?, ?, ?, ?, ?)';
		db.query(insertQuery, [name, department, email, file.filename, file.originalname, employment], (err, result) => {
			if (err) throw err;
			console.log('Submission successful');
			if (file.originalname){
				console.log(file);
				const params = setParams(file.buffer, file.filename, file.mimetype);
				uploadFile(params);
			}
		});
			
	})

	
	res.redirect('/')
}

function search(req, res){
	console.log('GET /search')
	const query = req.query.q;
	let sql = '';
	
	if(query != '')
	{
		sql = `SELECT * FROM submissions WHERE name LIKE '%${query}%' 
		OR department LIKE '%${query}%' OR email LIKE '%${query}%'
		OR employment LIKE '%${query}%'`;
	}
	else
	{
		sql = `SELECT * FROM submissions ORDER BY id`;
	}
	
	db.query(sql, (error, results) => {
		
		if (error) throw error;
		
		res.send(results);
		
	});
	
}

module.exports = {
	submit,
	form,
	search,
	submit,
}

function setQuery(file){
	if (!file){
		return {
			originalname: null
		}
	}
	else {
		return file;
	}
}

function setParams(buffer, filename, filetype){
	const params = {
		Bucket: bucketName,
		Body: buffer,
		Key: filename,
		ContentType: filetype
	}
	return params;
}

function uploadFile(params){
	const command = new PutObjectCommand(params);
	s3.send(command);
}