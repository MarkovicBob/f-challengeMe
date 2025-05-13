export const getCategoryColor = (Category) => {
  switch (Category) {
    case "Movement, Hobby, Sports":
      return "bg-[#FFD700] text-black";
    case "Mindfulness, Focus, Meditation":
      return "bg-[#E066FF] text-white";
    case "Knowledge, Discovery, Geology":
      return "bg-[#00BFFF] text-white";
    case "Photography, Creativity, Art":
      return "bg-[#EEA2AD] text-black";
  }
};

export const getLevelColor = (Level) => {
  switch (Level) {
    case "Easy":
      return "bg-[#EDEDED] text-black";
    case "Medium":
      return "bg-[#8B8B83] text-white";
    case "Difficult":
      return "bg-[#000] text-white";
  }
};

export const getSubCategoryColor = (subCategory) => {
  if (
    [
      "Hiking",
      "Jogging",
      "Cycling",
      "Climbing",
      "Kayaking",
      "Gymnastics",
      "Fitness",
      "Fishing",
    ].includes(subCategory)
  ) {
    return "bg-[#FFEC8B] text-black";
  } else if (["Yoga", "Meditation", "Breathing"].includes(subCategory)) {
    return "bg-[#FFBBFF] text-black";
  } else if (["Geology", "Astronomy", "History"].includes(subCategory)) {
    return "bg-[#B0E2FF] text-black";
  } else if (["Photography", "Painting", "Sculpting"].includes(subCategory)) {
    return "bg-[#FFC0CB] text-black";
  } else {
    return "bg-gray-200 text-black";
  }
};
