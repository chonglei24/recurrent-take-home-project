# EV Data Query

EV Data Query is a command line program that runs the specified query and reads from a supplied JSON data file. A JSON data file is already included in the project folder. The two queries are:

1.  `charged_above`: This query should return the number of vehicles that
    reported at least one `charge_reading` above a given % over the whole time
    period. It should take a charge % as an argument. This argument should be a
    decimal, for example 0.33 will be passed to indicate 33%.
2.  `average_daily_miles`: This query should return the average daily miles for
    a given vehicle over the course of the time period of the dataset, so it
    should take `vehicle_id` as an argument. (For example, if the given vehicle
    travelled 140 miles over a two week period, this should return 10).

The supplied JSON data file should contain records with these fields:

- `charge_reading`: The vehicle’s State of Charge (SoC), a decimal number
  representing the current charge level of the battery in terms of percentage.
  (For example, 0.33 means the battery is 33% charged.)
- `range_estimate`: The estimated range that the vehicle can drive before the
  battery is depleted, expressed in miles as a decimal number.
- `odometer`: The vehicle’s current odometer reading, expressed in miles as an
  integer.
- `plugged_in`: Whether or not the vehicle is plugged in at the time of the
  reading, expressed as a boolean.
- `charging`: Whether or not the vehicle is actively charging at the time of
  the reading, expressed as a boolean.
- `created_at`: Timestamp of the reading, expressed in a string of the format
  "yyyy-mm-dd hh:mm:ss", the timezone is UTC for all readings.
- `vehicle_id`: A unique identifier tied to the vehicle, expressed as a
  string.

# How It Works

Before running the program for the first time, please remember to install the npm packages using:

```
npm install
```

When running a command, 3 arguments are required in the listed order:

1.  the path to the data file
2.  the name of the query (specified in bold in the list above)
3.  one argument to be passed to the query (a vehicle identifier, or a number,
    as specified in the query description)

Example command:

```
node src/index.js public/ev_data.json average_daily_miles big-truck
```

# Assumptions and Decisions

- I decided to go with the JSON data file since it's easier to work with compared to a CSV file. I think it's much easier to work with the JSON file since I can just read the data and turn it into an object.
- When starting the project, I thought it would be best to use the npm package called commander for these reasons:
  - The primary reason was that I believed it made the code more readable, especially if we wanted to build on top of this program.
  - The package is widely used, with 41,769,829 weekly downloads as of writing this README.
  - The package is still being maintained by the developers (last publish was 13 days ago as of writing this README).
- I suppose the only assumption that I made was that the user could type anything into the command line, so I thought it was necessary to include error handling for these cases:
  - file is not in JSON format
  - query supplied is not average_daily_miles nor charged_above
  - if the query is charged_above and the argument is not a number
  - if the query is average_daily_miles and the vehicle_id supplied cannot be matched with the data

# Improvements

- Add additional logging to show the data related to the returned result. For example, if the user is running a query for average_daily_miles for cat-car, I would return the start date, the end date, and the miles driven in that time period
- Make this program compatible with CSV files. I believe it's always best to make a program more flexible (but not at the expense of code readability - sometimes it might be better to write a separate program).

# Task 2: Ticket Writeup

- Title: Add new query drove_nowhere to EV Data Query
- Description: Add a new query called drove_nowhere which should return the number of vehicles that were not driven at all on a given date, so it should take a date as an argument. The format of the date is not specified, so please implement it in a way where the user knows the format the date should be in. It also might be difficult to determine when a vehicle was driven. Take into account this case:

  - If the first data point was received at 12:00 PM and the next data point was received the next day at 12:00 PM and the odometer reading changed, we won't know if the vehicle was driven on the first day after 12:00 PM, or on the next day before 12:00 PM. We will need to clarify this later. A possible solution could be to exclude the vehicle on one of the days.
