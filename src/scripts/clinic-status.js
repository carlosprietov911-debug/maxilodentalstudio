const CLINIC_TIMEZONE = "America/Bogota";

const SCHEDULE = {
  0: null, // domingo
  1: { open: "08:00", close: "18:00" }, // lunes
  2: { open: "08:00", close: "18:00" }, // martes
  3: { open: "08:00", close: "18:00" }, // miércoles
  4: { open: "08:00", close: "18:00" }, // jueves
  5: { open: "08:00", close: "18:00" }, // viernes
  6: { open: "08:00", close: "14:00" }, // sábado
};

const DAY_NAMES = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

function getBogotaNowParts() {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: CLINIC_TIMEZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(new Date());

  const weekdayMap = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const weekday = weekdayMap[parts.find((p) => p.type === "weekday")?.value];
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);

  return { weekday, hour, minute };
}

function timeToMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(time) {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "p. m." : "a. m.";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

function findNextOpeningDay(currentDay) {
  for (let offset = 1; offset <= 7; offset++) {
    const nextDay = (currentDay + offset) % 7;
    if (SCHEDULE[nextDay]) {
      return {
        day: nextDay,
        offset,
        open: SCHEDULE[nextDay].open,
      };
    }
  }
  return null;
}

function getClinicStatus() {
  const { weekday, hour, minute } = getBogotaNowParts();
  const currentMinutes = hour * 60 + minute;
  const todaySchedule = SCHEDULE[weekday];

  if (!todaySchedule) {
    const nextOpening = findNextOpeningDay(weekday);
    return {
      open: false,
      text:
        nextOpening?.offset === 1
          ? `Cerrado ahora · abre mañana a las ${formatTime(nextOpening.open)}`
          : `Cerrado ahora · abre el ${DAY_NAMES[nextOpening.day]} a las ${formatTime(nextOpening.open)}`,
    };
  }

  const openMinutes = timeToMinutes(todaySchedule.open);
  const closeMinutes = timeToMinutes(todaySchedule.close);

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    return {
      open: true,
      text: `Abierto ahora · cierra a las ${formatTime(todaySchedule.close)}`,
    };
  }

  if (currentMinutes < openMinutes) {
    return {
      open: false,
      text: `Cerrado ahora · abre hoy a las ${formatTime(todaySchedule.open)}`,
    };
  }

  const nextOpening = findNextOpeningDay(weekday);

  return {
    open: false,
    text:
      nextOpening?.offset === 1
        ? `Cerrado ahora · abre mañana a las ${formatTime(nextOpening.open)}`
        : `Cerrado ahora · abre el ${DAY_NAMES[nextOpening.day]} a las ${formatTime(nextOpening.open)}`,
  };
}

export default function initClinicStatus() {
  const textEl = document.getElementById("clinic-status-text");
  const dotEl = document.getElementById("clinic-status-dot");
  const wrapperEl = document.getElementById("clinic-status");

  if (!textEl || !dotEl || !wrapperEl) return;

  function renderStatus() {
    const status = getClinicStatus();

    textEl.textContent = status.text;

    if (status.open) {
      dotEl.className = "h-2.5 w-2.5 rounded-full bg-emerald-500";
      wrapperEl.className =
        "mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-emerald-700";
    } else {
      dotEl.className = "h-2.5 w-2.5 rounded-full bg-rose-500";
      wrapperEl.className =
        "mt-4 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-rose-700";
    }
  }

  renderStatus();

  // actualiza cada minuto
  setInterval(renderStatus, 60 * 1000);
}