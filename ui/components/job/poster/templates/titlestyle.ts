export function getTitleStyle(title: string) {
  const len = title.length;

  if (len <= 45) {
    return {
      fontSize: "64px",
      lineHeight: "1.15",
      clamp: "line-clamp-2",
    };
  }

  if (len <= 75) {
    return {
      fontSize: "56px",
      lineHeight: "1.2",
      clamp: "line-clamp-3",
    };
  }

  if (len <= 110) {
    return {
      fontSize: "48px",
      lineHeight: "1.25",
      clamp: "line-clamp-3",
    };
  }

  return {
    fontSize: "42px",
    lineHeight: "1.3",
    clamp: "line-clamp-4",
  };
}