export const formatTimestamp = (timestamp, showTime = false, locale = "pt-BR") => {
  const defaultTimestamp = { seconds: 0, nanoseconds: 0 };
  const { seconds, nanoseconds } = timestamp || defaultTimestamp;

  const date = new Date(seconds * 1000 + nanoseconds / 1000000);

  const dateOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  };
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  };

  const formattedDate = date.toLocaleDateString(locale, dateOptions);
  const formattedTime = date.toLocaleTimeString(locale, timeOptions);

  const day = date.getDate();
  const suffix =
    day >= 11 && day <= 13
      ? "º"
      : day % 10 === 1
      ? "º"
      : day % 10 === 2
      ? "º"
      : day % 10 === 3
      ? "º"
      : "º";

  const finalDate = formattedDate.replace(/(\d+)/, `$1${suffix}`);

  return showTime ? `${finalDate} · ${formattedTime}` : finalDate;
};