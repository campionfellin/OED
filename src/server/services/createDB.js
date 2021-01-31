/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { createSchema } = require('../models/database');
const { log } = require('../log');
const { getConnection, dropConnection } = require('../db');
(async function createSchemaWrapper() {
	const conn = getConnection();
	console.log(`campion3: ${conn}`)
	try {
		await createSchema(conn);
		console.log('Schema created');
		process.exitCode = 0;
	} catch (err) {
		console.log(`Error creating schema: ${err}`);
		process.exitCode = 1;
	} finally {
		dropConnection();
	}
}());

