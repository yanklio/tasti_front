class Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: string[];
  imageUrl: string;

  constructor(
    id: number,
    name: string,
    description: string,
    ingredients: string[],
    imageUrl: string,
  ) {
    this.id = id;
    this.title = name;
    this.description = description;
    this.ingredients = ingredients || [];
    this.imageUrl = imageUrl || '';
  }
}
