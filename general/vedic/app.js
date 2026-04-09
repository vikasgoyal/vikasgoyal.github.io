const cities = [
  {
    id: "bengaluru",
    label: "Bengaluru, India",
    latitude: 12.9716,
    longitude: 77.5946,
    timeZone: "Asia/Kolkata",
  },
  {
    id: "boston",
    label: "Boston, United States",
    latitude: 42.3601,
    longitude: -71.0589,
    timeZone: "America/New_York",
  },
  {
    id: "chennai",
    label: "Chennai, India",
    latitude: 13.0827,
    longitude: 80.2707,
    timeZone: "Asia/Kolkata",
  },
  {
    id: "chicago",
    label: "Chicago, United States",
    latitude: 41.8781,
    longitude: -87.6298,
    timeZone: "America/Chicago",
  },
  {
    id: "delhi",
    label: "Delhi, India",
    latitude: 28.6139,
    longitude: 77.209,
    timeZone: "Asia/Kolkata",
  },
  {
    id: "dubai",
    label: "Dubai, United Arab Emirates",
    latitude: 25.2048,
    longitude: 55.2708,
    timeZone: "Asia/Dubai",
  },
  {
    id: "london",
    label: "London, United Kingdom",
    latitude: 51.5072,
    longitude: -0.1276,
    timeZone: "Europe/London",
  },
  {
    id: "los-angeles",
    label: "Los Angeles, United States",
    latitude: 34.0522,
    longitude: -118.2437,
    timeZone: "America/Los_Angeles",
  },
  {
    id: "mumbai",
    label: "Mumbai, India",
    latitude: 19.076,
    longitude: 72.8777,
    timeZone: "Asia/Kolkata",
  },
  {
    id: "new-york",
    label: "New York, United States",
    latitude: 40.7128,
    longitude: -74.006,
    timeZone: "America/New_York",
  },
  {
    id: "san-francisco",
    label: "San Francisco, United States",
    latitude: 37.7749,
    longitude: -122.4194,
    timeZone: "America/Los_Angeles",
  },
  {
    id: "seattle",
    label: "Seattle, United States",
    latitude: 47.6062,
    longitude: -122.3321,
    timeZone: "America/Los_Angeles",
  },
  {
    id: "tokyo",
    label: "Tokyo, Japan",
    latitude: 35.6762,
    longitude: 139.6503,
    timeZone: "Asia/Tokyo",
  },
  {
    id: "varanasi",
    label: "Varanasi, India",
    latitude: 25.3176,
    longitude: 82.9739,
    timeZone: "Asia/Kolkata",
  },
  {
    id: "washington-dc",
    label: "Washington, D.C., United States",
    latitude: 38.9072,
    longitude: -77.0369,
    timeZone: "America/New_York",
  },
  {
    id: "sydney",
    label: "Sydney, Australia",
    latitude: -33.8688,
    longitude: 151.2093,
    timeZone: "Australia/Sydney",
  },
].sort((left, right) => left.label.localeCompare(right.label));

const ghatiMs = 24 * 60 * 1000;
const palaMs = 24 * 1000;
const vipalaMs = 400;
const zenith = 90.833;
const minuteMs = 60 * 1000;

const seasonProfiles = [
  {
    key: "hemanta",
    name: "Hemanta",
    title: "Hemanta (early winter)",
    window: "Nov 16 - Jan 13",
    summary: "This period traditionally favors nourishment, steadier routines, warmth, and stronger rebuilding practices.",
    qualities: ["cool", "stable", "grounding"],
    prefer: ["warm grains", "ghee", "milk preparations", "soups", "root vegetables"],
    reduce: ["cold leftovers", "dry snacking", "skipping meals"],
    activity: "Sustained work, strength-building movement, oil massage, and regular meals are traditionally favored.",
    sleep: "Longer sleep and deeper evening winding down are generally more acceptable in this season.",
    mealStyle: "Favor nourishing, warm, moderately rich meals.",
  },
  {
    key: "shishira",
    name: "Shishira",
    title: "Shishira (late winter)",
    window: "Jan 14 - Mar 14",
    summary: "Late winter still leans cold and drying, so warmth, steadiness, and digestible nourishment remain important.",
    qualities: ["cold", "dry", "sharp"],
    prefer: ["warm breakfasts", "soups", "spiced grains", "sesame", "cooked vegetables"],
    reduce: ["iced drinks", "very light meals", "late-night wakefulness"],
    activity: "Good season for disciplined work, moderate exercise, and protecting warmth, especially in the mornings.",
    sleep: "Wake with intention, but do not undermine recovery with erratic late nights.",
    mealStyle: "Keep meals warm and regular, with enough substance to support the season.",
  },
  {
    key: "vasanta",
    name: "Vasanta",
    title: "Vasanta (spring)",
    window: "Mar 15 - May 14",
    summary: "Spring is often treated as a clearing season: lighter food, more movement, and less heaviness in routine.",
    qualities: ["mild", "loosening", "fresh"],
    prefer: ["light grains", "greens", "lentils", "bitter vegetables", "warm water"],
    reduce: ["heavy sweets", "excess dairy", "daytime lethargy"],
    activity: "Strong time for walking, cleansing routines, decluttering, and restoring discipline after winter heaviness.",
    sleep: "Avoid oversleeping; aim for a cleaner, more alert start to the day.",
    mealStyle: "Lighter, cleaner meals are traditionally emphasized.",
  },
  {
    key: "grishma",
    name: "Grishma",
    title: "Grishma (summer)",
    window: "May 15 - Jul 15",
    summary: "Summer guidance usually emphasizes cooling, hydration, moderation, and reducing excessive exertion.",
    qualities: ["hot", "dry", "draining"],
    prefer: ["hydrating fruits", "rice", "milk", "ghee in moderation", "cooling cooked foods"],
    reduce: ["overexertion", "very spicy food", "sleep deprivation"],
    activity: "Favor steadier work, lighter exercise, shade, hydration, and a calmer pace during the hottest hours.",
    sleep: "Protect recovery; hot seasons often require gentler pacing and earlier rest.",
    mealStyle: "Choose cooling, hydrating, moderately light meals.",
  },
  {
    key: "varsha",
    name: "Varsha",
    title: "Varsha (monsoon)",
    window: "Jul 16 - Sep 15",
    summary: "Monsoon guidance often favors digestive care, warmth, simplicity, and avoiding excess dampness or heaviness.",
    qualities: ["damp", "heavy", "unstable"],
    prefer: ["warm cooked meals", "ginger", "rice", "mung dal", "light soups"],
    reduce: ["raw foods", "contaminated water", "heavy fried meals"],
    activity: "Keep routines clean and orderly; choose moderate work, gentle movement, and digestive caution.",
    sleep: "Maintain regular sleep to steady the system when the season feels erratic.",
    mealStyle: "Warm, simple, well-cooked meals are traditionally preferred.",
  },
  {
    key: "sharad",
    name: "Sharad",
    title: "Sharad (autumn)",
    window: "Sep 16 - Nov 15",
    summary: "Autumn is often treated as a season for clarity, cooling balance, and measured activity after the rains.",
    qualities: ["clear", "light", "slightly warm"],
    prefer: ["sweet fruits", "rice", "ghee", "amla", "cooling cooked foods"],
    reduce: ["excess heat", "irritability", "very oily or overly spicy meals"],
    activity: "Good season for clear thinking, orderly work, and moderate exercise without excess heat.",
    sleep: "Keep bedtime regular and avoid pushing into late-night stimulation.",
    mealStyle: "Balanced meals with mild cooling qualities fit this season well.",
  },
];

