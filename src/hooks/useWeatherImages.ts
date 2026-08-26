import { useState, useEffect } from 'react';

export interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  conditionLabel: string;
  city: string;
  humidity: number;
  windSpeed: number;
  imageUrl: string;
}

// Mapping des conditions météo aux images réelles
const WEATHER_IMAGES: Record<string, string> = {
  sunny: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=480&fit=crop',
  cloudy: 'https://images.unsplash.com/photo-1534274988757-a28bf1a4c817?w=1600&h=480&fit=crop',
  rainy: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=1600&h=480&fit=crop',
  snowy: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1600&h=480&fit=crop',
  windy: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=480&fit=crop',
};

// Fallback images avec propriétaires et chiens
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1633722715463-d30628cbc4c1?w=1600&h=480&fit=crop',
  'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=1600&h=480&fit=crop',
  'https://images.unsplash.com/photo-1601003365885-06dbf4b69156?w=1600&h=480&fit=crop',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1600&h=480&fit=crop',
];

export const useWeatherImages = (latitude?: number, longitude?: number): WeatherData => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 17,
    condition: 'cloudy',
    conditionLabel: 'Nuageux',
    city: 'Localisation...',
    humidity: 65,
    windSpeed: 12,
    imageUrl: WEATHER_IMAGES.cloudy,
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Utiliser la géolocalisation du navigateur si pas de coordonnées fournies
        if (!latitude || !longitude) {
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                const { latitude: lat, longitude: lon } = position.coords;
                await fetchWeatherData(lat, lon);
              },
              () => {
                // En cas d'erreur, utiliser des données par défaut
                setWeather((prev) => ({
                  ...prev,
                  imageUrl: FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)],
                }));
              }
            );
          }
        } else {
          await fetchWeatherData(latitude, longitude);
        }
      } catch (error) {
        console.error('Erreur météo:', error);
      }
    };

    const fetchWeatherData = async (lat: number, lon: number) => {
      try {
        // Utiliser Open-Meteo API (gratuit, pas de clé requise)
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=auto`
        );
        const data = await response.json();

        if (data.current) {
          const temp = Math.round(data.current.temperature_2m);
          const weatherCode = data.current.weather_code;
          const humidity = data.current.relative_humidity_2m;
          const windSpeed = Math.round(data.current.wind_speed_10m);

          // Mapper les codes météo WMO aux conditions
          let condition: WeatherData['condition'] = 'cloudy';
          let conditionLabel = 'Nuageux';

          if (weatherCode === 0 || weatherCode === 1) {
            condition = 'sunny';
            conditionLabel = 'Ensoleillé';
          } else if (weatherCode === 2 || weatherCode === 3) {
            condition = 'cloudy';
            conditionLabel = 'Nuageux';
          } else if (weatherCode === 45 || weatherCode === 48) {
            condition = 'cloudy';
            conditionLabel = 'Brumeux';
          } else if (weatherCode >= 51 && weatherCode <= 67) {
            condition = 'rainy';
            conditionLabel = 'Pluvieux';
          } else if (weatherCode >= 71 && weatherCode <= 85) {
            condition = 'snowy';
            conditionLabel = 'Neigeux';
          } else if (weatherCode >= 80 && weatherCode <= 82) {
            condition = 'rainy';
            conditionLabel = 'Averses';
          } else if (weatherCode === 85 || weatherCode === 86) {
            condition = 'snowy';
            conditionLabel = 'Neige';
          } else if (weatherCode === 95 || weatherCode === 96 || weatherCode === 99) {
            condition = 'rainy';
            conditionLabel = 'Orageux';
          }

          // Récupérer la ville via reverse geocoding
          let city = 'France';
          try {
            const geoResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );
            const geoData = await geoResponse.json();
            city = geoData.address?.city || geoData.address?.town || geoData.address?.village || 'France';
          } catch (e) {
            console.error('Erreur géolocalisation:', e);
          }

          setWeather({
            temperature: temp,
            condition,
            conditionLabel,
            city,
            humidity,
            windSpeed,
            imageUrl: WEATHER_IMAGES[condition],
          });
        }
      } catch (error) {
        console.error('Erreur fetch météo:', error);
        // Utiliser une image de fallback aléatoire
        setWeather((prev) => ({
          ...prev,
          imageUrl: FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)],
        }));
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  return weather;
};
