export const useCategory = (selectedCategory, setSubCategoryOptions) => {
  switch (selectedCategory) {
    case "Movement, Hobby, Sports":
      setSubCategoryOptions([
        "Hiking",
        "Jogging",
        "Cycling",
        "Climbing",
        "Kayaking",
        "Gymnastics",
        "Fitness",
        "Fishing",
      ]);
      break;
    case "Mindfulness, Focus, Meditation":
      setSubCategoryOptions(["Yoga", "Meditation", "Breathing Exercises"]);
      break;
    case "Knowledge, Discovery, Geology":
      setSubCategoryOptions(["Geology", "Astronomy", "History"]);
      break;
    case "Photography, Creativity, Art":
      setSubCategoryOptions(["Photography", "Painting", "Sculpting"]);
      break;
    default:
      setSubCategoryOptions([]);
  }
};