const monthFoodProfiles = [
  {
    month: 1,
    name: "January",
    seasonLabel: "Hemanta to Shishira",
    favor: "warm grains, sesame, milk preparations, soups, stews",
    reduce: "cold drinks, irregular meals, dry snacking",
  },
  {
    month: 2,
    name: "February",
    seasonLabel: "Shishira",
    favor: "spiced porridges, root vegetables, cooked greens, ghee in moderation",
    reduce: "iced foods, very light dieting, late-night eating",
  },
  {
    month: 3,
    name: "March",
    seasonLabel: "Shishira to Vasanta",
    favor: "lighter grains, lentils, warm water, greens",
    reduce: "heavy sweets, excessive dairy, sluggish heavy breakfasts",
  },
  {
    month: 4,
    name: "April",
    seasonLabel: "Vasanta",
    favor: "bitter vegetables, mung preparations, barley, light lunches",
    reduce: "fried foods, heavy desserts, oversleeping after sunrise",
  },
  {
    month: 5,
    name: "May",
    seasonLabel: "Vasanta to Grishma",
    favor: "fresh fruit, rice, lighter cooked meals, hydration",
    reduce: "excess spice, long fasting in heat, overexertion",
  },
  {
    month: 6,
    name: "June",
    seasonLabel: "Grishma",
    favor: "cooling cooked foods, fruit, rice, buttermilk where suitable",
    reduce: "very salty meals, intense heat exposure, sleep deprivation",
  },
  {
    month: 7,
    name: "July",
    seasonLabel: "Grishma to Varsha",
    favor: "simple cooked meals, rice, ginger, warm water, soups",
    reduce: "raw salads, street food in damp weather, heavy oils",
  },
  {
    month: 8,
    name: "August",
    seasonLabel: "Varsha",
    favor: "mung dal, light khichdi, warm spices, well-cooked vegetables",
    reduce: "cold leftovers, contaminated water, heavy fried foods",
  },
  {
    month: 9,
    name: "September",
    seasonLabel: "Varsha to Sharad",
    favor: "mild grains, ghee in moderation, amla, balanced cooling foods",
    reduce: "overly spicy meals, digestive overload, erratic timings",
  },
  {
    month: 10,
    name: "October",
    seasonLabel: "Sharad",
    favor: "sweet fruit, rice, mild cooked vegetables, cooling balance",
    reduce: "irritating heat, excess oil, aggressive spice",
  },
  {
    month: 11,
    name: "November",
    seasonLabel: "Sharad to Hemanta",
    favor: "nourishing grains, soups, roots, slightly richer meals",
    reduce: "meal skipping, cold raw dinners, irregular sleep",
  },
  {
    month: 12,
    name: "December",
    seasonLabel: "Hemanta",
    favor: "warming stews, grains, sesame, dairy where suitable, hearty lunches",
    reduce: "cold breakfasts, under-eating, staying up deep into the night",
  },
];

const elements = {
  citySelect: document.querySelector("#city-select"),
  cityTimezone: document.querySelector("#city-timezone"),
  cityCoordinates: document.querySelector("#city-coordinates"),
  gregorianTime: document.querySelector("#gregorian-time"),
  gregorianDate: document.querySelector("#gregorian-date"),
  gregorianZone: document.querySelector("#gregorian-zone"),
  gregorianLongDate: document.querySelector("#gregorian-long-date"),
  dayProgress: document.querySelector("#day-progress"),
  gregorianRing: document.querySelector("#gregorian-ring"),
  gregorianProgressValue: document.querySelector("#gregorian-progress-value"),
  gregorianProgressCaption: document.querySelector("#gregorian-progress-caption"),
  daylightSummary: document.querySelector("#daylight-summary"),
  solarArc: document.querySelector("#solar-arc"),
  arcSunriseLabel: document.querySelector("#arc-sunrise-label"),
  arcNoonLabel: document.querySelector("#arc-noon-label"),
  arcSunsetLabel: document.querySelector("#arc-sunset-label"),
  vedicTime: document.querySelector("#vedic-time"),
  vedicCaption: document.querySelector("#vedic-caption"),
  sunriseTime: document.querySelector("#sunrise-time"),
  sunsetTime: document.querySelector("#sunset-time"),
  elapsedSunrise: document.querySelector("#elapsed-sunrise"),
  vedicRing: document.querySelector("#vedic-ring"),
  vedicProgressValue: document.querySelector("#vedic-progress-value"),
  vedicProgressCaption: document.querySelector("#vedic-progress-caption"),
  phaseBadge: document.querySelector("#phase-badge"),
  phaseTitle: document.querySelector("#phase-title"),
  phaseWindow: document.querySelector("#phase-window"),
  phaseFocus: document.querySelector("#phase-focus"),
  phaseFood: document.querySelector("#phase-food"),
  phaseAvoid: document.querySelector("#phase-avoid"),
  phaseSleep: document.querySelector("#phase-sleep"),
  dayPhaseCards: document.querySelector("#day-phase-cards"),
  timelineActiveLabel: document.querySelector("#timeline-active-label"),
  seasonName: document.querySelector("#season-name"),
  seasonTitle: document.querySelector("#season-title"),
  seasonSummary: document.querySelector("#season-summary"),
  seasonWindow: document.querySelector("#season-window"),
  seasonQualities: document.querySelector("#season-qualities"),
  seasonFoods: document.querySelector("#season-foods"),
  seasonReduce: document.querySelector("#season-reduce"),
  seasonActivity: document.querySelector("#season-activity"),
  seasonSleep: document.querySelector("#season-sleep"),
  seasonCards: document.querySelector("#season-cards"),
  mealTiming: document.querySelector("#meal-timing"),
  dinnerTiming: document.querySelector("#dinner-timing"),
  wakeTiming: document.querySelector("#wake-timing"),
  restTiming: document.querySelector("#rest-timing"),
  guidanceFootnote: document.querySelector("#guidance-footnote"),
  muhurtaCards: document.querySelector("#muhurta-cards"),
  monthFoodCards: document.querySelector("#month-food-cards"),
  monthTableCaption: document.querySelector("#month-table-caption"),
  reportLastUpdated: document.querySelector("#report-last-updated"),
};

