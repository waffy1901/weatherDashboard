import { useEffect, useState } from "react";

export const useWeatherTheme = (weatherCondition?: string) => {
  const [theme, setTheme] = useState("bg-default");

  useEffect(() => {
    if (!weatherCondition) {
      setTheme("bg-default");
      return;
    }

    const condition = weatherCondition.toLowerCase();
    
    if (condition.includes("clear") || condition.includes("sunny")) {
      setTheme("bg-sunny");
    } else if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("thunderstorm")) {
      setTheme("bg-rainy");
    } else if (condition.includes("cloud") || condition.includes("overcast")) {
      setTheme("bg-cloudy");
    } else if (condition.includes("snow") || condition.includes("blizzard")) {
      setTheme("bg-snowy");
    } else {
      setTheme("bg-default");
    }
  }, [weatherCondition]);

  return theme;
};
