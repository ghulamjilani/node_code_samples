export const getFormattedDate = (dateInput) => {
  const date = new Date(dateInput);
  const year = date.getFullYear();

  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : "0" + month;
  let day = date.getDate().toString();
  day = day.length > 1 ? day : `0${day}`;

  return day + "-" + month + "-" + year;
};

export const getFormattedTime = (dateInput) => {
  const date = new Date(dateInput);

  let hours = date.getHours().toString();
  hours = hours.length > 1 ? hours : "0" + hours;

  let minutes = date.getMinutes().toString();
  minutes = minutes.length > 1 ? minutes : "0" + minutes;

  let seconds = date.getSeconds().toString();
  seconds = seconds.length > 1 ? seconds : "0" + seconds;

  return `${hours}:${minutes}:${seconds}`;
};

export const profileFormattedDate = (dateInput) => {
  const date = new Date(dateInput);
  const year = date.getFullYear();

  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : "0" + month;
  let day = date.getDate().toString();
  day = day.length > 1 ? day : `0${day}`;

  return year + "-" + month + "-" + day;
};

export const getPaymentFormattedDate = (dateInput) => {
  const date = new Date(dateInput);

  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  const getPaymentFormattedDate = date.toLocaleDateString("en-GB", options);

  return getPaymentFormattedDate;
};