let selectedCity = cities.find((city) => city.id === "chicago") || cities[0];
let timerId = null;

function init() {
  populateCities();
  updateStaticCityMeta(selectedCity);
  updateReportLastUpdated();
  render();

  elements.citySelect.addEventListener("change", (event) => {
    const nextCity = cities.find((city) => city.id === event.target.value);

    if (!nextCity) {
      return;
    }

    selectedCity = nextCity;
    updateStaticCityMeta(selectedCity);
    render();
  });

  timerId = window.setInterval(render, 1000);
}

function populateCities() {
  const options = cities
    .map(
      (city) =>
        `<option value="${city.id}" ${city.id === selectedCity.id ? "selected" : ""}>${city.label}</option>`
    )
    .join("");

  elements.citySelect.innerHTML = options;
}

function updateStaticCityMeta(city) {
  elements.cityTimezone.textContent = city.timeZone;
  elements.cityCoordinates.textContent = `${formatCoordinate(city.latitude, "N", "S")}, ${formatCoordinate(city.longitude, "E", "W")}`;
}

function render() {
  const now = new Date();
  const solarContext = getSolarContext(now, selectedCity);
  renderGregorian(now, selectedCity);
  renderVedic(now, selectedCity, solarContext);
  renderLifestyle(now, selectedCity, solarContext);
}

function updateReportLastUpdated() {
  const parsedLastModified = document.lastModified ? new Date(document.lastModified) : null;
  const lastUpdated = parsedLastModified && !Number.isNaN(parsedLastModified.getTime())
    ? parsedLastModified
    : new Date();

  elements.reportLastUpdated.textContent = `Last updated: ${formatReportDateTime(lastUpdated)}`;
}

