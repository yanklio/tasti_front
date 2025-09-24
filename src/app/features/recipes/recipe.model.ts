class RecipeBrief {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;

  constructor(id: number, name: string, description: string, imageUrl: string) {
    this.id = id;
    this.title = name;
    this.description = description;
    this.imageUrl = imageUrl || '';
  }
}

class Recipe extends RecipeBrief {
  ingredients?: string[];

  constructor(
    id: number,
    name: string,
    description: string,
    imageUrl: string,
    ingredients?: string[],
  ) {
    super(id, name, description, imageUrl);
    this.ingredients = ingredients || [];
  }
}

export { Recipe, RecipeBrief };
