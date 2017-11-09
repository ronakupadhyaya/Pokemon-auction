const monthString  = function(month){
  switch (month) {
  case 0:
    return 'Jan';
  case 1:
    return 'Feb';
  case 2:
    return 'Mar';
  case 3:
    return 'Apr';
  case 4:
    return 'May';
  case 5:
    return 'Jun';
  case 6:
    return 'Jul';
  case 7:
    return 'Aug';
  case 8:
    return 'Sep';
  case 9:
    return 'Oct';
  case 10:
    return 'Nov';
  default:
    return 'Dec';
  }
};

const getNiceDate = function(dateObj){
  dateObj = new Date(dateObj.getTime());
  const day = dateObj.getDate();
  const month = monthString(dateObj.getMonth());
  const year = dateObj.getFullYear();
  return `${month} ${day}, ${year}`;
};

module.exports={
  monthString,
  getNiceDate
};