function renderGregorian(now, city) {
  elements.gregorianTime.textContent = formatInZone(now, city.timeZone, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  elements.gregorianDate.textContent = formatInZone(now, city.timeZone, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  elements.gregorianLongDate.textContent = formatInZone(now, city.timeZone, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  elements.gregorianZone.textContent = `Timezone: ${getTimeZoneLabel(now, city.timeZone)}`;

  const dayStart = getZonedDateBoundary(now, city.timeZone, "start");
  const dayEnd = getZonedDateBoundary(now, city.timeZone, "end");
  const progressRatio = clampRatio((now.getTime() - dayStart.getTime()) / (dayEnd.getTime() - dayStart.getTime()));
  elements.dayProgress.textContent = `${(progressRatio * 100).toFixed(1)}% of the local day`;
  elements.gregorianRing.style.setProperty("--progress", `${progressRatio * 360}deg`);
  elements.gregorianProgressValue.textContent = `${Math.round(progressRatio * 100)}%`;
  elements.gregorianProgressCaption.textContent = `Midnight to midnight in ${getTimeZoneLabel(now, city.timeZone)}`;
}

function renderVedic(now, city, solarContext) {
  if (!solarContext) {
    elements.vedicTime.textContent = "Unavailable";
    elements.vedicCaption.textContent = "Sunrise/sunset could not be computed for this city/date.";
    elements.sunriseTime.textContent = "Unavailable";
    elements.sunsetTime.textContent = "Unavailable";
    elements.elapsedSunrise.textContent = "Unavailable";
    return;
  }

  const {
    sunriseToday,
    activeSunrise,
    upcomingSunrise,
    sunsetToday,
  } = solarContext;
  const elapsed = now.getTime() - activeSunrise.getTime();
  const elapsedInCycle = clampToCycle(elapsed, activeSunrise, upcomingSunrise);
  const vedic = toVedicUnits(elapsedInCycle);
  const vedicRatio = clampRatio(getNormalizedVedicElapsed(elapsedInCycle) / (60 * ghatiMs));
  const vedicGhatis = (getNormalizedVedicElapsed(elapsedInCycle) / ghatiMs).toFixed(1);

  elements.vedicTime.textContent = `${pad2(vedic.ghati)} : ${pad2(vedic.pala)} : ${pad2(vedic.vipala)}`;
  elements.vedicCaption.textContent = `Anchor sunrise: ${formatInZone(activeSunrise, city.timeZone, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })}`;
  elements.sunriseTime.textContent = formatInZone(sunriseToday, city.timeZone, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  elements.sunsetTime.textContent = formatInZone(sunsetToday, city.timeZone, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  elements.elapsedSunrise.textContent = formatElapsed(elapsedInCycle);
  elements.vedicRing.style.setProperty("--progress", `${vedicRatio * 360}deg`);
  elements.vedicProgressValue.textContent = vedicGhatis;
  elements.vedicProgressCaption.textContent = `${vedicGhatis} of 60 ghatis since the anchor sunrise`;
}

function renderLifestyle(now, city, solarContext) {
  if (!solarContext) {
    renderUnavailableLifestyle();
    return;
  }

  const phaseContext = getPhaseContext(now, city, solarContext);
  const season = getSeasonProfile(solarContext.today, city.latitude);

  renderCurrentGuidance(phaseContext, season);
  renderDaylightArc(now, city, solarContext, phaseContext);
  renderDayRhythm(phaseContext);
  renderSeasonalLiving(season, city.latitude);
  renderFoodAndSleep(season, solarContext, city);
  renderMuhurtas(now, city, solarContext);
  renderMonthFoodTable(solarContext.zonedNow.month, season, city.latitude);
}

function renderUnavailableLifestyle() {
  elements.phaseBadge.textContent = "Current phase";
  elements.phaseTitle.textContent = "Unavailable";
  elements.phaseWindow.textContent = "Lifestyle guidance is unavailable because sunrise/sunset could not be computed.";
  elements.phaseFocus.textContent = "Choose a city where the sunrise calculation is available.";
  elements.phaseFood.textContent = "Unavailable";
  elements.phaseAvoid.textContent = "Unavailable";
  elements.phaseSleep.textContent = "Unavailable";
  elements.daylightSummary.textContent = "Solar arc unavailable.";
  elements.solarArc.style.setProperty("--sun-progress", "0.5");
  elements.solarArc.style.setProperty("--sun-height", "0");
  elements.solarArc.style.setProperty("--daylight-progress", "0");
  elements.solarArc.dataset.sky = "day";
  elements.arcSunriseLabel.textContent = "--:--";
  elements.arcNoonLabel.textContent = "--:--";
  elements.arcSunsetLabel.textContent = "--:--";
  elements.dayPhaseCards.innerHTML = "";
  elements.timelineActiveLabel.textContent = "Unavailable";
  elements.seasonName.textContent = "Current ritu";
  elements.seasonTitle.textContent = "Unavailable";
  elements.seasonSummary.textContent = "Seasonal guidance could not be generated.";
  elements.seasonWindow.textContent = "Unavailable";
  elements.seasonQualities.textContent = "Unavailable";
  elements.seasonFoods.textContent = "Unavailable";
  elements.seasonReduce.textContent = "Unavailable";
  elements.seasonActivity.textContent = "Unavailable";
  elements.seasonSleep.textContent = "Unavailable";
  elements.seasonCards.innerHTML = "";
  elements.mealTiming.textContent = "Unavailable";
  elements.dinnerTiming.textContent = "Unavailable";
  elements.wakeTiming.textContent = "Unavailable";
  elements.restTiming.textContent = "Unavailable";
  elements.guidanceFootnote.textContent = "Traditional reference only.";
  elements.muhurtaCards.innerHTML = "";
  elements.monthFoodCards.innerHTML = "";
  elements.monthTableCaption.textContent = "Seasonal food guidance is unavailable.";
}

function renderCurrentGuidance(phaseContext, season) {
  elements.phaseBadge.textContent = `${phaseContext.current.badge} · ${season.name}`;
  elements.phaseTitle.innerHTML = `<span class="title-with-icon">${getPhaseIconMarkup(phaseContext.current.key, "phase-icon-badge")}<span class="phase-title-text">${phaseContext.current.title}</span></span>`;
  elements.phaseWindow.textContent = phaseContext.current.windowText;
  elements.phaseFocus.textContent = phaseContext.current.focus;
  elements.phaseFood.textContent = `${phaseContext.current.food} ${season.mealStyle}`;
  elements.phaseAvoid.textContent = `${phaseContext.current.avoid} Seasonal caution: ${season.reduce.join(", ")}.`;
  elements.phaseSleep.textContent = `${phaseContext.current.sleep} ${season.sleep}`;
}

function renderDayRhythm(phaseContext) {
  elements.timelineActiveLabel.textContent = `${phaseContext.current.title} · ${phaseContext.current.windowText}`;
  elements.dayPhaseCards.innerHTML = phaseContext.schedule
    .map(
      (phase) => `
        <article class="rhythm-card ${phase.key === phaseContext.current.key ? "is-active" : ""}">
          <p class="rhythm-kicker">${phase.badge}</p>
          <h3>${phase.title}</h3>
          <p class="rhythm-window">${phase.windowText}</p>
          <p class="rhythm-copy">${phase.focus}</p>
        </article>
      `
    )
    .join("");
}

function renderDaylightArc(now, city, solarContext, phaseContext) {
  const sunrise = solarContext.sunriseToday;
  const sunset = solarContext.sunsetToday;
  const solarNoon = new Date(sunrise.getTime() + ((sunset.getTime() - sunrise.getTime()) / 2));
  const isDaylight = now.getTime() >= sunrise.getTime() && now.getTime() <= sunset.getTime();
  const dawnStart = new Date(sunrise.getTime() - (45 * minuteMs));
  const duskEnd = new Date(sunset.getTime() + (45 * minuteMs));
  const daylightRatio = isDaylight
    ? clampRatio((now.getTime() - sunrise.getTime()) / (sunset.getTime() - sunrise.getTime()))
    : now.getTime() < sunrise.getTime()
      ? 0
      : 1;
  const skyState = isDaylight
    ? "day"
    : now.getTime() >= dawnStart.getTime() && now.getTime() < sunrise.getTime()
      ? "dawn"
      : now.getTime() > sunset.getTime() && now.getTime() <= duskEnd.getTime()
        ? "dusk"
        : "night";
  const sunProgress = isDaylight ? daylightRatio : now.getTime() < sunrise.getTime() ? 0 : 1;
  const sunHeight = isDaylight ? Math.sin(daylightRatio * Math.PI) : 0;

  elements.solarArc.dataset.sky = skyState;
  elements.solarArc.style.setProperty("--sun-progress", sunProgress.toFixed(4));
  elements.solarArc.style.setProperty("--sun-height", sunHeight.toFixed(4));
  elements.solarArc.style.setProperty("--daylight-progress", daylightRatio.toFixed(4));
  elements.arcSunriseLabel.textContent = formatShortTime(sunrise, city.timeZone);
  elements.arcNoonLabel.textContent = formatShortTime(solarNoon, city.timeZone);
  elements.arcSunsetLabel.textContent = formatShortTime(sunset, city.timeZone);
  elements.daylightSummary.textContent = isDaylight
    ? `${(daylightRatio * 100).toFixed(1)}% of today's daylight has passed in ${city.label}. Current phase: ${phaseContext.current.title}.`
    : now.getTime() < sunrise.getTime()
      ? `Before sunrise in ${city.label}. Sunrise is at ${formatShortTime(sunrise, city.timeZone)}.`
      : `After sunset in ${city.label}. Today's daylight ended at ${formatShortTime(sunset, city.timeZone)}.`;
}

function getPhaseIconMarkup(key, className) {
  const iconPaths = {
    "brahma-muhurta": '<path d="M12 3.5c2.1 2.1 3.2 4.2 3.2 6.3A3.2 3.2 0 1 1 8.8 9.8C8.8 7.7 9.9 5.6 12 3.5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 6.2v11.3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M8.3 13.2h7.4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    "sunrise-transition": '<path d="M4 14.5h16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7 14.5a5 5 0 0 1 10 0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 5.2v3.3M6.8 8.1l1.8 1.5M17.2 8.1l-1.8 1.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    "morning-work": '<path d="M6.2 5.5h11.6v13H6.2z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9 8.5h6M9 11.5h6M9 14.5h4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    "midday-digestion": '<path d="M5.8 10.2h12.4l-1.2 5.6H7z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8.2 18.2h7.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M9.3 7.3c0-1 .6-1.6 1.3-2.3M12 7.3c0-1 .6-1.6 1.3-2.3M14.7 7.3c0-1 .6-1.6 1.3-2.3" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
    "afternoon-duty": '<path d="M5.5 8.2h13v9.6h-13z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9 8.2V6.5h6v1.7" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M5.5 11.5h13" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    "sunset-transition": '<path d="M4 14.5h16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7 14.5a5 5 0 0 1 10 0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6.6 17.8 8 16.5M17.4 17.8 16 16.5M12 18.5v-2.3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    "evening-settle": '<path d="M12 4.5c1.4 1.7 2.1 3.3 2.1 4.9A2.1 2.1 0 1 1 9.9 9.4c0-1.6.7-3.2 2.1-4.9Z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9.2 12.2h5.6l1 5.3H8.2z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
    "night-rest": '<path d="M14.9 4.8a6.5 6.5 0 1 0 4.3 10.7 7 7 0 1 1-4.3-10.7Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M16.8 8.2v.1M18.9 10.3v.1M16.7 12.4v.1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  };

  const icon = iconPaths[key] || iconPaths["morning-work"];
  return `<span class="${className}" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">${icon}</svg></span>`;
}

function renderSeasonalLiving(season, latitude) {
  elements.seasonName.textContent = `Current ritu · ${season.name}`;
  elements.seasonTitle.textContent = season.title;
  elements.seasonSummary.textContent = season.summary;
  elements.seasonWindow.textContent = getSeasonWindowForLatitude(season, latitude);
  elements.seasonQualities.textContent = season.qualities.join(", ");
  elements.seasonFoods.textContent = season.prefer.join(", ");
  elements.seasonReduce.textContent = season.reduce.join(", ");
  elements.seasonActivity.textContent = season.activity;
  elements.seasonSleep.textContent = season.sleep;
  elements.seasonCards.innerHTML = seasonProfiles
    .map(
      (profile) => `
        <article class="season-card ${profile.key === season.key ? "is-active" : ""}">
          <p class="season-card-title">${getSeasonWindowForLatitude(profile, latitude)}</p>
          <h3>${profile.name}</h3>
          <p class="season-copy">${profile.summary}</p>
        </article>
      `
    )
    .join("");
}

function renderFoodAndSleep(season, solarContext, city) {
  const solarNoon = new Date(
    solarContext.sunriseToday.getTime() +
      ((solarContext.sunsetToday.getTime() - solarContext.sunriseToday.getTime()) / 2)
  );
  const lunchStart = new Date(solarNoon.getTime() - (60 * minuteMs));
  const lunchEnd = new Date(solarNoon.getTime() + (60 * minuteMs));
  const dinnerStart = new Date(solarContext.sunsetToday.getTime() - (30 * minuteMs));
  const dinnerEnd = new Date(solarContext.sunsetToday.getTime() + (90 * minuteMs));
  const wakeStart = new Date(solarContext.sunriseToday.getTime() - (96 * minuteMs));
  const wakeEnd = new Date(solarContext.sunriseToday.getTime() - (24 * minuteMs));
  const sleepStart = new Date(solarContext.sunsetToday.getTime() + (90 * minuteMs));
  const localSleepCap = getLocalMarker(solarContext.today, city.timeZone, 22, 30, 0);
  const sleepEnd = localSleepCap.getTime() > sleepStart.getTime()
    ? localSleepCap
    : new Date(sleepStart.getTime() + (60 * minuteMs));

  elements.mealTiming.textContent = `Main meal: ${formatRange(lunchStart, lunchEnd, city.timeZone)}. Traditional guidance often places the heaviest meal near the strongest daytime digestive window. ${season.mealStyle}`;
  elements.dinnerTiming.textContent = `Dinner: ${formatRange(dinnerStart, dinnerEnd, city.timeZone)}. Keep the evening meal lighter, simpler, and easier to digest than the midday meal.`;
  elements.wakeTiming.textContent = `Wake window: ${formatRange(wakeStart, wakeEnd, city.timeZone)}. This period is commonly reserved for cleansing, prayer, study, quiet planning, or gentle movement before the day accelerates.`;
  elements.restTiming.textContent = `Sleep window: ${formatRange(sleepStart, sleepEnd, city.timeZone)}. Wind down stimulation, finish heavy work earlier, and let the night move toward restoration rather than extension.`;
  elements.guidanceFootnote.textContent = "This is a practical traditional reference, not medical advice. The season mapping follows an approximate Indian ritucharya calendar and the daily rhythm is simplified from broader Vedic and Ayurvedic practice.";
}

function renderMuhurtas(now, city, solarContext) {
  const windows = getMuhurtaWindows(now, solarContext, city.timeZone);
  elements.muhurtaCards.innerHTML = windows
    .map(
      (window) => `
        <article class="muhurta-card ${window.isActive ? "is-active" : ""}">
          <p class="muhurta-kicker">${window.kind}</p>
          <h3>${window.title}</h3>
          <p class="muhurta-window">${window.windowText}</p>
          <p class="muhurta-copy">${window.copy}</p>
        </article>
      `
    )
    .join("");
}

function renderMonthFoodTable(currentMonth, season, latitude) {
  elements.monthTableCaption.textContent = `The selected city is currently in ${season.title}. The current local month is highlighted below so seasonal food shifts are easier to track through the year.`;
  elements.monthFoodCards.innerHTML = monthFoodProfiles
    .map(
      (profile) => {
        const seasonalProfile = getMonthFoodProfileForLatitude(profile.month, latitude);

        return `
        <article class="month-card ${profile.month === currentMonth ? "is-active" : ""}">
          <p class="month-kicker">${seasonalProfile.seasonLabel}</p>
          <h3>${profile.name}</h3>
          <p class="month-copy"><strong>Favor:</strong> ${seasonalProfile.favor}</p>
          <p class="month-copy"><strong>Reduce:</strong> ${seasonalProfile.reduce}</p>
        </article>
      `;
      }
    )
    .join("");
}

function getMuhurtaWindows(now, solarContext, timeZone) {
  const solarNoon = new Date(
    solarContext.sunriseToday.getTime() +
      ((solarContext.sunsetToday.getTime() - solarContext.sunriseToday.getTime()) / 2)
  );
  const brahmaStart = new Date(solarContext.sunriseToday.getTime() - (96 * minuteMs));
  const brahmaEnd = new Date(solarContext.sunriseToday.getTime() - (48 * minuteMs));
  const pratahStart = new Date(solarContext.sunriseToday.getTime() - (24 * minuteMs));
  const pratahEnd = new Date(solarContext.sunriseToday.getTime() + (24 * minuteMs));
  const madhyahnaStart = new Date(solarNoon.getTime() - (24 * minuteMs));
  const madhyahnaEnd = new Date(solarNoon.getTime() + (24 * minuteMs));
  const sayamStart = new Date(solarContext.sunsetToday.getTime() - (24 * minuteMs));
  const sayamEnd = new Date(solarContext.sunsetToday.getTime() + (24 * minuteMs));

  return [
    {
      kind: "Muhurta",
      title: "Brahma muhurta",
      start: brahmaStart,
      end: brahmaEnd,
      windowText: formatRange(brahmaStart, brahmaEnd, timeZone),
      copy: "Traditionally favored for meditation, mantra, scriptural study, inward focus, and beginning the day before worldly pace takes over.",
    },
    {
      kind: "Sandhya",
      title: "Pratah sandhya",
      start: pratahStart,
      end: pratahEnd,
      windowText: formatRange(pratahStart, pratahEnd, timeZone),
      copy: "A sunrise transition window often associated with prayer, cleansing, breathwork, gratitude, and orienting the mind toward clarity.",
    },
    {
      kind: "Midday",
      title: "Madhyahna pause",
      start: madhyahnaStart,
      end: madhyahnaEnd,
      windowText: formatRange(madhyahnaStart, madhyahnaEnd, timeZone),
      copy: "A useful reference point for a complete meal, a brief pause, and a reset before the later duties of the day continue.",
    },
    {
      kind: "Sandhya",
      title: "Sayam sandhya",
      start: sayamStart,
      end: sayamEnd,
      windowText: formatRange(sayamStart, sayamEnd, timeZone),
      copy: "A sunset transition often used for prayer, reflection, gratitude, household re-centering, and softening from outward action into evening calm.",
    },
  ].map((window) => ({
    ...window,
    isActive: isWithinRange(now, window.start, window.end),
  }));
}

function getSolarContext(now, city) {
  const zonedNow = getZonedParts(now, city.timeZone);
  const today = { year: zonedNow.year, month: zonedNow.month, day: zonedNow.day };
  const yesterday = addDays(today, -1);
  const tomorrow = addDays(today, 1);
  const sunriseToday = calculateSunEvent(today, city.latitude, city.longitude, city.timeZone, true);
  const sunriseYesterday = calculateSunEvent(yesterday, city.latitude, city.longitude, city.timeZone, true);
  const sunriseTomorrow = calculateSunEvent(tomorrow, city.latitude, city.longitude, city.timeZone, true);
  const sunsetToday = calculateSunEvent(today, city.latitude, city.longitude, city.timeZone, false);

  if (!sunriseToday || !sunriseYesterday || !sunriseTomorrow || !sunsetToday) {
    return null;
  }

  const activeSunrise = now.getTime() >= sunriseToday.getTime() ? sunriseToday : sunriseYesterday;
  const upcomingSunrise = activeSunrise === sunriseToday ? sunriseTomorrow : sunriseToday;

  return {
    zonedNow,
    today,
    yesterday,
    tomorrow,
    sunriseToday,
    sunriseYesterday,
    sunriseTomorrow,
    sunsetToday,
    activeSunrise,
    upcomingSunrise,
  };
}

function getPhaseContext(now, city, solarContext) {
  const schedule = buildDayPhaseSchedule(solarContext, city.timeZone);
  const current =
    schedule.find((phase) => phase.key !== "night-rest" && now.getTime() >= phase.start.getTime() && now.getTime() < phase.end.getTime()) ||
    schedule.find((phase) => phase.key === "night-rest");

  if (current.key === "night-rest") {
    current.windowText = now.getTime() < schedule[0].start.getTime()
      ? `Quiet night hours until ${formatShortTime(schedule[0].start, city.timeZone)}`
      : current.windowText;
  }

  return { current, schedule };
}

function buildDayPhaseSchedule(solarContext, timeZone) {
  const sunrise = solarContext.sunriseToday;
  const sunset = solarContext.sunsetToday;
  const daylight = sunset.getTime() - sunrise.getTime();
  const brahmaStart = new Date(sunrise.getTime() - (96 * minuteMs));
  const brahmaEnd = new Date(sunrise.getTime() - (48 * minuteMs));
  const dawnEnd = new Date(sunrise.getTime() + (48 * minuteMs));
  const morningEnd = new Date(sunrise.getTime() + (daylight * 0.35));
  const middayEnd = new Date(sunrise.getTime() + (daylight * 0.65));
  const afternoonEnd = new Date(sunset.getTime() - (48 * minuteMs));
  const sunsetEnd = new Date(sunset.getTime() + (48 * minuteMs));
  const eveningCap = getLocalMarker(solarContext.today, timeZone, 21, 30, 0);
  const eveningEnd = eveningCap.getTime() > sunsetEnd.getTime()
    ? eveningCap
    : new Date(sunsetEnd.getTime() + (90 * minuteMs));

  const schedule = [
    {
      key: "brahma-muhurta",
      badge: "Pre-dawn clarity",
      title: "Brahma muhurta",
      start: brahmaStart,
      end: brahmaEnd,
      windowText: formatRange(brahmaStart, brahmaEnd, timeZone),
      focus: "Quiet prayer, meditation, mantra, reflective study, and setting intention are commonly placed here.",
      food: "Favor hydration or a very light warm drink rather than a heavy meal.",
      avoid: "Avoid sleeping through the whole window if you want a more traditional start, and avoid noisy stimulation.",
      sleep: "If you are still exhausted here, the previous night probably ran too late.",
    },
    {
      key: "sunrise-transition",
      badge: "Dawn transition",
      title: "Sunrise and sandhya",
      start: brahmaEnd,
      end: dawnEnd,
      windowText: formatRange(brahmaEnd, dawnEnd, timeZone),
      focus: "Cleansing, prayer, breathwork, light movement, and orienting the household around the new day fit this transition well.",
      food: "Keep breakfast light and easy if you eat this early.",
      avoid: "Avoid rushing immediately into heavy digital or social input.",
      sleep: "Move fully into wakefulness here rather than drifting back to sleep.",
    },
    {
      key: "morning-work",
      badge: "Morning discipline",
      title: "Morning work window",
      start: dawnEnd,
      end: morningEnd,
      windowText: formatRange(dawnEnd, morningEnd, timeZone),
      focus: "This period is well suited to focused study, planning, teaching, writing, and orderly work.",
      food: "Choose a moderate breakfast that supports steadiness without heaviness.",
      avoid: "Avoid scattered multitasking and unnecessarily heavy food.",
      sleep: "Stay upright and engaged; do not let the morning blur into sluggishness.",
    },
    {
      key: "midday-digestion",
      badge: "Midday strength",
      title: "Midday and main meal",
      start: morningEnd,
      end: middayEnd,
      windowText: formatRange(morningEnd, middayEnd, timeZone),
      focus: "Worldly duties, executive work, decisions, and the main meal traditionally fit near the center of the day.",
      food: "This is the strongest window for the heaviest, most complete meal of the day.",
      avoid: "Avoid skipping the main meal and then compensating with a heavy late dinner.",
      sleep: "Keep momentum, but allow a short pause after eating rather than pushing without digestion time.",
    },
    {
      key: "afternoon-duty",
      badge: "Afternoon duty",
      title: "Afternoon responsibilities",
      start: middayEnd,
      end: afternoonEnd,
      windowText: formatRange(middayEnd, afternoonEnd, timeZone),
      focus: "Meetings, travel, practical tasks, administration, service, and household duties fit the later workday well.",
      food: "If needed, keep snacks light and simple rather than turning the afternoon into a second meal.",
      avoid: "Avoid reaching for stimulation to compensate for natural afternoon flattening.",
      sleep: "Do not shift this period into unbounded evening work that follows you into the night.",
    },
    {
      key: "sunset-transition",
      badge: "Evening transition",
      title: "Sunset and settling",
      start: afternoonEnd,
      end: sunsetEnd,
      windowText: formatRange(afternoonEnd, sunsetEnd, timeZone),
      focus: "Traditionally this is a pause point for prayer, gratitude, regrouping, and softening the pace of the day.",
      food: "If dinner falls here, keep it warm, lighter than lunch, and not overly heavy.",
      avoid: "Avoid carrying a harsh work tempo straight through sunset.",
      sleep: "Start dimming stimulation and reduce the sense of rush.",
    },
    {
      key: "evening-settle",
      badge: "Evening settling",
      title: "Evening quiet work",
      start: sunsetEnd,
      end: eveningEnd,
      windowText: formatRange(sunsetEnd, eveningEnd, timeZone),
      focus: "Family time, light reading, reflection, devotional practice, and simple household closure fit better here than intense output.",
      food: "Finish the evening meal early enough that digestion is mostly calm before sleep.",
      avoid: "Avoid intense arguments, heavy food, or work that keeps the mind sharply activated.",
      sleep: "Use this as a buffer into sleep, not as a second morning.",
    },
    {
      key: "night-rest",
      badge: "Night restoration",
      title: "Night and sleep",
      start: eveningEnd,
      end: brahmaStart,
      windowText: `After ${formatShortTime(eveningEnd, timeZone)} until ${formatShortTime(brahmaStart, timeZone)}`,
      focus: "Night is traditionally for restoration, intimacy, quietness, and sleep rather than prolonged stimulation.",
      food: "Avoid turning late-night wakefulness into extra meals or heavy snacking.",
      avoid: "Avoid pushing study, entertainment, or work deep into the night when possible.",
      sleep: "Protect uninterrupted sleep so the next sunrise can actually reset the day.",
    },
  ];

  return schedule;
}

function getSeasonProfile(dateParts, latitude = 0) {
  const monthDay = (dateParts.month * 100) + dateParts.day;
  const northernSeasonKey = getNorthernSeasonKey(monthDay);
  const seasonKey = latitude < 0 ? getSouthernSeasonKey(northernSeasonKey) : northernSeasonKey;

  return seasonProfiles.find((profile) => profile.key === seasonKey);
}

function getNorthernSeasonKey(monthDay) {
  if (monthDay >= 1116 || monthDay <= 113) {
    return "hemanta";
  }

  if (monthDay <= 314) {
    return "shishira";
  }

  if (monthDay <= 514) {
    return "vasanta";
  }

  if (monthDay <= 715) {
    return "grishma";
  }

  if (monthDay <= 915) {
    return "varsha";
  }

  return "sharad";
}

function getSouthernSeasonKey(northernSeasonKey) {
  const shiftedKeys = {
    hemanta: "grishma",
    shishira: "varsha",
    vasanta: "sharad",
    grishma: "hemanta",
    varsha: "shishira",
    sharad: "vasanta",
  };

  return shiftedKeys[northernSeasonKey] || northernSeasonKey;
}

function getSeasonWindowForLatitude(profile, latitude = 0) {
  if (latitude >= 0) {
    return profile.window;
  }

  const southernWindows = {
    hemanta: "May 16 - Jul 15",
    shishira: "Jul 16 - Sep 15",
    vasanta: "Sep 16 - Nov 15",
    grishma: "Nov 16 - Jan 13",
    varsha: "Jan 14 - Mar 14",
    sharad: "Mar 15 - May 14",
  };

  return southernWindows[profile.key] || profile.window;
}

function getMonthFoodProfileForLatitude(month, latitude = 0) {
  const sourceMonth = latitude < 0 ? shiftMonth(month, 6) : month;

  return monthFoodProfiles.find((profile) => profile.month === sourceMonth);
}

function shiftMonth(month, offset) {
  return ((((month - 1) + offset) % 12) + 12) % 12 + 1;
}

function toVedicUnits(elapsedMs) {
  const normalized = getNormalizedVedicElapsed(elapsedMs);
  const ghati = Math.floor(normalized / ghatiMs);
  const ghatiRemainder = normalized % ghatiMs;
  const pala = Math.floor(ghatiRemainder / palaMs);
  const vipala = Math.floor((ghatiRemainder % palaMs) / vipalaMs);

  return { ghati, pala, vipala };
}

function getNormalizedVedicElapsed(elapsedMs) {
  return ((elapsedMs % (60 * ghatiMs)) + (60 * ghatiMs)) % (60 * ghatiMs);
}

function clampToCycle(elapsedMs, sunriseStart, sunriseEnd) {
  const cycleLength = sunriseEnd.getTime() - sunriseStart.getTime();

  if (elapsedMs < 0) {
    return 0;
  }

  return Math.min(elapsedMs, cycleLength);
}

function calculateSunEvent(dateParts, latitude, longitude, timeZone, isSunrise) {
  const dayOfYear = getDayOfYear(dateParts.year, dateParts.month, dateParts.day);
  const lngHour = longitude / 15;
  const approximateTime =
    dayOfYear + ((isSunrise ? 6 : 18) - lngHour) / 24;

  const meanAnomaly = (0.9856 * approximateTime) - 3.289;
  const trueLongitude = normalizeDegrees(
    meanAnomaly +
      (1.916 * Math.sin(toRadians(meanAnomaly))) +
      (0.02 * Math.sin(toRadians(2 * meanAnomaly))) +
      282.634
  );

  let rightAscension = toDegrees(Math.atan(0.91764 * Math.tan(toRadians(trueLongitude))));
  rightAscension = normalizeDegrees(rightAscension);

  const longitudeQuadrant = Math.floor(trueLongitude / 90) * 90;
  const rightAscensionQuadrant = Math.floor(rightAscension / 90) * 90;
  rightAscension += longitudeQuadrant - rightAscensionQuadrant;
  rightAscension /= 15;

  const sinDeclination = 0.39782 * Math.sin(toRadians(trueLongitude));
  const cosDeclination = Math.cos(Math.asin(sinDeclination));
  const cosLocalHour =
    (Math.cos(toRadians(zenith)) -
      (sinDeclination * Math.sin(toRadians(latitude)))) /
    (cosDeclination * Math.cos(toRadians(latitude)));

  if (cosLocalHour > 1 || cosLocalHour < -1) {
    return null;
  }

  const localHourAngle = isSunrise
    ? 360 - toDegrees(Math.acos(cosLocalHour))
    : toDegrees(Math.acos(cosLocalHour));
  const localHour = localHourAngle / 15;
  const localMeanTime = localHour + rightAscension - (0.06571 * approximateTime) - 6.622;
  const universalTime = localMeanTime - lngHour;
  const normalizedUniversalTime = ((universalTime % 24) + 24) % 24;
  let result = new Date(
    Date.UTC(dateParts.year, dateParts.month - 1, dateParts.day) +
      (normalizedUniversalTime * 60 * 60 * 1000)
  );
  let localResult = getZonedParts(result, timeZone);

  while (compareDateParts(localResult, dateParts) < 0) {
    result = new Date(result.getTime() + 86400000);
    localResult = getZonedParts(result, timeZone);
  }

  while (compareDateParts(localResult, dateParts) > 0) {
    result = new Date(result.getTime() - 86400000);
    localResult = getZonedParts(result, timeZone);
  }

  return result;
}

function getZonedParts(date, timeZone) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);
  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: Number(lookup.year),
    month: Number(lookup.month),
    day: Number(lookup.day),
    hour: Number(lookup.hour),
    minute: Number(lookup.minute),
    second: Number(lookup.second),
  };
}

function addDays(dateParts, deltaDays) {
  const utcDate = new Date(Date.UTC(dateParts.year, dateParts.month - 1, dateParts.day));
  utcDate.setUTCDate(utcDate.getUTCDate() + deltaDays);

  return {
    year: utcDate.getUTCFullYear(),
    month: utcDate.getUTCMonth() + 1,
    day: utcDate.getUTCDate(),
  };
}

function getZonedDateBoundary(date, timeZone, boundary) {
  const parts = getZonedParts(date, timeZone);
  const hour = boundary === "start" ? 0 : 24;
  return zonedTimeToUtc({ ...parts, hour, minute: 0, second: 0 }, timeZone);
}

function zonedTimeToUtc(parts, timeZone) {
  const utcGuess = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  const offset = getTimeZoneOffsetMs(new Date(utcGuess), timeZone);
  return new Date(utcGuess - offset);
}

function getTimeZoneOffsetMs(date, timeZone) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);
  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const utcEquivalent = Date.UTC(
    Number(lookup.year),
    Number(lookup.month) - 1,
    Number(lookup.day),
    Number(lookup.hour),
    Number(lookup.minute),
    Number(lookup.second)
  );

  return utcEquivalent - date.getTime();
}

function getDayOfYear(year, month, day) {
  const start = Date.UTC(year, 0, 0);
  const current = Date.UTC(year, month - 1, day);
  return Math.floor((current - start) / 86400000);
}

function compareDateParts(left, right) {
  if (left.year !== right.year) {
    return left.year - right.year;
  }

  if (left.month !== right.month) {
    return left.month - right.month;
  }

  return left.day - right.day;
}

function formatInZone(date, timeZone, options) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    ...options,
  }).format(date);
}

