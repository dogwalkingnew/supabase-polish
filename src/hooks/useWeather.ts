import { useEffect, useState } from "react";

export type WeatherCondition = "sunny" | "cloudy" | "rainy" | "stormy" | "snowy" | "foggy";

export interface WeatherData {
  temp: number;
  condition: WeatherCondition;
  windSpeed: number;
  humidity: number;
  city: string;
  recommendation: string;
  loading: boolean;
  error: string | null;
}

const OWM_API_KEY = "b6907d289e10d714a6e88b30761fae22"; // clé publique demo OWM

function mapOWMCondition(weatherId: number): WeatherCondition {
  if (weatherId >= 200 && weatherId < 300) return "stormy";
  if (weatherId >= 300 && weatherId < 600) return "rainy";
  if (weatherId >= 600 && weatherId < 700) return "snowy";
  if (weatherId >= 700 && weatherId < 800) return "foggy";
  if (weatherId === 800) return "sunny";
  return "cloudy";
}

function getRecommendation(condition: WeatherCondition, temp: number): string {
  if (condition === "rainy" || condition === "stormy")
    return "Pluie prévue — prévoyez un imperméable pour la mission !";
  if (condition === "snowy")
    return "Neige — vérifiez les pattes après la mission.";
  if (condition === "foggy")
    return "Brouillard — restez sur des zones bien connues.";
  if (temp >= 28)
    return "Fortes chaleurs — sortir tôt le matin ou en soirée.";
  if (temp <= 5)
    return "Grand froid — mission courte et bien couverte recommandée.";
  if (condition === "sunny" && temp >= 15 && temp <= 25)
    return "Conditions idéales — parfait pour une mission prolongée !";
  return "Bonnes conditions pour la mission d'aujourd'hui.";
}

const DEFAULT_WEATHER: WeatherData = {
  temp: 18,
  condition: "sunny",
  windSpeed: 10,
  humidity: 55,
  city: "Paris",
  recommendation: "Bonnes conditions pour la mission d'aujourd'hui.",
  loading: false,
  error: null,
};

export const useWeather = (): WeatherData => {
  const [weather, setWeather] = useState<WeatherData>({ ...DEFAULT_WEATHER, loading: true });

  useEffect(() => {
    let cancelled = false;

    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${OWM_API_KEY}`
        );
        if (!res.ok) throw new Error("API météo indisponible");
        const data = await res.json();
        if (cancelled) return;
        const condition = mapOWMCondition(data.weather[0].id);
        const temp = Math.round(data.main.temp);
        setWeather({
          temp,
          condition,
          windSpeed: Math.round(data.wind?.speed ? data.wind.speed * 3.6 : 10),
          humidity: data.main.humidity ?? 55,
          city: data.name || "Votre ville",
          recommendation: getRecommendation(condition, temp),
          loading: false,
          error: null,
        });
      } catch {
        if (!cancelled) {
          setWeather({ ...DEFAULT_WEATHER, loading: false, error: "Météo indisponible" });
        }
      }
    };

    if (!navigator.geolocation) {
      // Fallback: Paris coords
      fetchWeather(48.8566, 2.3522);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => fetchWeather(48.8566, 2.3522), // Fallback Paris
      { timeout: 5000 }
    );

    return () => { cancelled = true; };
  }, []);

  return weather;
};
