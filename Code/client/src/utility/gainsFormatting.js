const gainsColor = value => {
    if(value > 0) {
        return "success";
    } else if (value < 0) {
        return "danger";
    } else {
        return "dark";
    }
}

const gainsPrefix = value => {
    if(value > 0) {
        return "+";
    } else {
        return "";
    }
}

const chartColor = value => {
    if(value > 0) {
        return "hsl(141, 53%, 53%)";
    } else if (value < 0) {
        return "hsl(348, 100%, 61%)";
    } else {
        return "white";
    }
}

export {gainsColor, gainsPrefix, chartColor};