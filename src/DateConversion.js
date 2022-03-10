// nimmt ein Date Objekt und wandelt es in deutsche Notation um (TT.MM.JJJJ)
const toGermanDate = (date) => {
  if (!date) {
    return null;
  }
  return (
    addZero(date.getDate()) +
    "." +
    addZero(date.getMonth() + 1) +
    "." +
    date.getFullYear()
  );
};

const addZero = (i) => {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
};

export default toGermanDate;
