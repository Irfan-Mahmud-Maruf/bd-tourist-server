const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb')
const ObjectId = require('mongodb').ObjectId
const dotenv = require('dotenv')
const chalk = require('chalk')


// Initialization
dotenv.config();
const app = express() 
const port = process.env.PORT || 5000


// Middlewere 
app.use(cors())
app.use(express.json())


// MongoDB
const uri = `${process.env.DB_URI}`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
/**
 * Database
 * Input: 
 * 		db			: Database 
 * 		collection	: Database Collection 
 * 		method		: MongoDB Operation Method  
 * 		data		: Data
 * 			find: Query
 *			limit: RQuery Limit
 *			skip: Record Skip
 *			
 *			
 */
const database = async ({ db, table, method, data }) => {
	
	try {		
        await client.connect()
        // console.info('Connected successfully')

        const collection = client.db(db).collection(table)

        if (method === 'insertOne') {
			// Record Insert: Single
            const result = await collection.insertOne(data)
            // console.info('Inserted successfully')

            return result
        } else if (method === 'find') {
			// Record Find
			const queryLength = await Object.keys(data).length
			
			if (data.find) {
				if ( data.limit && !data.skip) {
					// Record with only limit()
					const result = await collection.find(data.find).limit(data.limit).toArray()
					
					return result
				}  else if (data.skip && !data.limit) {
					// Record with only skip()
					const result = await collection.find(data.find).skip(data.skip).toArray()
					
					return result
				} else if (data.skip && data.limit) { 
					// Record with skip() and limit().
					const result = await collection.find(data.find).skip(data.skip).limit(data.limit).toArray()
					
					return result
				} else {
					// Records
					const result = await collection.find(data.find).toArray()
					
					return result
				}
			} else {
				console.error('Somethig wrong')
				
				return
			}
			
            // console.info('Data retrived successfully.')
			
        } else if (method === 'updateOne') {
			/**
			 *Record Update
			 * options: 
			 *		db: Database
			 *		table: collection
			 *		method: updateOne
			 *		data: 
			 *			current: Current Data 
			 *			replace: Replacement Data
			 */
            const result = await collection.updateOne(data.current, data.replace)
            // console.info('Record updated successfully.')

            return result
        } else if (method === 'deleteMany') {
			// Record Remove
            const result = await collection.deleteMany(data)
            // console.info('Record removed successfully.')
			
            return result
        } else {
            console.warn('Provide a valid method')
        }        
    } catch {
        'Error: ', console.error
    } finally {
        client.close() 
        // console.info('Connection closed successfully')
    }
}


// Routes
/**
 *Route: /
 */
app.get('/', async (req, res) => {	
	res.send('bdtourist server running.')
})


/**
 *Get Services
 *Route: http://localhost:5000/service?skip=1&&limit=10
 */ 
app.get('/service', async (req, res) => {	
	const options = {
		db: 'bdtourist',
		table: 'services',
		method: 'find',
		data: {
			find: {},
			limit: parseInt(req.query.limit),
			skip: parseInt(req.query.skip)
		}
	}	
	const data = await database(options)
	res.send(data)
})

/**
 * Insert Service
 */ 
app.put('/service', async (req, res) => {	
	const data = req.body
	
	const options = {
		db: 'bdtourist',
		table: 'services',
		method: 'insertOne',
		data: data
	}	
	const result = await database(options)
	res.send(result)
})

// Get service with id
app.get('/service/:id', async (req, res) => {
	
	const options = {
		db: 'bdtourist',
		table: 'services',
		method: 'find',
		data: {
			find: {_id: ObjectId(req.params.id)}
		}
	}	
	const data = await database(options)
	res.send(data)
})


// Get FAQ
app.get('/faq', async (req, res) => {
	const options = {
		db: 'bdtourist',
		table: 'faq',
		method: 'find',
		data: {
			find: {},
			limit: parseInt(req.query.limit),
			skip: parseInt(req.query.skip)
		}
	}	
	const data = await database(options)
	res.send(data)
})
/**
 * Insert Faq
 */ 
app.put('/faq', async (req, res) => {
	const data = req.body
	
	const options = {
		db: 'bdtourist',
		table: 'faq',
		method: 'insertOne',
		data: data
	}	
	const result = await database(options)
	res.send(result)
})



// Get FAQ
app.get('/orders', async (req, res) => {
	const options = {
		db: 'bdtourist',
		table: 'orders',
		method: 'find',
		data: {
			find: {},
			limit: parseInt(req.query.limit),
			skip: parseInt(req.query.skip)
		}
	}	
	const data = await database(options)
	res.send(data)
})
/**
 * Insert Faq
 */ 
app.put('/orders', async (req, res) => {
	const data = req.body
	
	const options = {
		db: 'bdtourist',
		table: 'orders',
		method: 'insertOne',
		data: data
	}	
	const result = await database(options)
	res.send(result)
})


// Server 
app.listen(port, () => {
	console.log(chalk.cyanBright(`API server started at ${port}`))
	console.log(chalk.cyanBright(`http://localhost:${port}`))
})




