import { Weather } from "./weatherModel";

// Function to save weather data
async function saveWeatherData(weatherData: any[]): Promise<Weather[]> {
  try {
    const savedWeather = await Weather.bulkCreate(weatherData, {
      validate: true,
      individualHooks: true,
    });

    return savedWeather;
  } catch (error) {
    console.error("Error saving weather data:", error);
    throw error;
  }
}

// Function to retrieve weather data
async function getWeatherData(options?: { city?: string }): Promise<Weather[]> {
  try {
    const queryOptions: any = {};
    if (options?.city) {
      queryOptions.where = { city: options.city };
    }
    const weather = await Weather.findAll(queryOptions);

    return weather;
  } catch (error) {
    console.error("Error retrieving weather data:", error);
    throw error; // Re-throw for handling at a higher level
  }
}

export { saveWeatherData, getWeatherData };
