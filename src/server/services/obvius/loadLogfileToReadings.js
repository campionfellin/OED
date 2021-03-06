/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const moment = require('moment');
const Meter = require('../../models/Meter');
const Reading = require('../../models/Reading');
const { log } = require('../../log');
const demuxCsvWithSingleColumnTimestamps = require('./csvDemux');

async function loadLogfileToReadings(serialNumber, ipAddress, logfile, conn) {
	// Get demultiplexed, parsed data from the CSV.
	const data = demuxCsvWithSingleColumnTimestamps(logfile);

	for (let i = 0; i < data.length; i++) {
		let meter;
		try {
			meter = await Meter.getByName(`${serialNumber}.${i}`, conn);
		} catch (v) {
			// For now, new Obvius meters collect data (enabled) but do not display (not displayable).
			// Also, the identifier is the same as the meter name for now. The longer-term plan is to read
			// the configuration file and use information in that to set this value before meters are read
			// so they are not created here.
			meter = new Meter(undefined, `${serialNumber}.${i}`, ipAddress, true, false, Meter.type.OBVIUS);
			await meter.insert(conn);
		}

		for (const rawReading of data[i]) {
			// If the reading is invalid, throw it out.
			if (rawReading[1] === null) {
				continue;
			}

			// Otherwise assume it is kWh and proceed
			const startTimestamp = moment(rawReading[0], 'YYYY-MM-DD HH:mm:ss');
			const endTimestamp = startTimestamp.clone();
			endTimestamp.add(moment.duration(1, 'hours'));
			const reading = new Reading(meter.id, rawReading[1], startTimestamp, endTimestamp);
			try {
				await reading.insertOrIgnore(conn);
			} catch (err) {
				log.error('Could not insert readings from Obvius logfile.', err);
			}
		}
	}
}

module.exports = loadLogfileToReadings;
