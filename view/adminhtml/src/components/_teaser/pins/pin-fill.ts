const hasOwnColor = (pin: any): boolean => !!pin.override_color && !!pin.color;

const hasOwnNoFill = (pin: any): boolean =>
    !!pin.override_color && !!pin.no_fill;

const isPinFilled = (pin: any, baseNoFill: boolean): boolean => {
    if (hasOwnNoFill(pin)) {
        return false;
    }

    return hasOwnColor(pin) || !baseNoFill;
};

const getPinFillColor = (
    pin: any,
    baseColor: string,
    baseNoFill: boolean
): string => {
    if (!isPinFilled(pin, baseNoFill)) {
        return 'transparent';
    }

    return hasOwnColor(pin) ? pin.color : baseColor;
};

const getPinOutlineColor = (pin: any, baseOutlineColor: string): string =>
    hasOwnNoFill(pin) && pin.outline_color
        ? pin.outline_color
        : baseOutlineColor;

export { isPinFilled, getPinFillColor, getPinOutlineColor };
