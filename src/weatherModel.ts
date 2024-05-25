import { DataTypes, Model } from "sequelize";
import sequelize from "./pgConfig"; 


interface WeatherAttributes {
  id: number; 
  city: string;
  country: string;
  weather: string;
  time: Date;
  longitude: number;
  latitude: number;
}

class Weather
  extends Model<WeatherAttributes, WeatherAttributes>
  implements WeatherAttributes
{
  public declare id: number; 
  public city!: string;
  public country!: string;
  public weather!: string;
  public time!: Date;
  public longitude!: number;
  public latitude!: number;

}


Weather.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weather: {
      type: DataTypes.TEXT,
    },
    time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, 
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 6), 
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 6),
    },
  },
  {
    sequelize,
    tableName: "weather_data", 
    timestamps: false, 
  }
);


export { Weather };
