const fs = require('fs');
const program = require('commander');

program.version('1.0.0').description('Recurrent Take Home Project');

program
  .argument('<data_file_path>')
  .argument('<query>')
  .argument('<arg>')
  .description('run a query using a supplied data file and argument')
  .action((data_file_path, query, arg) => {
    try {
      query = query.toLowerCase();
      const file_type = data_file_path.split('.')[1];

      if (!file_type || file_type.toLowerCase() !== 'json') {
        throw new Error('ERROR: Data file must be a valid JSON file');
      } else if (!['average_daily_miles', 'charged_above'].includes(query)) {
        throw new Error('ERROR: Query must be average_daily_miles or charged_above');
      } else if (query === 'charged_above' && isNaN(arg)) {
        throw new Error('ERROR: Argument for charged_above query must be a number');
      }

      const raw_data = fs.readFileSync(data_file_path);
      const { records } = JSON.parse(raw_data);

      switch (query) {
        case 'average_daily_miles': {
          average_daily_miles(records, arg.toLowerCase());
          break;
        }

        case 'charged_above': {
          charged_above(records, parseFloat(arg));
          break;
        }
      }
    } catch (e) {
      console.error(e);
    }
  });

const average_daily_miles = (records, vehicle_id) => {
  const vehicle_records = records.filter((r) => r.vehicle_id === vehicle_id);

  if (vehicle_records.length === 0) {
    throw new Error(`ERROR: No records found for ${vehicle_id}`);
  }

  const odometer_readings = vehicle_records.map((r) => r.odometer);
  const miles_traveled = Math.max(...odometer_readings) - Math.min(...odometer_readings);
  const dates = vehicle_records.map((r) => new Date(r.created_at.split(/\s/)[0]));
  const time_period_in_days =
    (new Date(Math.max.apply(null, dates)).getTime() - new Date(Math.min.apply(null, dates)).getTime()) /
    (1000 * 3600 * 24);
  const average_daily_miles = miles_traveled / time_period_in_days;
  console.log(`Average daily miles for ${vehicle_id}: ${average_daily_miles}`);
  return average_daily_miles;
};

const charged_above = (records, charge_reading) => {
  const records_above_reading = records.filter((r) => r.charge_reading > charge_reading);
  const vehicle_ids = Array.from(new Set(records_above_reading.map((r) => r.vehicle_id)));
  const num_vehicles = vehicle_ids.length;
  console.log(
    `Found ${num_vehicles} vehicles (${vehicle_ids.join(
      ', ',
    )}) that reported at least one charge_reading above ${charge_reading}`,
  );
  return num_vehicles;
};

program.parse(process.argv);
