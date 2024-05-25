import express, { Request, Response } from "express";
// import bodyParser from 'body-parser';
import nodemailer from "nodemailer";
import axios from "axios";
import { saveWeatherData, getWeatherData } from "./service";

const app = express();
// app.use(bodyParser.json());
app.use(express.json());

const GEOCODING_API_KEY = "ENter_you_key";
const WEATHER_API_KEY = "Enter-Your_key";
const EMAIL_USER = "vickysaurabh545452@gmail.com";
const EMAIL_PASS = "Enter_Your_pass";

// Weather data saving API
app.post("/api/SaveWeatherMapping", async (req: Request, res: Response) => {
  const cities = req.body;

  try {
    const weatherData = [];

    for (const cityInfo of cities) {
      const geoResponse = await axios.get(
        "https://api.api-ninjas.com/v1/geocoding",
        {
          params: {
            city: cityInfo.city,
            country: cityInfo.country,
          },
          headers: {
            "X-Api-Key": GEOCODING_API_KEY,
          },
        }
      );

      const { latitude, longitude } = geoResponse.data[0];

      const weatherResponse = await axios.get(
        "https://weatherapi-com.p.rapidapi.com/current.json",
        {
          params: { q: `${latitude},${longitude}` },
          headers: {
            "X-RapidAPI-Key": WEATHER_API_KEY,
            "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
          },
        }
      );

      const weather = weatherResponse.data.current.condition.text;
      const time = new Date();

      weatherData.push({
        city: cityInfo.city,
        country: cityInfo.country,
        weather,
        time,
        longitude,
        latitude,
      });
    }

    await saveWeatherData(weatherData);
    res.status(201).send({ message: "Weather data saved successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while saving weather data." });
  }
});

// DashBoard API

app.get("/api/weatherDashboard", async (req: Request, res: Response) => {
  const city = req.query.city as string | undefined;

  try {
    const weatherData = await getWeatherData({ city });
    console.log(weatherData);
    res.send(weatherData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching weather data." });
  }
});

// Email setup

app.post("/api/sendWeatherEmail", async (req: Request, res: Response) => {
  const cities = req.body.cities;
  const recipientEmail = req.body.email;

  try {
    const weatherData: any[] = [];

    for (const cityInfo of cities) {
      const weatherRecords = await getWeatherData({ city: cityInfo.city });
      weatherRecords.forEach((record) => {
        weatherData.push(record);
      });
    }

    let emailContent =
      '<h1>Weather Data</h1><table border="1"><tr><th>City</th><th>Country</th><th>Date</th><th>Weather</th></tr>';

    for (const record of weatherData) {
      emailContent += `<tr><td>${record.city}</td><td>${record.country}</td><td>${record.time}</td><td>${record.weather}</td></tr>`;
    }

    emailContent += "</table>";

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const receiver = {
      from: EMAIL_USER,
      to:  recipientEmail,
      subject: "Weather Data",
      html: emailContent,
    };

    await transporter.sendMail(receiver);

    res.send({ message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while sending email." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