function formatShortTime(date, timeZone) {
  return formatInZone(date, timeZone, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRange(start, end, timeZone) {
  return `${formatShortTime(start, timeZone)} - ${formatShortTime(end, timeZone)}`;
}

function isWithinRange(now, start, end) {
  return now.getTime() >= start.getTime() && now.getTime() < end.getTime();
}

function getTimeZoneLabel(date, timeZone) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "short",
  })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value || timeZone;
}

function formatCoordinate(value, positiveLabel, negativeLabel) {
  const direction = value >= 0 ? positiveLabel : negativeLabel;
  return `${Math.abs(value).toFixed(4)}° ${direction}`;
}

function formatElapsed(elapsedMs) {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${pad2(hours)}h ${pad2(minutes)}m ${pad2(seconds)}s`;
}

function formatReportDateTime(date) {
  const formattedDateTime = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
  const timeZone = new Intl.DateTimeFormat(undefined, {
    timeZoneName: "short",
  })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value;

  return timeZone ? `${formattedDateTime} ${timeZone}` : formattedDateTime;
}

function clampRatio(value) {
  return Math.max(0, Math.min(1, value));
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function normalizeDegrees(value) {
  return ((value % 360) + 360) % 360;
}

function getLocalMarker(dateParts, timeZone, hour, minute, second) {
  return zonedTimeToUtc(
    {
      year: dateParts.year,
      month: dateParts.month,
      day: dateParts.day,
      hour,
      minute,
      second,
    },
    timeZone
  );
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function toDegrees(value) {
  return (value * 180) / Math.PI;
}

init();